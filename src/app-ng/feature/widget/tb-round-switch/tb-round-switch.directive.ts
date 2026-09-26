import { AfterViewInit, Component, effect, inject, model, untracked } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import { RootState } from '../../../root-state';

/**
 * Ported from the AngularJS directive `tbRoundSwitch` (module `thingsboard.widgets.rpc.roundSwitch`) in src/app/widget/lib/rpc/round-switch.directive.js:24.
 * The widget runtime renders it for a widget type whose template is `<tb-round-switch ctx="ctx">`; it
 * initialises whenever `ctx` is set, once its template is in the DOM (the legacy `$scope.$watch('vm.ctx')`).
 */
@Component({
  selector: 'tb-round-switch',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tb-round-switch.directive.html',
})
export class TbRoundSwitchDirective implements AfterViewInit {
  readonly ctx = model<any>();

  protected readonly element = inject(ElementRef);
  protected readonly utils = inject(UtilsService);
  protected readonly destroyRef = inject(DestroyRef);
  protected readonly rootScope = inject(RootState);
  private viewReady = false;
  private initedCtx: any = null;

  showTitle: any = false;
  value: any = false;
  error: any = '';
  checkboxId: any;
  protected switchElement: any;
  protected switchContainer: any;
  protected onoff: any;
  protected textMeasure: any;
  protected switchTitleContainer: any;
  protected switchTitle: any;
  protected switchErrorContainer: any;
  protected switchError: any;
  valueSubscription: any = null;
  convertValueFunction: any;
  executingUpdateValue: any;
  getValueMethod: any;
  isSimulated: any;
  parseValueFunction: any;
  requestTimeout: any;
  retrieveValueMethod: any;
  rpcValue: any;
  scheduledValue: any;
  setValueMethod: any;
  title: any;
  valueKey: any;

  constructor() {
    this.checkboxId = 'onoff-' + this.utils.guid();
    effect(() => {
      const ctx = this.ctx();
      untracked(() => this.ctxChanged(ctx));
    });
    this.destroyRef.onDestroy(() => {
        if (this.valueSubscription) {
            this.ctx().subscriptionApi.removeSubscription(this.valueSubscription.id);
        }
    });
  }

  ngAfterViewInit(): void {
    const host = $(this.element.nativeElement);
    this.switchElement = $('.switch', host);
    this.switchContainer = $('#switch-container', host);
    this.onoff = $('input', host);
    this.textMeasure = $('#text-measure', host);
    this.switchTitleContainer = $('.title-container', host);
    this.switchTitle = $('.switch-title', host);
    this.switchErrorContainer = $('.error-container', host);
    this.switchError = $('.switch-error', host);
    this.onoff.bind('change', () => {
        this.value = this.onoff.prop('checked') === false;
        this.onValue();
    });
    this.viewReady = true;
    this.resize();
    this.ctxChanged(this.ctx());
  }

  private ctxChanged(ctx: any): void {
    if (ctx && this.viewReady && ctx !== this.initedCtx) {
      this.initedCtx = ctx;
      this.init();
    }
  }

