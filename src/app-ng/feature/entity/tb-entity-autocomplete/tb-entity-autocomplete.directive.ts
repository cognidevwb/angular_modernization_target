import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
// @ts-ignore
import entityAutocompleteTemplate from '../../../../app/entity/entity-autocomplete.tpl.html';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntityAutocomplete` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './tb-entity-autocomplete.directive.html',
})
export class TbEntityAutocompleteDirective {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly entityType = model<any>();
  readonly entitySubtype = model<any>();
  readonly excludeEntityIds = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template, md-not-found
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × md-not-found left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(entityAutocompleteTemplate);
  entity: any = null;
  entitySearchText: any = '';
  $watch: any;
  entityRequiredText: any;
  entityText: any;
  noEntitiesMatchingText: any;
  selectEntityText: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                var targetType: any = this.entityType();
                if (targetType == types.aliasEntityType.current_customer) {
                    targetType = types.entityType.customer;
                }
                this.entityService.getEntity(targetType, ngModelCtrl.$viewValue).then(
                    (entity?: any) => {
                        this.entity = entity;
                    },
                    () => {
                        this.entity = null;
                    }
                );
            } else {
                this.entity = null;
            }
        }
    this.$watch('entityType', () => {
            this.load();
        });
    this.$watch('entitySubtype', () => {
            if (this.entity && this.entity.type != this.entitySubtype()) {
                this.entity = null;
                this.updateView();
            }
        });
    this.$watch('entity', (newVal?: any, prevVal?: any) => {
            if (!angular.equals(newVal, prevVal)) {
                this.updateView();
            }
        });
    this.$watch('disabled', (newVal?: any, prevVal?: any) => {
            if (!angular.equals(newVal, prevVal)) {
                this.updateView();
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  fetchEntities(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var limit: any = 50;
    if (this.excludeEntityIds() && this.excludeEntityIds().length) {
        limit += this.excludeEntityIds().length;
    }
    var targetType: any = this.entityType();
    if (targetType == types.aliasEntityType.current_customer) {
        targetType = types.entityType.customer;
    }

    this.entityService.getEntitiesByNameFilter(targetType, searchText, limit, {ignoreLoading: true}, this.entitySubtype()).then((result?: any) => {
        if (result) {
            if (this.excludeEntityIds() && this.excludeEntityIds().length) {
                var entities: any = [];
                result.forEach((entity?: any) => {
                    if (this.excludeEntityIds().indexOf(entity.id.id) == -1) {
                        entities.push(entity);
                    }
                });
                deferred.resolve(entities);
            } else {
                deferred.resolve(result);
            }
        } else {
            deferred.resolve([]);
        }
    }, function fail() {
        deferred.reject();
    });
    return deferred.promise;
  }

  entitySearchTextChanged(...rest: any[]): any {
          }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        ngModelCtrl.$setViewValue(this.entity ? this.entity.id.id : null);
    }
  }

  load(...rest: any[]): any {
    switch (this.entityType()) {
        case types.entityType.asset:
            this.selectEntityText = 'asset.select-asset';
            this.entityText = 'asset.asset';
            this.noEntitiesMatchingText = 'asset.no-assets-matching';
            this.entityRequiredText = 'asset.asset-required';
            break;
        case types.entityType.device:
            this.selectEntityText = 'device.select-device';
            this.entityText = 'device.device';
            this.noEntitiesMatchingText = 'device.no-devices-matching';
            this.entityRequiredText = 'device.device-required';
            break;
        case types.entityType.entityView:
            this.selectEntityText = 'entity-view.select-entity-view';
            this.entityText = 'entity-view.entity-view';
            this.noEntitiesMatchingText = 'entity-view.no-entity-views-matching';
            this.entityRequiredText = 'entity-view.entity-view-required';
            break;
        case types.entityType.rulechain:
            this.selectEntityText = 'rulechain.select-rulechain';
            this.entityText = 'rulechain.rulechain';
            this.noEntitiesMatchingText = 'rulechain.no-rulechains-matching';
            this.entityRequiredText = 'rulechain.rulechain-required';
            break;
        case types.entityType.tenant:
            this.selectEntityText = 'tenant.select-tenant';
            this.entityText = 'tenant.tenant';
            this.noEntitiesMatchingText = 'tenant.no-tenants-matching';
            this.entityRequiredText = 'tenant.tenant-required';
            break;
        case types.entityType.customer:
            this.selectEntityText = 'customer.select-customer';
            this.entityText = 'customer.customer';
            this.noEntitiesMatchingText = 'customer.no-customers-matching';
            this.entityRequiredText = 'customer.customer-required';
            break;
        case types.entityType.user:
            this.selectEntityText = 'user.select-user';
            this.entityText = 'user.user';
            this.noEntitiesMatchingText = 'user.no-users-matching';
            this.entityRequiredText = 'user.user-required';
            break;
        case types.entityType.dashboard:
            this.selectEntityText = 'dashboard.select-dashboard';
            this.entityText = 'dashboard.dashboard';
            this.noEntitiesMatchingText = 'dashboard.no-dashboards-matching';
            this.entityRequiredText = 'dashboard.dashboard-required';
            break;
        case types.entityType.alarm:
            this.selectEntityText = 'alarm.select-alarm';
            this.entityText = 'alarm.alarm';
            this.noEntitiesMatchingText = 'alarm.no-alarms-matching';
            this.entityRequiredText = 'alarm.alarm-required';
            break;
        case types.aliasEntityType.current_customer:
            this.selectEntityText = 'customer.select-default-customer';
            this.entityText = 'customer.default-customer';
            this.noEntitiesMatchingText = 'customer.no-customers-matching';
            this.entityRequiredText = 'customer.default-customer-required';
            break;
    }
    if (this.entity && this.entity.id.entityType != this.entityType()) {
        this.entity = null;
        this.updateView();
    }
  }
}
