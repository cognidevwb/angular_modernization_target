import { Component, inject, input, model } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { DashboardService } from '../../api/services/dashboard.service';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbDashboardSelect` (module `thingsboard.directives.dashboardSelect`) in src/app/components/dashboard-select.directive.js:31.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-dashboard-select',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbDashboardSelectDirective {
  readonly dashboardsScope = input<any>();
  readonly customerId = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly dashboardService = inject(DashboardService);
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);

  protected template: any = dashboardSelectTemplate;
  dashboardId: any = null;
  protected pageLink: any = {limit: 100};
  protected promise: any;
  $watch: any;
  dashboards: any;
  panelRef: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    if (this.dashboardsScope() === 'customer' || this.userService.getAuthority() === 'CUSTOMER_USER') {
            if (this.customerId() && this.customerId() != types.id.nullUid) {
                this.promise = this.dashboardService.getCustomerDashboards(this.customerId(), this.pageLink, {ignoreLoading: true});
            } else {
                this.promise = Promise.resolve({data: []});
            }
        } else {
            this.promise = this.dashboardService.getTenantDashboards(this.pageLink, {ignoreLoading: true});
        }
    this.promise.then((result?: any) => {
            this.dashboards = result.data;
        }, () => {
            this.dashboards = [];
        });
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                this.dashboardId = ngModelCtrl.$viewValue;
            } else {
                this.dashboardId = null;
            }
        }
    this.$watch('dashboardId', () => {
            this.updateView();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateView(...rest: any[]): any {
    ngModelCtrl.$setViewValue(this.dashboardId);
  }

  openDashboardSelectPanel(event?: any, ...rest: any[]): any {
    let vm = this;
    if (this.disabled()) {
        return;
    }
    var position: any;
    var panelHeight: any = window.matchMedia('min-height: 350px').matches ? 250 : 150;
    var panelWidth: any = 300;
    var offset: any = this.element.nativeElement.getBoundingClientRect();
    var bottomY: any = offset.bottom - $(window).scrollTop(); //eslint-disable-line
    var leftX: any = offset.left - $(window).scrollLeft(); //eslint-disable-line
    var yPosition: any;
    var xPosition: any;
    if (bottomY + panelHeight > $( window ).height()) { //eslint-disable-line
        yPosition = (this.overlay as any).yPosition.ABOVE;
    } else {
        yPosition = (this.overlay as any).yPosition.BELOW;
    }
    if (leftX + panelWidth > $( window ).width()) { //eslint-disable-line
        xPosition = (this.overlay as any).xPosition.CENTER;
    } else {
        xPosition = (this.overlay as any).xPosition.ALIGN_START;
    }
    position = (this.overlay as any).newPanelPosition()
        .relativeTo($(this.element.nativeElement))
        .addPanelPosition(xPosition, yPosition);
    var config: any = {
        attachTo: $(this.document.body),
        controller: 'DashboardSelectPanelController',
        controllerAs: 'vm',
        templateUrl: '',
        panelClass: 'tb-dashboard-select-panel',
        position: position,
        fullscreen: false,
        locals: {
            dashboards: this.dashboards,
            dashboardId: this.dashboardId,
            onDashboardSelected: (dashboardId?: any, ...rest: any[]) => {
                if (this.panelRef) {
                    this.panelRef.close();
                }
                this.dashboardId = dashboardId;
            }
        },
        openFrom: event,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false
    };
    (this.overlay as any).open(config).then((result?: any) => {
        this.panelRef = result;
    });
  }
}
