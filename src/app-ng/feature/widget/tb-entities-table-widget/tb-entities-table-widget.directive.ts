import { Component, model, effect, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

import { isEqual } from 'lodash-es';
import tinycolor from 'tinycolor2';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function EntitiesTableWidgetController(this: any, $element?: any, $scope?: any, $filter?: any, $mdMedia?: any, $mdPanel?: any, $document?: any, $translate?: any, $timeout?: any, utils?: any, types?: any) {
    var vm: any = this;

    vm.stylesInfo = {};
    vm.contentsInfo = {};
    vm.columnWidth = {};

    vm.showData = true;
    vm.hasData = false;

    vm.entities = [];
    vm.entitiesCount = 0;

    vm.datasources = null;
    vm.allEntities = null;

    vm.currentEntity = null;

    vm.displayEntityName = true;
    vm.entityNameColumnTitle = '';
    vm.displayEntityLabel = false;
    vm.entityLabelColumnTitle = '';
    vm.displayEntityType = true;
    vm.actionCellDescriptors = [];
    vm.displayPagination = true;
    vm.defaultPageSize = 10;
    vm.defaultSortOrder = "'entityName'";

    vm.query = {
        order: vm.defaultSortOrder,
        limit: vm.defaultPageSize,
        page: 1,
        search: null
    };

    vm.searchAction = {
        name: 'action.search',
        show: true,
        onAction: function() {
            vm.enterFilterMode();
        },
        icon: 'search'
    };

    let columnDisplayAction: any = {
        name: 'entity.columns-to-display',
        show: true,
        onAction: function($event?: any) {
            vm.editColumnsToDisplay($event);
        },
        icon: 'view_column'
    };

    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.onReorder = onReorder;
    vm.onPaginate = onPaginate;
    vm.onRowClick = onRowClick;
    vm.onActionButtonClick = onActionButtonClick;
    vm.isCurrent = isCurrent;

    vm.cellStyle = cellStyle;
    vm.cellContent = cellContent;

    vm.editColumnsToDisplay = editColumnsToDisplay;

    effect(() => {
        const ctx = vm.ctxSignal();
        if (ctx && ctx.defaultSubscription) {
            vm.settings = ctx.settings;
            vm.widgetConfig = ctx.widgetConfig;
            vm.subscription = ctx.defaultSubscription;
            vm.datasources = vm.subscription.datasources;
            initializeConfig();
            updateDatasources();
            updateEntities();
        }
    });

    effect(() => {
        const newVal = vm.querySearchSignal();
        if (!isEqual(newVal, vm.prevQuerySearch) && vm.query.search != null) {
            updateEntities();
        }
        vm.prevQuerySearch = newVal;
    });

    $scope.$on('entities-table-data-updated', function(event?: any, tableId?: any) {
        if (vm.tableId == tableId) {
            if (vm.subscription) {
                updateEntitiesData(vm.subscription.data);
                updateEntities();
                $scope.$digest();
            }
        }
    });

    function mdMediaSignal(query: string) {
        const mq = query === 'gt-xs' ? '(min-width: 600px)' :
            query === 'gt-sm' ? '(min-width: 960px)' :
            query === 'gt-md' ? '(min-width: 1280px)' :
            query === 'gt-lg' ? '(min-width: 1920px)' : query;
        return signal(window.matchMedia(mq).matches);
    }

    effect(() => {
        vm.isGtXs = mdMediaSignal('gt-xs')();
    });

    effect(() => {
        vm.isGtMd = mdMediaSignal('gt-md')();
        if (vm.isGtMd) {
            vm.limitOptions = [vm.defaultPageSize, vm.defaultPageSize*2, vm.defaultPageSize*3];
        } else {
            vm.limitOptions = null;
        }
    });

    function initializeConfig() {

        vm.ctx.widgetActions = [ vm.searchAction, columnDisplayAction ];

        vm.actionCellDescriptors = vm.ctx.actionsApi.getActionDescriptors('actionCellButton');

        if (vm.settings.entitiesTitle && vm.settings.entitiesTitle.length) {
            vm.entitiesTitle = utils.customTranslation(vm.settings.entitiesTitle, vm.settings.entitiesTitle);
        } else {
            vm.entitiesTitle = $translate.instant('entity.entities');
        }

        vm.ctx.widgetTitle = vm.entitiesTitle;

        vm.searchAction.show = vm.settings.enableSearch !== undefined ? vm.settings.enableSearch : true;
        vm.displayEntityName = vm.settings.displayEntityName !== undefined ? vm.settings.displayEntityName : true;
        vm.displayEntityLabel = vm.settings.displayEntityLabel !== undefined ? vm.settings.displayEntityLabel : false;
        columnDisplayAction.show = vm.settings.enableSelectColumnDisplay !== undefined ? vm.settings.enableSelectColumnDisplay : true;

        if (vm.settings.entityNameColumnTitle && vm.settings.entityNameColumnTitle.length) {
            vm.entityNameColumnTitle = utils.customTranslation(vm.settings.entityNameColumnTitle, vm.settings.entityNameColumnTitle);
        } else {
            vm.entityNameColumnTitle = $translate.instant('entity.entity-name');
        }

        if (vm.settings.entityLabelColumnTitle && vm.settings.entityLabelColumnTitle.length) {
            vm.entityLabelColumnTitle = utils.customTranslation(vm.settings.entityLabelColumnTitle, vm.settings.entityLabelColumnTitle);
        } else {
            vm.entityLabelColumnTitle = $translate.instant('entity.entity-label');
        }

        vm.displayEntityType = vm.settings.displayEntityType !== undefined ? vm.settings.displayEntityType : true;
        vm.displayPagination = vm.settings.displayPagination !== undefined ? vm.settings.displayPagination : true;

        var pageSize: any = vm.settings.defaultPageSize;
        if (pageSize !== undefined && typeof pageSize === 'number' && pageSize > 0) {
            vm.defaultPageSize = pageSize;
        }

        if (vm.settings.defaultSortOrder && vm.settings.defaultSortOrder.length) {
            vm.defaultSortOrder = vm.settings.defaultSortOrder;
            if (vm.settings.defaultSortOrder.charAt(0) === "-") {
                vm.defaultSortOrder = '-"' + utils.customTranslation(vm.settings.defaultSortOrder.substring(1), vm.settings.defaultSortOrder.substring(1)) + '"';
            } else {
                vm.defaultSortOrder = '"' + utils.customTranslation(vm.settings.defaultSortOrder, vm.settings.defaultSortOrder) + '"';
            }
        }

        vm.query.order = vm.defaultSortOrder;
        vm.query.limit = vm.defaultPageSize;
        if (vm.isGtMd) {
            vm.limitOptions = [vm.defaultPageSize, vm.defaultPageSize*2, vm.defaultPageSize*3];
        } else {
            vm.limitOptions = null;
        }

        var origColor: any = vm.widgetConfig.color || 'rgba(0, 0, 0, 0.87)';
        var defaultColor: any = (tinycolor as any)(origColor);
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

        var cssParser: any = new ((window as any).cssjs)();
        cssParser.testMode = false;
        var namespace: any = 'entities-table-' + hashCode(cssString);
        cssParser.cssPreviewNamespace = namespace;
        cssParser.createStyleElement(namespace, cssString);
        vm.ctx.$container[0].classList.add(namespace);

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
    }

    function enterFilterMode () {
        vm.query.search = '';
        vm.ctx.hideTitlePanel = true;
        $timeout(()=>{
            $(vm.ctx.$container).find('.searchInput').focus();
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        updateEntities();
        vm.ctx.hideTitlePanel = false;
    }

    function onReorder () {
        updateEntities();
    }

    function onPaginate () {
        updateEntities();
    }

    function onRowClick($event?: any, entity?: any, isDouble?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.currentEntity != entity) {
            vm.currentEntity = entity;
        }
        var actionSourceId: any = isDouble ? 'rowDoubleClick' : 'rowClick';
        var descriptors: any = vm.ctx.actionsApi.getActionDescriptors(actionSourceId);
        if (descriptors.length) {
            var entityId: any, entityName: any, entityLabel: any;
            if (vm.currentEntity) {
                entityId = vm.currentEntity.id;
                entityName = vm.currentEntity.entityName;
                entityLabel = vm.currentEntity.entityLabel;
            }
            vm.ctx.actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, null, entityLabel);
        }
    }

    function onActionButtonClick($event?: any, entity?: any, actionDescriptor?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var entityId: any, entityName: any, entityLabel: any;
        if (entity) {
            entityId = entity.id;
            entityName = entity.entityName;
            entityLabel = entity.entityLabel;
        }
        vm.ctx.actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, null, entityLabel);
    }

    function isCurrent(entity?: any) {
        return (vm.currentEntity && entity && vm.currentEntity.id && entity.id) &&
            (vm.currentEntity.id.id === entity.id.id);
    }

    function updateEntities() {
        var result: any = $filter('orderBy')(vm.allEntities, vm.query.order);
        if (vm.query.search != null) {
            result = ($filter('filter') as any)(result, {$: vm.query.search});
        }
        vm.entitiesCount = result.length;

        if (vm.displayPagination) {
            var startIndex: any = vm.query.limit * (vm.query.page - 1);
            vm.entities = result.slice(startIndex, startIndex + vm.query.limit);
        } else {
            vm.entities = result;
        }
    }

    function cellStyle(entity?: any, key?: any) {
        var style: any = {};
        if (entity && key) {
            var styleInfo: any = vm.stylesInfo[key.label];
            var value: any = getEntityValue(entity, key);
            if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
                try {
                    style = styleInfo.cellStyleFunction(value);
                } catch (e) {
                    style = {};
                }
            } else {
                style = (defaultStyle as any)(key, value);
            }
        }
        if (!style.width) {
            var columnWidth: any = vm.columnWidth[key.label];
            if(columnWidth !== "0px") {
                style.width = columnWidth;
            } else {
                style.width = "auto";
            }
        }
        return style;
    }

    function cellContent(entity?: any, key?: any) {
        var strContent: any = '';
        if (entity && key) {
            var contentInfo: any = vm.contentsInfo[key.label];
            var value: any = getEntityValue(entity, key);
            if (contentInfo.useCellContentFunction && contentInfo.cellContentFunction) {
                if (value !== undefined) {
                    strContent = '' + value;
                }
                var content: any = strContent;
                try {
                    content = contentInfo.cellContentFunction(value, entity, $filter);
                } catch (e) {
                    content = strContent;
                }
            } else {
                var decimals: any = (contentInfo.decimals || contentInfo.decimals === 0) ? contentInfo.decimals : vm.widgetConfig.decimals;
                var units: any = contentInfo.units || vm.widgetConfig.units;
                content = vm.ctx.utils.formatValue(value, decimals, units, true);
            }
            return content;
        } else {
            return strContent;
        }
        return undefined;
    }

    function defaultStyle(/*key, value*/) {
        return {};
    }

    const getDescendantProp: any = (obj?: any, path?: any) => (
        path.split('.').reduce((acc?: any, part?: any) => acc && acc[part], obj)
    );

    function getEntityValue(entity?: any, key?: any) {
        return getDescendantProp(entity, key.label);
    }

    function updateEntitiesData(data?: any) {
        if (vm.allEntities) {
            for (var i: any=0;i<vm.allEntities.length;i++) {
                var entity: any = vm.allEntities[i];
                for (var a: any=0;a<vm.dataKeys.length;a++) {
                    var dataKey: any = vm.dataKeys[a];
                    var index: any = i * vm.dataKeys.length + a;
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

    function editColumnsToDisplay($event?: any) {
        var element: any = $($event.target);
        var position: any = $mdPanel.newPanelPosition()
            .relativeTo(element)
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);
        var config: any = {
            attachTo: $($document[0].body),
            controller: DisplayColumnsPanelController,
            controllerAs: 'vm',
            panelClass: 'tb-display-columns-panel',
            position: position,
            fullscreen: false,
            locals: {
                'columns': vm.columns
            },
            openFrom: $event,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false
        };
        $mdPanel.open(config);
    }

    function updateDatasources() {

        vm.stylesInfo = {};
        vm.contentsInfo = {};
        vm.columnWidth = {};
        vm.dataKeys = [];
        vm.columns = [];
        vm.allEntities = [];

        var datasource: any;
        var dataKey: any;

        datasource = vm.datasources[0];

        vm.ctx.widgetTitle = utils.createLabelFromDatasource(datasource, vm.entitiesTitle);

        if (vm.displayEntityName) {
            vm.columns.push(
                {
                    name: 'entityName',
                    label: 'entityName',
                    title: vm.entityNameColumnTitle,
                    display: true
                }
            );
            vm.contentsInfo['entityName'] = {
                useCellContentFunction: false
            };
            vm.stylesInfo['entityName'] = {
                useCellStyleFunction: false
            };
            vm.columnWidth['entityName'] = '0px';
        }

        if (vm.displayEntityLabel) {
            vm.columns.push(
                {
                    name: 'entityLabel',
                    label: 'entityLabel',
                    title: vm.entityLabelColumnTitle,
                    display: true
                }
            );
            vm.contentsInfo['entityLabel'] = {
                useCellContentFunction: false
            };
            vm.stylesInfo['entityLabel'] = {
                useCellStyleFunction: false
            };
            vm.columnWidth['entityLabel'] = '0px';
        }

        if (vm.displayEntityType) {
            vm.columns.push(
                {
                    name: 'entityType',
                    label: 'entityType',
                    title: $translate.instant('entity.entity-type'),
                    display: true
                }
            );
            vm.contentsInfo['entityType'] = {
                useCellContentFunction: false
            };
            vm.stylesInfo['entityType'] = {
                useCellStyleFunction: false
            };
            vm.columnWidth['entityType'] = '0px';
        }

        for (var d: any = 0; d < datasource.dataKeys.length; d++ ) {
            dataKey = structuredClone(datasource.dataKeys[d]);
            if (dataKey.type == types.dataKeyType.function) {
                dataKey.name = dataKey.label;
            }
            vm.dataKeys.push(dataKey);

            dataKey.title = utils.customTranslation(dataKey.label, dataKey.label);

            var keySettings: any = dataKey.settings;

            var cellStyleFunction: any = null;
            var useCellStyleFunction: any = false;

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

            vm.stylesInfo[dataKey.label] = {
                useCellStyleFunction: useCellStyleFunction,
                cellStyleFunction: cellStyleFunction
            };

            var cellContentFunction: any = null;
            var useCellContentFunction: any = false;

            if (keySettings.useCellContentFunction === true) {
                if (keySettings.cellContentFunction !== undefined && keySettings.cellContentFunction.length > 0) {
                    try {
                        cellContentFunction = new Function('value, entity, filter', keySettings.cellContentFunction);
                        useCellContentFunction = true;
                    } catch (e) {
                        cellContentFunction = null;
                        useCellContentFunction = false;
                    }
                }
            }

            vm.contentsInfo[dataKey.label] = {
                useCellContentFunction: useCellContentFunction,
                cellContentFunction: cellContentFunction,
                units: dataKey.units,
                decimals: dataKey.decimals
            };

            var columnWidth: any = keySettings.columnWidth !== undefined ? keySettings.columnWidth : '0px';
            vm.columnWidth[dataKey.label] = columnWidth;

            dataKey.display = true;
            vm.columns.push(dataKey);
        }

        for (var i: any=0;i<vm.datasources.length;i++) {
            datasource = vm.datasources[i];
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
                entity.entityType = $translate.instant(types.entityTypeTranslations[datasource.entityType].type) + '';
            } else {
                entity.entityType = '';
            }
            for (d = 0; d < vm.dataKeys.length; d++) {
                dataKey = vm.dataKeys[d];
                entity[dataKey.label] = '';
            }
            vm.allEntities.push(entity);
        }

    }

}

function DisplayColumnsPanelController(this: any, columns?: any) {  //eslint-disable-line

    var vm: any = this;
    vm.columns = columns;
}

/**
 * Ported from the AngularJS directive `tbEntitiesTableWidget` (module `thingsboard.widgets.entitiesTableWidget`) in src/app/widget/lib/entities-table-widget.js:30.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-entities-table-widget',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-entities-table-widget.directive.html',
})
export class TbEntitiesTableWidgetDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly tableId = model<any>();
  readonly ctx = model<any>();

  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

  restrict: any = "E";
  bindToController: any = {
            tableId: '=',
            ctx: '='
        };
  controller: any = EntitiesTableWidgetController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
