import { Component, DestroyRef, effect, inject, model, untracked } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import tinycolor from 'tinycolor2';
import cssjs from '../../../../vendor/css.js/css';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { onWidgetEvent } from '../../components/widget/widget-scope';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { createLegacyFilter } from '../../components/widget/legacy-helpers';

/**
 * Ported from the AngularJS directive `tbTimeseriesTableWidget` (module `thingsboard.widgets.timeseriesTableWidget`) in src/app/widget/lib/timeseries-table-widget.js:27.
 * The widget runtime renders it for the template `<tb-timeseries-table-widget table-id="tableId" ctx="ctx">`;
 * the widget type's script broadcasts `timeseries-table-data-updated` on `ctx.$scope` when data arrives.
 */
@Component({
  selector: 'tb-timeseries-table-widget',
  standalone: true,
  imports: [TranslatePipe, MatPaginatorModule, MatTooltipModule, MatToolbarModule, MatTabsModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-timeseries-table-widget.directive.html',
})
export class TbTimeseriesTableWidgetDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  protected readonly element = inject(ElementRef);
  protected readonly translate = inject(TranslateService);
  protected readonly destroyRef = inject(DestroyRef);
  /** `$filter` as the cell content functions receive it (`filter('date')(value, format)`). */
  protected readonly $filter = createLegacyFilter((key, params) => this.translate.instant(key, params));
  /** md-table-pagination's default page sizes (the legacy `vm.limitOptions` was never set). */
  readonly limitOptions = [5, 10, 15];
  private offDataUpdated: (() => void) | null = null;

  protected dateFormatFilter: any;
  sources: any = [];
  sourceIndex: any = 0;
  defaultPageSize: any = 10;
  defaultSortOrder: any = '-0';
  query: any = {
        "search": null
    };
  actionCellDescriptors: any = [];
  searchAction: any;
  data: any;
  datasources: any;
  displayPagination: any;
  settings: any;
  showTimestamp: any;
  widgetConfig: any;

  constructor() {
    this.searchAction = {
        name: 'action.search',
        show: true,
        onAction: () => {
            this.enterFilterMode();
        },
        icon: 'search'
    };
    effect(() => {
      const ctx = this.ctx();
      untracked(() => {
        if (ctx) {
          this.settings = ctx.settings;
          this.widgetConfig = ctx.widgetConfig;
          this.data = ctx.data;
          this.datasources = ctx.datasources;
          this.listenForData(ctx);
          this.initialize();
        }
      });
    });
    this.destroyRef.onDestroy(() => this.offDataUpdated?.());
  }

  /** The widget type's script broadcasts on its widget scope when new data arrived for this table. */
  private listenForData(ctx: any): void {
    this.offDataUpdated?.();
    this.offDataUpdated = onWidgetEvent(ctx, 'timeseries-table-data-updated', (_event: any, tableId: any) => {
          if (this.tableId() == tableId) {
            this.dataUpdated();
          }
        });
  }

  /** The tab selection (`md-selected="vm.sourceIndex"` and its watch). */
  onSourceIndexChange(newIndex: number): void {
    const oldIndex = this.sourceIndex;
    this.sourceIndex = newIndex;
    if (newIndex != oldIndex) {
      this.updateSourceData(this.sources[this.sourceIndex]);
      this.updateActiveEntityInfo();
    }
  }

  /** A click on a sortable column header (md-order / md-order-by): same column toggles the direction. */
  sortBy(source: any, orderBy: any): void {
    const key = String(orderBy);
    source.query.order = source.query.order === key ? '-' + key : key;
    this.onReorder(source);
  }

  sortDirection(source: any, orderBy: any): string {
    const key = String(orderBy);
    if (source.query.order === key) {
      return 'arrow_upward';
    }
    return source.query.order === '-' + key ? 'arrow_downward' : '';
  }

  /** md-table-pagination's page and limit. */
  onPage(source: any, event: PageEvent): void {
    source.query.limit = event.pageSize;
    source.query.page = event.pageIndex + 1;
    this.onPaginate(source);
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
    this.ctx().hideTitlePanel = false;
  };

  initialize(...rest: any[]): any {
    this.ctx().widgetActions = [ this.searchAction ];
    this.actionCellDescriptors = this.ctx().actionsApi.getActionDescriptors('actionCellButton');
    this.showTimestamp = this.settings.showTimestamp !== false;
    this.dateFormatFilter = (this.settings.showMilliseconds !== true) ? 'yyyy-MM-dd HH:mm:ss' :  'yyyy-MM-dd HH:mm:ss.sss';
    var origColor: any = this.widgetConfig.color || 'rgba(0, 0, 0, 0.87)';
    var defaultColor: any = tinycolor(origColor);
    var mdDark: any = defaultColor.setAlpha(0.87).toRgbString();
    var mdDarkSecondary: any = defaultColor.setAlpha(0.54).toRgbString();
    var mdDarkDisabled: any = defaultColor.setAlpha(0.26).toRgbString();
    //var mdDarkIcon = mdDarkSecondary;
    var mdDarkDivider: any = defaultColor.setAlpha(0.12).toRgbString();

    var cssString: any = 'table.md-table th.md-column {\n'+
        'color: ' + mdDarkSecondary + ';\n'+
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
    var namespace: any = 'ts-table-' + hashCode(cssString);
    cssParser.cssPreviewNamespace = namespace;
    cssParser.createStyleElement(namespace, cssString);
    $(this.element.nativeElement).addClass(namespace);

    this.displayPagination = (this.settings.displayPagination !== undefined) ? this.settings.displayPagination : true;

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
    this.updateDatasources();
  }

  dataUpdated(...rest: any[]): any {
    for (var s: any=0; s < this.sources.length; s++) {
        var source: any = this.sources[s];
        source.rawData = this.data.slice(source.keyStartIndex, source.keyEndIndex);
    }
    this.updateSourceData(this.sources[this.sourceIndex]);

  }

  onPaginate(source?: any, ...rest: any[]): any {
    this.updatePage(source);
  }

  onReorder(source?: any, ...rest: any[]): any {
    this.reorder(source);
    this.updatePage(source);
  }

  onRowClick = ($event?: any, row?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var descriptors: any = this.ctx().actionsApi.getActionDescriptors('rowClick');
    if (descriptors.length) {
        var entityId: any = this.ctx().activeEntityInfo.entityId;
        var entityName: any = this.ctx().activeEntityInfo.entityName;
        var entityLabel: any = this.ctx().activeEntityInfo.entityLabel;
        this.ctx().actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, row, entityLabel);
    }
  };

  onActionButtonClick = ($event?: any, row?: any, actionDescriptor?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var entityId: any = this.ctx().activeEntityInfo.entityId;
    var entityName: any = this.ctx().activeEntityInfo.entityName;
    var entityLabel: any = this.ctx().activeEntityInfo.entityLabel;
    this.ctx().actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, row, entityLabel);
  };

  cellStyle(source?: any, index?: any, value?: any, ...rest: any[]): any {
    var style: any = {};
    if (index > 0) {
        var styleInfo: any = source.ts.stylesInfo[index-1];
        if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
            try {
                style = styleInfo.cellStyleFunction(value);
            } catch (e: any) {
                style = {};
            }
        }
    }
    return style;
  }

  cellContent(source?: any, index?: any, row?: any, value?: any, ...rest: any[]): any {
    if (index === 0) {
        return this.$filter('date')(value, this.dateFormatFilter);
    } else {
        var strContent: any = '';
        if ((value !== undefined)) {
            strContent = ''+value;
        }
        var content: any = strContent;
        var contentInfo: any = source.ts.contentsInfo[index-1];
        if (contentInfo.useCellContentFunction && contentInfo.cellContentFunction) {
            try {
                var rowData: any = source.ts.rowDataTemplate;
                rowData['Timestamp'] = row[0];
                for (var h: any=0; h < source.ts.header.length; h++) {
                    var headerInfo: any = source.ts.header[h];
                    rowData[headerInfo.dataKey.name] = row[headerInfo.index];
                }
                content = contentInfo.cellContentFunction(value, rowData, this.$filter);
            } catch (e: any) {
                content = strContent;
            }
        } else {
            var decimals: any = (contentInfo.decimals || contentInfo.decimals === 0) ? contentInfo.decimals : this.widgetConfig.decimals;
            var units: any = contentInfo.units || this.widgetConfig.units;
            content = this.ctx().utils.formatValue(value, decimals, units, true);
        }
        return content;
    }
    return undefined;
  }

  updateActiveEntityInfo(...rest: any[]): any {
    var source: any = this.sources[this.sourceIndex];
    var activeEntityInfo: any = null;
    if (source) {
        var datasource: any = source.datasource;
        if (datasource.type === types.datasourceType.entity &&
            datasource.entityType && datasource.entityId) {
            activeEntityInfo = {
                entityId: {
                    entityType: datasource.entityType,
                    id: datasource.entityId
                },
                entityName: datasource.entityName
            };
        }
    }
    this.ctx().activeEntityInfo = activeEntityInfo;
  }

  updateDatasources(...rest: any[]): any {
    this.sources = [];
    this.sourceIndex = 0;
    var keyOffset: any = 0;
    if (this.datasources) {
        for (var ds: any = 0; ds < this.datasources.length; ds++) {
            var source: any = {};
            var datasource: any = this.datasources[ds];
            source.keyStartIndex = keyOffset;
            keyOffset += datasource.dataKeys.length;
            source.keyEndIndex = keyOffset;
            source.datasource = datasource;
            source.data = [];
            source.rawData = [];
            source.query = {
                limit: this.settings.defaultPageSize || 10,
                page: 1,
                order: '-0'
            }
            source.ts = {
                header: [],
                count: 0,
                data: [],
                stylesInfo: [],
                contentsInfo: [],
                rowDataTemplate: {}
            }
            source.ts.rowDataTemplate['Timestamp'] = null;
            for (var a: any = 0; a < datasource.dataKeys.length; a++ ) {
                var dataKey: any = datasource.dataKeys[a];
                var keySettings: any = dataKey.settings;
                source.ts.header.push({
                    index: a+1,
                    dataKey: dataKey
                });
                source.ts.rowDataTemplate[dataKey.label] = null;

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

                source.ts.stylesInfo.push({
                    useCellStyleFunction: useCellStyleFunction,
                    cellStyleFunction: cellStyleFunction
                });

                var cellContentFunction: any = null;
                var useCellContentFunction: any = false;

                if (keySettings.useCellContentFunction === true) {
                    if ((keySettings.cellContentFunction !== undefined) && keySettings.cellContentFunction.length > 0) {
                        try {
                            cellContentFunction = new Function('value, rowData, filter', keySettings.cellContentFunction);
                            useCellContentFunction = true;
                        } catch (e: any) {
                            cellContentFunction = null;
                            useCellContentFunction = false;
                        }
                    }
                }

                source.ts.contentsInfo.push({
                    useCellContentFunction: useCellContentFunction,
                    cellContentFunction: cellContentFunction,
                    units: dataKey.units,
                    decimals: dataKey.decimals
                });

            }
            this.sources.push(source);
        }
    }
    this.updateActiveEntityInfo();
  }

  updatePage(source?: any, ...rest: any[]): any {
    var startIndex: any = source.query.limit * (source.query.page - 1);
    source.ts.data = source.data.slice(startIndex, startIndex + source.query.limit);
  }

  reorder(source?: any, ...rest: any[]): any {
    let searchRegExp: any = new RegExp(this.query.search);

    source.data = this.$filter('orderBy')(source.data, source.query.order);
    if (this.query.search !== null) {
        source.data = source.data.filter((item?: any) =>{
            for (let i: any = 0; i < item.length; i++) {
                if (this.showTimestamp) {
                    if (i === 0) {
                        if (searchRegExp.test(this.$filter('date')(item[i], this.dateFormatFilter))) {
                            return true;
                        }
                    } else {
                        if (searchRegExp.test(item[i])) {
                            return true;
                        }
                    }
                } else {
                    if (searchRegExp.test(item[i])) {
                        return true;
                    }
                }
            }
            return undefined;
        });
    }
  }

  convertData(data?: any, ...rest: any[]): any {
         var rowsMap: any = {};
         for (var d: any = 0; d < data.length; d++) {
             var columnData: any = data[d].data;
             for (var i: any = 0; i < columnData.length; i++) {
                 var cellData: any = columnData[i];
                 var timestamp: any = cellData[0];
                 var row: any = rowsMap[timestamp];
                 if (!row) {
                     row = [];
                     row[0] = timestamp;
                     for (var c: any = 0; c < data.length; c++) {
                         row[c+1] = undefined;
                     }
                     rowsMap[timestamp] = row;
                 }
                 row[d+1] = cellData[1];
             }
         }
         var rows: any = [];
         for (var t in rowsMap) {
             if (this.settings.hideEmptyLines)
    {
                 var hideLine: any = true;
                 for (var _c: any = 0; (_c < data.length) && hideLine; _c++) {
                     if (rowsMap[t][_c+1])
                         hideLine = false;
                 }
                 if (!hideLine)
                    rows.push(rowsMap[t]);
             }
             else
                 rows.push(rowsMap[t]);
         }
         return rows;
  }

  updateSourceData(source?: any, ...rest: any[]): any {
    source.data = this.convertData(source.rawData);
    source.ts.count = source.data.length;
    this.reorder(source);
    this.updatePage(source);
  }
}
