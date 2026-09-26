import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import knobTemplate from '../../../../app/widget/lib/rpc/knob.tpl.html';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function KnobController(this: any, $element?: any, $scope?: any, $document?: any) {
    let vm: any = this;

    vm.value = 0;
    vm.error = '';
    vm.newValue = 0;

    var knob: any = angular.element('.knob', $element),
        knobContainer: any = angular.element('#knob-container', $element),
        knobTopPointerContainer: any = knob.find('.top-pointer-container'),
        knobTopPointer: any = knob.find('.top-pointer'),
        knobValueContainer: any = knob.find('.value-container'),
        knobValue: any = knob.find('.knob-value'),
        knobErrorContainer: any = knob.find('.error-container'),
        knobError: any = knob.find('.knob-error'),
        knobTitleContainer: any = knob.find('.title-container'),
        knobTitle: any = knob.find('.knob-title'),
        knobMinmaxContainer: any = knob.find('.minmax-container'),
        minmaxLabel: any = knob.find('.minmax-label'),
        textMeasure: any = knob.find('#text-measure'),
        startDeg: any = -1,
        currentDeg: any = 0,
        rotation: any = 0,
        lastDeg: any = 0,
        moving: any = false;

    var minDeg: any = -45;
    var maxDeg: any = 225;

    var canvasBarElement: any = angular.element('#canvasBar', $element);

    var levelColors: any = ['#19ff4b', '#ffff19', '#ff3232'];

    var canvasBar: any;

    $scope.$watch('vm.ctx', () => {
        if (vm.ctx) {
            init();
        }
    });

    function init() {

        vm.minValue = angular.isDefined(vm.ctx.settings.minValue) ? vm.ctx.settings.minValue : 0;
        vm.maxValue = angular.isDefined(vm.ctx.settings.maxValue) ? vm.ctx.settings.maxValue : 100;
        vm.title = angular.isDefined(vm.ctx.settings.title) ? vm.ctx.settings.title : '';

        var canvasBarData: any = {
            renderTo: canvasBarElement[0],
            hideValue: true,
            neonGlowBrightness: 0,
            gaugeWidthScale: 0.4,
            gaugeColor: 'rgba(0, 0, 0, 0)',
            levelColors: levelColors,
            minValue: vm.minValue,
            maxValue: vm.maxValue,
            gaugeType: 'donut',
            dashThickness: 2,
            donutStartAngle: 3/4*Math.PI,
            donutEndAngle: 9/4*Math.PI,
            animation: false
        };

        canvasBar = new CanvasDigitalGauge(canvasBarData).draw();

        knob.on('click', (e?: any) => {
            if (moving) {
                moving = false;
                return false;
            }
            e.preventDefault();

            var offset: any = knob.offset();
            var center: any = {
                y : offset.top + knob.height()/2,
                x: offset.left + knob.width()/2
            };
            var a: any, b: any, deg: any,
                rad2deg: any = 180/Math.PI;

            e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;

            a = center.y - e.pageY;
            b = center.x - e.pageX;
            deg = Math.atan2(a,b)*rad2deg;
            if(deg < 0){
                deg = 360 + deg;
            }
            if (deg > maxDeg) {
                if (deg - 360 > minDeg) {
                    deg = deg - 360;
                } else {
                    return false;
                }
            }
            currentDeg = deg;
            lastDeg = deg;
            knobTopPointerContainer.css('transform','rotate('+(currentDeg)+'deg)');
            turn(degreeToRatio(currentDeg));
            rotation = currentDeg;
            startDeg = -1;
            rpcUpdateValue(vm.newValue);
            return undefined;
        });

        knob.on('mousedown touchstart', (e?: any) => {
            moving = false;
            e.preventDefault();
            var offset: any = knob.offset();
            var center: any = {
                y : offset.top + knob.height()/2,
                x: offset.left + knob.width()/2
            };

            var a: any, b: any, deg: any, tmp: any,
                rad2deg: any = 180/Math.PI;

            $document.on('mousemove.rem touchmove.rem', (e?: any) => {
                moving = true;
                e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;

                a = center.y - e.pageY;
                b = center.x - e.pageX;
                deg = Math.atan2(a,b)*rad2deg;
                if(deg < 0){
                    deg = 360 + deg;
                }

                if(startDeg == -1){
                    startDeg = deg;
                }

                tmp = Math.floor((deg-startDeg) + rotation);

                if(tmp < 0){
                    tmp = 360 + tmp;
                }
                else if(tmp > 359){
                    tmp = tmp % 360;
                }

                if (tmp > maxDeg) {
                    if (tmp - 360 > minDeg) {
                        tmp = tmp - 360;
                    } else {
                        var deltaMax: any = Math.abs(maxDeg - lastDeg);
                        var deltaMin: any = Math.abs(minDeg - lastDeg);
                        if (deltaMax < deltaMin) {
                            tmp = maxDeg;
                        } else {
                            tmp = minDeg;
                        }
                    }
                }
                if(Math.abs(tmp - lastDeg) > 180){
                    startDeg = deg;
                    rotation = currentDeg;
                    return false;
                }

                currentDeg = tmp;
                lastDeg = tmp;

                knobTopPointerContainer.css('transform','rotate('+(currentDeg)+'deg)');
                turn(degreeToRatio(currentDeg));
                return undefined;
            });

            $document.on('mouseup.rem  touchend.rem',() => {
                if(moving) {
                    rpcUpdateValue(vm.newValue);
                }
                knob.off('.rem');
                $document.off('.rem');
                rotation = currentDeg;
                startDeg = -1;
            });

        });
        vm.ctx.resize = resize;
        resize();
        var initialValue: any = angular.isDefined(vm.ctx.settings.initialValue) ? vm.ctx.settings.initialValue : vm.minValue;
        setValue(initialValue);

        var subscription: any = vm.ctx.defaultSubscription;
        var rpcEnabled: any = subscription.rpcEnabled;

        vm.isSimulated = $scope.widgetEditMode;

        vm.requestTimeout = 500;
        if (vm.ctx.settings.requestTimeout) {
            vm.requestTimeout = vm.ctx.settings.requestTimeout;
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
                rpcRequestValue();
            }
        }
    }

    function ratioToDegree(ratio?: any) {
        return minDeg + ratio*(maxDeg-minDeg);
    }

    function degreeToRatio(degree?: any) {
        return (degree-minDeg)/(maxDeg-minDeg);
    }

    function resize() {
        var width: any = knobContainer.width();
        var height: any = knobContainer.height();
        var size: any = Math.min(width, height);
        knob.css({width: size, height: size});
        canvasBar.update({width: size, height: size});
        setFontSize(knobTitle, vm.title, knobTitleContainer.height(), knobTitleContainer.width());
        setFontSize(knobError, vm.error, knobErrorContainer.height(), knobErrorContainer.width());
        var minmaxHeight: any = knobMinmaxContainer.height();
        minmaxLabel.css({'fontSize': minmaxHeight+'px', 'lineHeight': minmaxHeight+'px'});
        checkValueSize();
    }

    function turn(ratio?: any) {
        vm.newValue = (vm.minValue + (vm.maxValue - vm.minValue)*ratio).toFixed(vm.ctx.decimals);
        if (canvasBar.value != vm.newValue) {
            canvasBar.value = vm.newValue;
        }
        updateColor(canvasBar.getValueColor());
        onValue(vm.newValue);
    }

    function setValue(value?: any) {
        var ratio: any = (value-vm.minValue) / (vm.maxValue - vm.minValue);
        rotation = lastDeg = currentDeg = ratioToDegree(ratio);
        knobTopPointerContainer.css('transform','rotate('+(currentDeg)+'deg)');
        if (canvasBar.value != value) {
            canvasBar.value = value;
        }
        updateColor(canvasBar.getValueColor());
        vm.value = formatValue(value);
        checkValueSize();
    }

    function updateColor(color?: any) {
        var glowColor: any = tinycolor(color).brighten(30).toHexString();
        knobValue.css({'color': glowColor});
        var textShadow: any = `${color} 1px 1px 10px, ${glowColor} 1px 1px 10px`;
        knobValue.css({'textShadow': textShadow});
        knobTopPointer.css({'backgroundColor': glowColor});
        var boxShadow: any = `inset 1px 0 2px #040404, 1px 1px 8px 2px ${glowColor}`;
        knobTopPointer.css({'boxShadow': boxShadow});
    }

    function onValue(value?: any) {
        $scope.$applyAsync(() => {
            vm.value = formatValue(value);
            checkValueSize();
        });
    }

    function onError(error?: any) {
        $scope.$applyAsync(() => {
            vm.error = error;
            setFontSize(knobError, vm.error, knobErrorContainer.height(), knobErrorContainer.width());
        });
    }

    function formatValue(value?: any) {
        return vm.ctx.utils.formatValue(value, vm.ctx.decimals, vm.ctx.units, true);
    }

    function checkValueSize() {
        var fontSize: any = knobValueContainer.height()/3.3;
        var containerWidth: any = knobValueContainer.width();
        setFontSize(knobValue, vm.value, fontSize, containerWidth);
    }

    function setFontSize(element?: any, text?: any, fontSize?: any, maxWidth?: any) {
        var textWidth: any = measureTextWidth(text, fontSize);
        while (textWidth > maxWidth) {
            fontSize--;
            if (fontSize < 0) {
                break;
            }
            textWidth = measureTextWidth(text, fontSize);
        }
        element.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
    }

    function measureTextWidth(text?: any, fontSize?: any) {
        textMeasure.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
        textMeasure.html(text);
        return textMeasure.width();
    }

    function rpcRequestValue() {
        vm.error = '';
        vm.ctx.controlApi.sendTwoWayCommand(vm.getValueMethod, null, vm.requestTimeout).then(
            (responseBody?: any) => {
                if (isNumber(responseBody)) {
                    var numValue: any = Number(responseBody).toFixed(vm.ctx.decimals);
                    setValue(numValue);
                } else {
                    var errorText: any = `Unable to parse response: ${responseBody}`;
                    onError(errorText);
                }
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
        vm.ctx.controlApi.sendOneWayCommand(vm.setValueMethod, value, vm.requestTimeout).then(
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
 * Ported from the AngularJS directive `tbKnob` (module `thingsboard.widgets.rpc.knob`) in src/app/widget/lib/rpc/knob.directive.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-knob',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tb-knob.directive.html',
})
export class TbKnobDirective {
  readonly ctx = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            ctx: '='
        };
  controller: any = KnobController;
  controllerAs: any;
  templateUrl: any = knobTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
