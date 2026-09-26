import { Component, inject, input, model } from '@angular/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { ElementRef } from '@angular/core';
import { UserService } from '../../api/services/user.service';

import $ from 'jquery';
import { isEqual } from 'lodash-es';
import { $q } from '../../../core/q';
declare function require(id: string): any;
const dashboardAutocompleteTemplate: string = require('../../../../app/components/dashboard-autocomplete.tpl.html');
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbDashboardAutocomplete` (module `thingsboard.directives.dashboardAutocomplete`) in src/app/components/dashboard-autocomplete.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-dashboard-autocomplete',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbDashboardAutocompleteDirective {
  readonly dashboardsScope = input<any>();
  readonly tenantId = model<any>();
  readonly customerId = model<any>();
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly selectFirstDashboard = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly dashboardService = inject(DashboardService);
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);

  protected template: any = dashboardAutocompleteTemplate;
  dashboard: any = null;
  dashboardSearchText: any = '';
  $watch: any;
  dashboardFetchFunction: any;
  writeValue: any;
  onChange: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.writeValue = (value: any) => {
            if (value) {
                this.dashboardService.getDashboardInfo(value).then(
                    (dashboard?: any) => {
                        this.dashboard = dashboard;
                        this.startWatchers();
                    },
                    () => {
                        this.dashboard = null;
                        this.updateView();
                        this.startWatchers();
                    }
                );
            } else {
                this.dashboard = null;
                this.startWatchers();
            }
        }
    if (this.selectFirstDashboard()) {
            var pageLink: any = {limit: 1, textSearch: ''};
            this.dashboardFetchFunction(pageLink).then((result?: any) => {
                var dashboards: any = result.data;
                if (dashboards.length > 0) {
                    this.dashboard = dashboards[0];
                    this.updateView();
                }
            }, function fail() {
            });
        }
    if (this.selectFirstDashboard()) {
            var pageLink: any = {limit: 1, textSearch: ''};
            this.dashboardFetchFunction(pageLink).then((result?: any) => {
                var dashboards: any = result.data;
                if (dashboards.length > 0) {
                    this.dashboard = dashboards[0];
                    this.updateView();
                }
            }, function fail() {
            });
        }
    $(this.element.nativeElement).contents();
  }

  fetchDashboards(searchText?: any, ...rest: any[]): any {
    var pageLink: any = {limit: 50, textSearch: searchText};

    var deferred: any = {};
    deferred.promise = new Promise((resolve, reject) => { deferred.resolve = resolve; deferred.reject = reject; });

    var promise: any;
    if (this.dashboardsScope() === 'customer' || this.userService.getAuthority() === 'CUSTOMER_USER') {
        if (this.customerId()) {
            promise = this.dashboardService.getCustomerDashboards(this.customerId(), pageLink, {ignoreLoading: true});
        } else {
            promise = Promise.resolve({data: []});
        }
    } else {
        if (this.userService.getAuthority() === 'SYS_ADMIN') {
            if (this.tenantId()) {
                promise = this.dashboardService.getTenantDashboardsByTenantId(this.tenantId(), pageLink, {ignoreLoading: true});
            } else {
                promise = Promise.resolve({data: []});
            }
        } else {
            promise = this.dashboardService.getTenantDashboards(pageLink, {ignoreLoading: true});
        }
    }

    promise.then(function success(result?: any) {
        deferred.resolve(result.data);
    }, function fail() {
        deferred.reject();
    });

    return deferred.promise;
  }

  dashboardSearchTextChanged(...rest: any[]): any {
          }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        this.onChange(this.dashboard ? this.dashboard.id.id : null);
    }
  }

  startWatchers(...rest: any[]): any {
    this.$watch = this.$watch || {};
    if (!isEqual(this.dashboard, this.$watch.dashboard)) {
        this.$watch.dashboard = this.dashboard;
        this.updateView();
    }
    if (!isEqual(this.disabled(), this.$watch.disabled)) {
        this.$watch.disabled = this.disabled();
        this.updateView();
    }
  }
}
