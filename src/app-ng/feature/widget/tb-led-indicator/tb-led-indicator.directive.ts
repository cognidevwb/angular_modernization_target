import { Component, inject, model } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import tinycolor from 'tinycolor2';
import { $timeout } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;
declare let utils: any;

/**
 * Ported from the AngularJS directive `tbLedIndicator` (module `thingsboard.widgets.rpc.ledIndicator`) in src/app/widget/lib/rpc/led-indicator.directive.js:26.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-led-indicator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tb-led-indicator.directive.html',
})
export class TbLedIndicatorDirective {
  readonly ctx = model<any>();

  protected readonly element = inject(ElementRef);
  // TODO(port): '$scope' — component state: fields and signals on this class
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  protected readonly utils = inject(UtilsService);
  protected readonly destroyRef = inject(DestroyRef);

  showTitle: any = false;
  value: any = false;
  error: any = '';
  protected checkStatusPollingInterval: any = 10000;
  subscriptionOptions: any;
  protected led: any;
  protected ledContainer: any;
  protected textMeasure: any;
  protected ledTitleContainer: any;
  protected ledTitle: any;
  protected ledErrorContainer: any;
  protected ledError: any;
  checkStatusMethod: any;
  checkStatusTimeoutHandle: any;
  destroyed: any;
  disabledColor: any;
  disabledMiddleColor: any;
  isSimulated: any;
  ledColor: any;
  ledMiddleColor: any;
  parseValueFunction: any;
  performCheckStatus: any;
  requestTimeout: any;
  retrieveValueMethod: any;
  subscription: any;
  title: any;
  valueAttribute: any;
  widgetEditMode: any;

  // TODO(port): $scope.$digest — $digest is not needed: Angular detects the change
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    this.subscriptionOptions = {
        callbacks: {
            onDataUpdated: this.onDataUpdated,
            onDataUpdateError: this.onDataUpdateError,
            dataLoading: (...rest: any[]) => {}
        }
    };
    this.led = $('.led', $(this.element.nativeElement));
    this.ledContainer = $('#led-container', $(this.element.nativeElement));
    this.textMeasure = $('#text-measure', $(this.element.nativeElement));
    this.ledTitleContainer = $('.title-container', $(this.element.nativeElement));
    this.ledTitle = $('.led-title', $(this.element.nativeElement));
    this.ledErrorContainer = $('.error-container', $(this.element.nativeElement));
    this.ledError = $('.led-error', $(this.element.nativeElement));
    $scope.$watch('vm.ctx', () => {
        if (this.ctx()) {
            this.init();
        }
    });
    this.destroyRef.onDestroy(() => {
        this.destroyed = true;
        if (this.checkStatusTimeoutHandle) {
            clearTimeout(this.checkStatusTimeoutHandle);
        }
        if (this.subscription) {
            this.ctx().subscriptionApi.removeSubscription(this.subscription.id);
        }
    });
    this.resize();
  }

  init(...rest: any[]): any {

    this.title = (this.ctx().settings.title !== undefined) ? this.ctx().settings.title : '';
    this.showTitle = this.title && this.title.length ? true : false;

    var origColor: any = (this.ctx().settings.ledColor !== undefined) ? this.ctx().settings.ledColor : 'green';

    this.valueAttribute = (this.ctx().settings.valueAttribute !== undefined) ? this.ctx().settings.valueAttribute : 'value';

    this.ledColor = tinycolor(origColor).brighten(30).toHexString();
    this.ledMiddleColor = tinycolor(origColor).toHexString();
    this.disabledColor = tinycolor(origColor).darken(40).toHexString();
    this.disabledMiddleColor = tinycolor(origColor).darken(60).toHexString();

    this.ctx().resize = this.resize;
    queueMicrotask(() => {
        this.resize();
    });
    var initialValue: any = (this.ctx().settings.initialValue !== undefined) ? this.ctx().settings.initialValue : false;
    this.setValue(initialValue, true);

    var subscription: any = this.ctx().defaultSubscription;
    var rpcEnabled: any = subscription.rpcEnabled;

    this.isSimulated = this.widgetEditMode;

    this.requestTimeout = 500;
    if (this.ctx().settings.requestTimeout) {
        this.requestTimeout = this.ctx().settings.requestTimeout;
    }
    this.retrieveValueMethod = 'attribute';
    if (this.ctx().settings.retrieveValueMethod && this.ctx().settings.retrieveValueMethod.length) {
        this.retrieveValueMethod = this.ctx().settings.retrieveValueMethod;
    }

    this.parseValueFunction = (data?: any) => data ? true : false;
    if (this.ctx().settings.parseValueFunction && this.ctx().settings.parseValueFunction.length) {
        try {
            this.parseValueFunction = new Function('data', this.ctx().settings.parseValueFunction);
        } catch (e: any) {
            this.parseValueFunction = (data?: any) => data ? true : false;
        }
    }

    this.performCheckStatus = this.ctx().settings.performCheckStatus != false;
    if (this.performCheckStatus) {
        this.checkStatusMethod = 'checkStatus';
        if (this.ctx().settings.checkStatusMethod && this.ctx().settings.checkStatusMethod.length) {
            this.checkStatusMethod = this.ctx().settings.checkStatusMethod;
        }
    }
    if (!rpcEnabled) {
        this.onError('Target device is not set!');
    } else {
        if (!this.isSimulated) {
            if (this.performCheckStatus) {
                this.rpcCheckStatus();
            } else {
                this.subscribeForValue();
            }
        }
    }
  }

  resize = (...rest: any[]): any => {
    var width: any = this.ledContainer.width();
    var height: any = this.ledContainer.height();
    var size: any = Math.min(width, height);

    this.led.css({width: size, height: size});

    if (this.showTitle) {
        this.setFontSize(this.ledTitle, this.title, this.ledTitleContainer.height() * 2 / 3, this.ledTitleContainer.width());
    }
    this.setFontSize(this.ledError, this.error, this.ledErrorContainer.height(), this.ledErrorContainer.width());
  };

  setValue(value?: any, forceUpdate?: any, ...rest: any[]): any {
    if (this.value != value || forceUpdate) {
        this.value = value;
        this.updateColor();
    }
  }

  updateColor(...rest: any[]): any {
    var color: any = this.value ? this.ledColor : this.disabledColor;
    var middleColor: any = this.value ? this.ledMiddleColor : this.disabledMiddleColor;
    var boxShadow: any = `#000 0 -1px 6px 1px, inset ${middleColor} 0 -1px 8px, ${color} 0 3px 11px`;
    this.led.css({'backgroundColor': color});
    this.led.css({'boxShadow': boxShadow});
    if (this.value) {
        this.led.removeClass( 'disabled' );
    } else {
        this.led.addClass( 'disabled' );
    }
  }

  onError(error?: any, ...rest: any[]): any {
    queueMicrotask(() => {
        this.error = error;
        this.setFontSize(this.ledError, this.error, this.ledErrorContainer.height(), this.ledErrorContainer.width());
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

  rpcCheckStatus = (...rest: any[]): any => {
    if (this.destroyed) {
        return;
    }
    this.error = '';
    this.ctx().controlApi.sendTwoWayCommand(this.checkStatusMethod, null, this.requestTimeout).then(
        (responseBody?: any) => {
            var status: any = responseBody ? true : false;
            if (status) {
                if (this.checkStatusTimeoutHandle) {
                    clearTimeout(this.checkStatusTimeoutHandle);
                    this.checkStatusTimeoutHandle = null;
                }
                this.subscribeForValue();
            } else {
                var errorText: any = 'Unknown device status!';
                this.onError(errorText);
                if (this.checkStatusTimeoutHandle) {
                    clearTimeout(this.checkStatusTimeoutHandle);
                }
                this.checkStatusTimeoutHandle = setTimeout(this.rpcCheckStatus, this.checkStatusPollingInterval);
            }
        },
        () => {
            var errorText: any = this.ctx().defaultSubscription.rpcErrorText;
            this.onError(errorText);
            if (this.checkStatusTimeoutHandle) {
                clearTimeout(this.checkStatusTimeoutHandle);
            }
            this.checkStatusTimeoutHandle = setTimeout(this.rpcCheckStatus, this.checkStatusPollingInterval);
        }
    );
  };

  subscribeForValue(...rest: any[]): any {
    var subscriptionsInfo: any = [{
        type: types.datasourceType.entity,
        entityType: types.entityType.device,
        entityId: this.ctx().defaultSubscription.targetDeviceId
    }];

    if (this.retrieveValueMethod == 'attribute') {
        subscriptionsInfo[0].attributes = [
            {name: this.valueAttribute}
        ];
    } else {
        subscriptionsInfo[0].timeseries = [
            {name: this.valueAttribute}
        ];
    }

    this.ctx().subscriptionApi.createSubscriptionFromInfo (
        types.widgetType.latest.value, subscriptionsInfo, this.subscriptionOptions, false, true).then(
        (subscription?: any) => {
            this.subscription = subscription;
        }
    );
  }

  onDataUpdated = (subscription?: any, apply?: any, ...rest: any[]): any => {
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
    if (apply) {

    }
  };

  onDataUpdateError = (subscription?: any, e?: any, ...rest: any[]): any => {
    var exceptionData: any = this.utils.parseException(e);
    var errorText: any = exceptionData.name;
    if (exceptionData.message) {
        errorText += ': ' + exceptionData.message;
    }
    this.onError(errorText);
  };
}
