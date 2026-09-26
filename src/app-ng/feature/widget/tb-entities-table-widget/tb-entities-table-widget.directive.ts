import { Component, inject, model } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import displayColumnsPanelTemplate from '../../../../app/widget/lib/display-columns-panel.tpl.html';
import tinycolor from 'tinycolor2';
import cssjs from '../../../../vendor/css.js/css';
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
import { $timeout } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $filter: any;
declare let $scope: any;
declare let utils: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function DisplayColumnsPanelController(this: any, columns?: any) {  //eslint-disable-line

    var vm: any = this;
    vm.columns = columns;
}

/**
 * Ported from the AngularJS directive `tbEntitiesTableWidget` (module `thingsboard.widgets.entitiesTableWidget`) in src/app/widget/lib/entities-table-widget.js:30.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
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

  protected readonly elementRef = inject(ElementRef);
  // TODO(port): '$scope' — component state: fields and signals on this class
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  protected readonly utils = inject(UtilsService);
  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

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

  // TODO(port): $scope.$digest — $digest is not needed: Angular detects the change
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    let vm = this;
    this.query = {
        order: this.defaultSortOrder,
        limit: this.defaultPageSize,
        page: 1,
        search: null
    };
    this.searchAction = {
        name: 'action.search',
        show: true,
        onAction: (...rest: any[]) => {
            this.enterFilterMode();
        },
        icon: 'search'
    };
    this.columnDisplayAction = {
        name: 'entity.columns-to-display',
        show: true,
        onAction: ($event?: any, ...rest: any[]) => {
            this.editColumnsToDisplay($event);
        },
        icon: 'view_column'
    };
    this.enterFilterMode = this.enterFilterMode;
    this.exitFilterMode = this.exitFilterMode;
    this.onReorder = this.onReorder;
    this.onPaginate = this.onPaginate;
    this.onRowClick = this.onRowClick;
    this.onActionButtonClick = this.onActionButtonClick;
    this.isCurrent = this.isCurrent;
    this.cellStyle = this.cellStyle;
    this.cellContent = this.cellContent;
    this.editColumnsToDisplay = this.editColumnsToDisplay;
    $scope.$watch('vm.ctx', () => {
        if (this.ctx() && this.ctx().defaultSubscription) {
            this.settings = this.ctx().settings;
            this.widgetConfig = this.ctx().widgetConfig;
            this.subscription = this.ctx().defaultSubscription;
            this.datasources = this.subscription.datasources;
            this.initializeConfig();
            this.updateDatasources();
            this.updateEntities();
        }
    });
    $scope.$watch("vm.query.search", (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal) && this.query.search != null) {
            this.updateEntities();
        }
    });
    $scope.$on('entities-table-data-updated', (event?: any, tableId?: any) => {
        if (this.tableId() == tableId) {
            if (this.subscription) {
                this.updateEntitiesData(this.subscription.data);
                this.updateEntities();
                
            }
        }
    });
    $scope.$watch(() => { return this.breakpoints('gt-xs'); }, (isGtXs?: any) => {
        this.isGtXs = isGtXs;
    });
    $scope.$watch(() => { return this.breakpoints('gt-md'); }, (isGtMd?: any) => {
        this.isGtMd = isGtMd;
        if (this.isGtMd) {
            this.limitOptions = [this.defaultPageSize, this.defaultPageSize*2, this.defaultPageSize*3];
        } else {
            this.limitOptions = null;
        }
    });
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
    setTimeout(()=>{
        $(this.ctx().$container).find('.searchInput').focus();
    })
  };

  exitFilterMode = (...rest: any[]): any => {
    this.query.search = null;
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
    var result: any = $filter('orderBy')(this.allEntities, this.query.order);
    if (this.query.search != null) {
        result = $filter('filter')(result, {$: this.query.search});
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
                content = contentInfo.cellContentFunction(value, entity, $filter);
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

  defaultStyle(/*key, value*/: any, ...rest: any[]): any {
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

  editColumnsToDisplay = ($event?: any, ...rest: any[]): any => {
    let vm = this;
    var element: any = $($event.target);
    var position: any = this.overlay.newPanelPosition()
        .relativeTo(element)
        .addPanelPosition(this.overlay.xPosition.ALIGN_END, this.overlay.yPosition.BELOW);
    var config: any = {
        attachTo: $(this.document.body),
        controller: DisplayColumnsPanelController,
        controllerAs: 'vm',
        templateUrl: displayColumnsPanelTemplate,
        panelClass: 'tb-display-columns-panel',
        position: position,
        fullscreen: false,
        locals: {
            'columns': this.columns
        },
        openFrom: $event,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false
    };
    this.overlay.open(config);
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
        dataKey = structuredClone(datasource.dataKeys[d]);
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
