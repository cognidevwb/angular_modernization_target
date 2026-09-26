import { Component, DestroyRef, ElementRef, inject, model, effect, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import $ from 'jquery';

/**
 * Ported from the AngularJS directive `tbSwitch` (module `thingsboard.widgets.rpc.switch`) in src/app/widget/lib/rpc/switch.directive.js:24.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-switch',
  standalone: true,
  imports: [MatSlideToggleModule, CommonModule, FormsModule],
  templateUrl: './tb-switch.directive.html',
})
export class TbSwitchDirective {
  readonly ctx = model<any>();

  protected error = '';
  protected showTitle = false;
  protected title = '';
  protected value = false;
  protected showOnOffLabels = true;

  private isSimulated = false;
  private requestTimeout = 500;
  private retrieveValueMethod = 'rpc';
  private valueKey = 'value';
  private parseValueFunction: (data?: any) => any = (data?: any) => data ? true : false;
  private convertValueFunction: (value?: any) => any = (value?: any) => value;
  private getValueMethod = 'getValue';
  private setValueMethod = 'setValue';
  private valueSubscription: any = null;
  private executingUpdateValue = false;
  private scheduledValue: any = null;
  private rpcValue: any = null;

  private readonly switchAspectRation = 2.7893;

  private readonly elementRef = inject(ElementRef);
  private readonly destroyRef = inject(DestroyRef);

  constructor() {
    effect(() => {
      if (this.ctx()) {
        this.init();
      }
    });

    this.destroyRef.onDestroy(() => {
      if (this.valueSubscription) {
        this.ctx().subscriptionApi.removeSubscription(this.valueSubscription.id);
      }
    });
  }

  protected onValue(): void {
    this.rpcUpdateValue(this.value);
  }

  private init(): void {
    const ctx: any = this.ctx();
    this.title = ctx.settings.title !== undefined ? ctx.settings.title : '';
    this.showTitle = this.title && this.title.length ? true : false;
    this.showOnOffLabels = ctx.settings.showOnOffLabels !== undefined ? ctx.settings.showOnOffLabels : true;
    ctx.resize = () => this.resize();
    setTimeout(() => {
      this.resize();
    });
    const initialValue: any = ctx.settings.initialValue !== undefined ? ctx.settings.initialValue : false;
    this.setValue(initialValue);

    const subscription: any = ctx.defaultSubscription;
    const rpcEnabled: any = subscription.rpcEnabled;

    this.isSimulated = ctx.$scope?.widgetEditMode;

    this.requestTimeout = 500;
    if (ctx.settings.requestTimeout) {
      this.requestTimeout = ctx.settings.requestTimeout;
    }

    this.retrieveValueMethod = 'rpc';
    if (ctx.settings.retrieveValueMethod && ctx.settings.retrieveValueMethod.length) {
      this.retrieveValueMethod = ctx.settings.retrieveValueMethod;
    }

    this.valueKey = 'value';
    if (ctx.settings.valueKey && ctx.settings.valueKey.length) {
      this.valueKey = ctx.settings.valueKey;
    }

    this.parseValueFunction = (data?: any) => data ? true : false;
    if (ctx.settings.parseValueFunction && ctx.settings.parseValueFunction.length) {
      try {
        this.parseValueFunction = new Function('data', ctx.settings.parseValueFunction) as any;
      } catch (e) {
        this.parseValueFunction = (data?: any) => data ? true : false;
      }
    }

    this.convertValueFunction = (value?: any) => value;
    if (ctx.settings.convertValueFunction && ctx.settings.convertValueFunction.length) {
      try {
        this.convertValueFunction = new Function('value', ctx.settings.convertValueFunction) as any;
      } catch (e) {
        this.convertValueFunction = (value?: any) => value;
      }
    }

    this.getValueMethod = 'getValue';
    if (ctx.settings.getValueMethod && ctx.settings.getValueMethod.length) {
      this.getValueMethod = ctx.settings.getValueMethod;
    }
    this.setValueMethod = 'setValue';
    if (ctx.settings.setValueMethod && ctx.settings.setValueMethod.length) {
      this.setValueMethod = ctx.settings.setValueMethod;
    }
    if (!rpcEnabled) {
      this.onError('Target device is not set!');
    } else {
      if (!this.isSimulated) {
        if (this.retrieveValueMethod === 'rpc') {
          this.rpcRequestValue();
        } else if (this.retrieveValueMethod === 'attribute' || this.retrieveValueMethod === 'timeseries') {
          this.subscribeForValue();
        }
      }
    }
  }

  private resize(): void {
    const nativeElement = this.elementRef.nativeElement;
    const switchElement: any = $('.switch', nativeElement);
    const switchContainer: any = $('#switch-container', nativeElement);
    const mdSwitch: any = $('mat-slide-toggle', switchElement);
    const onoffContainer: any = $('.onoff-container', nativeElement);
    const onLabel: any = $('.on-label', nativeElement);
    const offLabel: any = $('.off-label', nativeElement);
    const switchTitleContainer: any = $('.title-container', nativeElement);
    const switchTitle: any = $('.switch-title', nativeElement);
    const textMeasure: any = $('#text-measure', nativeElement);
    const switchErrorContainer: any = $('.error-container', nativeElement);
    const switchError: any = $('.switch-error', nativeElement);

    let width: any = switchContainer.width();
    let height: any;
    if (this.showOnOffLabels) {
      height = switchContainer.height() * 2 / 3;
    } else {
      height = switchContainer.height();
    }
    const ratio: any = width / height;
    if (ratio > this.switchAspectRation) {
      width = height * this.switchAspectRation;
    } else {
      height = width / this.switchAspectRation;
    }
    switchElement.css({ width: width, height: height });
    mdSwitch.css('height', height + 'px');
    mdSwitch.css('width', width + 'px');
    mdSwitch.css('min-width', width + 'px');
    $('.md-container', mdSwitch).css('height', height + 'px');
    $('.md-container', mdSwitch).css('width', width + 'px');

    if (this.showTitle) {
      this.setFontSize(switchTitle, this.title, switchTitleContainer.height() * 2 / 3, switchTitleContainer.width(), textMeasure);
    }

    if (this.showOnOffLabels) {
      onoffContainer.css({ width: width, height: switchContainer.height() / 3 });
      this.setFontSize(onLabel, 'OFF', onoffContainer.height(), onoffContainer.width() / 2, textMeasure);
      this.setFontSize(offLabel, 'OFF', onoffContainer.height(), onoffContainer.width() / 2, textMeasure);
    }

    this.setFontSize(switchError, this.error, switchErrorContainer.height(), switchErrorContainer.width(), textMeasure);
  }

  private subscribeForValue(): void {
    const ctx: any = this.ctx();
    const types: any = ctx.types;
    const valueSubscriptionInfo: any = [{
      type: types.datasourceType.entity,
      entityType: types.entityType.device,
      entityId: ctx.defaultSubscription.targetDeviceId
    }];
    if (this.retrieveValueMethod === 'attribute') {
      valueSubscriptionInfo[0].attributes = [
        { name: this.valueKey }
      ];
    } else {
      valueSubscriptionInfo[0].timeseries = [
        { name: this.valueKey }
      ];
    }
    const subscriptionOptions: any = {
      callbacks: {
        onDataUpdated: (subscription?: any, apply?: any) => this.onDataUpdated(subscription, apply),
        onDataUpdateError: (subscription?: any, e?: any) => this.onDataUpdateError(subscription, e)
      }
    };
    ctx.subscriptionApi.createSubscriptionFromInfo(
      types.widgetType.latest.value, valueSubscriptionInfo, subscriptionOptions, false, true).then(
      (subscription?: any) => {
        this.valueSubscription = subscription;
      }
    );
  }

  private onDataUpdated(subscription?: any, apply?: any): void {
    let value: any = false;
    const data: any = subscription.data;
    if (data.length) {
      const keyData: any = data[0];
      if (keyData && keyData.data && keyData.data[0]) {
        const attrValue: any = keyData.data[0][1];
        if (attrValue) {
          let parsed: any = null;
          try {
            parsed = this.parseValueFunction(JSON.parse(attrValue));
          } catch (e) {/**/}
          value = parsed ? true : false;
        }
      }
    }
    this.setValue(value);
  }

  private onDataUpdateError(subscription?: any, e?: any): void {
    const ctx: any = this.ctx();
    const utils: any = ctx.utils;
    const exceptionData: any = utils.parseException(e);
    let errorText: any = exceptionData.name;
    if (exceptionData.message) {
      errorText += ': ' + exceptionData.message;
    }
    this.onError(errorText);
  }

  private setValue(value?: any): void {
    this.value = value ? true : false;
  }

  private onError(error?: any): void {
    this.error = error;
    const nativeElement = this.elementRef.nativeElement;
    const switchErrorContainer: any = $('.error-container', nativeElement);
    const switchError: any = $('.switch-error', nativeElement);
    const textMeasure: any = $('#text-measure', nativeElement);
    this.setFontSize(switchError, this.error, switchErrorContainer.height(), switchErrorContainer.width(), textMeasure);
  }

  private setFontSize(element: any, text: any, fontSize: any, maxWidth: any, textMeasure: any): void {
    let textWidth: any = this.measureTextWidth(text, fontSize, textMeasure);
    while (textWidth > maxWidth) {
      fontSize--;
      textWidth = this.measureTextWidth(text, fontSize, textMeasure);
    }
    element.css({ 'fontSize': fontSize + 'px', 'lineHeight': fontSize + 'px' });
  }

  private measureTextWidth(text: any, fontSize: any, textMeasure: any): any {
    textMeasure.css({ 'fontSize': fontSize + 'px', 'lineHeight': fontSize + 'px' });
    textMeasure.text(text);
    return textMeasure.width();
  }

  private rpcRequestValue(): void {
    this.error = '';
    const ctx: any = this.ctx();
    ctx.controlApi.sendTwoWayCommand(this.getValueMethod, null, this.requestTimeout).then(
      (responseBody?: any) => {
        this.setValue(this.parseValueFunction(responseBody));
      },
      () => {
        const errorText: any = ctx.defaultSubscription.rpcErrorText;
        this.onError(errorText);
      }
    );
  }

  private rpcUpdateValue(value?: any): void {
    if (this.executingUpdateValue) {
      this.scheduledValue = value;
      return;
    } else {
      this.scheduledValue = null;
      this.rpcValue = value;
      this.executingUpdateValue = true;
    }
    this.error = '';
    const ctx: any = this.ctx();
    ctx.controlApi.sendOneWayCommand(this.setValueMethod, this.convertValueFunction(value), this.requestTimeout).then(
      () => {
        this.executingUpdateValue = false;
        if (this.scheduledValue != null && this.scheduledValue != this.rpcValue) {
          this.rpcUpdateValue(this.scheduledValue);
        }
      },
      () => {
        this.executingUpdateValue = false;
        const errorText: any = ctx.defaultSubscription.rpcErrorText;
        this.onError(errorText);
      }
    );
  }
}
