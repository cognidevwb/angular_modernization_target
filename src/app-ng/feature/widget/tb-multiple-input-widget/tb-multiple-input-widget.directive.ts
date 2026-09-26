import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import multipleInputWidgetTemplate from '../../../../app/widget/lib/multiple-input-widget.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function MultipleInputWidgetController(this: any, $q?: any, $scope?: any, $translate?: any, attributeService?: any, toast?: any, types?: any, utils?: any) {
    var vm: any = this;

    vm.entityDetected = false;
    vm.isAllParametersValid = true;

    vm.sources = [];
    vm.datasources = null;

    vm.discardAll = discardAll;
    vm.inputChanged = inputChanged;
    vm.save = save;
    vm.getGroupTitle = getGroupTitle;

    $scope.$watch('vm.ctx', function () {
        if (vm.ctx && vm.ctx.defaultSubscription) {
            vm.settings = vm.ctx.settings;
            vm.widgetConfig = vm.ctx.widgetConfig;
            vm.subscription = vm.ctx.defaultSubscription;
            vm.datasources = vm.subscription.datasources;
            initializeConfig();
            updateDatasources();
        }
    });

    $scope.$on('multiple-input-data-updated', function (event?: any, formId?: any) {
        if (vm.formId == formId) {
            updateWidgetData(vm.subscription.data);
            $scope.$digest();
        }
    });

    $scope.$on('multiple-input-resize', function (event?: any, formId?: any) {
        if (vm.formId == formId) {
            updateWidgetDisplaying();
        }
    });

    function discardAll() {
        for (var i: any = 0; i < vm.sources.length; i++) {
            for (var j: any = 0; j < vm.sources[i].keys.length; j++) {
                vm.sources[i].keys[j].data.currentValue = vm.sources[i].keys[j].data.originalValue;
            }
        }
        $scope.multipleInputForm.$setPristine();
    }

    function inputChanged(source?: any, key?: any) {
        if (!vm.settings.showActionButtons) {
            if (!key.settings.required || (key.settings.required && key.data && angular.isDefined(key.data.currentValue))) {
                var dataToSave: any = {
                    datasource: source.datasource,
                    keys: [key]
                };
                vm.save(dataToSave);
            }
        }
    }

    function save(dataToSave?: any) {
        var tasks: any = [];
        var config: any = {
            ignoreLoading: !vm.settings.showActionButtons
        };
        var data: any;
        if (dataToSave) {
            data = [dataToSave];
        } else {
            data = vm.sources;
        }
        for (let i: any = 0; i < data.length; i++) {
            var serverAttributes: any = [], sharedAttributes: any = [], telemetry: any = [];
            for (let j: any = 0; j < data[i].keys.length; j++) {
                var key: any = data[i].keys[j];
                if ((key.data.currentValue !== key.data.originalValue) || vm.settings.updateAllValues) {
                    var attribute: any = {
                        key: key.name
                    };
                    if (key.data.currentValue) {
                        switch (key.settings.dataKeyValueType) {
                            case 'dateTime':
                            case 'date':
                                attribute.value = key.data.currentValue.getTime();
                                break;
                            case 'time':
                                attribute.value = key.data.currentValue.getTime() - moment().startOf('day').valueOf();//eslint-disable-line
                                break;
                            default:
                                attribute.value = key.data.currentValue;
                        }
                    } else {
                        if (key.data.currentValue === '') {
                            attribute.value = null;
                        } else {
                            attribute.value = key.data.currentValue;
                        }
                    }

                    switch (key.settings.dataKeyType) {
                        case 'shared':
                            sharedAttributes.push(attribute);
                            break;
                        case 'timeseries':
                            telemetry.push(attribute);
                            break;
                        default:
                            serverAttributes.push(attribute);
                    }
                }
            }
            if (serverAttributes.length) {
                tasks.push(attributeService.saveEntityAttributes(
                    data[i].datasource.entityType,
                    data[i].datasource.entityId,
                    types.attributesScope.server.value,
                    serverAttributes,
                    config));
            }
            if (sharedAttributes.length) {
                tasks.push(attributeService.saveEntityAttributes(
                    data[i].datasource.entityType,
                    data[i].datasource.entityId,
                    types.attributesScope.shared.value,
                    sharedAttributes,
                    config));
            }
            if (telemetry.length) {
                tasks.push(attributeService.saveEntityTimeseries(
                    data[i].datasource.entityType,
                    data[i].datasource.entityId,
                    types.latestTelemetry.value,
                    telemetry,
                    config));
            }
        }

        if (tasks.length) {
            $q.all(tasks).then(
                function success() {
                    $scope.multipleInputForm.$setPristine();
                    if (vm.settings.showResultMessage) {
                        toast.showSuccess($translate.instant('widgets.input-widgets.update-successful'), 1000, angular.element(vm.ctx.$container), 'bottom left');
                    }
                },
                function fail() {
                    if (vm.settings.showResultMessage) {
                        toast.showError($translate.instant('widgets.input-widgets.update-failed'), angular.element(vm.ctx.$container), 'bottom left');
                    }
                }
            );
        } else {
            $scope.multipleInputForm.$setPristine();
        }
    }

    function initializeConfig() {

        if (vm.settings.widgetTitle && vm.settings.widgetTitle.length) {
            vm.widgetTitle = utils.customTranslation(vm.settings.widgetTitle, vm.settings.widgetTitle);
        } else {
            vm.widgetTitle = vm.ctx.widgetConfig.title;
        }

        vm.ctx.widgetTitle = vm.widgetTitle;

        vm.settings.groupTitle = vm.settings.groupTitle || "${entityName}";

        //For backward compatibility
        if (angular.isUndefined(vm.settings.showActionButtons)) {
            vm.settings.showActionButtons = true;
        }
        if (angular.isUndefined(vm.settings.fieldsAlignment)) {
            vm.settings.fieldsAlignment = 'row';
        }
        if (angular.isUndefined(vm.settings.fieldsInRow)) {
            vm.settings.fieldsInRow = 2;
        }
        //For backward compatibility

        vm.isVerticalAlignment = !(vm.settings.fieldsAlignment === 'row');

        if (!vm.isVerticalAlignment && vm.settings.fieldsInRow) {
            vm.inputWidthSettings = 100 / vm.settings.fieldsInRow + '%';
        }
        updateWidgetDisplaying();
    }

    function updateDatasources() {
        if (vm.datasources && vm.datasources.length) {
            vm.entityDetected = true;
            for (var i: any = 0; i < vm.datasources.length; i++) {
                var datasource: any = vm.datasources[i];
                var source: any = {
                    datasource: datasource,
                    keys: []
                };
                if (datasource.type === types.datasourceType.entity) {
                    for (var j: any = 0; j < datasource.dataKeys.length; j++) {
                        if ((datasource.entityType !== types.entityType.device) && (datasource.dataKeys[j].settings.dataKeyType == 'shared')) {
                            vm.isAllParametersValid = false;
                        }
                        source.keys.push(datasource.dataKeys[j]);
                        if (source.keys[j].units) {
                            source.keys[j].label += ' (' + source.keys[j].units + ')';
                        }
                        source.keys[j].data = {};

                        //For backward compatibility
                        if (angular.isUndefined(source.keys[j].settings.dataKeyType)) {
                            if (vm.settings.attributesShared) {
                                source.keys[j].settings.dataKeyType = 'shared';
                            } else {
                                source.keys[j].settings.dataKeyType = 'server';
                            }
                        }

                        if (angular.isUndefined(source.keys[j].settings.dataKeyValueType)) {
                            if (source.keys[j].settings.inputTypeNumber) {
                                source.keys[j].settings.dataKeyValueType = 'double';
                            } else {
                                source.keys[j].settings.dataKeyValueType = 'string';
                            }
                        }

                        if (angular.isUndefined(source.keys[j].settings.isEditable)) {
                            if (source.keys[j].settings.readOnly) {
                                source.keys[j].settings.isEditable = 'readonly';
                            } else {
                                source.keys[j].settings.isEditable = 'editable';
                            }
                        }
                        //For backward compatibility

                    }
                } else {
                    vm.entityDetected = false;
                }
                vm.sources.push(source);
            }
        }
    }

    function updateWidgetData(data?: any) {
        var dataIndex: any = 0;
        for (var i: any = 0; i < vm.sources.length; i++) {
            var source: any = vm.sources[i];
            for (var j: any = 0; j < source.keys.length; j++) {
                var keyData: any = data[dataIndex].data;
                var key: any = source.keys[j];
                if (keyData && keyData.length) {
                    var value: any;
                    switch (key.settings.dataKeyValueType) {
                        case 'dateTime':
                        case 'date':
                            value = moment(keyData[0][1]).toDate(); // eslint-disable-line
                            break;
                        case 'time':
                            value = moment().startOf('day').add(keyData[0][1], 'ms').toDate(); // eslint-disable-line
                            break;
                        case 'booleanCheckbox':
                        case 'booleanSwitch':
                            value = (keyData[0][1] === 'true');
                            break;
                        default:
                            value = keyData[0][1];
                    }

                    key.data = {
                        currentValue: value,
                        originalValue: value
                    };
                }

                if (key.settings.isEditable === 'editable' && key.settings.disabledOnDataKey) {
                    var conditions: any = data.filter((item?: any) => {
                        return item.dataKey.name === key.settings.disabledOnDataKey;
                    });
                    if (conditions && conditions.length) {
                        if (conditions[0].data.length) {
                            if (conditions[0].data[0][1] === 'false') {
                                key.settings.disabledOnCondition = true;
                            } else {
                                key.settings.disabledOnCondition = !conditions[0].data[0][1];
                            }
                        }
                    }
                }
                dataIndex++;
            }
        }
    }

    function updateWidgetDisplaying() {
        vm.changeAlignment = (vm.ctx.$container[0].offsetWidth < 620);
        vm.smallWidthContainer = (vm.ctx.$container[0].offsetWidth < 420);
    }

    function getGroupTitle(datasource?: any) {
        return utils.createLabelFromDatasource(datasource, vm.settings.groupTitle);
    }
}

/**
 * Ported from the AngularJS directive `tbMultipleInputWidget` (module `thingsboard.widgets.multipleInputWidget`) in src/app/widget/lib/multiple-input-widget.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-multiple-input-widget',
  standalone: true,
  imports: [TranslatePipe, MatSlideToggleModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-multiple-input-widget.directive.html',
})
export class TbMultipleInputWidgetDirective {
  readonly formId = model<any>();
  readonly ctx = model<any>();

  // TODO(port): elements not resolved to a component: mdp-date-picker, mdp-time-picker
  // TODO(port): template: 6 × ng-message left in place
  // TODO(port): template: 5 × ng-messages left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            formId: '=',
            ctx: '='
        };
  controller: any = MultipleInputWidgetController;
  controllerAs: any;
  templateUrl: any = multipleInputWidgetTemplate;
  key: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
