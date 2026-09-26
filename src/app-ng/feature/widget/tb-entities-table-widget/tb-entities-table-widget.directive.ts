import { Component, DestroyRef, effect, inject, InjectionToken, Injector, model, untracked } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import tinycolor from 'tinycolor2';
import cssjs from '../../../../vendor/css.js/css';
import { RootState } from '../../../root-state';
import { onWidgetEvent } from '../../components/widget/widget-scope';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { createLegacyFilter, legacyCopy, legacyEquals } from '../../components/widget/legacy-helpers';

const DISPLAY_COLUMNS_PANEL_DATA = new InjectionToken<any>('DISPLAY_COLUMNS_PANEL_DATA');

/** Ported from `DisplayColumnsPanelController` + src/app/widget/lib/display-columns-panel.tpl.html. */
@Component({
  selector: 'tb-entities-display-columns-panel',
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
export class EntitiesDisplayColumnsPanelComponent {
  protected readonly columns: any[] = inject(DISPLAY_COLUMNS_PANEL_DATA).columns;
}

/**
 * Ported from the AngularJS directive `tbEntitiesTableWidget` (module `thingsboard.widgets.entitiesTableWidget`) in src/app/widget/lib/entities-table-widget.js:30.
 * The widget runtime renders it for the template `<tb-entities-table-widget table-id="tableId" ctx="ctx">`;
 * the widget type's script broadcasts `entities-table-data-updated` on `ctx.$scope` when data arrives.
 */
@Component({
  selector: 'tb-entities-table-widget',
  standalone: true,
  imports: [TranslatePipe, MatPaginatorModule, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-entities-table-widget.directive.html',
})
export class TbEntitiesTableWidgetDirective {
  protected readonly rootScope = inject(RootState);
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  protected readonly elementRef = inject(ElementRef);
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  protected readonly injector = inject(Injector);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly translate = inject(TranslateService);
  protected readonly utils = inject(UtilsService);
  /** `$filter` as the cell content functions receive it (`filter('date')(value, format)`). */
  protected readonly $filter = createLegacyFilter((key, params) => this.translate.instant(key, params));
  private offDataUpdated: (() => void) | null = null;
  private prevSearch: any = null;

  stylesInfo: any = {};
  contentsInfo: any = {};
  columnWidth: any = {};
  showData: any = true;
  hasData: any = false;
  entities: any = [];
  entitiesCount: any = 0;
  datasources: any = null;
  allEntities: any = null;
  currentEntity: any = null;
  displayEntityName: any = true;
  entityNameColumnTitle: any = '';
  displayEntityLabel: any = false;
  entityLabelColumnTitle: any = '';
  displayEntityType: any = true;
  actionCellDescriptors: any = [];
  displayPagination: any = true;
  defaultPageSize: any = 10;
  defaultSortOrder: any = "'entityName'";
  query: any;
  searchAction: any;
  protected columnDisplayAction: any;
  columns: any;
  dataKeys: any;
  entitiesTitle: any;
  isGtMd: any;
  isGtXs: any;
  limitOptions: any;
  settings: any;
  subscription: any;
  widgetConfig: any;

  constructor() {
    this.query = {
        order: this.defaultSortOrder,
        limit: this.defaultPageSize,
        page: 1,
        search: null
    };
    this.searchAction = {
        name: 'action.search',
        show: true,
        onAction: () => {
            this.enterFilterMode();
        },
        icon: 'search'
    };
    this.columnDisplayAction = {
        name: 'entity.columns-to-display',
        show: true,
        onAction: ($event?: any) => {
            this.editColumnsToDisplay($event);
        },
        icon: 'view_column'
    };
    effect(() => {
      const ctx = this.ctx();
      untracked(() => {
        if (ctx && ctx.defaultSubscription) {
            this.settings = ctx.settings;
            this.widgetConfig = ctx.widgetConfig;
            this.subscription = ctx.defaultSubscription;
            this.datasources = this.subscription.datasources;
            this.listenForData(ctx);
            this.initializeConfig();
            this.updateDatasources();
            this.updateEntities();
        }
      });
    });
    // $mdMedia('gt-xs') / $mdMedia('gt-md')
    const gtXs = this.breakpoints.observe('(min-width: 600px)').subscribe((state) => {
        this.isGtXs = state.matches;
    });
    const gtMd = this.breakpoints.observe('(min-width: 1280px)').subscribe((state) => {
        this.isGtMd = state.matches;
        if (this.isGtMd) {
            this.limitOptions = [this.defaultPageSize, this.defaultPageSize*2, this.defaultPageSize*3];
        } else {
            this.limitOptions = null;
        }
    });
    this.destroyRef.onDestroy(() => {
        gtXs.unsubscribe();
        gtMd.unsubscribe();
        this.offDataUpdated?.();
    });
  }

  /** The widget type's script broadcasts on its widget scope when new data arrived for this table. */
  private listenForData(ctx: any): void {
    this.offDataUpdated?.();
    this.offDataUpdated = onWidgetEvent(ctx, 'entities-table-data-updated', (_event: any, tableId: any) => {
          if (this.tableId() == tableId) {
            if (this.subscription) {
                this.updateEntitiesData(this.subscription.data);
                this.updateEntities();
            }
          }
        });
  }

  /** The search input: the legacy watch on the query's search text. */
  onSearchChange(newVal: any): void {
    const prevVal = this.prevSearch;
    this.query.search = newVal;
    this.prevSearch = newVal;
    if (!legacyEquals(newVal, prevVal) && this.query.search != null) {
        this.updateEntities();
    }
  }

  /** The label a sort order (`-"label"`, `'label'`) orders by. */
  private orderLabel(order: any): string {
    let key = String(order ?? '');
    if (key.charAt(0) === '-' || key.charAt(0) === '+') {
      key = key.substring(1);
    }
    return key.replace(/^(['"])(.*)\1$/, '$2');
  }

  /** A click on a column header (md-order-by): a new column sorts ascending, the same column toggles. */
  sortBy(label: string): void {
    const desc = String(this.query.order ?? '').charAt(0) === '-';
    if (this.orderLabel(this.query.order) === label) {
      this.query.order = (desc ? '' : '-') + '"' + label + '"';
    } else {
      this.query.order = '"' + label + '"';
    }
    this.onReorder();
  }

  sortDirection(label: string): string {
    if (this.orderLabel(this.query.order) !== label) {
      return '';
    }
    return String(this.query.order).charAt(0) === '-' ? 'arrow_downward' : 'arrow_upward';
  }

  /** md-table-pagination's page and limit. */
  onPage(event: PageEvent): void {
    this.query.limit = event.pageSize;
    this.query.page = event.pageIndex + 1;
    this.onPaginate();
  }

  initializeConfig(...rest: any[]): any {

    this.ctx().widgetActions = [ this.searchAction, this.columnDisplayAction ];

    this.actionCellDescriptors = this.ctx().actionsApi.getActionDescriptors('actionCellButton');

    if (this.settings.entitiesTitle && this.settings.entitiesTitle.length) {
        this.entitiesTitle = this.utils.customTranslation(this.settings.entitiesTitle, this.settings.entitiesTitle);
    } else {
        this.entitiesTitle = this.translate.instant('entity.entities');
    }

    this.ctx().widgetTitle = this.entitiesTitle;

    this.searchAction.show = (this.settings.enableSearch !== undefined) ? this.settings.enableSearch : true;
    this.displayEntityName = (this.settings.displayEntityName !== undefined) ? this.settings.displayEntityName : true;
    this.displayEntityLabel = (this.settings.displayEntityLabel !== undefined) ? this.settings.displayEntityLabel : false;
    this.columnDisplayAction.show = (this.settings.enableSelectColumnDisplay !== undefined) ? this.settings.enableSelectColumnDisplay : true;

    if (this.settings.entityNameColumnTitle && this.settings.entityNameColumnTitle.length) {
        this.entityNameColumnTitle = this.utils.customTranslation(this.settings.entityNameColumnTitle, this.settings.entityNameColumnTitle);
    } else {
        this.entityNameColumnTitle = this.translate.instant('entity.entity-name');
    }

    if (this.settings.entityLabelColumnTitle && this.settings.entityLabelColumnTitle.length) {
        this.entityLabelColumnTitle = this.utils.customTranslation(this.settings.entityLabelColumnTitle, this.settings.entityLabelColumnTitle);
    } else {
        this.entityLabelColumnTitle = this.translate.instant('entity.entity-label');
    }

    this.displayEntityType = (this.settings.displayEntityType !== undefined) ? this.settings.displayEntityType : true;
    this.displayPagination = (this.settings.displayPagination !== undefined) ? this.settings.displayPagination : true;

    var pageSize: any = this.settings.defaultPageSize;
    if ((pageSize !== undefined) && (typeof pageSize === 'number') && pageSize > 0) {
        this.defaultPageSize = pageSize;
    }

    if (this.settings.defaultSortOrder && this.settings.defaultSortOrder.length) {
        this.defaultSortOrder = this.settings.defaultSortOrder;
        if (this.settings.defaultSortOrder.charAt(0) === "-") {
            this.defaultSortOrder = '-"' + this.utils.customTranslation(this.settings.defaultSortOrder.substring(1), this.settings.defaultSortOrder.substring(1)) + '"';
        } else {
            this.defaultSortOrder = '"' + this.utils.customTranslation(this.settings.defaultSortOrder, this.settings.defaultSortOrder) + '"';
        }
    }

    this.query.order = this.defaultSortOrder;
    this.query.limit = this.defaultPageSize;
    if (this.isGtMd) {
        this.limitOptions = [this.defaultPageSize, this.defaultPageSize*2, this.defaultPageSize*3];
    } else {
        this.limitOptions = null;
    }

    var origColor: any = this.widgetConfig.color || 'rgba(0, 0, 0, 0.87)';
    var defaultColor: any = tinycolor(origColor);
    var mdDark: any = defaultColor.setAlpha(0.87).toRgbString();
    var mdDarkSecondary: any = defaultColor.setAlpha(0.54).toRgbString();
    var mdDarkDisabled: any = defaultColor.setAlpha(0.26).toRgbString();
    //var mdDarkIcon = mdDarkSecondary;
    var mdDarkDivider: any = defaultColor.setAlpha(0.12).toRgbString();

    //md-icon.md-default-theme, md-icon {

    var cssString: any = 'table.md-table th.md-column {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
        '}\n'+
        'table.md-table th.md-column.md-checkbox-column md-checkbox:not(.md-checked) .md-icon {\n'+
        'border-color: ' + mdDarkSecondary + ';\n'+
        '}\n'+
        'table.md-table th.md-column md-icon.md-sort-icon {\n'+
        'color: ' + mdDarkDisabled + ';\n'+
        '}\n'+
        'table.md-table th.md-column.md-active, table.md-table th.md-column.md-active md-icon {\n'+
        'color: ' + mdDark + ';\n'+
        '}\n'+
        'table.md-table td.md-cell {\n'+
        'color: ' + mdDark + ';\n'+
        'border-top: 1px '+mdDarkDivider+' solid;\n'+
        '}\n'+
        'table.md-table td.md-cell.md-checkbox-cell md-checkbox:not(.md-checked) .md-icon {\n'+
        'border-color: ' + mdDarkSecondary + ';\n'+
        '}\n'+
        'table.md-table td.md-cell.tb-action-cell button.md-icon-button md-icon {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
        '}\n'+
        'table.md-table td.md-cell.md-placeholder {\n'+
        'color: ' + mdDarkDisabled + ';\n'+
        '}\n'+
        'table.md-table td.md-cell md-select > .md-select-value > span.md-select-icon {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
        '}\n'+
        '.md-table-pagination {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
        'border-top: 1px '+mdDarkDivider+' solid;\n'+
        '}\n'+
        '.md-table-pagination .buttons md-icon {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
        '}\n'+
        '.md-table-pagination md-select:not([disabled]):focus .md-select-value {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
        '}';

    var cssParser: any = new cssjs();
    cssParser.testMode = false;
    var namespace: any = 'entities-table-' + hashCode(cssString);
    cssParser.cssPreviewNamespace = namespace;
    cssParser.createStyleElement(namespace, cssString);
    $(this.elementRef.nativeElement).addClass(namespace);

    function hashCode(str?: any): any {
        var hash: any = 0;
        var i: any, char: any;
        if (str.length === 0) return hash;
        for (i = 0; i < str.length; i++) {
            char = str.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash;
        }
        return hash;
    }
  }

  enterFilterMode = (...rest: any[]): any => {
    this.query.search = '';
    this.ctx().hideTitlePanel = true;
    setTimeout(() => {
        $(this.ctx().$container).find('.searchInput').focus();
    });
  };

  exitFilterMode = (...rest: any[]): any => {
    this.query.search = null;
    this.prevSearch = null;
    this.updateEntities();
    this.ctx().hideTitlePanel = false;
  };

  onReorder = (...rest: any[]): any => {
    this.updateEntities();
  };

  onPaginate = (...rest: any[]): any => {
    this.updateEntities();
  };

  onRowClick = ($event?: any, entity?: any, isDouble?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    if (this.currentEntity != entity) {
        this.currentEntity = entity;
    }
    var actionSourceId: any = isDouble ? 'rowDoubleClick' : 'rowClick';
    var descriptors: any = this.ctx().actionsApi.getActionDescriptors(actionSourceId);
    if (descriptors.length) {
        var entityId: any, entityName: any, entityLabel: any;
        if (this.currentEntity) {
            entityId = this.currentEntity.id;
            entityName = this.currentEntity.entityName;
            entityLabel = this.currentEntity.entityLabel;
        }
        this.ctx().actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, null, entityLabel);
    }
  };

  onActionButtonClick = ($event?: any, entity?: any, actionDescriptor?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var entityId: any, entityName: any, entityLabel: any;
    if (entity) {
        entityId = entity.id;
        entityName = entity.entityName;
        entityLabel = entity.entityLabel;
    }
    this.ctx().actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, null, entityLabel);
  };

  isCurrent = (entity?: any, ...rest: any[]): any => {
    return (this.currentEntity && entity && this.currentEntity.id && entity.id) &&
        (this.currentEntity.id.id === entity.id.id);
  };

  updateEntities(...rest: any[]): any {
    var result: any = this.$filter('orderBy')(this.allEntities, this.query.order);
    if (this.query.search != null) {
        result = this.$filter('filter')(result, {$: this.query.search});
    }
    this.entitiesCount = result.length;

    if (this.displayPagination) {
        var startIndex: any = this.query.limit * (this.query.page - 1);
        this.entities = result.slice(startIndex, startIndex + this.query.limit);
    } else {
        this.entities = result;
    }
  }

  cellStyle = (entity?: any, key?: any, ...rest: any[]): any => {
    var style: any = {};
    if (entity && key) {
        var styleInfo: any = this.stylesInfo[key.label];
        var value: any = this.getEntityValue(entity, key);
        if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
            try {
                style = styleInfo.cellStyleFunction(value);
            } catch (e: any) {
                style = {};
            }
        } else {
            style = this.defaultStyle(key, value);
        }
    }
    if (!style.width) {
        var columnWidth: any = this.columnWidth[key.label];
        if(columnWidth !== "0px") {
            style.width = columnWidth;
        } else {
            style.width = "auto";
        }
    }
    return style;
  };

  cellContent = (entity?: any, key?: any, ...rest: any[]): any => {
    var strContent: any = '';
    if (entity && key) {
        var contentInfo: any = this.contentsInfo[key.label];
        var value: any = this.getEntityValue(entity, key);
        if (contentInfo.useCellContentFunction && contentInfo.cellContentFunction) {
            if ((value !== undefined)) {
                strContent = '' + value;
            }
            var content: any = strContent;
            try {
                content = contentInfo.cellContentFunction(value, entity, this.$filter);
            } catch (e: any) {
                content = strContent;
            }
        } else {
            var decimals: any = (contentInfo.decimals || contentInfo.decimals === 0) ? contentInfo.decimals : this.widgetConfig.decimals;
            var units: any = contentInfo.units || this.widgetConfig.units;
            content = this.ctx().utils.formatValue(value, decimals, units, true);
        }
        return content;
    } else {
        return strContent;
    }
  };

  defaultStyle(..._keyAndValue: any[]): any {
    return {};
  }

  getDescendantProp(obj?: any, path?: any, ...rest: any[]): any {
    return (
          path.split('.').reduce((acc?: any, part?: any) => acc && acc[part], obj)
      );
  }

  getEntityValue(entity?: any, key?: any, ...rest: any[]): any {
    return this.getDescendantProp(entity, key.label);
  }

  updateEntitiesData(data?: any, ...rest: any[]): any {
    if (this.allEntities) {
        for (var i: any=0;i<this.allEntities.length;i++) {
            var entity: any = this.allEntities[i];
            for (var a: any=0;a<this.dataKeys.length;a++) {
                var dataKey: any = this.dataKeys[a];
                var index: any = i * this.dataKeys.length + a;
                var keyData: any = data[index].data;
                if (keyData && keyData.length && keyData[0].length > 1) {
                    var value: any = keyData[0][1];
                    entity[dataKey.label] = value;
                } else {
                    entity[dataKey.label] = '';
                }
            }
        }
    }
  }

  /** `$mdPanel.open` of the columns panel: below the clicked button, aligned to its end; closes on outside click or Escape. */
  editColumnsToDisplay = ($event?: any): void => {
    const target = $event && $event.target ? $event.target : this.elementRef.nativeElement;
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(target)
      .withPositions([{ originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top' }]);
    const overlayRef = this.overlay.create({
      positionStrategy,
      panelClass: 'tb-display-columns-panel',
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
      providers: [{ provide: DISPLAY_COLUMNS_PANEL_DATA, useValue: { columns: this.columns } }],
      parent: this.injector
    });
    overlayRef.attach(new ComponentPortal(EntitiesDisplayColumnsPanelComponent, null, injector));
    this.destroyRef.onDestroy(() => overlayRef.dispose());
  };

  updateDatasources(...rest: any[]): any {

    this.stylesInfo = {};
    this.contentsInfo = {};
    this.columnWidth = {};
    this.dataKeys = [];
    this.columns = [];
    this.allEntities = [];

    var datasource: any;
    var dataKey: any;

    datasource = this.datasources[0];

    this.ctx().widgetTitle = this.utils.createLabelFromDatasource(datasource, this.entitiesTitle);

    if (this.displayEntityName) {
        this.columns.push(
            {
                name: 'entityName',
                label: 'entityName',
                title: this.entityNameColumnTitle,
                display: true
            }
        );
        this.contentsInfo['entityName'] = {
            useCellContentFunction: false
        };
        this.stylesInfo['entityName'] = {
            useCellStyleFunction: false
        };
        this.columnWidth['entityName'] = '0px';
    }

    if (this.displayEntityLabel) {
        this.columns.push(
            {
                name: 'entityLabel',
                label: 'entityLabel',
                title: this.entityLabelColumnTitle,
                display: true
            }
        );
        this.contentsInfo['entityLabel'] = {
            useCellContentFunction: false
        };
        this.stylesInfo['entityLabel'] = {
            useCellStyleFunction: false
        };
        this.columnWidth['entityLabel'] = '0px';
    }

    if (this.displayEntityType) {
        this.columns.push(
            {
                name: 'entityType',
                label: 'entityType',
                title: this.translate.instant('entity.entity-type'),
                display: true
            }
        );
        this.contentsInfo['entityType'] = {
            useCellContentFunction: false
        };
        this.stylesInfo['entityType'] = {
            useCellStyleFunction: false
        };
        this.columnWidth['entityType'] = '0px';
    }

    for (var d: any = 0; d < datasource.dataKeys.length; d++ ) {
        dataKey = legacyCopy(datasource.dataKeys[d]);
        if (dataKey.type == types.dataKeyType.function) {
            dataKey.name = dataKey.label;
        }
        this.dataKeys.push(dataKey);

        dataKey.title = this.utils.customTranslation(dataKey.label, dataKey.label);

        var keySettings: any = dataKey.settings;

        var cellStyleFunction: any = null;
        var useCellStyleFunction: any = false;

        if (keySettings.useCellStyleFunction === true) {
            if ((keySettings.cellStyleFunction !== undefined) && keySettings.cellStyleFunction.length > 0) {
                try {
                    cellStyleFunction = new Function('value', keySettings.cellStyleFunction);
                    useCellStyleFunction = true;
                } catch (e: any) {
                    cellStyleFunction = null;
                    useCellStyleFunction = false;
                }
            }
        }

        this.stylesInfo[dataKey.label] = {
            useCellStyleFunction: useCellStyleFunction,
            cellStyleFunction: cellStyleFunction
        };

        var cellContentFunction: any = null;
        var useCellContentFunction: any = false;

        if (keySettings.useCellContentFunction === true) {
            if ((keySettings.cellContentFunction !== undefined) && keySettings.cellContentFunction.length > 0) {
                try {
                    cellContentFunction = new Function('value, entity, filter', keySettings.cellContentFunction);
                    useCellContentFunction = true;
                } catch (e: any) {
                    cellContentFunction = null;
                    useCellContentFunction = false;
                }
            }
        }

        this.contentsInfo[dataKey.label] = {
            useCellContentFunction: useCellContentFunction,
            cellContentFunction: cellContentFunction,
            units: dataKey.units,
            decimals: dataKey.decimals
        };

        var columnWidth: any = (keySettings.columnWidth !== undefined) ? keySettings.columnWidth : '0px';
        this.columnWidth[dataKey.label] = columnWidth;

        dataKey.display = true;
        this.columns.push(dataKey);
    }

    for (var i: any=0;i<this.datasources.length;i++) {
        datasource = this.datasources[i];
        if (datasource.type == types.datasourceType.entity && !datasource.entityId) {
            continue;
        }
        var entity: any = {
            id: {}
        };
        entity.entityName = datasource.entityName;
        if (datasource.entityLabel) {
            entity.entityLabel = datasource.entityLabel;
        } else {
            entity.entityLabel = datasource.entityName;
        }
        if (datasource.entityId) {
            entity.id.id = datasource.entityId;
        }
        if (datasource.entityType) {
            entity.id.entityType = datasource.entityType;
            entity.entityType = this.translate.instant(types.entityTypeTranslations[datasource.entityType].type) + '';
        } else {
            entity.entityType = '';
        }
        for (d = 0; d < this.dataKeys.length; d++) {
            dataKey = this.dataKeys[d];
            entity[dataKey.label] = '';
        }
        this.allEntities.push(entity);
    }

  }
}
