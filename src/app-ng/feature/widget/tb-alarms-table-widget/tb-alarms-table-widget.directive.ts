import { Component, DestroyRef, DoCheck, ElementRef, InjectionToken, Injector, effect, inject, model } from '@angular/core';
import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import $ from 'jquery';
import tinycolor from 'tinycolor2';
import { firstValueFrom } from 'rxjs';
import cssjs from '../../../../vendor/css.js/css';
import { RootState } from '../../../root-state';
import { AlarmService } from '../../api/services/alarm.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { AlarmDetailsDialogComponent } from '../../alarm/alarm-details-dialog/alarm-details-dialog.component';

/** What an `$mdPanel` of this widget received as `locals`. */
const ALARMS_TABLE_PANEL_DATA = new InjectionToken<any>('ALARMS_TABLE_PANEL_DATA');

/** The `$mdDialog.confirm()` the legacy widget showed before acknowledging or clearing: title, html content, no / yes. */
@Component({
  selector: 'tb-alarms-table-confirm-dialog',
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
export class TbAlarmsTableConfirmDialogComponent {
  protected readonly data: { title: string; content: string; ok: string; cancel: string } = inject(MAT_DIALOG_DATA);
}

/** Ported from `AlarmStatusFilterPanelController` + alarm-status-filter-panel.tpl.html. */
@Component({
  selector: 'tb-alarm-status-filter-panel',
  standalone: true,
  imports: [TranslatePipe, MatRadioModule, FormsModule],
  template: `
    <div style="height: 100%" class="md-padding tb-alarm-status-filter-panel" layout="column">
      <label class="tb-title">{{ 'alarm.alarm-status-filter' | translate }}</label>
      <mat-radio-group [(ngModel)]="subscription.alarmSearchStatus" color="primary">
        @for (searchStatus of searchStatuses; track searchStatus) {
          <mat-radio-button [value]="searchStatus" color="primary" [attr.aria-label]="('alarm.search-status.' + searchStatus) | translate">
            {{ ('alarm.search-status.' + searchStatus) | translate }}
          </mat-radio-button>
        }
      </mat-radio-group>
    </div>
  `,
})
export class AlarmStatusFilterPanelComponent {
  private readonly data: any = inject(ALARMS_TABLE_PANEL_DATA);
  protected readonly subscription: any = this.data.subscription;
  protected readonly searchStatuses: string[] = Object.values(types.alarmSearchStatus);
}

/** Ported from `DisplayColumnsPanelController` + display-columns-panel.tpl.html. */
@Component({
  selector: 'tb-display-columns-panel',
  standalone: true,
  imports: [TranslatePipe, MatCheckboxModule, FormsModule],
  template: `
    <div style="height: 100%" class="md-padding tb-display-columns-panel" layout="column">
      <label class="tb-title">{{ 'entity.columns-to-display' | translate }}</label>
      @for (column of columns; track $index) {
        <mat-checkbox [attr.aria-label]="'entity.columns-to-display' | translate" [(ngModel)]="column.display">{{ column.title }}</mat-checkbox>
      }
    </div>
  `,
})
export class DisplayColumnsPanelComponent {
  private readonly data: any = inject(ALARMS_TABLE_PANEL_DATA);
  protected readonly columns: any[] = this.data.columns;
}

/**
 * Ported from the AngularJS directive `tbAlarmsTableWidget` (module `thingsboard.widgets.alarmsTableWidget`) in src/app/widget/lib/alarms-table-widget.js:32.
 * The md-data-table becomes a plain table with a row-select column, per-column ordering and a MatPaginator.
 */
@Component({
  selector: 'tb-alarms-table-widget',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, MatCheckboxModule, MatPaginatorModule, MatDialogModule, CommonModule, FormsModule],
  providers: [DatePipe, DecimalPipe],
  templateUrl: './tb-alarms-table-widget.directive.html',
})
export class TbAlarmsTableWidgetDirective implements DoCheck {
  protected readonly rootScope = inject(RootState);
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  private readonly element = inject(ElementRef);
  private readonly translate = inject(TranslateService);
  private readonly dialog = inject(MatDialog);
  private readonly overlay = inject(Overlay);
  private readonly injector = inject(Injector);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly destroyRef = inject(DestroyRef);
  private readonly datePipe = inject(DatePipe);
  private readonly decimalPipe = inject(DecimalPipe);
  private readonly alarmService = inject(AlarmService);
  private readonly utils = inject(UtilsService);

  stylesInfo: any = {};
  contentsInfo: any = {};
  columnWidth: any = {};

  showData = true;
  hasData = false;

  alarms: any[] = [];
  alarmsCount = 0;
  selectedAlarms: any[] = [];

  alarmSource: any = null;
  alarmSearchStatus: any = null;
  allAlarms: any[] = [];

  currentAlarm: any = null;

  enableSelection = true;
  displayDetails = true;
  allowAcknowledgment = true;
  allowClear = true;
  actionCellDescriptors: any[] = [];
  displayPagination = true;
  defaultPageSize = 10;
  defaultSortOrder = '-' + types.alarmFields.createdTime.value;

  query: any = {
    order: this.defaultSortOrder,
    limit: this.defaultPageSize,
    page: 1,
    search: null
  };

  isGtXs = false;
  isGtMd = false;
  limitOptions: number[] | null = null;

  settings: any;
  widgetConfig: any;
  subscription: any;
  alarmsTitle: any;

  searchAction: any = {
    name: 'action.search',
    show: true,
    onAction: () => {
      this.enterFilterMode();
    },
    icon: 'search'
  };

  private readonly columnDisplayAction: any = {
    name: 'entity.columns-to-display',
    show: true,
    onAction: ($event?: any) => {
      this.editColumnsToDisplay($event);
    },
    icon: 'view_column'
  };

  private readonly statusFilterAction: any = {
    name: 'alarm.alarm-status-filter',
    show: true,
    onAction: ($event?: any) => {
      this.editAlarmStatusFilter($event);
    },
    icon: 'filter_list'
  };

  /** The `$watch('vm.selectedAlarms.length')` state. */
  private lastSelectedLength: number | undefined;

  constructor() {
    effect(() => {
      const ctx: any = this.ctx();
      if (ctx) {
        this.settings = ctx.settings;
        this.widgetConfig = ctx.widgetConfig;
        this.subscription = ctx.defaultSubscription;
        this.alarmSource = this.subscription.alarmSource;
        this.initializeConfig();
        this.updateAlarmSource();
      }
    });

    const deregister = this.rootScope.$on('alarms-table-data-updated', (event: any, tableId: any) => {
      if (this.tableId() == tableId) {
        if (this.subscription) {
          this.allAlarms = this.subscription.alarms || [];
          this.updateAlarms(true);
        }
      }
    });
    this.destroyRef.onDestroy(() => deregister());

    this.breakpointObserver.observe(['(min-width: 600px)', '(min-width: 1280px)'])
      .subscribe((state) => {
        this.isGtXs = state.breakpoints['(min-width: 600px)'];
        this.isGtMd = state.breakpoints['(min-width: 1280px)'];
        if (this.isGtMd) {
          this.limitOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3];
        } else {
          this.limitOptions = null;
        }
      });
  }

  /** `$scope.$watch('vm.selectedAlarms.length')`: the title panel hides while alarms are selected. */
  ngDoCheck(): void {
    const newLength = this.selectedAlarms.length;
    if (newLength !== this.lastSelectedLength) {
      this.lastSelectedLength = newLength;
      const selectionMode = newLength ? true : false;
      const ctx: any = this.ctx();
      if (ctx) {
        if (selectionMode) {
          ctx.hideTitlePanel = true;
        } else if (this.query.search == null) {
          ctx.hideTitlePanel = false;
        }
      }
    }
  }

  private initializeConfig(): void {
    const ctx: any = this.ctx();

    ctx.widgetActions = [this.searchAction, this.statusFilterAction, this.columnDisplayAction];

    this.displayDetails = this.settings.displayDetails !== undefined ? this.settings.displayDetails : true;
    this.allowAcknowledgment = this.settings.allowAcknowledgment !== undefined ? this.settings.allowAcknowledgment : true;
    this.allowClear = this.settings.allowClear !== undefined ? this.settings.allowClear : true;

    if (this.displayDetails) {
      this.actionCellDescriptors.push(
        {
          displayName: this.translate.instant('alarm.details'),
          icon: 'more_horiz',
          details: true
        }
      );
    }

    if (this.allowAcknowledgment) {
      this.actionCellDescriptors.push(
        {
          displayName: this.translate.instant('alarm.acknowledge'),
          icon: 'done',
          acknowledge: true
        }
      );
    }

    if (this.allowClear) {
      this.actionCellDescriptors.push(
        {
          displayName: this.translate.instant('alarm.clear'),
          icon: 'clear',
          clear: true
        }
      );
    }

    this.actionCellDescriptors = this.actionCellDescriptors.concat(ctx.actionsApi.getActionDescriptors('actionCellButton'));

    if (this.settings.alarmsTitle && this.settings.alarmsTitle.length) {
      this.alarmsTitle = this.utils.customTranslation(this.settings.alarmsTitle, this.settings.alarmsTitle);
    } else {
      this.alarmsTitle = this.translate.instant('alarm.alarms');
    }

    ctx.widgetTitle = this.alarmsTitle;

    this.enableSelection = this.settings.enableSelection !== undefined ? this.settings.enableSelection : true;
    this.searchAction.show = this.settings.enableSearch !== undefined ? this.settings.enableSearch : true;
    this.columnDisplayAction.show = this.settings.enableSelectColumnDisplay !== undefined ? this.settings.enableSelectColumnDisplay : true;
    this.statusFilterAction.show = this.settings.enableStatusFilter !== undefined ? this.settings.enableStatusFilter : true;
    if (!this.allowAcknowledgment && !this.allowClear) {
      this.enableSelection = false;
    }

    this.displayPagination = this.settings.displayPagination !== undefined ? this.settings.displayPagination : true;

    const pageSize = this.settings.defaultPageSize;
    if (pageSize !== undefined && typeof pageSize === 'number' && pageSize > 0) {
      this.defaultPageSize = pageSize;
    }

    if (this.settings.defaultSortOrder && this.settings.defaultSortOrder.length) {
      this.defaultSortOrder = this.settings.defaultSortOrder;
    }

    this.query.order = this.defaultSortOrder;
    this.query.limit = this.defaultPageSize;
    if (this.isGtMd) {
      this.limitOptions = [this.defaultPageSize, this.defaultPageSize * 2, this.defaultPageSize * 3];
    } else {
      this.limitOptions = null;
    }

    const origColor = this.widgetConfig.color || 'rgba(0, 0, 0, 0.87)';
    const defaultColor = tinycolor(origColor);
    const mdDark = defaultColor.setAlpha(0.87).toRgbString();
    const mdDarkSecondary = defaultColor.setAlpha(0.54).toRgbString();
    const mdDarkDisabled = defaultColor.setAlpha(0.26).toRgbString();
    const mdDarkDivider = defaultColor.setAlpha(0.12).toRgbString();

    const cssString = 'table.md-table th.md-column {\n' +
      'color: ' + mdDarkSecondary + ';\n' +
      '}\n' +
      'table.md-table th.md-column.md-checkbox-column md-checkbox:not(.md-checked) .md-icon {\n' +
      'border-color: ' + mdDarkSecondary + ';\n' +
      '}\n' +
      'table.md-table th.md-column md-icon.md-sort-icon {\n' +
      'color: ' + mdDarkDisabled + ';\n' +
      '}\n' +
      'table.md-table th.md-column.md-active, table.md-table th.md-column.md-active md-icon {\n' +
      'color: ' + mdDark + ';\n' +
      '}\n' +
      'table.md-table td.md-cell {\n' +
      'color: ' + mdDark + ';\n' +
      'border-top: 1px ' + mdDarkDivider + ' solid;\n' +
      '}\n' +
      'table.md-table td.md-cell.md-checkbox-cell md-checkbox:not(.md-checked) .md-icon {\n' +
      'border-color: ' + mdDarkSecondary + ';\n' +
      '}\n' +
      'table.md-table td.md-cell.tb-action-cell button.md-icon-button md-icon {\n' +
      'color: ' + mdDarkSecondary + ';\n' +
      '}\n' +
      'table.md-table td.md-cell.md-placeholder {\n' +
      'color: ' + mdDarkDisabled + ';\n' +
      '}\n' +
      'table.md-table td.md-cell md-select > .md-select-value > span.md-select-icon {\n' +
      'color: ' + mdDarkSecondary + ';\n' +
      '}\n' +
      '.md-table-pagination {\n' +
      'color: ' + mdDarkSecondary + ';\n' +
      'border-top: 1px ' + mdDarkDivider + ' solid;\n' +
      '}\n' +
      '.md-table-pagination .buttons md-icon {\n' +
      'color: ' + mdDarkSecondary + ';\n' +
      '}\n' +
      '.md-table-pagination md-select:not([disabled]):focus .md-select-value {\n' +
      'color: ' + mdDarkSecondary + ';\n' +
      '}';

    const cssParser: any = new (cssjs as any)();
    cssParser.testMode = false;
    const namespace = 'ts-table-' + this.hashCode(cssString);
    cssParser.cssPreviewNamespace = namespace;
    cssParser.createStyleElement(namespace, cssString);
    $(this.element.nativeElement).addClass(namespace);
  }

  private hashCode(str: string): number {
    let hash = 0;
    let i: number, char: number;
    if (str.length === 0) return hash;
    for (i = 0; i < str.length; i++) {
      char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return hash;
  }

  enterFilterMode(): void {
    this.query.search = '';
    this.onSearchChanged();
    this.ctx().hideTitlePanel = true;
    setTimeout(() => {
      $(this.ctx().$container).find('.searchInput').focus();
    });
  }

  exitFilterMode(): void {
    this.query.search = null;
    this.updateAlarms();
    this.ctx().hideTitlePanel = false;
  }

  /** `$scope.$watch("vm.query.search")`: a new search text filters the alarms again. */
  onSearchChanged(): void {
    if (this.query.search != null) {
      this.updateAlarms();
    }
  }

  /** `md-order-by` on a column header: the same column flips its direction, another column orders ascending. */
  reorder(field: string): void {
    if (this.query.order === field) {
      this.query.order = '-' + field;
    } else {
      this.query.order = field;
    }
    this.onReorder();
  }

  onReorder(): void {
    this.updateAlarms();
  }

  onPaginate(event?: PageEvent): void {
    if (event) {
      this.query.page = event.pageIndex + 1;
      this.query.limit = event.pageSize;
    }
    this.updateAlarms();
  }

  /** `md-select-id="id.id"`: an alarm is selected when an alarm with its id is. */
  isSelected(alarm: any): boolean {
    return this.selectedAlarms.some((selected: any) => selected === alarm || (selected.id && alarm.id && selected.id.id === alarm.id.id));
  }

  toggleSelection(alarm: any): void {
    if (this.isSelected(alarm)) {
      this.selectedAlarms = this.selectedAlarms.filter((selected: any) => !(selected === alarm || (selected.id && alarm.id && selected.id.id === alarm.id.id)));
    } else {
      this.selectedAlarms = [...this.selectedAlarms, alarm];
    }
  }

  allSelected(): boolean {
    return this.alarms.length > 0 && this.alarms.every((alarm: any) => this.isSelected(alarm));
  }

  toggleAll(): void {
    this.selectedAlarms = this.allSelected() ? [] : [...this.alarms];
  }

  onRowClick($event: any, alarm: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.currentAlarm != alarm) {
      this.currentAlarm = alarm;
    }
    const ctx: any = this.ctx();
    const descriptors = ctx.actionsApi.getActionDescriptors('rowClick');
    if (descriptors.length) {
      let entityId: any;
      let entityName: any;
      if (this.currentAlarm && this.currentAlarm.originator) {
        entityId = this.currentAlarm.originator;
        entityName = this.currentAlarm.originatorName;
      }
      ctx.actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, { alarm: alarm });
    }
  }

  onActionButtonClick($event: any, alarm: any, actionDescriptor: any): void {
    if (actionDescriptor.details) {
      this.openAlarmDetails($event, alarm);
    } else if (actionDescriptor.acknowledge) {
      this.ackAlarm($event, alarm);
    } else if (actionDescriptor.clear) {
      this.clearAlarm($event, alarm);
    } else {
      if ($event) {
        $event.stopPropagation();
      }
      let entityId: any;
      let entityName: any;
      if (alarm && alarm.originator) {
        entityId = alarm.originator;
        entityName = alarm.originatorName;
      }
      this.ctx().actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, { alarm: alarm });
    }
  }

  actionEnabled(alarm: any, actionDescriptor: any): boolean {
    if (actionDescriptor.acknowledge) {
      return (alarm.status == types.alarmStatus.activeUnack ||
        alarm.status == types.alarmStatus.clearedUnack);
    } else if (actionDescriptor.clear) {
      return (alarm.status == types.alarmStatus.activeAck ||
        alarm.status == types.alarmStatus.activeUnack);
    }
    return true;
  }

  isCurrent(alarm: any): boolean {
    return !!((this.currentAlarm && alarm && this.currentAlarm.id && alarm.id) &&
      (this.currentAlarm.id.id === alarm.id.id));
  }

  openAlarmDetails($event: any, alarm: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (alarm && alarm.id) {
      const onShowingCallback = {
        onShowing: function () { }
      };
      firstValueFrom(this.dialog.open(AlarmDetailsDialogComponent, {
        data: {
          alarmId: alarm.id.id,
          allowAcknowledgment: this.allowAcknowledgment,
          allowClear: this.allowClear,
          displayDetails: true,
          showingCallback: onShowingCallback
        },
        panelClass: 'tb-fullscreen-dialog'
      }).afterClosed()).then((updatedAlarm: any) => {
        if (updatedAlarm) {
          this.subscription.update();
        }
      });
    }
  }

  ackAlarms($event: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.selectedAlarms && this.selectedAlarms.length > 0) {
      const title = this.translate.instant('alarm.aknowledge-alarms-title', { count: this.selectedAlarms.length });
      const content = this.translate.instant('alarm.aknowledge-alarms-text', { count: this.selectedAlarms.length });
      this.confirm(title, content, title).then((ok) => {
        if (!ok) {
          return;
        }
        const tasks: any[] = [];
        for (let i = 0; i < this.selectedAlarms.length; i++) {
          const alarm = this.selectedAlarms[i];
          if (alarm.id) {
            tasks.push(this.alarmService.ackAlarm(alarm.id.id));
          }
        }
        if (tasks.length) {
          Promise.all(tasks).then(() => {
            this.selectedAlarms = [];
            this.subscription.update();
          });
        }
      });
    }
  }

  ackAlarm($event: any, alarm: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.confirm(this.translate.instant('alarm.aknowledge-alarm-title'),
      this.translate.instant('alarm.aknowledge-alarm-text'),
      this.translate.instant('alarm.acknowledge')).then((ok) => {
      if (ok) {
        this.alarmService.ackAlarm(alarm.id.id).then(() => {
          this.selectedAlarms = [];
          this.subscription.update();
        });
      }
    });
  }

  clearAlarms($event: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    if (this.selectedAlarms && this.selectedAlarms.length > 0) {
      const title = this.translate.instant('alarm.clear-alarms-title', { count: this.selectedAlarms.length });
      const content = this.translate.instant('alarm.clear-alarms-text', { count: this.selectedAlarms.length });
      this.confirm(title, content, title).then((ok) => {
        if (!ok) {
          return;
        }
        const tasks: any[] = [];
        for (let i = 0; i < this.selectedAlarms.length; i++) {
          const alarm = this.selectedAlarms[i];
          if (alarm.id) {
            tasks.push(this.alarmService.clearAlarm(alarm.id.id));
          }
        }
        if (tasks.length) {
          Promise.all(tasks).then(() => {
            this.selectedAlarms = [];
            this.subscription.update();
          });
        }
      });
    }
  }

  clearAlarm($event: any, alarm: any): void {
    if ($event) {
      $event.stopPropagation();
    }
    this.confirm(this.translate.instant('alarm.clear-alarm-title'),
      this.translate.instant('alarm.clear-alarm-text'),
      this.translate.instant('alarm.clear')).then((ok) => {
      if (ok) {
        this.alarmService.clearAlarm(alarm.id.id).then(() => {
          this.selectedAlarms = [];
          this.subscription.update();
        });
      }
    });
  }

  private confirm(title: string, content: string, ariaLabel: string): Promise<boolean> {
    const ref = this.dialog.open(TbAlarmsTableConfirmDialogComponent, {
      data: { title, content, cancel: this.translate.instant('action.no'), ok: this.translate.instant('action.yes') },
      ariaLabel,
    });
    return firstValueFrom(ref.afterClosed()).then((result) => !!result);
  }

  updateAlarms(preserveSelections?: boolean): void {
    if (!preserveSelections) {
      this.selectedAlarms = [];
    }
    let result: any[] = this.orderBy(this.allAlarms, this.query.order);
    if (this.query.search != null) {
      const search = this.query.search;
      result = result.filter((alarm: any) => this.matchesAnyProperty(alarm, search));
    }
    this.alarmsCount = result.length;

    if (this.displayPagination) {
      const startIndex = this.query.limit * (this.query.page - 1);
      this.alarms = result.slice(startIndex, startIndex + this.query.limit);
    } else {
      this.alarms = result;
    }

    if (preserveSelections) {
      const newSelectedAlarms: any[] = [];
      if (this.selectedAlarms && this.selectedAlarms.length) {
        let i = this.selectedAlarms.length;
        while (i--) {
          const selectedAlarm = this.selectedAlarms[i];
          if (selectedAlarm.id) {
            const found = this.alarms.filter((alarm: any) => alarm.id && alarm.id.id === selectedAlarm.id.id);
            if (found && found.length) {
              newSelectedAlarms.push(found[0]);
            }
          }
        }
      }
      this.selectedAlarms = newSelectedAlarms;
    }
  }

  /** `$filter('orderBy')(list, 'field' | '-field')`: strings compare case-insensitively, the sort is stable. */
  private orderBy(list: any[], order: string): any[] {
    if (!order) {
      return [...list];
    }
    const desc = order.startsWith('-');
    const field = desc || order.startsWith('+') ? order.substring(1) : order;
    return [...list].sort((a: any, b: any) => {
      let x = this.getDescendantProp(a, field);
      let y = this.getDescendantProp(b, field);
      if (typeof x === 'string' && typeof y === 'string') {
        x = x.toLowerCase();
        y = y.toLowerCase();
      }
      let cmp = 0;
      if (typeof x !== typeof y) {
        cmp = typeof x < typeof y ? -1 : 1;
      } else if (x !== y) {
        cmp = x < y ? -1 : 1;
      }
      return desc ? -cmp : cmp;
    });
  }

  /** `$filter('filter')(list, {$: text})`: any property, at any depth, contains the text (case-insensitive). */
  private matchesAnyProperty(value: any, text: string): boolean {
    const expected = ('' + text).toLowerCase();
    const match = (actual: any): boolean => {
      if (actual === null || actual === undefined) {
        return false;
      }
      if (typeof actual === 'object') {
        return Object.keys(actual).some((key) => key.charAt(0) !== '$' && match(actual[key]));
      }
      if (typeof actual === 'function') {
        return false;
      }
      return ('' + actual).toLowerCase().indexOf(expected) !== -1;
    };
    return match(value);
  }

  cellStyle(alarm: any, key: any): any {
    let style: any = {};
    if (alarm && key) {
      const styleInfo = this.stylesInfo[key.label];
      const value = this.getAlarmValue(alarm, key);
      if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
        try {
          style = styleInfo.cellStyleFunction(value);
        } catch (e) {
          style = {};
        }
      } else {
        style = this.defaultStyle(key, value);
      }
    }
    if (!style.width) {
      const columnWidth = this.columnWidth[key.label];
      style.width = columnWidth;
    }
    return style;
  }

  cellContent(alarm: any, key: any): any {
    let strContent = '';
    if (alarm && key) {
      const contentInfo = this.contentsInfo[key.label];
      const value = this.getAlarmValue(alarm, key);
      let content: any;
      if (contentInfo.useCellContentFunction && contentInfo.cellContentFunction) {
        if (value !== undefined) {
          strContent = '' + value;
        }
        content = strContent;
        try {
          content = contentInfo.cellContentFunction(value, alarm, this.filter);
        } catch (e) {
          content = strContent;
        }
      } else {
        content = this.defaultContent(key, value);
      }
      return content;
    } else {
      return strContent;
    }
  }

  /** The `filter` argument of a cell content function (the legacy `$filter`): the common formatting filters by name. */
  private readonly filter = (name: string): ((...args: any[]) => any) => {
    switch (name) {
      case 'date':
        return (value: any, format?: string, timezone?: string) => this.datePipe.transform(value, format, timezone);
      case 'number':
        return (value: any, fractionSize?: number) => this.decimalPipe.transform(value,
          fractionSize !== undefined ? '1.' + fractionSize + '-' + fractionSize : undefined);
      case 'translate':
        return (key: any, params?: any) => this.translate.instant(key, params);
      case 'uppercase':
        return (value: any) => (value === undefined || value === null) ? value : ('' + value).toUpperCase();
      case 'lowercase':
        return (value: any) => (value === undefined || value === null) ? value : ('' + value).toLowerCase();
      case 'json':
        return (value: any) => JSON.stringify(value, null, 2);
      default:
        return (value: any) => value;
    }
  };

  private defaultContent(key: any, value: any): any {
    if (value !== undefined) {
      const alarmField = (types.alarmFields as any)[key.name];
      if (alarmField) {
        if (alarmField.time) {
          return this.datePipe.transform(value, 'yyyy-MM-dd HH:mm:ss');
        } else if (alarmField.value == types.alarmFields.severity.value) {
          return this.translate.instant((types.alarmSeverity as any)[value].name);
        } else if (alarmField.value == types.alarmFields.status.value) {
          return this.translate.instant('alarm.display-status.' + value);
        } else if (alarmField.value == types.alarmFields.originatorType.value) {
          return this.translate.instant((types.entityTypeTranslations as any)[value].type);
        } else {
          return value;
        }
      } else {
        return value;
      }
    } else {
      return '';
    }
  }

  private defaultStyle(key: any, value: any): any {
    if (value !== undefined) {
      const alarmField = (types.alarmFields as any)[key.name];
      if (alarmField) {
        if (alarmField.value == types.alarmFields.severity.value) {
          return {
            fontWeight: 'bold',
            color: (types.alarmSeverity as any)[value].color
          };
        } else {
          return {};
        }
      } else {
        return {};
      }
    } else {
      return {};
    }
  }

  private getDescendantProp(obj: any, path: string): any {
    return path.split('.').reduce((acc: any, part: string) => acc && acc[part], obj);
  }

  private getAlarmValue(alarm: any, key: any): any {
    const alarmField = (types.alarmFields as any)[key.name];
    if (alarmField) {
      return this.getDescendantProp(alarm, alarmField.value);
    } else {
      return this.getDescendantProp(alarm, key.name);
    }
  }

  editAlarmStatusFilter($event: any): void {
    this.openPanel($event, AlarmStatusFilterPanelComponent, 'tb-alarm-status-filter-panel', { subscription: this.subscription });
  }

  editColumnsToDisplay($event: any): void {
    this.openPanel($event, DisplayColumnsPanelComponent, 'tb-display-columns-panel', { columns: this.alarmSource.dataKeys });
  }

  /** `$mdPanel.open`: a panel below the clicked element, aligned to its end; closes on outside click or Escape. */
  private openPanel($event: any, component: any, panelClass: string, locals: any): void {
    const target = $event && $event.target ? $event.target : this.element.nativeElement;
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(target)
      .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }]);
    const overlayRef = this.overlay.create({
      positionStrategy,
      panelClass,
      hasBackdrop: true,
      backdropClass: 'cdk-overlay-transparent-backdrop',
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });
    overlayRef.backdropClick().subscribe(() => overlayRef.dispose());
    overlayRef.keydownEvents().subscribe((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        overlayRef.dispose();
      }
    });
    const injector = Injector.create({
      providers: [{ provide: ALARMS_TABLE_PANEL_DATA, useValue: locals }],
      parent: this.injector
    });
    overlayRef.attach(new ComponentPortal(component, null, injector));
    this.destroyRef.onDestroy(() => overlayRef.dispose());
  }

  private updateAlarmSource(): void {
    const ctx: any = this.ctx();

    ctx.widgetTitle = this.utils.createLabelFromDatasource(this.alarmSource, this.alarmsTitle);

    this.stylesInfo = {};
    this.contentsInfo = {};
    this.columnWidth = {};

    for (let d = 0; d < this.alarmSource.dataKeys.length; d++) {
      const dataKey = this.alarmSource.dataKeys[d];

      dataKey.title = this.utils.customTranslation(dataKey.label, dataKey.label);
      dataKey.display = true;

      const keySettings = dataKey.settings;

      let cellStyleFunction: any = null;
      let useCellStyleFunction = false;

      if (keySettings.useCellStyleFunction === true) {
        if (keySettings.cellStyleFunction !== undefined && keySettings.cellStyleFunction.length > 0) {
          try {
            cellStyleFunction = new Function('value', keySettings.cellStyleFunction);
            useCellStyleFunction = true;
          } catch (e) {
            cellStyleFunction = null;
            useCellStyleFunction = false;
          }
        }
      }

      this.stylesInfo[dataKey.label] = {
        useCellStyleFunction: useCellStyleFunction,
        cellStyleFunction: cellStyleFunction
      };

      let cellContentFunction: any = null;
      let useCellContentFunction = false;

      if (keySettings.useCellContentFunction === true) {
        if (keySettings.cellContentFunction !== undefined && keySettings.cellContentFunction.length > 0) {
          try {
            cellContentFunction = new Function('value, alarm, filter', keySettings.cellContentFunction);
            useCellContentFunction = true;
          } catch (e) {
            cellContentFunction = null;
            useCellContentFunction = false;
          }
        }
      }

      this.contentsInfo[dataKey.label] = {
        useCellContentFunction: useCellContentFunction,
        cellContentFunction: cellContentFunction
      };

      const columnWidth = keySettings.columnWidth !== undefined ? keySettings.columnWidth : '0px';
      this.columnWidth[dataKey.label] = columnWidth;
    }
  }
}
