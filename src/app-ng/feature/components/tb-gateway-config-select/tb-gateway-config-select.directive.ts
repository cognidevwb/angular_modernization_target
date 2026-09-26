import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { ENTER } from '@angular/cdk/keycodes';
import { isEqual } from 'lodash-es';

import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbGatewayConfigSelect` (module `thingsboard.directives.gatewayConfigSelect`) in src/app/components/gateway/gateway-config-select.directive.js:27.
 */
@Component({
  selector: 'tb-gateway-config-select',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  providers: ngModelProviders(TbGatewayConfigSelectDirective),
  template: `
    <div class="tb-gateway-config-select" style="display: flex; flex-direction: column;">
      <mat-form-field class="mat-block">
        <input matInput
               [(ngModel)]="gatewaySearchText"
               [matAutocomplete]="auto"
               [required]="tbRequired()"
               [disabled]="!gatewayList()?.length"
               (keydown)="gatewayNameEnter($event)"
               placeholder="{{ 'gateway.gateway' | translate }}">
        <mat-autocomplete #auto="matAutocomplete" (optionSelected)="onGatewaySelected($event)">
          @for (item of gatewayNameSearch(gatewaySearchText); track item) {
            <mat-option [value]="item">{{ item.name }}</mat-option>
          }
          @if (!gatewayNameSearch(gatewaySearchText)?.length) {
            <mat-option [disabled]="true">
              {{ 'gateway.no-gateways-matching' | translate:{gateway: gatewaySearchText} }}
              @if (!textIsEmpty(gatewaySearchText)) {
                <a (click)="createNewGatewayDialog($event, gatewaySearchText)">
                  {{ 'gateway.create-new-gateway' | translate }}
                </a>
              }
            </mat-option>
          }
        </mat-autocomplete>
      </mat-form-field>
    </div>
  `,
})
export class TbGatewayConfigSelectDirective extends NgModelController {
  readonly tbRequired = model<boolean>(false);
  readonly gatewayList = model<any>();
  readonly getAccessToken = model<any>();
  readonly createDevice = model<any>();
  readonly theForm = model<any>();

  protected readonly translate = inject(TranslateService);

  gatewaySearchText: any = '';

  private watchingGateway = false;
  private _gateway: any = null;

  get gateway(): any {
    return this._gateway;
  }

  set gateway(value: any) {
    const prevVal = this._gateway;
    this._gateway = value;
    if (this.watchingGateway && !isEqual(value, prevVal) && value !== null) {
      this.updateView();
    }
  }

  override $render(): void {
    if (this.$viewValue) {
      this.gateway = this.$viewValue;
      this.startWatchers();
    }
  }

  onGatewaySelected(event: MatAutocompleteSelectedEvent): void {
    this.gateway = event.option.value;
    this.updateView();
  }

  updateValidity(...rest: any[]): any {
    var value: any = this.$viewValue;
    var valid: any = (value !== undefined) && value != null || !this.tbRequired();
    this.$setValidity('gateway', valid);
  }

  startWatchers(...rest: any[]): any {
    this.watchingGateway = true;
  }

  gatewayNameSearch(gatewaySearchText?: any, ...rest: any[]): any {
    return gatewaySearchText ? this.gatewayList().filter(
        this.createFilterForGatewayName(gatewaySearchText)) : this.gatewayList();
  }

  createFilterForGatewayName(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = query.toLowerCase();
    return function filterFn(device?: any) {
        return (device.name.toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  updateView(...rest: any[]): any {
    this.$setViewValue(this.gateway);
    this.updateValidity();
    this.getAccessToken()(this.gateway.id);
  }

  textIsEmpty(str?: any, ...rest: any[]): any {
    return (!str || 0 === str.length);
  }

  gatewayNameEnter($event?: any, ...rest: any[]): any {
    if ($event.keyCode === ENTER) {
        $event.preventDefault();
        let indexRes: any = this.gatewayList().findIndex((element?: any) => element.key === this.gatewaySearchText);
        if (indexRes === -1) {
            this.createNewGatewayDialog($event, this.gatewaySearchText);
        }
    }
  }

  createNewGatewayDialog($event?: any, deviceName?: any, ...rest: any[]): any {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any = this.translate.instant('gateway.create-new-gateway');
    var content: any = this.translate.instant('gateway.create-new-gateway-text', {gatewayName: deviceName});
    if (window.confirm(title + '\n' + content)) {
        let deviceObj: any = {
            name: deviceName,
            type: "Gateway",
            additionalInfo: {
                gateway: true
            }
        };
        this.createDevice()(deviceObj);
    } else {
        this.gatewaySearchText = "";
    }
  }
}
