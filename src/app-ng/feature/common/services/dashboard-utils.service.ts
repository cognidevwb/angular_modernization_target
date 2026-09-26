import { inject, Injectable } from '@angular/core';
import { TimeService } from '../../api/services/time.service';
import { UtilsService } from './utils.service';
import { types } from '../constants/types';
import { bindMethods } from '../../../legacy-injector';

/**
 * Ported from the AngularJS factory `dashboardUtils` (module `thingsboard.dashboardUtils`) in src/app/common/dashboard-utils.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class DashboardUtilsService {
  private readonly __bound = bindMethods(this);
  private readonly timeService = inject(TimeService);
  private readonly utils = inject(UtilsService);

  validateAndUpdateEntityAliases(configuration?: any, datasourcesByAliasId?: any, targetDevicesByAliasId?: any, ...rest: any[]): any {
    var aliasId: any, entityAlias: any;
    if ((configuration.entityAliases === undefined)) {
        configuration.entityAliases = {};
        if (configuration.deviceAliases) {
            var deviceAliases: any = configuration.deviceAliases;
            for (aliasId in deviceAliases) {
                var deviceAlias: any = deviceAliases[aliasId];
                entityAlias = this.validateAndUpdateDeviceAlias(aliasId, deviceAlias, datasourcesByAliasId, targetDevicesByAliasId);
                configuration.entityAliases[entityAlias.id] = entityAlias;
            }
            delete configuration.deviceAliases;
        }
    } else {
        var entityAliases: any = configuration.entityAliases;
        for (aliasId in entityAliases) {
            entityAlias = entityAliases[aliasId];
            entityAlias = this.validateAndUpdateEntityAlias(aliasId, entityAlias, datasourcesByAliasId, targetDevicesByAliasId);
            if (aliasId != entityAlias.id) {
                delete entityAliases[aliasId];
            }
            entityAliases[entityAlias.id] = entityAlias;
        }
    }
    return configuration;
  }

  validateAliasId(aliasId?: any, datasourcesByAliasId?: any, targetDevicesByAliasId?: any, ...rest: any[]): any {
    if (!aliasId || !(typeof aliasId === 'string') || aliasId.length != 36) {
        var newAliasId: any = this.utils.guid();
        var aliasDatasources: any = datasourcesByAliasId[aliasId];
        if (aliasDatasources) {
            aliasDatasources.forEach(
                  function(datasource?: any) {
                      datasource.entityAliasId = newAliasId;
                  }
            );
        }
        var targetDeviceAliasIdsList: any = targetDevicesByAliasId[aliasId];
        if (targetDeviceAliasIdsList) {
            targetDeviceAliasIdsList.forEach(
                function(targetDeviceAliasIds?: any) {
                    targetDeviceAliasIds[0] = newAliasId;
                }
            );
        }
        return newAliasId;
    } else {
        return aliasId;
    }
    return undefined;
  }

  validateAndUpdateDeviceAlias(aliasId?: any, deviceAlias?: any, datasourcesByAliasId?: any, targetDevicesByAliasId?: any, ...rest: any[]): any {
    aliasId = this.validateAliasId(aliasId, datasourcesByAliasId, targetDevicesByAliasId);
    var alias: any = deviceAlias.alias;
    var entityAlias: any = {
        id: aliasId,
        alias: alias,
        filter: {
            type: null,
            entityType: types.entityType.device,
            resolveMultiple: false
        },
    }
    if (deviceAlias.deviceFilter) {
        entityAlias.filter.type =
            deviceAlias.deviceFilter.useFilter ? types.aliasFilterType.entityName.value : types.aliasFilterType.entityList.value;
        if (entityAlias.filter.type == types.aliasFilterType.entityList.value) {
            entityAlias.filter.entityList = deviceAlias.deviceFilter.deviceList;
        } else {
            entityAlias.filter.entityNameFilter = deviceAlias.deviceFilter.deviceNameFilter;
        }
    } else {
        entityAlias.filter.type = types.aliasFilterType.entityList.value;
        entityAlias.filter.entityList = [deviceAlias.deviceId];
    }
    return entityAlias;
  }

  validateAndUpdateEntityAlias(aliasId?: any, entityAlias?: any, datasourcesByAliasId?: any, targetDevicesByAliasId?: any, ...rest: any[]): any {
    entityAlias.id = this.validateAliasId(aliasId, datasourcesByAliasId, targetDevicesByAliasId);
    if (!entityAlias.filter) {
        entityAlias.filter = {
            type: entityAlias.entityFilter.useFilter ? types.aliasFilterType.entityName.value : types.aliasFilterType.entityList.value,
            entityType: entityAlias.entityType,
            resolveMultiple: false
        }
        if (entityAlias.filter.type == types.aliasFilterType.entityList.value) {
            entityAlias.filter.entityList = entityAlias.entityFilter.entityList;
        } else {
            entityAlias.filter.entityNameFilter = entityAlias.entityFilter.entityNameFilter;
        }
        delete entityAlias.entityType;
        delete entityAlias.entityFilter;
    }
    return entityAlias;
  }

  validateAndUpdateWidget(widget?: any, ...rest: any[]): any {
    if (!widget.config) {
        widget.config = {};
    }
    if (!widget.config.datasources) {
        widget.config.datasources = [];
    }
    widget.config.datasources.forEach(function(datasource?: any) {
        if (datasource.type === 'device') {
            datasource.type = types.datasourceType.entity;
        }
        if (datasource.deviceAliasId) {
            datasource.entityAliasId = datasource.deviceAliasId;
            delete datasource.deviceAliasId;
        }
    });
    //TODO: Temp workaround
    if (widget.isSystemType  && widget.bundleAlias == 'charts' && widget.typeAlias == 'timeseries') {
        widget.typeAlias = 'basic_timeseries';
    }
    return widget;
  }

  createDefaultLayoutData(...rest: any[]): any {
    return {
        widgets: {},
        gridSettings: {
            backgroundColor: '#eeeeee',
            color: 'rgba(0,0,0,0.870588)',
            columns: 24,
            margins: [10, 10],
            backgroundSizeMode: '100%'
        }
    };
  }

  createDefaultLayouts(...rest: any[]): any {
    return {
        'main': this.createDefaultLayoutData()
    };
  }

  createDefaultState(name?: any, root?: any, ...rest: any[]): any {
    return {
        name: name,
        root: root,
        layouts: this.createDefaultLayouts()
    }
  }

  validateAndUpdateDashboard(dashboard?: any, ...rest: any[]): any {
    if (!dashboard.configuration) {
        dashboard.configuration = {};
    }
    if ((dashboard.configuration.widgets === undefined)) {
        dashboard.configuration.widgets = {};
    } else if (Array.isArray(dashboard.configuration.widgets)) {
        var widgetsMap: any = {};
        dashboard.configuration.widgets.forEach((widget?: any) => {
            if (!widget.id) {
                widget.id = this.utils.guid();
            }
            widgetsMap[widget.id] = widget;
        });
        dashboard.configuration.widgets = widgetsMap;
    }
    for (var id in dashboard.configuration.widgets) {
        var widget: any = dashboard.configuration.widgets[id];
        dashboard.configuration.widgets[id] = this.validateAndUpdateWidget(widget);
    }
    if ((dashboard.configuration.states === undefined)) {
        dashboard.configuration.states = {
            'default': this.createDefaultState(dashboard.title, true)
        };

        var mainLayout: any = dashboard.configuration.states['default'].layouts['main'];
        for (id in dashboard.configuration.widgets) {
            widget = dashboard.configuration.widgets[id];
            mainLayout.widgets[id] = {
                sizeX: widget.sizeX,
                sizeY: widget.sizeY,
                row: widget.row,
                col: widget.col,
            };
            if ((widget.config.mobileHeight !== undefined)) {
                mainLayout.widgets[id].mobileHeight = widget.config.mobileHeight;
            }
            if ((widget.config.mobileOrder !== undefined)) {
                mainLayout.widgets[id].mobileOrder = widget.config.mobileOrder;
            }
        }
    } else {
        var states: any = dashboard.configuration.states;
        var rootFound: any = false;
        for (var stateId in states) {
            var state: any = states[stateId];
            if ((state.root === undefined)) {
                state.root = false;
            } else if (state.root) {
                rootFound = true;
            }
        }
        if (!rootFound) {
            var firstStateId: any = Object.keys(states)[0];
            states[firstStateId].root = true;
        }
    }

    var datasourcesByAliasId: any = {};
    var targetDevicesByAliasId: any = {};
    for (var widgetId in dashboard.configuration.widgets) {
        widget = dashboard.configuration.widgets[widgetId];
        widget.config.datasources.forEach(function (datasource?: any) {
           if (datasource.entityAliasId) {
               var aliasId: any = datasource.entityAliasId;
               var aliasDatasources: any = datasourcesByAliasId[aliasId];
               if (!aliasDatasources) {
                   aliasDatasources = [];
                   datasourcesByAliasId[aliasId] = aliasDatasources;
               }
               aliasDatasources.push(datasource);
           }
        });
        if (widget.config.targetDeviceAliasIds && widget.config.targetDeviceAliasIds.length) {
            var aliasId: any = widget.config.targetDeviceAliasIds[0];
            var targetDeviceAliasIdsList: any = targetDevicesByAliasId[aliasId];
            if (!targetDeviceAliasIdsList) {
                targetDeviceAliasIdsList = [];
                targetDevicesByAliasId[aliasId] = targetDeviceAliasIdsList;
            }
            targetDeviceAliasIdsList.push(widget.config.targetDeviceAliasIds);
        }
    }

    dashboard.configuration = this.validateAndUpdateEntityAliases(dashboard.configuration, datasourcesByAliasId, targetDevicesByAliasId);

    if ((dashboard.configuration.timewindow === undefined)) {
        dashboard.configuration.timewindow = this.timeService.defaultTimewindow();
    }
    if ((dashboard.configuration.settings === undefined)) {
        dashboard.configuration.settings = {};
        dashboard.configuration.settings.stateControllerId = 'entity';
        dashboard.configuration.settings.showTitle = false;
        dashboard.configuration.settings.showDashboardsSelect = true;
        dashboard.configuration.settings.showEntitiesSelect = true;
        dashboard.configuration.settings.showDashboardTimewindow = true;
        dashboard.configuration.settings.showDashboardExport = true;
        dashboard.configuration.settings.toolbarAlwaysOpen = true;
    } else {
        if ((dashboard.configuration.settings.stateControllerId === undefined)) {
            dashboard.configuration.settings.stateControllerId = 'entity';
        }
    }
    if ((dashboard.configuration.gridSettings !== undefined)) {
        var gridSettings: any = dashboard.configuration.gridSettings;
        if ((gridSettings.showTitle !== undefined)) {
            dashboard.configuration.settings.showTitle = gridSettings.showTitle;
            delete gridSettings.showTitle;
        }
        if ((gridSettings.titleColor !== undefined)) {
            dashboard.configuration.settings.titleColor = gridSettings.titleColor;
            delete gridSettings.titleColor;
        }
        if ((gridSettings.showDevicesSelect !== undefined)) {
            dashboard.configuration.settings.showEntitiesSelect = gridSettings.showDevicesSelect;
            delete gridSettings.showDevicesSelect;
        }
        if ((gridSettings.showEntitiesSelect !== undefined)) {
            dashboard.configuration.settings.showEntitiesSelect = gridSettings.showEntitiesSelect;
            delete gridSettings.showEntitiesSelect;
        }
        if ((gridSettings.showDashboardTimewindow !== undefined)) {
            dashboard.configuration.settings.showDashboardTimewindow = gridSettings.showDashboardTimewindow;
            delete gridSettings.showDashboardTimewindow;
        }
        if ((gridSettings.showDashboardExport !== undefined)) {
            dashboard.configuration.settings.showDashboardExport = gridSettings.showDashboardExport;
            delete gridSettings.showDashboardExport;
        }
        dashboard.configuration.states['default'].layouts['main'].gridSettings = gridSettings;
        delete dashboard.configuration.gridSettings;
    }
    return dashboard;
  }

  getRootStateId(states?: any, ...rest: any[]): any {
    for (var stateId in states) {
        var state: any = states[stateId];
        if (state.root) {
            return stateId;
        }
    }
    return Object.keys(states)[0];
  }

  createSingleWidgetDashboard(widget?: any, ...rest: any[]): any {
    if (!widget.id) {
        widget.id = this.utils.guid();
    }
    var dashboard: any = {};
    dashboard = this.validateAndUpdateDashboard(dashboard);
    dashboard.configuration.widgets[widget.id] = widget;
    dashboard.configuration.states['default'].layouts['main'].widgets[widget.id] = {
        sizeX: widget.sizeX,
        sizeY: widget.sizeY,
        row: widget.row,
        col: widget.col,
    };
    return dashboard;
  }

  createSingleEntityFilter(entityType?: any, entityId?: any, ...rest: any[]): any {
    return {
        type: types.aliasFilterType.singleEntity.value,
        singleEntity: { entityType: entityType, id: entityId },
        resolveMultiple: false
    };
  }

  getStateLayoutsData(dashboard?: any, targetState?: any, ...rest: any[]): any {
    var dashboardConfiguration: any = dashboard.configuration;
    var states: any = dashboardConfiguration.states;
    var state: any = states[targetState];
    if (state) {
        var allWidgets: any = dashboardConfiguration.widgets;
        var result: any = {};
        for (var l in state.layouts) {
            var layout: any = state.layouts[l];
            if (layout) {
                result[l] = {
                    widgets: [],
                    widgetLayouts: {},
                    gridSettings: {}
                }
                for (var id in layout.widgets) {
                    result[l].widgets.push(allWidgets[id]);
                }
                result[l].widgetLayouts = layout.widgets;
                result[l].gridSettings = layout.gridSettings;
            }
        }
        return result;
    } else {
        return null;
    }
    return undefined;
  }

  setLayouts(dashboard?: any, targetState?: any, newLayouts?: any, ...rest: any[]): any {
    var dashboardConfiguration: any = dashboard.configuration;
    var states: any = dashboardConfiguration.states;
    var state: any = states[targetState];
    var addedCount: any = 0;
    var removedCount: any = 0;
    for (var l in state.layouts) {
        if (!newLayouts[l]) {
            removedCount++;
        }
    }
    for (l in newLayouts) {
        if (!state.layouts[l]) {
            addedCount++;
        }
    }
    state.layouts = newLayouts;
    var layoutsCount: any = Object.keys(state.layouts).length;
    var newColumns: any;
    if (addedCount) {
        for (l in state.layouts) {
            newColumns = state.layouts[l].gridSettings.columns * (layoutsCount - addedCount) / layoutsCount;
            state.layouts[l].gridSettings.columns = newColumns;
        }
    }
    if (removedCount) {
        for (l in state.layouts) {
            newColumns = state.layouts[l].gridSettings.columns * (layoutsCount + removedCount) / layoutsCount;
            state.layouts[l].gridSettings.columns = newColumns;
        }
    }
    this.removeUnusedWidgets(dashboard);
  }

  updateLayoutSettings(layout?: any, gridSettings?: any, ...rest: any[]): any {
    var prevGridSettings: any = layout.gridSettings;
    var prevColumns: any = prevGridSettings ? prevGridSettings.columns : 24;
    var ratio: any = gridSettings.columns / prevColumns;
    layout.gridSettings = gridSettings;
    var maxRow: any = 0;
    for (var w in layout.widgets) {
        var widget: any = layout.widgets[w];
        maxRow = Math.max(maxRow, widget.row + widget.sizeY);
    }
    var newMaxRow: any = Math.round(maxRow * ratio);
    for (w in layout.widgets) {
        widget = layout.widgets[w];
        if (widget.row + widget.sizeY == maxRow) {
            widget.row = Math.round(widget.row * ratio);
            widget.sizeY = newMaxRow - widget.row;
        } else {
            widget.row = Math.round(widget.row * ratio);
            widget.sizeY = Math.round(widget.sizeY * ratio);
        }
        widget.sizeX = Math.round(widget.sizeX * ratio);
        widget.col = Math.round(widget.col * ratio);
        if (widget.col + widget.sizeX > gridSettings.columns) {
            widget.sizeX = gridSettings.columns - widget.col;
        }
    }
  }

  addWidgetToLayout(dashboard?: any, targetState?: any, targetLayout?: any, widget?: any, originalColumns?: any, originalSize?: any, row?: any, column?: any, ...rest: any[]): any {
    var dashboardConfiguration: any = dashboard.configuration;
    var states: any = dashboardConfiguration.states;
    var state: any = states[targetState];
    var layout: any = state.layouts[targetLayout];
    var layoutCount: any = Object.keys(state.layouts).length;
    if (!widget.id) {
        widget.id = this.utils.guid();
    }
    if (!dashboardConfiguration.widgets[widget.id]) {
        dashboardConfiguration.widgets[widget.id] = widget;
    }
    var widgetLayout: any = {
        sizeX: originalSize ? originalSize.sizeX : widget.sizeX,
        sizeY: originalSize ? originalSize.sizeY : widget.sizeY,
        mobileOrder: widget.config.mobileOrder,
        mobileHeight: widget.config.mobileHeight
    };

    if ((originalColumns === undefined)) {
        originalColumns = 24;
    }

    var gridSettings: any = layout.gridSettings;
    var columns: any = 24;
    if (gridSettings && gridSettings.columns) {
        columns = gridSettings.columns;
    }

    columns = columns * layoutCount;

    if (columns != originalColumns) {
        var ratio: any = columns / originalColumns;
        widgetLayout.sizeX *= ratio;
        widgetLayout.sizeY *= ratio;
    }

    if (row > -1 && column > - 1) {
        widgetLayout.row = row;
        widgetLayout.col = column;
    } else {
        row = 0;
        for (var w in layout.widgets) {
            var existingLayout: any = layout.widgets[w];
            var wRow: any = existingLayout.row ? existingLayout.row : 0;
            var wSizeY: any = existingLayout.sizeY ? existingLayout.sizeY : 1;
            var bottom: any = wRow + wSizeY;
            row = Math.max(row, bottom);
        }
        widgetLayout.row = row;
        widgetLayout.col = 0;
    }

    layout.widgets[widget.id] = widgetLayout;
  }

  removeWidgetFromLayout(dashboard?: any, targetState?: any, targetLayout?: any, widgetId?: any, ...rest: any[]): any {
    var dashboardConfiguration: any = dashboard.configuration;
    var states: any = dashboardConfiguration.states;
    var state: any = states[targetState];
    var layout: any = state.layouts[targetLayout];
    delete layout.widgets[widgetId];
    this.removeUnusedWidgets(dashboard);
  }

  isSingleLayoutDashboard(dashboard?: any, ...rest: any[]): any {
    var dashboardConfiguration: any = dashboard.configuration;
    var states: any = dashboardConfiguration.states;
    var stateKeys: any = Object.keys(states);
    if (stateKeys.length === 1) {
        var state: any = states[stateKeys[0]];
        var layouts: any = state.layouts;
        var layoutKeys: any = Object.keys(layouts);
        if (layoutKeys.length === 1) {
            return {
                state: stateKeys[0],
                layout: layoutKeys[0]
            }
        }
    }
    return null;
  }

  removeUnusedWidgets(dashboard?: any, ...rest: any[]): any {
    var dashboardConfiguration: any = dashboard.configuration;
    var states: any = dashboardConfiguration.states;
    var widgets: any = dashboardConfiguration.widgets;
    for (var widgetId in widgets) {
        var found: any = false;
        for (var s in states) {
            var state: any = states[s];
            for (var l in state.layouts) {
                var layout: any = state.layouts[l];
                if (layout.widgets[widgetId]) {
                    found = true;
                    break;
                }
            }
        }
        if (!found) {
            delete dashboardConfiguration.widgets[widgetId];
        }

    }
  }

  getWidgetsArray(dashboard?: any, ...rest: any[]): any {
    var widgetsArray: any = [];
    var dashboardConfiguration: any = dashboard.configuration;
    var widgets: any = dashboardConfiguration.widgets;
    for (var widgetId in widgets) {
        var widget: any = widgets[widgetId];
        widgetsArray.push(widget);
    }
    return widgetsArray;
  }
}
