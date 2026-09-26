import { Component, DestroyRef, ElementRef, effect, forwardRef, inject, input } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { AttributeService } from '../../api/services/attribute.service';
import { EntityService } from '../../api/services/entity.service';
import { WidgetService } from '../../api/services/widget.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { linkAttrs } from '../../../legacy-link';
import { TbWidgetsBundleSelectDirective } from '../../components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive';
import { TbDashboardDirective } from '../../components/tb-dashboard/tb-dashboard.directive';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { AddAttributeDialogComponent, AddAttributeDialogData } from '../add-attribute-dialog/add-attribute-dialog.component';
import { AddWidgetToDashboardDialogComponent, AddWidgetToDashboardDialogData } from '../add-widget-to-dashboard-dialog/add-widget-to-dashboard-dialog.component';
import { AliasController } from '../alias-controller';
import { EditAttributeValueDialogComponent, EditAttributeValueDialogData } from './edit-attribute-value-dialog.component';

/**
 * Ported from the AngularJS directive `tbAttributeTable` (module `thingsboard.entity`) in
 * src/app/entity/attribute/attribute-table.directive.js: the attributes / latest telemetry of one
 * entity — a paged, sortable, searchable, selectable table, add / edit / delete, and a widget
 * mode that previews the selected keys on the widgets of a bundle.
 *
 * `entity-type` and `default-attribute-scope` were plain attributes; they are inputs here, and
 * the host attributes (`attr.entity-type="…"`) are still read when the inputs are not bound.
 */
@Component({
  selector: 'tb-attribute-table',
  standalone: true,
  imports: [
    DatePipe, NgClass, FormsModule, TranslatePipe, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule,
    MatInputModule, MatPaginatorModule, MatProgressBarModule, MatSelectModule, MatToolbarModule, MatTooltipModule,
    forwardRef(() => TbWidgetsBundleSelectDirective), forwardRef(() => TbDashboardDirective),
  ],
  templateUrl: './tb-attribute-table.directive.html',
})
export class TbAttributeTableDirective {
  readonly entityId = input<any>();
  readonly entityName = input<any>();
  readonly disableAttributeScopeSelection = input<any>();
  readonly entityTypeInput = input<string | undefined>(undefined, { alias: 'entityType' });
  readonly defaultAttributeScopeInput = input<string | undefined>(undefined, { alias: 'defaultAttributeScope' });

