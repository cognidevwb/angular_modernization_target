import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function RoundSwitchController(this: any, $element?: any, $scope?: any, utils?: any, types?: any) {
    let vm: any = this;

    vm.showTitle = false;
    vm.value = false;
    vm.error = '';

    vm.checkboxId = 'onoff-' + utils.guid();

    var switchElement: any = $('.switch', $element),
        switchContainer: any = $('#switch-container', $element),
        onoff: any = $('input', $element),
        textMeasure: any = $('#text-measure', $element),
        switchTitleContainer: any = $('.title-container', $element),
        switchTitle: any = $('.switch-title', $element),
        switchErrorContainer: any = $('.error-container', $element),
        switchError: any = $('.switch-error', $element);

    onoff.bind('change', () => {
        vm.value = onoff.prop('checked') === false;
        onValue();
    });

    vm.valueSubscription = null;

    $scope.$watch('vm.ctx', () => {
        if (vm.ctx) {
            init();
        }
    });

    $scope.$on('$destroy', () => {
        if (vm.valueSubscription) {
            vm.ctx.subscriptionApi.removeSubscription(vm.valueSubscription.id);
        }
    });

    resize();

    function init() {

        vm.title = vm.ctx.settings.title !== undefined ? vm.ctx.settings.title : '';
        vm.showTitle = vm.title && vm.title.length ? true : false;
        vm.ctx.resize = resize;
        resize();
        var initialValue: any = vm.ctx.settings.initialValue !== undefined ? vm.ctx.settings.initialValue : false;
        setValue(initialValue);
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

    function resize() {
        var width: any = switchContainer.width();
        var height: any = switchContainer.height();
        var size: any = Math.min(width, height);
        var scale: any = size/260;
        switchElement.css({
            '-webkit-transform': `scale(${scale})`,
            '-moz-transform': `scale(${scale})`,
            '-ms-transform': `scale(${scale})`,
            '-o-transform': `scale(${scale})`,
            transform: `scale(${scale})`
        });
        if (vm.showTitle) {
            setFontSize(switchTitle, vm.title, switchTitleContainer.height() * 2 / 3, switchTitleContainer.width());
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
            $scope.$digest();
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
        onoff.prop('checked', !vm.value);
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
 * Ported from the AngularJS directive `tbRoundSwitch` (module `thingsboard.widgets.rpc.roundSwitch`) in src/app/widget/lib/rpc/round-switch.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-round-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tb-round-switch.directive.html',
})
export class TbRoundSwitchDirective {
  readonly ctx = model<any>();

  protected showTitle = false;
  protected title = '';
  protected checkboxId = '';
  protected error = '';

  restrict: any = "E";
  bindToController: any = {
            ctx: '='
        };
  controller: any = RoundSwitchController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
