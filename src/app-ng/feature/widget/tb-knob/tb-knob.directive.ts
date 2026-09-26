import { AfterViewInit, Component, effect, inject, model, untracked, ChangeDetectionStrategy } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import CanvasDigitalGauge from '../../../legacy-lib/widget/lib/CanvasDigitalGauge';
import tinycolor from 'tinycolor2';
import { isNumber } from '../../../legacy-lib/widget/lib/widget-utils';
import { RootState } from '../../../root-state';

/**
 * Ported from the AngularJS directive `tbKnob` (module `thingsboard.widgets.rpc.knob`) in src/app/widget/lib/rpc/knob.directive.js:29.
 * The widget runtime renders it for a widget type whose template is `<tb-knob ctx="ctx">`; it (re)initialises
 * whenever `ctx` is set, once its template is in the DOM (the legacy `$scope.$watch('vm.ctx')`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-knob',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tb-knob.directive.html',
})
export class TbKnobDirective implements AfterViewInit {
  readonly ctx = model<any>();

  protected readonly element = inject(ElementRef);
  protected readonly document = inject(DOCUMENT);
  protected readonly rootScope = inject(RootState);
  private viewReady = false;
  private initedCtx: any = null;

  value: any = 0;
  error: any = '';
  newValue: any = 0;
  protected knob: any;
  protected knobContainer: any;
  protected knobTopPointerContainer: any;
  protected knobTopPointer: any;
  protected knobValueContainer: any;
  protected knobValue: any;
  protected knobErrorContainer: any;
  protected knobError: any;
  protected knobTitleContainer: any;
  protected knobTitle: any;
  protected knobMinmaxContainer: any;
  protected minmaxLabel: any;
  protected textMeasure: any;
  protected startDeg: any = -1;
  protected currentDeg: any = 0;
  protected rotation: any = 0;
  protected lastDeg: any = 0;
  protected moving: any = false;
  protected minDeg: any = -45;
  protected maxDeg: any = 225;
  protected canvasBarElement: any;
  protected levelColors: any = ['#19ff4b', '#ffff19', '#ff3232'];
  protected canvasBar: any;
  executingUpdateValue: any;
  getValueMethod: any;
  isSimulated: any;
  maxValue: any;
  minValue: any;
  requestTimeout: any;
  rpcValue: any;
  scheduledValue: any;
  setValueMethod: any;
  title: any;

  constructor() {
    effect(() => {
      const ctx = this.ctx();
      untracked(() => this.ctxChanged(ctx));
    });
  }

  ngAfterViewInit(): void {
    const host = $(this.element.nativeElement);
    this.knob = $('.knob', host);
    this.knobContainer = $('#knob-container', host);
    this.knobTopPointerContainer = this.knob.find('.top-pointer-container');
    this.knobTopPointer = this.knob.find('.top-pointer');
    this.knobValueContainer = this.knob.find('.value-container');
    this.knobValue = this.knob.find('.knob-value');
    this.knobErrorContainer = this.knob.find('.error-container');
    this.knobError = this.knob.find('.knob-error');
    this.knobTitleContainer = this.knob.find('.title-container');
    this.knobTitle = this.knob.find('.knob-title');
    this.knobMinmaxContainer = this.knob.find('.minmax-container');
    this.minmaxLabel = this.knob.find('.minmax-label');
    this.textMeasure = this.knob.find('#text-measure');
    this.canvasBarElement = $('#canvasBar', host);
    this.viewReady = true;
    this.ctxChanged(this.ctx());
  }

  private ctxChanged(ctx: any): void {
    if (ctx && this.viewReady && ctx !== this.initedCtx) {
      this.initedCtx = ctx;
      this.init();
    }
  }

  init(...rest: any[]): any {

    this.minValue = (this.ctx().settings.minValue !== undefined) ? this.ctx().settings.minValue : 0;
    this.maxValue = (this.ctx().settings.maxValue !== undefined) ? this.ctx().settings.maxValue : 100;
    this.title = (this.ctx().settings.title !== undefined) ? this.ctx().settings.title : '';

    var canvasBarData: any = {
        renderTo: this.canvasBarElement[0],
        hideValue: true,
        neonGlowBrightness: 0,
        gaugeWidthScale: 0.4,
        gaugeColor: 'rgba(0, 0, 0, 0)',
        levelColors: this.levelColors,
        minValue: this.minValue,
        maxValue: this.maxValue,
        gaugeType: 'donut',
        dashThickness: 2,
        donutStartAngle: 3/4*Math.PI,
        donutEndAngle: 9/4*Math.PI,
        animation: false
    };

    this.canvasBar = new CanvasDigitalGauge(canvasBarData).draw();

    this.knob.on('click', (e?: any) => {
        if (this.moving) {
            this.moving = false;
            return false;
        }
        e.preventDefault();

        var offset: any = this.knob.offset();
        var center: any = {
            y : offset.top + this.knob.height()/2,
            x: offset.left + this.knob.width()/2
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
        if (deg > this.maxDeg) {
            if (deg - 360 > this.minDeg) {
                deg = deg - 360;
            } else {
                return false;
            }
        }
        this.currentDeg = deg;
        this.lastDeg = deg;
        this.knobTopPointerContainer.css('transform','rotate('+(this.currentDeg)+'deg)');
        this.turn(this.degreeToRatio(this.currentDeg));
        this.rotation = this.currentDeg;
        this.startDeg = -1;
        this.rpcUpdateValue(this.newValue);
        return undefined;
    });

    this.knob.on('mousedown touchstart', (e?: any) => {
        this.moving = false;
        e.preventDefault();
        var offset: any = this.knob.offset();
        var center: any = {
            y : offset.top + this.knob.height()/2,
            x: offset.left + this.knob.width()/2
        };

        var a: any, b: any, deg: any, tmp: any,
            rad2deg: any = 180/Math.PI;

        $(this.document).on('mousemove.rem touchmove.rem', (e?: any) => {
            this.moving = true;
            e = (e.originalEvent.touches) ? e.originalEvent.touches[0] : e;

            a = center.y - e.pageY;
            b = center.x - e.pageX;
            deg = Math.atan2(a,b)*rad2deg;
            if(deg < 0){
                deg = 360 + deg;
            }

            if(this.startDeg == -1){
                this.startDeg = deg;
            }

            tmp = Math.floor((deg-this.startDeg) + this.rotation);

            if(tmp < 0){
                tmp = 360 + tmp;
            }
            else if(tmp > 359){
                tmp = tmp % 360;
            }

            if (tmp > this.maxDeg) {
                if (tmp - 360 > this.minDeg) {
                    tmp = tmp - 360;
                } else {
                    var deltaMax: any = Math.abs(this.maxDeg - this.lastDeg);
                    var deltaMin: any = Math.abs(this.minDeg - this.lastDeg);
                    if (deltaMax < deltaMin) {
                        tmp = this.maxDeg;
                    } else {
                        tmp = this.minDeg;
                    }
                }
            }
            if(Math.abs(tmp - this.lastDeg) > 180){
                this.startDeg = deg;
                this.rotation = this.currentDeg;
                return false;
            }

            this.currentDeg = tmp;
            this.lastDeg = tmp;

            this.knobTopPointerContainer.css('transform','rotate('+(this.currentDeg)+'deg)');
            this.turn(this.degreeToRatio(this.currentDeg));
            return undefined;
        });

        $(this.document).on('mouseup.rem  touchend.rem',() => {
            if(this.moving) {
                this.rpcUpdateValue(this.newValue);
            }
            this.knob.off('.rem');
            $(this.document).off('.rem');
            this.rotation = this.currentDeg;
            this.startDeg = -1;
        });

    });
    this.ctx().resize = this.resize;
    this.resize();
    var initialValue: any = (this.ctx().settings.initialValue !== undefined) ? this.ctx().settings.initialValue : this.minValue;
    this.setValue(initialValue);

    var subscription: any = this.ctx().defaultSubscription;
    var rpcEnabled: any = subscription.rpcEnabled;

    this.isSimulated = this.rootScope['widgetEditMode'];

    this.requestTimeout = 500;
    if (this.ctx().settings.requestTimeout) {
        this.requestTimeout = this.ctx().settings.requestTimeout;
    }
    this.getValueMethod = 'getValue';
    if (this.ctx().settings.getValueMethod && this.ctx().settings.getValueMethod.length) {
        this.getValueMethod = this.ctx().settings.getValueMethod;
    }
    this.setValueMethod = 'setValue';
    if (this.ctx().settings.setValueMethod && this.ctx().settings.setValueMethod.length) {
        this.setValueMethod = this.ctx().settings.setValueMethod;
    }
    if (!rpcEnabled) {
        this.onError('Target device is not set!');
    } else {
        if (!this.isSimulated) {
            this.rpcRequestValue();
        }
    }
  }

  ratioToDegree(ratio?: any, ...rest: any[]): any {
    return this.minDeg + ratio*(this.maxDeg-this.minDeg);
  }

  degreeToRatio(degree?: any, ...rest: any[]): any {
    return (degree-this.minDeg)/(this.maxDeg-this.minDeg);
  }

  resize = (...rest: any[]): any => {
    var width: any = this.knobContainer.width();
    var height: any = this.knobContainer.height();
    var size: any = Math.min(width, height);
    this.knob.css({width: size, height: size});
    this.canvasBar.update({width: size, height: size});
    this.setFontSize(this.knobTitle, this.title, this.knobTitleContainer.height(), this.knobTitleContainer.width());
    this.setFontSize(this.knobError, this.error, this.knobErrorContainer.height(), this.knobErrorContainer.width());
    var minmaxHeight: any = this.knobMinmaxContainer.height();
    this.minmaxLabel.css({'fontSize': minmaxHeight+'px', 'lineHeight': minmaxHeight+'px'});
    this.checkValueSize();
  };

  turn(ratio?: any, ...rest: any[]): any {
    this.newValue = (this.minValue + (this.maxValue - this.minValue)*ratio).toFixed(this.ctx().decimals);
    if (this.canvasBar.value != this.newValue) {
        this.canvasBar.value = this.newValue;
    }
    this.updateColor(this.canvasBar.getValueColor());
    this.onValue(this.newValue);
  }

  setValue(value?: any, ...rest: any[]): any {
    var ratio: any = (value-this.minValue) / (this.maxValue - this.minValue);
    this.rotation = this.lastDeg = this.currentDeg = this.ratioToDegree(ratio);
    this.knobTopPointerContainer.css('transform','rotate('+(this.currentDeg)+'deg)');
    if (this.canvasBar.value != value) {
        this.canvasBar.value = value;
    }
    this.updateColor(this.canvasBar.getValueColor());
    this.value = this.formatValue(value);
    this.checkValueSize();
  }

  updateColor(color?: any, ...rest: any[]): any {
    var glowColor: any = tinycolor(color).brighten(30).toHexString();
    this.knobValue.css({'color': glowColor});
    var textShadow: any = `${color} 1px 1px 10px, ${glowColor} 1px 1px 10px`;
    this.knobValue.css({'textShadow': textShadow});
    this.knobTopPointer.css({'backgroundColor': glowColor});
    var boxShadow: any = `inset 1px 0 2px #040404, 1px 1px 8px 2px ${glowColor}`;
    this.knobTopPointer.css({'boxShadow': boxShadow});
  }

  onValue(value?: any, ...rest: any[]): any {
    queueMicrotask(() => {
        this.value = this.formatValue(value);
        this.checkValueSize();
    });
  }

  onError(error?: any, ...rest: any[]): any {
    queueMicrotask(() => {
        this.error = error;
        this.setFontSize(this.knobError, this.error, this.knobErrorContainer.height(), this.knobErrorContainer.width());
    });
  }

  formatValue(value?: any, ...rest: any[]): any {
    return this.ctx().utils.formatValue(value, this.ctx().decimals, this.ctx().units, true);
  }

  checkValueSize(...rest: any[]): any {
    var fontSize: any = this.knobValueContainer.height()/3.3;
    var containerWidth: any = this.knobValueContainer.width();
    this.setFontSize(this.knobValue, this.value, fontSize, containerWidth);
  }

  setFontSize(element?: any, text?: any, fontSize?: any, maxWidth?: any, ...rest: any[]): any {
    var textWidth: any = this.measureTextWidth(text, fontSize);
    while (textWidth > maxWidth) {
        fontSize--;
        if (fontSize < 0) {
            break;
        }
        textWidth = this.measureTextWidth(text, fontSize);
    }
    element.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
  }

  measureTextWidth(text?: any, fontSize?: any, ...rest: any[]): any {
    this.textMeasure.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
    this.textMeasure.html(text);
    return this.textMeasure.width();
  }

  rpcRequestValue(...rest: any[]): any {
    this.error = '';
    this.ctx().controlApi.sendTwoWayCommand(this.getValueMethod, null, this.requestTimeout).then(
        (responseBody?: any) => {
            if (isNumber(responseBody)) {
                var numValue: any = Number(responseBody).toFixed(this.ctx().decimals);
                this.setValue(numValue);
            } else {
                var errorText: any = `Unable to parse response: ${responseBody}`;
                this.onError(errorText);
            }
        },
        () => {
            var errorText: any = this.ctx().defaultSubscription.rpcErrorText;
            this.onError(errorText);
        }
    );
  }

  rpcUpdateValue(value?: any, ...rest: any[]): any {
    if (this.executingUpdateValue) {
        this.scheduledValue = value;
        return;
    } else {
        this.scheduledValue = null;
        this.rpcValue = value;
        this.executingUpdateValue = true;
    }
    this.error = '';
    this.ctx().controlApi.sendOneWayCommand(this.setValueMethod, value, this.requestTimeout).then(
        () => {
            this.executingUpdateValue = false;
            if (this.scheduledValue != null && this.scheduledValue != this.rpcValue) {
                this.rpcUpdateValue(this.scheduledValue);
            }
        },
        () => {
            this.executingUpdateValue = false;
            var errorText: any = this.ctx().defaultSubscription.rpcErrorText;
            this.onError(errorText);
        }
    );
  }
}
