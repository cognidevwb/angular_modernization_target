import { Component, model, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import timeseriesTableWidgetTemplate from '../../../../app/widget/lib/timeseries-table-widget.tpl.html?raw';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { takeUntil } from 'rxjs/operators';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function TimeseriesTableWidgetController(this: any, $element?: any, $scope?: any, $filter?: any, $timeout?: any, types?: any) {
    var vm: any = this;
    let dateFormatFilter: any;

    vm.sources = [];
    vm.sourceIndex = 0;
    vm.defaultPageSize = 10;
    vm.defaultSortOrder = '-0';
    vm.query = {
        "search": null
    };

    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.onRowClick = onRowClick;
    vm.onActionButtonClick = onActionButtonClick;
    vm.actionCellDescriptors = [];

    function enterFilterMode () {
        vm.query.search = '';
        vm.ctx.hideTitlePanel = true;
        $timeout(()=>{
        $timeout(()=>{
            $(vm.ctx.$container).find('.searchInput').focus();
        })
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        vm.ctx.hideTitlePanel = false;
    }

    vm.searchAction = {
        name: 'action.search',
        show: true,
        onAction: function() {
            vm.enterFilterMode();
        },
        icon: 'search'
    };

    effect(() => {
       if (vm.ctx) {
           vm.settings = vm.ctx.settings;
           vm.widgetConfig = vm.ctx.widgetConfig;
           vm.data = vm.ctx.data;
           vm.datasources = vm.ctx.datasources;
           initialize();
       }
    });

    function initialize() {
        vm.ctx.widgetActions = [ vm.searchAction ];
        vm.actionCellDescriptors = vm.ctx.actionsApi.getActionDescriptors('actionCellButton');
        vm.showTimestamp = vm.settings.showTimestamp !== false;
        dateFormatFilter = (vm.settings.showMilliseconds !== true) ? 'yyyy-MM-dd HH:mm:ss' :  'yyyy-MM-dd HH:mm:ss.sss';
        var origColor: any = vm.widgetConfig.color || 'rgba(0, 0, 0, 0.87)';
        var defaultColor: any = (window as any).tinycolor(origColor);
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

        var cssParser: any = new (window as any).cssjs();
        cssParser.testMode = false;
        var namespace: any = 'ts-table-' + hashCode(cssString);
        cssParser.cssPreviewNamespace = namespace;
        cssParser.createStyleElement(namespace, cssString);
        el.nativeElement.classList.add(namespace);

        vm.displayPagination = angular.isDefined(vm.settings.displayPagination) ? vm.settings.displayPagination : true;

        function hashCode(str?: any) {
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
        updateDatasources();
    }

    timeseriesTableService.timeseriesTableDataUpdated$.pipe(takeUntil(this.destroy$)).subscribe(({tableId}: any) => {
        if (vm.tableId == tableId) {
            dataUpdated();
        }
    });

    function dataUpdated() {
        for (var s: any=0; s < vm.sources.length; s++) {
            var source: any = vm.sources[s];
            source.rawData = vm.data.slice(source.keyStartIndex, source.keyEndIndex);
        }
        updateSourceData(vm.sources[vm.sourceIndex]);
    function dataUpdated() {
        for (var s: any=0; s < vm.sources.length; s++) {
            var source: any = vm.sources[s];
            source.rawData = vm.data.slice(source.keyStartIndex, source.keyEndIndex);
        }
        updateSourceData(vm.sources[vm.sourceIndex]);
    }
    }

    vm.onPaginate = function(source?: any) {
        updatePage(source);
    }

    vm.onReorder = function(source?: any) {
        reorder(source);
        updatePage(source);
    }

    function onRowClick($event?: any, row?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var descriptors: any = vm.ctx.actionsApi.getActionDescriptors('rowClick');
        if (descriptors.length) {
            var entityId: any = vm.ctx.activeEntityInfo.entityId;
            var entityName: any = vm.ctx.activeEntityInfo.entityName;
            var entityLabel: any = vm.ctx.activeEntityInfo.entityLabel;
            vm.ctx.actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, row, entityLabel);
        }
    }

    function onActionButtonClick($event?: any, row?: any, actionDescriptor?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var entityId: any = vm.ctx.activeEntityInfo.entityId;
        var entityName: any = vm.ctx.activeEntityInfo.entityName;
        var entityLabel: any = vm.ctx.activeEntityInfo.entityLabel;
        vm.ctx.actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, row, entityLabel);
    }


    vm.cellStyle = function(source?: any, index?: any, value?: any) {
        var style: any = {};
        if (index > 0) {
            var styleInfo: any = source.ts.stylesInfo[index-1];
            if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
                try {
                    style = styleInfo.cellStyleFunction(value);
                } catch (e) {
                    style = {};
                }
            }
        }
        return style;
    }

    vm.cellContent = function(source?: any, index?: any, row?: any, value?: any) {
        if (index === 0) {
            return datePipe.transform(value, dateFormatFilter);
        } else {
            var strContent: any = '';
            if (angular.isDefined(value)) {
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
                    content = contentInfo.cellContentFunction(value, rowData, $filter);
                } catch (e) {
                    content = strContent;
                }
            } else {
                var decimals: any = (contentInfo.decimals || contentInfo.decimals === 0) ? contentInfo.decimals : vm.widgetConfig.decimals;
                var units: any = contentInfo.units || vm.widgetConfig.units;
                content = vm.ctx.utils.formatValue(value, decimals, units, true);
            }
            return content;
        }
        return undefined;
    }

    effect(() => {
        const newIndex = vm.sourceIndex;
        if (newIndex != oldIndex) {
            updateSourceData(vm.sources[vm.sourceIndex]);
            updateActiveEntityInfo();
        }
        oldIndex = newIndex;
    });

    function updateActiveEntityInfo() {
        var source: any = vm.sources[vm.sourceIndex];
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
        vm.ctx.activeEntityInfo = activeEntityInfo;
    }

    function updateDatasources() {
        vm.sources = [];
        vm.sourceIndex = 0;
        var keyOffset: any = 0;
        if (vm.datasources) {
            for (var ds: any = 0; ds < vm.datasources.length; ds++) {
                var source: any = {};
                var datasource: any = vm.datasources[ds];
                source.keyStartIndex = keyOffset;
                keyOffset += datasource.dataKeys.length;
                source.keyEndIndex = keyOffset;
                source.datasource = datasource;
                source.data = [];
                source.rawData = [];
                source.query = {
                    limit: vm.settings.defaultPageSize || 10,
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
                        if (angular.isDefined(keySettings.cellStyleFunction) && keySettings.cellStyleFunction.length > 0) {
                            try {
                                cellStyleFunction = new Function('value', keySettings.cellStyleFunction);
                                useCellStyleFunction = true;
                            } catch (e) {
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
                        if (angular.isDefined(keySettings.cellContentFunction) && keySettings.cellContentFunction.length > 0) {
                            try {
                                cellContentFunction = new Function('value, rowData, filter', keySettings.cellContentFunction);
                                useCellContentFunction = true;
                            } catch (e) {
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
                vm.sources.push(source);
            }
        }
        updateActiveEntityInfo();
    }

    function updatePage(source?: any) {
        var startIndex: any = source.query.limit * (source.query.page - 1);
        source.ts.data = source.data.slice(startIndex, startIndex + source.query.limit);
    }

    function reorder(source?: any) {
        let searchRegExp: any = new RegExp(vm.query.search);

        source.data = $filter('orderBy')(source.data, source.query.order);
        if (vm.query.search !== null) {
            source.data = source.data.filter(function(item?: any){
                for (let i: any = 0; i < item.length; i++) {
                    if (vm.showTimestamp) {
                        if (i === 0) {
                            if (searchRegExp.test(datePipe.transform(item[i], dateFormatFilter))) {
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

    function convertData(data?: any) {
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
            if (vm.settings.hideEmptyLines)
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

    function updateSourceData(source?: any) {
        source.data = convertData(source.rawData);
        source.ts.count = source.data.length;
        reorder(source);
        updatePage(source);
    }

}

/**
 * Ported from the AngularJS directive `tbTimeseriesTableWidget` (module `thingsboard.widgets.timeseriesTableWidget`) in src/app/widget/lib/timeseries-table-widget.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-timeseries-table-widget',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatTabsModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-timeseries-table-widget.directive.html',
})
export class TbTimeseriesTableWidgetDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            tableId: '=',
            ctx: '='
        };
  controller: any = TimeseriesTableWidgetController;
  controllerAs: any;
  templateUrl: any = timeseriesTableWidgetTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