  protected readonly rootScope = inject(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly utils = inject(UtilsService);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly entityService = inject(EntityService);
  protected readonly attributeService = inject(AttributeService);
  protected readonly widgetService = inject(WidgetService);
  protected readonly element = inject(ElementRef);

  readonly types: any = types;
  entityType: any;
  attributeScopes: any = {};
  attributeScopeList: any[] = [];
  attributeScopeSelectionReadonly = false;
  private attributeScopeValue: any;
  attributes: any = { count: 0, data: [] };
  selectedAttributes: any[] = [];
  mode: 'default' | 'widget' = 'default';
  subscriptionId: any = null;
  query: any = { order: 'key', limit: 5, page: 1, search: null };
  private searchValue: string | null = null;
  attributesDeferred: any;
  loadingAttributes = false;

  aliasController: AliasController | null = null;
  private widgetDatasource: any;
  widgetsBundle: any = null;
  selectedWidgetsBundleAlias: any;
  widgetsListCache: any[] = [];
  widgetsLoaded = false;
  widgetsCarousel = { index: 0 };
  private initialized = false;

  constructor() {
    // `scope.$watch('entityId', …)`: a new entity resets the filter and reloads
    effect(() => {
      const entityId = this.entityId();
      this.ensureInit();
      if (entityId) {
        this.resetFilter();
        this.getEntityAttributes(false, true);
      }
    });
    inject(DestroyRef).onDestroy(() => {
      if (this.subscriptionId) {
        this.attributeService.unsubscribeForEntityAttributes(this.subscriptionId);
      }
    });
  }

  /** The legacy link's setup, once the host's attributes are in place. */
  private ensureInit(): void {
    if (this.initialized) {
      return;
    }
    this.initialized = true;
    const attrs = linkAttrs(this.element.nativeElement);
    this.entityType = this.entityTypeInput() ?? attrs.entityType;
    if (this.entityType === types.entityType.device || this.entityType === types.entityType.entityView) {
      this.attributeScopes = types.attributesScope;
      this.attributeScopeSelectionReadonly = false;
    } else {
      this.attributeScopes = { server: types.attributesScope.server };
      this.attributeScopeSelectionReadonly = true;
    }
    this.attributeScopeList = Object.values(this.attributeScopes);
    this.attributeScopeValue = this.defaultAttributeScope();
  }

  private defaultAttributeScope(): any {
    const value = this.defaultAttributeScopeInput() ?? linkAttrs(this.element.nativeElement).defaultAttributeScope;
    let scope = this.getAttributeScopeByValue(value);
    if (this.entityType != types.entityType.device && scope != types.latestTelemetry) {
      scope = this.attributeScopes.server;
    }
    return scope;
  }

  get attributeScope(): any {
    return this.attributeScopeValue;
  }

  /** `scope.$watch('attributeScope', …)`: another scope starts over. */
  set attributeScope(newVal: any) {
    const prevVal = this.attributeScopeValue;
    this.attributeScopeValue = newVal;
    if (newVal && JSON.stringify(newVal) !== JSON.stringify(prevVal)) {
      this.mode = 'default';
      this.search = null;
      this.selectedAttributes = [];
      this.getEntityAttributes(false, true);
    }
  }

  get search(): string | null {
    return this.searchValue;
  }

  /** `scope.$watch('query.search', …)`: typing filters. */
  set search(value: string | null) {
    const prev = this.searchValue;
    this.searchValue = value;
    this.query.search = value;
    if (value !== prev && value != null) {
      this.getEntityAttributes();
    }
  }

  getAttributeScopeByValue(attributeScopeValue: any): any {
    if (types.latestTelemetry.value === attributeScopeValue) {
      return types.latestTelemetry;
    }
    for (const attrScope in this.attributeScopes) {
      if (this.attributeScopes[attrScope].value === attributeScopeValue) {
        return this.attributeScopes[attrScope];
      }
    }
    return undefined;
  }

  resetFilter(): void {
    this.mode = 'default';
    this.searchValue = null;
    this.query.search = null;
    this.selectedAttributes = [];
    this.attributeScopeValue = this.defaultAttributeScope();
  }

  enterFilterMode(event: Event): void {
    const toolbarsContainer = (event.currentTarget as HTMLElement).closest('.toolbarsContainer');
    this.search = '';
    setTimeout(() => {
      (toolbarsContainer?.querySelector('.searchInput') as HTMLInputElement | null)?.focus();
    });
  }

  exitFilterMode(): void {
    this.search = null;
    this.getEntityAttributes();
  }

  success(attributes: any, update?: boolean): void {
    this.attributes = attributes;
    if (!update) {
      this.selectedAttributes = [];
    }
  }

  /** The legacy md-order toggle: the same column flips direction, another sorts ascending. */
  sortBy(column: string): void {
    this.query.order = this.query.order === column ? '-' + column : column;
    this.getEntityAttributes(false, false);
  }

  onPaginate(event: PageEvent): void {
    this.query.page = event.pageIndex + 1;
    this.query.limit = event.pageSize;
    this.getEntityAttributes(false, false);
  }

  getEntityAttributes(forceUpdate?: boolean, reset?: boolean): void {
    if (this.attributesDeferred) {
      this.attributesDeferred.resolve();
    }
    if (this.entityId() && this.entityType && this.attributeScope) {
      if (reset) {
        this.attributes = { count: 0, data: [] };
      }
      this.checkSubscription();
      this.loadingAttributes = true;
      const deferred = this.attributeService.getEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value,
        this.query, (attributes: any, update?: boolean) => {
          this.success(attributes, update || forceUpdate);
        });
      this.attributesDeferred = deferred;
      Promise.resolve(deferred?.promise).finally(() => {
        if (this.attributesDeferred === deferred) {
          this.loadingAttributes = false;
        }
      });
    } else {
      this.attributesDeferred = null;
      this.success({ count: 0, data: [] });
    }
  }