  init(...rest: any[]): any {

    this.title = (this.ctx().settings.title !== undefined) ? this.ctx().settings.title : '';
    this.showTitle = this.title && this.title.length ? true : false;
    this.ctx().resize = this.resize;
    queueMicrotask(() => {
        this.resize();
    });
    var initialValue: any = (this.ctx().settings.initialValue !== undefined) ? this.ctx().settings.initialValue : false;
    this.setValue(initialValue);

    var subscription: any = this.ctx().defaultSubscription;
    var rpcEnabled: any = subscription.rpcEnabled;

    this.isSimulated = this.rootScope['widgetEditMode'];

    this.requestTimeout = 500;
    if (this.ctx().settings.requestTimeout) {
        this.requestTimeout = this.ctx().settings.requestTimeout;
    }

    this.retrieveValueMethod = 'rpc';
    if (this.ctx().settings.retrieveValueMethod && this.ctx().settings.retrieveValueMethod.length) {
        this.retrieveValueMethod = this.ctx().settings.retrieveValueMethod;
    }

    this.valueKey = 'value';
    if (this.ctx().settings.valueKey && this.ctx().settings.valueKey.length) {
        this.valueKey = this.ctx().settings.valueKey;
    }

    this.parseValueFunction = (data?: any) => data ? true : false;
    if (this.ctx().settings.parseValueFunction && this.ctx().settings.parseValueFunction.length) {
        try {
            this.parseValueFunction = new Function('data', this.ctx().settings.parseValueFunction);
        } catch (e: any) {
            this.parseValueFunction = (data?: any) => data ? true : false;
        }
    }

    this.convertValueFunction = (value?: any) => value;
    if (this.ctx().settings.convertValueFunction && this.ctx().settings.convertValueFunction.length) {
        try {
            this.convertValueFunction = new Function('value', this.ctx().settings.convertValueFunction);
        } catch (e: any) {
            this.convertValueFunction = (value?: any) => value;
        }
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
            if (this.retrieveValueMethod == 'rpc') {
                this.rpcRequestValue();
            } else if (this.retrieveValueMethod == 'attribute' || this.retrieveValueMethod == 'timeseries') {
                this.subscribeForValue();
            }
        }
    }
  }

  resize = (...rest: any[]): any => {
    var width: any = this.switchContainer.width();
    var height: any = this.switchContainer.height();
    var size: any = Math.min(width, height);
    var scale: any = size/260;
    this.switchElement.css({
        '-webkit-transform': `scale(${scale})`,
        '-moz-transform': `scale(${scale})`,
        '-ms-transform': `scale(${scale})`,
        '-o-transform': `scale(${scale})`,
        transform: `scale(${scale})`
    });
    if (this.showTitle) {
        this.setFontSize(this.switchTitle, this.title, this.switchTitleContainer.height() * 2 / 3, this.switchTitleContainer.width());
    }
    this.setFontSize(this.switchError, this.error, this.switchErrorContainer.height(), this.switchErrorContainer.width());
  };

  subscribeForValue(...rest: any[]): any {
    var valueSubscriptionInfo: any = [{
        type: types.datasourceType.entity,
        entityType: types.entityType.device,
        entityId: this.ctx().defaultSubscription.targetDeviceId
    }];
    if (this.retrieveValueMethod == 'attribute') {
        valueSubscriptionInfo[0].attributes = [
            {name: this.valueKey}
        ];
    } else {
        valueSubscriptionInfo[0].timeseries = [
            {name: this.valueKey}
        ];
    }
    var subscriptionOptions: any = {
        callbacks: {
            onDataUpdated: this.onDataUpdated,
            onDataUpdateError: this.onDataUpdateError
        }
    };
    this.ctx().subscriptionApi.createSubscriptionFromInfo (
        types.widgetType.latest.value, valueSubscriptionInfo, subscriptionOptions, false, true).then(
        (subscription?: any) => {
            this.valueSubscription = subscription;
        }
    );
  }

  onDataUpdated = (subscription?: any, ...rest: any[]): any => {
    var value: any = false;
    var data: any = subscription.data;
    if (data.length) {
        var keyData: any = data[0];
        if (keyData && keyData.data && keyData.data[0]) {
            var attrValue: any = keyData.data[0][1];
            if (attrValue) {
                var parsed: any = null;
                try {
                    parsed = this.parseValueFunction(JSON.parse(attrValue));
                } catch (e: any){/**/}
                value = parsed ? true : false;
            }
        }
    }
    this.setValue(value);
  };

  onDataUpdateError = (subscription?: any, e?: any, ...rest: any[]): any => {
    var exceptionData: any = this.utils.parseException(e);
    var errorText: any = exceptionData.name;
    if (exceptionData.message) {
        errorText += ': ' + exceptionData.message;
    }
    this.onError(errorText);
  };

  setValue(value?: any, ...rest: any[]): any {
    this.value = value ? true : false;
    this.onoff.prop('checked', !this.value);
  }

  onValue(...rest: any[]): any {
    this.rpcUpdateValue(this.value);
  }

  onError(error?: any, ...rest: any[]): any {
    queueMicrotask(() => {
        this.error = error;
        this.setFontSize(this.switchError, this.error, this.switchErrorContainer.height(), this.switchErrorContainer.width());
    });
  }

  setFontSize(element?: any, text?: any, fontSize?: any, maxWidth?: any, ...rest: any[]): any {
    var textWidth: any = this.measureTextWidth(text, fontSize);
    while (textWidth > maxWidth) {
        fontSize--;
        textWidth = this.measureTextWidth(text, fontSize);
    }
    element.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
  }

  measureTextWidth(text?: any, fontSize?: any, ...rest: any[]): any {
    this.textMeasure.css({'fontSize': fontSize+'px', 'lineHeight': fontSize+'px'});
    this.textMeasure.text(text);
    return this.textMeasure.width();
  }

  rpcRequestValue(...rest: any[]): any {
    this.error = '';
    this.ctx().controlApi.sendTwoWayCommand(this.getValueMethod, null, this.requestTimeout).then(
        (responseBody?: any) => {
            this.setValue(this.parseValueFunction(responseBody));
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
    this.ctx().controlApi.sendOneWayCommand(this.setValueMethod, this.convertValueFunction(value), this.requestTimeout).then(
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
