import { Component, effect, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntityAutocomplete` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-entity-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './tb-entity-autocomplete.directive.html',
  providers: ngModelProviders(TbEntityAutocompleteDirective),
})
export class TbEntityAutocompleteDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly entityType = model<any>();
  readonly entitySubtype = model<any>();
  readonly excludeEntityIds = model<any>();

  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);

  entity: any = null;
  entitySearchText: any = '';
  entityRequiredText: any;
  entityText: any;
  noEntitiesMatchingText: any;
  selectEntityText: any;
  filteredEntities: any[] = [];
  displayEntityFn = (entity: any) => entity ? entity.name : '';

  private prevDisabled: any;

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    effect(() => {
      this.entityType();
      this.load();
    });
    effect(() => {
      const subtype = this.entitySubtype();
      if (this.entity && this.entity.type != subtype) {
        this.entity = null;
        this.updateView();
      }
    });
    effect(() => {
      const disabled = this.disabled();
      if (!isEqual(disabled, this.prevDisabled)) {
        this.updateView();
      }
      this.prevDisabled = disabled;
    });
  }

  override $render(): void {
    if (this.$viewValue) {
      let targetType: any = this.entityType();
      if (targetType == types.aliasEntityType.current_customer) {
        targetType = types.entityType.customer;
      }
      this.entityService.getEntity(targetType, this.$viewValue).then(
        (entity?: any) => {
          this.entity = entity;
          this.updateView();
        },
        () => {
          this.entity = null;
          this.updateView();
        }
      );
    } else {
      this.entity = null;
    }
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
    this.fetchEntities(this.entitySearchText).then((entities: any[]) => {
        this.filteredEntities = entities || [];
    });
  }

  onEntitySelected(event: any): void {
    this.entity = event.option.value;
    this.updateView();
  }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        this.$setViewValue(this.entity ? this.entity.id.id : null);
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
