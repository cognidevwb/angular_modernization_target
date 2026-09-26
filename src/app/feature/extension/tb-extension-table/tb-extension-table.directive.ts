import { Component, DestroyRef, ElementRef, OnChanges, SimpleChanges, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { AttributeService } from '../../api/services/attribute.service';
import { TelemetryWebsocketService } from '../../api/services/telemetry-websocket.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { RootState } from '../../../root-state';

/** The `$mdDialog.confirm()` the legacy table showed before a delete: title, html content, no / yes. */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-extension-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content><div [innerHTML]="data.content"></div></mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button [mat-dialog-close]="false">{{ data.cancel }}</button>
      <button mat-button color="primary" [mat-dialog-close]="true">{{ data.ok }}</button>
    </mat-dialog-actions>
  `,
})
export class TbExtensionConfirmDialogComponent {
  protected readonly data: { title: string; content: string; ok: string; cancel: string } = inject(MAT_DIALOG_DATA);
}

/**
 * Ported from the AngularJS directive `tbExtensionTable` (module `thingsboard.extension`) in src/app/extension/extension-table.directive.js.
 * The md-data-table becomes a plain table with a row-select column, id/type ordering and a MatPaginator;
 * the scope events (`showSearch`, `refreshExtensions`, `addExtension`, `exportExtensions`, `importExtensions`
 * in; `selectedExtensions`, `filterMode` out) go over RootState.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-extension-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatDialogModule, CommonModule, FormsModule],
  templateUrl: './tb-extension-table.directive.html',
})
export class TbExtensionTableDirective implements OnChanges {
  readonly entityId = model<any>();
  readonly entityType = input<any>();
  readonly inWidget = input<any>();
  readonly ctx = model<any>();
  readonly entityName = model<any>();

  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly attributeService = inject(AttributeService);
  private readonly telemetryWebsocketService = inject(TelemetryWebsocketService);
  private readonly importExport = inject(ImportExportService);
  private readonly rootScope = inject(RootState);
  private readonly element = inject(ElementRef);

  protected extensions: any[] = [];
  protected allExtensions: any[] = [];
  protected selectedExtensions: any[] = [];
  protected extensionsCount = 0;
  protected query: { order: string; limit: number; page: number; search: string | null } = {
    order: 'id',
    limit: 5,
    page: 1,
    search: null
  };
  protected readonly limitOptions = [5, 10, 15];
  protected syncStatus: any;
  protected syncLastTime: any;
  protected isSync = false;
  protected extensionsPromise: any = null;

  private subscribed = false;
  private subscriber: any = null;
  private appliedConfiguration: any;
  private extensionsJSON: any;

  constructor() {
    const offs = [
      this.rootScope.$on('showSearch', (_e: any, source: any) => {
        if (source.entityId == this.entityId()) {
          this.enterFilterMode();
          this.rootScope.$emit('filterMode', true);
        }
      }),
      this.rootScope.$on('refreshExtensions', (_e: any, source: any) => {
        if (source.entityId == this.entityId()) {
          this.reloadExtensions();
        }
      }),
      this.rootScope.$on('addExtension', (_e: any, source: any) => {
        if (source.entityId == this.entityId()) {
          this.addExtension();
        }
      }),
      this.rootScope.$on('exportExtensions', (_e: any, source: any) => {
        if (source.entityId == this.entityId()) {
          this.exportExtensions(source.entityName);
        }
      }),
      this.rootScope.$on('importExtensions', (_e: any, source: any) => {
        if (source.entityId == this.entityId()) {
          this.importExtensions();
        }
      }),
    ];
    inject(DestroyRef).onDestroy(() => {
      offs.forEach((off) => off());
      this.unsubscribe();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['entityId'] && this.entityId()) {
      this.unsubscribe();
      this.subscribed = false;
      this.syncLastTime = this.translate.instant('extension.sync.not-available');
      this.subscribeForClientAttributes();
      this.reloadExtensions();
    }
  }

  protected enterFilterMode(event?: any): void {
    const $toolbarsContainer: any = event
      ? $(event.currentTarget).closest('.toolbarsContainer')
      : $(this.element.nativeElement).find('.toolbarsContainer');

    this.query.search = '';
    if (this.inWidget()) {
      this.ctx().hideTitlePanel = true;
    }
    setTimeout(() => {
      $toolbarsContainer.find('.searchInput').focus();
    });
  }

  protected exitFilterMode(): void {
    this.query.search = null;
    this.updateExtensions();
    if (this.inWidget()) {
      this.ctx().hideTitlePanel = false;
      this.rootScope.$emit('filterMode', false);
    }
  }

  /** The legacy `$watch('vm.query.search')`: a changed search re-filters. */
  protected onSearchChange(value: string | null): void {
    if (value !== this.query.search) {
      this.query.search = value;
      if (this.query.search != null) {
        this.updateExtensions();
      }
    }
  }

  /** md-order-by: a click on the ordered column flips it, a click on another orders by it ascending. */
  protected reorder(field: string): void {
    this.query.order = this.query.order === field ? '-' + field : field;
    this.onReorder();
  }

  protected onReorder(): void {
    this.updateExtensions();
  }

  protected onPaginate(event: PageEvent): void {
    this.query.page = event.pageIndex + 1;
    this.query.limit = event.pageSize;
    this.updateExtensions();
  }

  protected isSelected(extension: any): boolean {
    return this.selectedExtensions.indexOf(extension) > -1;
  }

  protected toggleSelection(extension: any): void {
    const index = this.selectedExtensions.indexOf(extension);
    if (index > -1) {
      this.setSelection(this.selectedExtensions.filter((ext) => ext !== extension));
    } else {
      this.setSelection([...this.selectedExtensions, extension]);
    }
  }

  protected allSelected(): boolean {
    return this.extensions.length > 0 && this.selectedExtensions.length === this.extensions.length;
  }

  protected toggleAll(): void {
    this.setSelection(this.allSelected() ? [] : [...this.extensions]);
  }

  protected addExtension($event?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.openExtensionDialog($event);
  }

  protected editExtension($event?: any, extension?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.openExtensionDialog($event, extension);
  }

  // TODO(port): the legacy ExtensionDialogController (src/app/extension/extension-dialog.controller.js) has no ported
  // dialog component yet; once it has, open it here with MatDialog.open(ExtensionDialog, {data: {isAdd, allExtensions,
  // entityId, entityType, extension}}) and reloadExtensions() when it closes with a result.
  private openExtensionDialog($event?: any, extension?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
  }

  protected deleteExtension($event?: any, extension?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (extension) {
      const title = this.translate.instant('extension.delete-extension-title', {extensionId: extension.id});
      const content = this.translate.instant('extension.delete-extension-text');
      this.confirm(title, content).then((ok) => {
        if (ok) {
          const editedExtensions = this.allExtensions.filter((ext: any) => ext.id !== extension.id);
          this.saveExtensions(editedExtensions);
        }
      });
    }
  }

  protected deleteExtensions($event?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.selectedExtensions && this.selectedExtensions.length > 0) {
      const title = this.translate.instant('extension.delete-extensions-title', {count: this.selectedExtensions.length});
      const content = this.translate.instant('extension.delete-extensions-text');
      this.confirm(title, content).then((ok) => {
        if (ok) {
          const selectedIds = this.selectedExtensions.map((ext: any) => ext.id);
          const editedExtensions = this.allExtensions.filter((ext: any) => selectedIds.indexOf(ext.id) === -1);
          this.saveExtensions(editedExtensions);
        }
      });
    }
  }

  protected reloadExtensions(): void {
    this.subscribed = false;
    this.allExtensions.length = 0;
    this.extensions.length = 0;
    this.extensionsPromise = this.attributeService.getEntityAttributesValues(this.entityType(), this.entityId(), types.attributesScope.shared.value, ["configuration"]);
    this.extensionsPromise.then(
      (data?: any) => {
        if (data.length) {
          this.allExtensions = JSON.parse(data[0].value);
        } else {
          this.allExtensions = [];
        }
        this.setSelection([]);
        this.updateExtensions();
        this.extensionsPromise = null;
      },
      () => {
        this.extensions = [];
        this.setSelection([]);
        this.updateExtensions();
        this.extensionsPromise = null;
      }
    );
  }

  protected updateExtensions(): void {
    this.setSelection([]);
    let result: any[] = this.orderBy(this.allExtensions, this.query.order);
    if (this.query.search != null) {
      const search = this.query.search;
      result = result.filter((extension: any) =>
        !search || (extension.id.indexOf(search) != -1) || (extension.type.indexOf(search) != -1));
    }
    this.extensionsCount = result.length;
    const startIndex = this.query.limit * (this.query.page - 1);
    this.extensions = result.slice(startIndex, startIndex + this.query.limit);

    this.extensionsJSON = JSON.stringify(this.extensions);
    this.checkForSync();
  }

  protected importExtensions($event?: any): void {
    this.importExport.importExtension($event, {"entityType": this.entityType(), "entityId": this.entityId(), "successFunc": () => this.reloadExtensions()});
  }

  protected exportExtensions(widgetSourceEntityName?: any): void {
    if (this.inWidget()) {
      this.importExport.exportToPc(this.extensionsJSON, widgetSourceEntityName + '_configuration.json');
    } else {
      this.importExport.exportToPc(this.extensionsJSON, this.entityName() + '_configuration.json');
    }
  }

  /* change function for widget implementing, like exportExtensions */
  protected exportExtension($event?: any, extension?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.importExport.exportToPc(extension, this.entityName() + '_' + extension.id + '_configuration.json');
  }

  /** The legacy `$watch('vm.selectedExtensions.length')`: selection mode hides the widget title and tells the widget. */
  private setSelection(selection: any[]): void {
    const hadSelection = this.selectedExtensions.length > 0;
    this.selectedExtensions = selection;
    const selectionMode = selection.length > 0;
    if (selectionMode === hadSelection) {
      return;
    }
    const ctx = this.ctx();
    if (ctx) {
      if (selectionMode) {
        ctx.hideTitlePanel = true;
        this.rootScope.$emit('selectedExtensions', true);
      } else if (this.query.search == null) {
        ctx.hideTitlePanel = false;
        this.rootScope.$emit('selectedExtensions', false);
      }
    }
  }

  private saveExtensions(editedExtensions: any[]): void {
    const editedValue = JSON.stringify(editedExtensions);
    this.attributeService.saveEntityAttributes(this.entityType(), this.entityId(), types.attributesScope.shared.value, [{key: "configuration", value: editedValue}]).then(
      () => {
        this.reloadExtensions();
      }
    );
  }

  private confirm(title: string, content: string): Promise<boolean> {
    const ref = this.dialog.open(TbExtensionConfirmDialogComponent, {
      data: {title, content, cancel: this.translate.instant('action.no'), ok: this.translate.instant('action.yes')},
      ariaLabel: title,
    });
    return new Promise((resolve) => ref.afterClosed().subscribe((result) => resolve(!!result)));
  }

  /** `$filter('orderBy')(list, 'field' | '-field')`. */
  private orderBy(list: any[], order: string): any[] {
    const desc = order.startsWith('-');
    const field = desc ? order.substring(1) : order;
    return [...list].sort((a: any, b: any) => {
      const x = a?.[field];
      const y = b?.[field];
      const cmp = x < y ? -1 : x > y ? 1 : 0;
      return desc ? -cmp : cmp;
    });
  }

  private unsubscribe(): void {
    if (this.subscriber) {
      this.telemetryWebsocketService.unsubscribe(this.subscriber);
      this.subscriber = null;
    }
  }

  private subscribeForClientAttributes(): void {
    if (!this.subscribed) {
      if (this.entityId() && this.entityType()) {
        this.subscriber = {
          subscriptionCommands: [{
            entityType: this.entityType(),
            entityId: this.entityId(),
            scope: 'CLIENT_SCOPE'
          }],
          type: 'attribute',
          onData: (data?: any) => {
            if (data.data) {
              this.onSubscriptionData(data.data);
            }
            this.subscribed = true;
          }
        };
        this.telemetryWebsocketService.subscribe(this.subscriber);
      }
    }
  }

  private onSubscriptionData(data?: any): void {
    if ($.isEmptyObject(data)) {
      this.appliedConfiguration = undefined;
    } else {
      if (data.appliedConfiguration && data.appliedConfiguration[0] && data.appliedConfiguration[0][1]) {
        this.appliedConfiguration = data.appliedConfiguration[0][1];
      }
    }
    this.updateExtensions();
  }

  private checkForSync(): void {
    if (this.appliedConfiguration && this.extensionsJSON && this.appliedConfiguration === this.extensionsJSON) {
      this.syncStatus = this.translate.instant('extension.sync.sync');
      this.syncLastTime = this.formatDate();
      this.isSync = true;
    } else {
      this.syncStatus = this.translate.instant('extension.sync.not-sync');
      this.isSync = false;
    }
  }

  private formatDate(date?: Date): string {
    const d = date ? date : new Date();
    const addZero = (num: number): string => (num < 10 ? '0' + num : '' + num);
    return d.getFullYear() + '/' + addZero(d.getMonth() + 1) + '/' + addZero(d.getDate()) + ' ' + addZero(d.getHours()) + ':' + addZero(d.getMinutes()) + ':' + addZero(d.getSeconds());
  }
}
