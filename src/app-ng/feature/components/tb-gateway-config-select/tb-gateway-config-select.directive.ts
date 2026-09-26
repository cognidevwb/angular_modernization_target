import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

import $ from 'jquery';
// @ts-ignore
import gatewaySelectTemplate from '../../../../app/components/gateway/gateway-config-select.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $mdConstant: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbGatewayConfigSelect` (module `thingsboard.directives.gatewayConfigSelect`) in src/app/components/gateway/gateway-config-select.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-gateway-config-select',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbGatewayConfigSelectDirective {
  readonly tbRequired = model<any>();
  readonly gatewayList = model<any>();
  readonly getAccessToken = model<any>();
  readonly createDevice = model<any>();
  readonly theForm = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$mdConstant' — key codes: @angular/cdk/keycodes
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly element = inject(ElementRef);

  protected template: any = gatewaySelectTemplate;
  gateway: any = null;
  gatewaySearchText: any = '';
  $watch: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                this.gateway = ngModelCtrl.$viewValue;
                this.startWatchers();
            }
        };
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateValidity(...rest: any[]): any {
    var value: any = ngModelCtrl.$viewValue;
    var valid: any = (value !== undefined) && value != null || !this.tbRequired();
    ngModelCtrl.$setValidity('gateway', valid);
  }

  startWatchers(...rest: any[]): any {
    this.$watch('gateway', (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal) && newVal !== null) {
            this.updateView();
        }
    });
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
    ngModelCtrl.$setViewValue(this.gateway);
    this.updateValidity();
    this.getAccessToken()(this.gateway.id);
  }

  textIsEmpty(str?: any, ...rest: any[]): any {
    return (!str || 0 === str.length);
  }

  gatewayNameEnter($event?: any, ...rest: any[]): any {
    if ($event.keyCode === $mdConstant.KEY_CODE.ENTER) {
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
    var confirm: any = (this.dialog as any).confirm()
        .targetEvent($event)
        .title(title)
        .htmlContent(content)
        .ariaLabel(title)
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    (this.dialog as any).show(confirm).then(
        () => {
            let deviceObj: any = {
                name: deviceName,
                type: "Gateway",
                additionalInfo: {
                    gateway: true
                }
            };
            this.createDevice()(deviceObj);
        },
        () => {
            this.gatewaySearchText = "";
        }
    );
  }
}