  checkSubscription(): void {
    let newSubscriptionId: any = null;
    if (this.entityId() && this.entityType && this.attributeScope.clientSide && this.mode != 'widget') {
      newSubscriptionId = this.attributeService.subscribeForEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value);
    }
    if (this.subscriptionId && this.subscriptionId != newSubscriptionId) {
      this.attributeService.unsubscribeForEntityAttributes(this.subscriptionId);
    }
    this.subscriptionId = newSubscriptionId;
  }

  isSelected(attribute: any): boolean {
    return this.selectedAttributes.some((a) => a.key === attribute.key);
  }

  toggleSelected(attribute: any): void {
    this.selectedAttributes = this.isSelected(attribute)
      ? this.selectedAttributes.filter((a) => a.key !== attribute.key)
      : [...this.selectedAttributes, attribute];
  }

  allSelected(): boolean {
    const rows = this.attributes?.data ?? [];
    return rows.length > 0 && rows.every((a: any) => this.isSelected(a));
  }

  toggleAll(): void {
    this.selectedAttributes = this.allSelected() ? [] : [...(this.attributes?.data ?? [])];
  }

  editAttribute($event: Event, attribute: any): void {
    if (this.attributeScope.clientSide) {
      return;
    }
    $event.stopPropagation();
    const ref = this.dialog.open<EditAttributeValueDialogComponent, EditAttributeValueDialogData, { value: any }>(
      EditAttributeValueDialogComponent, { data: { attributeValue: attribute.value }, panelClass: 'tb-dialog' });
    firstValueFrom(ref.afterClosed()).then((model) => {
      if (!model) {
        return;
      }
      const updatedAttribute = structuredClone(attribute);
      updatedAttribute.value = model.value;
      this.attributeService.saveEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value, [updatedAttribute]).then(() => {
        this.getEntityAttributes();
      });
    });
  }

  addAttribute($event: Event): void {
    if (this.attributeScope.clientSide) {
      return;
    }
    $event.stopPropagation();
    const ref = this.dialog.open<AddAttributeDialogComponent, AddAttributeDialogData, boolean>(AddAttributeDialogComponent, {
      data: { entityType: this.entityType, entityId: this.entityId(), attributeScope: this.attributeScope.value },
      panelClass: 'tb-dialog',
    });
    firstValueFrom(ref.afterClosed()).then((added) => {
      if (added) {
        this.getEntityAttributes();
      }
    });
  }

  deleteAttributes($event: Event): void {
    if (this.attributeScope.clientSide) {
      return;
    }
    $event.stopPropagation();
    showConfirm(this.dialog, {
      title: this.translate.instant('attribute.delete-attributes-title', { count: this.selectedAttributes.length }),
      htmlContent: this.translate.instant('attribute.delete-attributes-text'),
      cancel: this.translate.instant('action.no'),
      ok: this.translate.instant('action.yes'),
    }).then(
      () => {
        this.attributeService.deleteEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value, this.selectedAttributes).then(() => {
          this.selectedAttributes = [];
          this.getEntityAttributes();
        });
      },
      () => undefined,
    );
  }

  /** The widget the carousel shows (legacy kept only the current slide populated). */
  currentWidgets(): any[] {
    return this.widgetsListCache[this.widgetsCarousel.index] ?? [];
  }

  nextWidget(): void {
    if (this.widgetsCarousel.index < this.widgetsListCache.length - 1) {
      this.widgetsCarousel.index++;
    }
  }

  prevWidget(): void {
    if (this.widgetsCarousel.index > 0) {
      this.widgetsCarousel.index--;
    }
  }

  enterWidgetMode(): void {
    this.mode = 'widget';
    this.checkSubscription();
    this.widgetsListCache = [];
    this.widgetsLoaded = false;
    this.widgetsCarousel = { index: 0 };
    this.widgetsBundle = null;
    this.selectedWidgetsBundleAlias = types.systemBundleAlias.cards;

    const entityAlias: any = {
      id: this.utils.guid(),
      alias: this.entityName(),
      filter: this.dashboardUtils.createSingleEntityFilter(this.entityType, this.entityId()),
    };
    const entityAliases: any = { [entityAlias.id]: entityAlias };
    const stateController = {
      getStateParams: () => ({}),
    };
    this.aliasController = new AliasController(this.rootScope, null, null, this.utils, types, this.entityService, stateController, entityAliases);

    const dataKeyType = this.attributeScope === types.latestTelemetry ? types.dataKeyType.timeseries : types.dataKeyType.attribute;
    this.widgetDatasource = {
      type: types.datasourceType.entity,
      entityAliasId: entityAlias.id,
      dataKeys: this.selectedAttributes.map((attribute: any, i: number) => ({
        name: attribute.key,
        label: attribute.key,
        type: dataKeyType,
        color: this.utils.getMaterialColor(i),
        settings: {},
        _hash: Math.random(),
      })),
    };
  }

  /** `scope.$watch('widgetsBundle', …)` in widget mode: load the bundle's widgets for the keys. */
  onWidgetsBundleChange(widgetsBundle: any): void {
    this.widgetsBundle = widgetsBundle;
    if (this.mode !== 'widget') {
      return;
    }
    this.widgetsListCache = [];
    this.widgetsCarousel.index = 0;
    if (!widgetsBundle) {
      return;
    }
    this.widgetsLoaded = false;
    const bundleAlias = widgetsBundle.alias;
    const isSystem = widgetsBundle.tenantId.id === types.id.nullUid;
    this.widgetService.getBundleWidgetTypes(bundleAlias, isSystem).then((loaded: any) => {
      if (this.widgetsBundle !== widgetsBundle) {
        return;
      }
      const widgetTypes = [...loaded].sort((a: any, b: any) => {
        const aType = a?.descriptor?.type ?? '';
        const bType = b?.descriptor?.type ?? '';
        if (aType !== bType) {
          return aType < bType ? 1 : -1;
        }
        const aCreated = a?.createdTime ?? 0;
        const bCreated = b?.createdTime ?? 0;
        return aCreated < bCreated ? 1 : aCreated > bCreated ? -1 : 0;
      });
      for (const widgetType of widgetTypes) {
        const widget = this.toPreviewWidget(widgetType, bundleAlias, isSystem);
        if (widget) {
          this.widgetsListCache.push([widget]);
        }
      }
      this.widgetsLoaded = true;
    });
  }

  private toPreviewWidget(widgetType: any, bundleAlias: string, isSystem: boolean): any {
    const widgetInfo = this.widgetService.toWidgetInfo(widgetType);
    if (widgetInfo.type === types.widgetType.static.value) {
      return null;
    }
    const showsKeys = this.attributeScope === types.latestTelemetry
      ? widgetInfo.type !== types.widgetType.rpc.value
      : widgetInfo.type === types.widgetType.latest.value;
    if (!showsKeys) {
      return null;
    }
    const sizeX = widgetInfo.sizeX * 2;
    const sizeY = widgetInfo.sizeY * 2;
    const widget: any = {
      isSystemType: isSystem,
      bundleAlias,
      typeAlias: widgetInfo.alias,
      type: widgetInfo.type,
      title: widgetInfo.widgetName,
      sizeX,
      sizeY,
      row: 0,
      col: Math.floor(Math.max(0, (20 - sizeX) / 2)),
      config: JSON.parse(widgetInfo.defaultConfig),
    };
    widget.config.title = widgetInfo.widgetName;
    widget.config.datasources = [this.widgetDatasource];
    return widget;
  }

  exitWidgetMode(): void {
    this.selectedWidgetsBundleAlias = null;
    this.mode = 'default';
    this.getEntityAttributes(true);
  }

  addWidgetToDashboard($event: Event): void {
    if (this.mode === 'widget' && this.widgetsListCache.length > 0) {
      const widget = this.widgetsListCache[this.widgetsCarousel.index][0];
      $event.stopPropagation();
      this.dialog.open<AddWidgetToDashboardDialogComponent, AddWidgetToDashboardDialogData>(AddWidgetToDashboardDialogComponent, {
        data: {
          entityId: this.entityId(),
          entityType: this.entityType,
          entityName: this.entityName(),
          widget: structuredClone(widget),
        },
        panelClass: 'tb-dialog',
      });
    }
  }

  loading(): boolean {
    return !!this.rootScope['loading'];
  }
}
