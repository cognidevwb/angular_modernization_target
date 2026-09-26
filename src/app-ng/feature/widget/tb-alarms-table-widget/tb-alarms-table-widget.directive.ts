import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import alarmsTableWidgetTemplate from '../../../../app/widget/lib/alarms-table-widget.tpl.html';
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

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function AlarmsTableWidgetController(this: any, $element?: any, $scope?: any, $filter?: any, $mdMedia?: any, $mdDialog?: any, $mdPanel?: any, $document?: any, $translate?: any, $q?: any, $timeout?: any, alarmService?: any, utils?: any, types?: any) {
    var vm: any = this;

    vm.stylesInfo = {};
    vm.contentsInfo = {};
    vm.columnWidth = {};

    vm.showData = true;
    vm.hasData = false;

    vm.alarms = [];
    vm.alarmsCount = 0;
    vm.selectedAlarms = []

    vm.alarmSource = null;
    vm.alarmSearchStatus = null;
    vm.allAlarms = [];

    vm.currentAlarm = null;

    vm.enableSelection = true;
    vm.displayDetails = true;
    vm.allowAcknowledgment = true;
    vm.allowClear = true;
    vm.actionCellDescriptors = [];
    vm.displayPagination = true;
    vm.defaultPageSize = 10;
    vm.defaultSortOrder = '-'+types.alarmFields.createdTime.value;

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

    let statusFilterAction: any = {
        name: 'alarm.alarm-status-filter',
        show: true,
        onAction: function($event?: any) {
            vm.editAlarmStatusFilter($event);
        },
        icon: 'filter_list'
    };

    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.onReorder = onReorder;
    vm.onPaginate = onPaginate;
    vm.onRowClick = onRowClick;
    vm.onActionButtonClick = onActionButtonClick;
    vm.actionEnabled = actionEnabled;
    vm.isCurrent = isCurrent;
    vm.openAlarmDetails = openAlarmDetails;
    vm.ackAlarms = ackAlarms;
    vm.ackAlarm = ackAlarm;
    vm.clearAlarms = clearAlarms;
    vm.clearAlarm = clearAlarm;

    vm.cellStyle = cellStyle;
    vm.cellContent = cellContent;

    vm.editAlarmStatusFilter = editAlarmStatusFilter;
    vm.editColumnsToDisplay = editColumnsToDisplay;

    $scope.$watch('vm.ctx', function() {
        if (vm.ctx) {
            vm.settings = vm.ctx.settings;
            vm.widgetConfig = vm.ctx.widgetConfig;
            vm.subscription = vm.ctx.defaultSubscription;
            vm.alarmSource = vm.subscription.alarmSource;
            initializeConfig();
            updateAlarmSource();
        }
    });

    $scope.$watch("vm.query.search", function(newVal?: any, prevVal?: any) {
        if (!angular.equals(newVal, prevVal) && vm.query.search != null) {
            updateAlarms();
        }
    });

    $scope.$on('alarms-table-data-updated', function(event?: any, tableId?: any) {
        if (vm.tableId == tableId) {
            if (vm.subscription) {
                vm.allAlarms = vm.subscription.alarms || [];
                updateAlarms(true);
                $scope.$digest();
            }
        }
    });

    $scope.$watch(function() { return $mdMedia('gt-xs'); }, function(isGtXs?: any) {
        vm.isGtXs = isGtXs;
    });

    $scope.$watch(function() { return $mdMedia('gt-md'); }, function(isGtMd?: any) {
        vm.isGtMd = isGtMd;
        if (vm.isGtMd) {
            vm.limitOptions = [vm.defaultPageSize, vm.defaultPageSize*2, vm.defaultPageSize*3];
        } else {
            vm.limitOptions = null;
        }
    });

    $scope.$watch('vm.selectedAlarms.length', function (newLength?: any) {
        var selectionMode: any = newLength ? true : false;
        if (vm.ctx) {
            if (selectionMode) {
                vm.ctx.hideTitlePanel = true;
            } else if (vm.query.search == null) {
                vm.ctx.hideTitlePanel = false;
            }
        }
    });

    function initializeConfig() {

        vm.ctx.widgetActions = [ vm.searchAction, statusFilterAction, columnDisplayAction ];

        vm.displayDetails = angular.isDefined(vm.settings.displayDetails) ? vm.settings.displayDetails : true;
        vm.allowAcknowledgment = angular.isDefined(vm.settings.allowAcknowledgment) ? vm.settings.allowAcknowledgment : true;
        vm.allowClear = angular.isDefined(vm.settings.allowClear) ? vm.settings.allowClear : true;

        if (vm.displayDetails) {
            vm.actionCellDescriptors.push(
                {
                    displayName: $translate.instant('alarm.details'),
                    icon: 'more_horiz',
                    details: true
                }
            );
        }

        if (vm.allowAcknowledgment) {
            vm.actionCellDescriptors.push(
                {
                    displayName: $translate.instant('alarm.acknowledge'),
                    icon: 'done',
                    acknowledge: true
                }
            );
        }

        if (vm.allowClear) {
            vm.actionCellDescriptors.push(
                {
                    displayName: $translate.instant('alarm.clear'),
                    icon: 'clear',
                    clear: true
                }
            );
        }

        vm.actionCellDescriptors = vm.actionCellDescriptors.concat(vm.ctx.actionsApi.getActionDescriptors('actionCellButton'));

        if (vm.settings.alarmsTitle && vm.settings.alarmsTitle.length) {
            vm.alarmsTitle = utils.customTranslation(vm.settings.alarmsTitle, vm.settings.alarmsTitle);
        } else {
            vm.alarmsTitle = $translate.instant('alarm.alarms');
        }

        vm.ctx.widgetTitle = vm.alarmsTitle;

        vm.enableSelection = angular.isDefined(vm.settings.enableSelection) ? vm.settings.enableSelection : true;
        vm.searchAction.show = angular.isDefined(vm.settings.enableSearch) ? vm.settings.enableSearch : true;
        columnDisplayAction.show = angular.isDefined(vm.settings.enableSelectColumnDisplay) ? vm.settings.enableSelectColumnDisplay : true;
        statusFilterAction.show = angular.isDefined(vm.settings.enableStatusFilter) ? vm.settings.enableStatusFilter : true;
        if (!vm.allowAcknowledgment && !vm.allowClear) {
            vm.enableSelection = false;
        }

        vm.displayPagination = angular.isDefined(vm.settings.displayPagination) ? vm.settings.displayPagination : true;

        var pageSize: any = vm.settings.defaultPageSize;
        if (angular.isDefined(pageSize) && angular.isNumber(pageSize) && pageSize > 0) {
            vm.defaultPageSize = pageSize;
        }

        if (vm.settings.defaultSortOrder && vm.settings.defaultSortOrder.length) {
            vm.defaultSortOrder = vm.settings.defaultSortOrder;
        }

        vm.query.order = vm.defaultSortOrder;
        vm.query.limit = vm.defaultPageSize;
        if (vm.isGtMd) {
            vm.limitOptions = [vm.defaultPageSize, vm.defaultPageSize*2, vm.defaultPageSize*3];
        } else {
            vm.limitOptions = null;
        }

        var origColor: any = vm.widgetConfig.color || 'rgba(0, 0, 0, 0.87)';
        var defaultColor: any = tinycolor(origColor);
        var mdDark: any = defaultColor.setAlpha(0.87).toRgbString();
        var mdDarkSecondary: any = defaultColor.setAlpha(0.54).toRgbString();
        var mdDarkDisabled: any = defaultColor.setAlpha(0.26).toRgbString();
        //var mdDarkIcon = mdDarkSecondary;
        var mdDarkDivider: any = defaultColor.setAlpha(0.12).toRgbString();

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
        var namespace: any = 'ts-table-' + hashCode(cssString);
        cssParser.cssPreviewNamespace = namespace;
        cssParser.createStyleElement(namespace, cssString);
        $element.addClass(namespace);

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
            angular.element(vm.ctx.$container).find('.searchInput').focus();
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        updateAlarms();
        vm.ctx.hideTitlePanel = false;
    }

    function onReorder () {
        updateAlarms();
    }

    function onPaginate () {
        updateAlarms();
    }

    function onRowClick($event?: any, alarm?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.currentAlarm != alarm) {
            vm.currentAlarm = alarm;
        }
        var descriptors: any = vm.ctx.actionsApi.getActionDescriptors('rowClick');
        if (descriptors.length) {
            var entityId: any;
            var entityName: any;
            if (vm.currentAlarm && vm.currentAlarm.originator) {
                entityId = vm.currentAlarm.originator;
                entityName = vm.currentAlarm.originatorName;
            }
            vm.ctx.actionsApi.handleWidgetAction($event, descriptors[0], entityId, entityName, { alarm: alarm });
        }
    }

    function onActionButtonClick($event?: any, alarm?: any, actionDescriptor?: any) {
        if (actionDescriptor.details) {
            vm.openAlarmDetails($event, alarm);
        } else if (actionDescriptor.acknowledge) {
            vm.ackAlarm($event, alarm);
        } else if (actionDescriptor.clear) {
            vm.clearAlarm($event, alarm);
        } else {
            if ($event) {
                $event.stopPropagation();
            }
            var entityId: any;
            var entityName: any;
            if (alarm && alarm.originator) {
                entityId = alarm.originator;
                entityName = alarm.originatorName;
            }
            vm.ctx.actionsApi.handleWidgetAction($event, actionDescriptor, entityId, entityName, {alarm: alarm});
        }
    }

    function actionEnabled(alarm?: any, actionDescriptor?: any) {
        if (actionDescriptor.acknowledge) {
            return (alarm.status == types.alarmStatus.activeUnack ||
                    alarm.status == types.alarmStatus.clearedUnack);
        } else if (actionDescriptor.clear) {
            return (alarm.status == types.alarmStatus.activeAck ||
                    alarm.status == types.alarmStatus.activeUnack);
        }
        return true;
    }

    function isCurrent(alarm?: any) {
        return (vm.currentAlarm && alarm && vm.currentAlarm.id && alarm.id) &&
            (vm.currentAlarm.id.id === alarm.id.id);
    }

    function openAlarmDetails($event?: any, alarm?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (alarm && alarm.id) {
            var onShowingCallback: any = {
                onShowing: function(){}
            }
            $mdDialog.show({
                controller: 'AlarmDetailsDialogController',
                controllerAs: 'vm',
                templateUrl: alarmDetailsDialogTemplate,
                locals: {
                    alarmId: alarm.id.id,
                    allowAcknowledgment: vm.allowAcknowledgment,
                    allowClear: vm.allowClear,
                    displayDetails: true,
                    showingCallback: onShowingCallback
                },
                parent: angular.element($document[0].body),
                targetEvent: $event,
                fullscreen: true,
                multiple: true,
                onShowing: function(scope?: any, element?: any) {
                    onShowingCallback.onShowing(scope, element);
                }
            }).then(function (alarm?: any) {
                if (alarm) {
                    vm.subscription.update();
                }
            });

        }
    }

    function ackAlarms($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.selectedAlarms && vm.selectedAlarms.length > 0) {
            var title: any = $translate.instant('alarm.aknowledge-alarms-title', {count: vm.selectedAlarms.length}, 'messageformat');
            var content: any = $translate.instant('alarm.aknowledge-alarms-text', {count: vm.selectedAlarms.length}, 'messageformat');
            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));
            $mdDialog.show(confirm).then(function () {
                var tasks: any = [];
                for (var i: any=0;i<vm.selectedAlarms.length;i++) {
                    var alarm: any = vm.selectedAlarms[i];
                    if (alarm.id) {
                        tasks.push(alarmService.ackAlarm(alarm.id.id));
                    }
                }
                if (tasks.length) {
                    $q.all(tasks).then(function () {
                        vm.selectedAlarms = [];
                        vm.subscription.update();
                    });
                }

            });
        }
    }

    function ackAlarm($event?: any, alarm?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var confirm: any = $mdDialog.confirm()
            .targetEvent($event)
            .title($translate.instant('alarm.aknowledge-alarm-title'))
            .htmlContent($translate.instant('alarm.aknowledge-alarm-text'))
            .ariaLabel($translate.instant('alarm.acknowledge'))
            .cancel($translate.instant('action.no'))
            .ok($translate.instant('action.yes'));
        $mdDialog.show(confirm).then(function () {
            alarmService.ackAlarm(alarm.id.id).then(function () {
                vm.selectedAlarms = [];
                vm.subscription.update();
            });
        });
    }

    function clearAlarms($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.selectedAlarms && vm.selectedAlarms.length > 0) {
            var title: any = $translate.instant('alarm.clear-alarms-title', {count: vm.selectedAlarms.length}, 'messageformat');
            var content: any = $translate.instant('alarm.clear-alarms-text', {count: vm.selectedAlarms.length}, 'messageformat');
            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));
            $mdDialog.show(confirm).then(function () {
                var tasks: any = [];
                for (var i: any=0;i<vm.selectedAlarms.length;i++) {
                    var alarm: any = vm.selectedAlarms[i];
                    if (alarm.id) {
                        tasks.push(alarmService.clearAlarm(alarm.id.id));
                    }
                }
                if (tasks.length) {
                    $q.all(tasks).then(function () {
                        vm.selectedAlarms = [];
                        vm.subscription.update();
                    });
                }

            });
        }
    }

    function clearAlarm($event?: any, alarm?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var confirm: any = $mdDialog.confirm()
            .targetEvent($event)
            .title($translate.instant('alarm.clear-alarm-title'))
            .htmlContent($translate.instant('alarm.clear-alarm-text'))
            .ariaLabel($translate.instant('alarm.clear'))
            .cancel($translate.instant('action.no'))
            .ok($translate.instant('action.yes'));
        $mdDialog.show(confirm).then(function () {
            alarmService.clearAlarm(alarm.id.id).then(function () {
                vm.selectedAlarms = [];
                vm.subscription.update();
            });
        });
    }

    function updateAlarms(preserveSelections?: any) {
        if (!preserveSelections) {
            vm.selectedAlarms = [];
        }
        var result: any = $filter('orderBy')(vm.allAlarms, vm.query.order);
        if (vm.query.search != null) {
            result = $filter('filter')(result, {$: vm.query.search});
        }
        vm.alarmsCount = result.length;

        if (vm.displayPagination) {
            var startIndex: any = vm.query.limit * (vm.query.page - 1);
            vm.alarms = result.slice(startIndex, startIndex + vm.query.limit);
        } else {
            vm.alarms = result;
        }

        if (preserveSelections) {
            var newSelectedAlarms: any = [];
            if (vm.selectedAlarms && vm.selectedAlarms.length) {
                var i: any = vm.selectedAlarms.length;
                while (i--) {
                    var selectedAlarm: any = vm.selectedAlarms[i];
                    if (selectedAlarm.id) {
                        result = $filter('filter')(vm.alarms, {id: {id: selectedAlarm.id.id} });
                        if (result && result.length) {
                            newSelectedAlarms.push(result[0]);
                        }
                    }
                }
            }
            vm.selectedAlarms = newSelectedAlarms;
        }
    }

    function cellStyle(alarm?: any, key?: any) {
        var style: any = {};
        if (alarm && key) {
            var styleInfo: any = vm.stylesInfo[key.label];
            var value: any = getAlarmValue(alarm, key);
            if (styleInfo.useCellStyleFunction && styleInfo.cellStyleFunction) {
                try {
                    style = styleInfo.cellStyleFunction(value);
                } catch (e) {
                    style = {};
                }
            } else {
                style = defaultStyle(key, value);
            }
        }
        if (!style.width) {
            var columnWidth: any = vm.columnWidth[key.label];
            style.width = columnWidth;
        }
        return style;
    }

    function cellContent(alarm?: any, key?: any) {
        var strContent: any = '';
        if (alarm && key) {
            var contentInfo: any = vm.contentsInfo[key.label];
            var value: any = getAlarmValue(alarm, key);
            if (contentInfo.useCellContentFunction && contentInfo.cellContentFunction) {
                if (angular.isDefined(value)) {
                    strContent = '' + value;
                }
                var content: any = strContent;
                try {
                    content = contentInfo.cellContentFunction(value, alarm, $filter);
                } catch (e) {
                    content = strContent;
                }
            } else {
                content = defaultContent(key, value);
            }
            return content;
        } else {
            return strContent;
        }
        return undefined;
    }

    function defaultContent(key?: any, value?: any) {
        if (angular.isDefined(value)) {
            var alarmField: any = types.alarmFields[key.name];
            if (alarmField) {
                if (alarmField.time) {
                    return $filter('date')(value, 'yyyy-MM-dd HH:mm:ss');
                } else if (alarmField.value == types.alarmFields.severity.value) {
                    return $translate.instant(types.alarmSeverity[value].name);
                } else if (alarmField.value == types.alarmFields.status.value) {
                    return $translate.instant('alarm.display-status.'+value);
                } else if (alarmField.value == types.alarmFields.originatorType.value) {
                    return $translate.instant(types.entityTypeTranslations[value].type);
                }
                else {
                    return value;
                }
            } else {
                return value;
            }
        } else {
            return '';
        }
        return undefined;
    }
    function defaultStyle(key?: any, value?: any) {
        if (angular.isDefined(value)) {
            var alarmField: any = types.alarmFields[key.name];
            if (alarmField) {
                if (alarmField.value == types.alarmFields.severity.value) {
                    return {
                        fontWeight: 'bold',
                        color: types.alarmSeverity[value].color
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
        return undefined;
    }

    const getDescendantProp: any = (obj?: any, path?: any) => (
        path.split('.').reduce((acc?: any, part?: any) => acc && acc[part], obj)
    );

    function getAlarmValue(alarm?: any, key?: any) {
        var alarmField: any = types.alarmFields[key.name];
        if (alarmField) {
            return getDescendantProp(alarm, alarmField.value);
        } else {
            return getDescendantProp(alarm, key.name);
        }
        return undefined;
    }

    function editAlarmStatusFilter($event?: any) {
        var element: any = angular.element($event.target);
        var position: any = $mdPanel.newPanelPosition()
            .relativeTo(element)
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);
        var config: any = {
            attachTo: angular.element($document[0].body),
            controller: AlarmStatusFilterPanelController,
            controllerAs: 'vm',
            templateUrl: alarmStatusFilterPanelTemplate,
            panelClass: 'tb-alarm-status-filter-panel',
            position: position,
            fullscreen: false,
            locals: {
                'subscription': vm.subscription
            },
            openFrom: $event,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false
        };
        $mdPanel.open(config);
    }

    function editColumnsToDisplay($event?: any) {
        var element: any = angular.element($event.target);
        var position: any = $mdPanel.newPanelPosition()
            .relativeTo(element)
            .addPanelPosition($mdPanel.xPosition.ALIGN_END, $mdPanel.yPosition.BELOW);
        var config: any = {
            attachTo: angular.element($document[0].body),
            controller: DisplayColumnsPanelController,
            controllerAs: 'vm',
            templateUrl: displayColumnsPanelTemplate,
            panelClass: 'tb-display-columns-panel',
            position: position,
            fullscreen: false,
            locals: {
                'columns': vm.alarmSource.dataKeys
            },
            openFrom: $event,
            clickOutsideToClose: true,
            escapeToClose: true,
            focusOnOpen: false
        };
        $mdPanel.open(config);
    }

    function updateAlarmSource() {

        vm.ctx.widgetTitle = utils.createLabelFromDatasource(vm.alarmSource, vm.alarmsTitle);

        vm.stylesInfo = {};
        vm.contentsInfo = {};
        vm.columnWidth = {};

        for (var d: any = 0; d < vm.alarmSource.dataKeys.length; d++ ) {
            var dataKey: any = vm.alarmSource.dataKeys[d];

            dataKey.title = utils.customTranslation(dataKey.label, dataKey.label);
            dataKey.display = true;

            var keySettings: any = dataKey.settings;

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

            vm.stylesInfo[dataKey.label] = {
                useCellStyleFunction: useCellStyleFunction,
                cellStyleFunction: cellStyleFunction
            };

            var cellContentFunction: any = null;
            var useCellContentFunction: any = false;

            if (keySettings.useCellContentFunction === true) {
                if (angular.isDefined(keySettings.cellContentFunction) && keySettings.cellContentFunction.length > 0) {
                    try {
                        cellContentFunction = new Function('value, alarm, filter', keySettings.cellContentFunction);
                        useCellContentFunction = true;
                    } catch (e) {
                        cellContentFunction = null;
                        useCellContentFunction = false;
                    }
                }
            }

            vm.contentsInfo[dataKey.label] = {
                useCellContentFunction: useCellContentFunction,
                cellContentFunction: cellContentFunction
            };

            var columnWidth: any = angular.isDefined(keySettings.columnWidth) ? keySettings.columnWidth : '0px';
            vm.columnWidth[dataKey.label] = columnWidth;
        }
    }

}

function AlarmStatusFilterPanelController(this: any, subscription?: any, types?: any) {  //eslint-disable-line

    var vm: any = this;
    vm.types = types;
    vm.subscription = subscription;
}

function DisplayColumnsPanelController(this: any, columns?: any) {  //eslint-disable-line

    var vm: any = this;
    vm.columns = columns;
}

/**
 * Ported from the AngularJS directive `tbAlarmsTableWidget` (module `thingsboard.widgets.alarmsTableWidget`) in src/app/widget/lib/alarms-table-widget.js:32.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-alarms-table-widget',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-alarms-table-widget.directive.html',
})
export class TbAlarmsTableWidgetDirective {
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
  controller: any = AlarmsTableWidgetController;
  controllerAs: any;
  templateUrl: any = alarmsTableWidgetTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
