import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import ledIndicatorTemplate from '../../../../app/widget/lib/rpc/led-indicator.tpl.html';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function LedIndicatorController(this: any, $element?: any, $scope?: any, $timeout?: any, utils?: any, types?: any) {
    let vm: any = this;

    vm.showTitle = false;
    vm.value = false;
    vm.error = '';

    const checkStatusPollingInterval: any = 10000;

    vm.subscriptionOptions = {
        callbacks: {
            onDataUpdated: onDataUpdated,
            onDataUpdateError: onDataUpdateError,
            dataLoading: () => {}
        }
    };

    var led: any = angular.element('.led', $element),
        ledContainer: any = angular.element('#led-container', $element),
        textMeasure: any = angular.element('#text-measure', $element),
        ledTitleContainer: any = angular.element('.title-container', $element),
        ledTitle: any = angular.element('.led-title', $element),
        ledErrorContainer: any = angular.element('.error-container', $element),
        ledError: any = angular.element('.led-error', $element);

    $scope.$watch('vm.ctx', () => {
        if (vm.ctx) {
            init();
        }
    });

    $scope.$on('$destroy', () => {
        vm.destroyed = true;
        if (vm.checkStatusTimeoutHandle) {
            $timeout.cancel(vm.checkStatusTimeoutHandle);
        }
        if (vm.subscription) {
            vm.ctx.subscriptionApi.removeSubscription(vm.subscription.id);
        }
    });

    resize();

    function init() {

        vm.title = angular.isDefined(vm.ctx.settings.title) ? vm.ctx.settings.title : '';
        vm.showTitle = vm.title && vm.title.length ? true : false;

        var origColor: any = angular.isDefined(vm.ctx.settings.ledColor) ? vm.ctx.settings.ledColor : 'green';

        vm.valueAttribute = angular.isDefined(vm.ctx.settings.valueAttribute) ? vm.ctx.settings.valueAttribute : 'value';

        vm.ledColor = tinycolor(origColor).brighten(30).toHexString();
        vm.ledMiddleColor = tinycolor(origColor).toHexString();
        vm.disabledColor = tinycolor(origColor).darken(40).toHexString();
        vm.disabledMiddleColor = tinycolor(origColor).darken(60).toHexString();

        vm.ctx.resize = resize;
        $scope.$applyAsync(() => {
            resize();
        });
        var initialValue: any = angular.isDefined(vm.ctx.settings.initialValue) ? vm.ctx.settings.initialValue : false;
        setValue(initialValue, true);

        var subscription: any = vm.ctx.defaultSubscription;
        var rpcEnabled: any = subscription.rpcEnabled;

        vm.isSimulated = $scope.widgetEditMode;

        vm.requestTimeout = 500;
        if (vm.ctx.settings.requestTimeout) {
            vm.requestTimeout = vm.ctx.settings.requestTimeout;
        }
        vm.retrieveValueMethod = 'attribute';
        if (vm.ctx.settings.retrieveValueMethod && vm.ctx.settings.retrieveValueMethod.length) {
            vm.retrieveValueMethod = vm.ctx.settings.retrieveValueMethod;
        }

        vm.parseValueFunction = (data?: any) => data ? true : false;
        if (vm.ctx.settings.parseValueFunction && vm.ctx.settings.parseValueFunction.length) {
            try {
                vm.parseValueFunction = new Function('data', vm.ctx.settings.parseValueFunction);
            } catch (e) {
                vm.parseValueFunction = (data?: any) => data ? true : false;
            }
        }

        vm.performCheckStatus = vm.ctx.settings.performCheckStatus != false;
        if (vm.performCheckStatus) {
            vm.checkStatusMethod = 'checkStatus';
            if (vm.ctx.settings.checkStatusMethod && vm.ctx.settings.checkStatusMethod.length) {
                vm.checkStatusMethod = vm.ctx.settings.checkStatusMethod;
            }
        }
        if (!rpcEnabled) {
            onError('Target device is not set!');
        } else {
            if (!vm.isSimulated) {
                if (vm.performCheckStatus) {
                    rpcCheckStatus();
                } else {
                    subscribeForValue();
                }
            }
        }
    }

    function resize() {
        var width: any = ledContainer.width();
        var height: any = ledContainer.height();
        var size: any = Math.min(width, height);

        led.css({width: size, height: size});

        if (vm.showTitle) {
            setFontSize(ledTitle, vm.title, ledTitleContainer.height() * 2 / 3, ledTitleContainer.width());
        }
        setFontSize(ledError, vm.error, ledErrorContainer.height(), ledErrorContainer.width());
    }

    function setValue(value?: any, forceUpdate?: any) {
        if (vm.value != value || forceUpdate) {
            vm.value = value;
            updateColor();
        }
    }

    function updateColor() {
        var color: any = vm.value ? vm.ledColor : vm.disabledColor;
        var middleColor: any = vm.value ? vm.ledMiddleColor : vm.disabledMiddleColor;
        var boxShadow: any = `#000 0 -1px 6px 1px, inset ${middleColor} 0 -1px 8px, ${color} 0 3px 11px`;
        led.css({'backgroundColor': color});
        led.css({'boxShadow': boxShadow});
        if (vm.value) {
            led.removeClass( 'disabled' );
        } else {
            led.addClass( 'disabled' );
        }
    }

    function onError(error?: any) {
        $scope.$applyAsync(() => {
            vm.error = error;
            setFontSize(ledError, vm.error, ledErrorContainer.height(), ledErrorContainer.width());
        });
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

    function rpcCheckStatus() {
        if (vm.destroyed) {
            return;
        }
        vm.error = '';
        vm.ctx.controlApi.sendTwoWayCommand(vm.checkStatusMethod, null, vm.requestTimeout).then(
            (responseBody?: any) => {
                var status: any = responseBody ? true : false;
                if (status) {
                    if (vm.checkStatusTimeoutHandle) {
                        $timeout.cancel(vm.checkStatusTimeoutHandle);
                        vm.checkStatusTimeoutHandle = null;
                    }
                    subscribeForValue();
                } else {
                    var errorText: any = 'Unknown device status!';
                    onError(errorText);
                    if (vm.checkStatusTimeoutHandle) {
                        $timeout.cancel(vm.checkStatusTimeoutHandle);
                    }
                    vm.checkStatusTimeoutHandle = $timeout(rpcCheckStatus, checkStatusPollingInterval);
                }
            },
            () => {
                var errorText: any = vm.ctx.defaultSubscription.rpcErrorText;
                onError(errorText);
                if (vm.checkStatusTimeoutHandle) {
                    $timeout.cancel(vm.checkStatusTimeoutHandle);
                }
                vm.checkStatusTimeoutHandle = $timeout(rpcCheckStatus, checkStatusPollingInterval);
            }
        );
    }

    function subscribeForValue() {
        var subscriptionsInfo: any = [{
            type: types.datasourceType.entity,
            entityType: types.entityType.device,
            entityId: vm.ctx.defaultSubscription.targetDeviceId
        }];

        if (vm.retrieveValueMethod == 'attribute') {
            subscriptionsInfo[0].attributes = [
                {name: vm.valueAttribute}
            ];
        } else {
            subscriptionsInfo[0].timeseries = [
                {name: vm.valueAttribute}
            ];
        }

        vm.ctx.subscriptionApi.createSubscriptionFromInfo (
            types.widgetType.latest.value, subscriptionsInfo, vm.subscriptionOptions, false, true).then(
            function(subscription?: any) {
                vm.subscription = subscription;
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
                        parsed = vm.parseValueFunction(angular.fromJson(attrValue));
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

}

/**
 * Ported from the AngularJS directive `tbLedIndicator` (module `thingsboard.widgets.rpc.ledIndicator`) in src/app/widget/lib/rpc/led-indicator.directive.js:26.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-led-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tb-led-indicator.directive.html',
})
export class TbLedIndicatorDirective {
  readonly ctx = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            ctx: '='
        };
  controller: any = LedIndicatorController;
  controllerAs: any;
  templateUrl: any = ledIndicatorTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
