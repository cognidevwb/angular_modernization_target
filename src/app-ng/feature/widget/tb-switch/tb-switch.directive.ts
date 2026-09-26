import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import switchTemplate from '../../../../app/widget/lib/rpc/switch.tpl.html?raw';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function SwitchController(this: any, $element?: any, $scope?: any, types?: any, utils?: any) {
    let vm: any = this;

    vm.showTitle = false;
    vm.value = false;
    vm.error = '';

    var switchElement: any = angular.element('.switch', $element),
        switchContainer: any = angular.element('#switch-container', $element),
        mdSwitch: any = angular.element('md-switch', switchElement),
        onoffContainer: any = angular.element('.onoff-container', $element),
        onLabel: any = angular.element('.on-label', $element),
        offLabel: any = angular.element('.off-label', $element),
        switchTitleContainer: any = angular.element('.title-container', $element),
        switchTitle: any = angular.element('.switch-title', $element),
        textMeasure: any = angular.element('#text-measure', $element),
        switchErrorContainer: any = angular.element('.error-container', $element),
        switchError: any = angular.element('.switch-error', $element);


    vm.onValue = onValue;

    vm.valueSubscription = null;

    effect(() => {
        if (vm.ctx()) {
            init();
        }
    });

    $scope.$on('$destroy', () => {
        if (vm.valueSubscription) {
            vm.ctx.subscriptionApi.removeSubscription(vm.valueSubscription.id);
        }
    });

    function init() {

        vm.title = angular.isDefined(vm.ctx.settings.title) ? vm.ctx.settings.title : '';
        vm.showTitle = vm.title && vm.title.length ? true : false;
        vm.showOnOffLabels = angular.isDefined(vm.ctx.settings.showOnOffLabels) ? vm.ctx.settings.showOnOffLabels : true;
        vm.ctx.resize = resize;
        $scope.$applyAsync(() => {
            resize();
        });
        var initialValue: any = angular.isDefined(vm.ctx.settings.initialValue) ? vm.ctx.settings.initialValue : false;
        setValue(initialValue);

        var subscription: any = vm.ctx.defaultSubscription;
        var rpcEnabled: any = subscription.rpcEnabled;

        vm.isSimulated = $scope.widgetEditMode;

        vm.requestTimeout = 500;
        if (vm.ctx.settings.requestTimeout) {
            vm.requestTimeout = vm.ctx.settings.requestTimeout;
        }

        vm.retrieveValueMethod = 'rpc';
        if (vm.ctx.settings.retrieveValueMethod && vm.ctx.settings.retrieveValueMethod.length) {
            vm.retrieveValueMethod = vm.ctx.settings.retrieveValueMethod;
        }

        vm.valueKey = 'value';
        if (vm.ctx.settings.valueKey && vm.ctx.settings.valueKey.length) {
            vm.valueKey = vm.ctx.settings.valueKey;
        }

        vm.parseValueFunction = (data?: any) => data ? true : false;
        if (vm.ctx.settings.parseValueFunction && vm.ctx.settings.parseValueFunction.length) {
            try {
                vm.parseValueFunction = new Function('data', vm.ctx.settings.parseValueFunction);
            } catch (e) {
                vm.parseValueFunction = (data?: any) => data ? true : false;
            }
        }

        vm.convertValueFunction = (value?: any) => value;
        if (vm.ctx.settings.convertValueFunction && vm.ctx.settings.convertValueFunction.length) {
            try {
                vm.convertValueFunction = new Function('value', vm.ctx.settings.convertValueFunction);
            } catch (e) {
                vm.convertValueFunction = (value?: any) => value;
            }
        }

        vm.getValueMethod = 'getValue';
        if (vm.ctx.settings.getValueMethod && vm.ctx.settings.getValueMethod.length) {
            vm.getValueMethod = vm.ctx.settings.getValueMethod;
        }
        vm.setValueMethod = 'setValue';
        if (vm.ctx.settings.setValueMethod && vm.ctx.settings.setValueMethod.length) {
            vm.setValueMethod = vm.ctx.settings.setValueMethod;
        }
        if (!rpcEnabled) {
            onError('Target device is not set!');
        } else {
            if (!vm.isSimulated) {
                if (vm.retrieveValueMethod == 'rpc') {
                    rpcRequestValue();
                } else if (vm.retrieveValueMethod == 'attribute' || vm.retrieveValueMethod == 'timeseries') {
                    subscribeForValue();
                }
            }
        }
    }

    const switchAspectRation: any = 2.7893;

    function resize() {
        var width: any = switchContainer.width();
        var height: any;
        if (vm.showOnOffLabels) {
            height = switchContainer.height()*2/3;
        } else {
            height = switchContainer.height();
        }
        var ratio: any = width/height;
        if (ratio > switchAspectRation) {
            width = height*switchAspectRation;
        } else {
            height = width/switchAspectRation;
        }
        switchElement.css({width: width, height: height});
        mdSwitch.css('height', height+'px');
        mdSwitch.css('width', width+'px');
        mdSwitch.css('min-width', width+'px');
        angular.element('.md-container', mdSwitch).css('height', height+'px');
        angular.element('.md-container', mdSwitch).css('width', width+'px');


        if (vm.showTitle) {
            setFontSize(switchTitle, vm.title, switchTitleContainer.height() * 2 / 3, switchTitleContainer.width());
        }

        if (vm.showOnOffLabels) {
            onoffContainer.css({width: width, height: switchContainer.height() / 3});
            setFontSize(onLabel, 'OFF', onoffContainer.height(), onoffContainer.width() / 2);
            setFontSize(offLabel, 'OFF', onoffContainer.height(), onoffContainer.width() / 2);
        }

        setFontSize(switchError, vm.error, switchErrorContainer.height(), switchErrorContainer.width());
    }

    function subscribeForValue() {
        var valueSubscriptionInfo: any = [{
            type: types.datasourceType.entity,
            entityType: types.entityType.device,
            entityId: vm.ctx.defaultSubscription.targetDeviceId
        }];
        if (vm.retrieveValueMethod == 'attribute') {
            valueSubscriptionInfo[0].attributes = [
                {name: vm.valueKey}
            ];
        } else {
            valueSubscriptionInfo[0].timeseries = [
                {name: vm.valueKey}
            ];
        }
        var subscriptionOptions: any = {
            callbacks: {
                onDataUpdated: onDataUpdated,
                onDataUpdateError: onDataUpdateError
            }
        };
        vm.ctx.subscriptionApi.createSubscriptionFromInfo (
            types.widgetType.latest.value, valueSubscriptionInfo, subscriptionOptions, false, true).then(
            (subscription?: any) => {
                vm.valueSubscription = subscription;
            }
        );
    }

    function onDataUpdated(subscription?: any, apply?: any) {
        var value: any = false;
        var data: any = subscription.data;
        if (data.length) {
            var keyData: any = data[0];
            if (keyData && keyData.data && keyData.data[0]) {
                var attrValue: any = keyData.data[0][1];
                if (attrValue) {
                    var parsed: any = null;
                    try {
                        parsed = vm.parseValueFunction(JSON.parse(attrValue));
                    } catch (e){/**/}
                    value = parsed ? true : false;
                }
            }
        }
        setValue(value);
        if (apply) {
        if (apply) {
        }
        }
    }

    function onDataUpdateError(subscription?: any, e?: any) {
        var exceptionData: any = utils.parseException(e);
        var errorText: any = exceptionData.name;
        if (exceptionData.message) {
            errorText += ': ' + exceptionData.message;
        }
        onError(errorText);
    }

    function setValue(value?: any) {
        vm.value = value ? true : false;
    }

    function onValue() {
        rpcUpdateValue(vm.value);
    }

    function onError(error?: any) {
    function onError(error?: any) {
        vm.error = error;
        setFontSize(switchError, vm.error, switchErrorContainer.height(), switchErrorContainer.width());
    }
    }

    function setFontSize(element?: any, text?: any, fontSize?: any, maxWidth?: any) {
        var textWidth: any = measureTextWidth(text, fontSize);
        while (textWidth > maxWidth) {
            fontSize--;
            textWidth = measureTextWidth(text, fontSize);
        }
        element.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
    }

    function measureTextWidth(text?: any, fontSize?: any) {
        textMeasure.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
        textMeasure.text(text);
        return textMeasure.width();
    }

    function rpcRequestValue() {
        vm.error = '';
        vm.ctx.controlApi.sendTwoWayCommand(vm.getValueMethod, null, vm.requestTimeout).then(
            (responseBody?: any) => {
                setValue(vm.parseValueFunction(responseBody));
            },
            () => {
                var errorText: any = vm.ctx.defaultSubscription.rpcErrorText;
                onError(errorText);
            }
        );
    }

    function rpcUpdateValue(value?: any) {
        if (vm.executingUpdateValue) {
            vm.scheduledValue = value;
            return;
        } else {
            vm.scheduledValue = null;
            vm.rpcValue = value;
            vm.executingUpdateValue = true;
        }
        vm.error = '';
        vm.ctx.controlApi.sendOneWayCommand(vm.setValueMethod, vm.convertValueFunction(value), vm.requestTimeout).then(
            () => {
                vm.executingUpdateValue = false;
                if (vm.scheduledValue != null && vm.scheduledValue != vm.rpcValue) {
                    rpcUpdateValue(vm.scheduledValue);
                }
            },
            () => {
                vm.executingUpdateValue = false;
                var errorText: any = vm.ctx.defaultSubscription.rpcErrorText;
                onError(errorText);
            }
        );
    }
}

/**
 * Ported from the AngularJS directive `tbSwitch` (module `thingsboard.widgets.rpc.switch`) in src/app/widget/lib/rpc/switch.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-switch',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, FormsModule],
  templateUrl: './tb-switch.directive.html',
})
export class TbSwitchDirective {
  readonly ctx = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            ctx: '='
        };
  controller: any = SwitchController;
  controllerAs: any;
  templateUrl: any = switchTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
