import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntityTypeSelectDirective } from '../tb-entity-type-select/tb-entity-type-select.directive';
import { TbEntityAutocompleteDirective } from '../tb-entity-autocomplete/tb-entity-autocomplete.directive';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntitySelect` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-select',
  standalone: true,
  imports: [FormsModule, forwardRef(() => TbEntityTypeSelectDirective), forwardRef(() => TbEntityAutocompleteDirective)],
  templateUrl: './tb-entity-select.directive.html',
  providers: ngModelProviders(TbEntitySelectDirective),
})
export class TbEntitySelectDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly allowedEntityTypes = model<any>();
  readonly useAliasEntityTypes = model<any>();

  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);

  entityTypeCurrentTenant: any = types.aliasEntityType.current_tenant;
  protected entityTypes: any;
  protected entityTypeKeys: any;
  model: any;
  $watch: any;
  defaultEntityType: any;
  disabledDeregistration: any;
  displayEntityTypeSelect: any;
  entityIdDeregistration: any;
  entityTypeDeregistration: any;

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.entityTypes = this.entityService.prepareAllowedEntityTypesList(this.allowedEntityTypes(), this.useAliasEntityTypes());
    this.entityTypeKeys = Object.keys(this.entityTypes);
    if (this.entityTypeKeys.length === 1) {
            this.displayEntityTypeSelect = false;
            this.defaultEntityType = this.entityTypes[this.entityTypeKeys[0]];
        } else {
            this.displayEntityTypeSelect = true;
        }
    this.model = {
            entityType: this.defaultEntityType
        };
  }

  $render(): void {
    this.destroyWatchers();
    if (this.$viewValue) {
        const value: any = this.$viewValue;
        this.model.entityType = value.entityType;
        this.model.entityId = value.id;
    } else {
        this.model.entityType = this.defaultEntityType;
        this.model.entityId = null;
    }
    this.initWatchers();
  }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        var value: any = this.$viewValue;
        if (this.model && this.model.entityType &&
            (this.model.entityId || this.model.entityType === this.entityTypeCurrentTenant)) {
            if (!value) {
                value = {};
            }
            value.entityType = this.model.entityType;
            value.id = this.model.entityId;
            this.$setViewValue(value);
        } else {
            this.$setViewValue(null);
        }
    }
  }

  initWatchers(...rest: any[]): any {
    this.entityTypeDeregistration = this.$watch('model.entityType', (newVal?: any, prevVal?: any) => {
        if (!isEqual(newVal, prevVal)) {
            this.updateView();
        }
    });

    this.entityIdDeregistration = this.$watch('model.entityId', (newVal?: any, prevVal?: any) => {
        if (!isEqual(newVal, prevVal)) {
            this.updateView();
        }
    });

    this.disabledDeregistration = this.$watch('disabled', (newVal?: any, prevVal?: any) => {
        if (!isEqual(newVal, prevVal)) {
            this.updateView();
        }
    });
  }

  destroyWatchers(...rest: any[]): any {
    if (this.entityTypeDeregistration) {
        this.entityTypeDeregistration();
        this.entityTypeDeregistration = null;
    }
    if (this.entityIdDeregistration) {
        this.entityIdDeregistration();
        this.entityIdDeregistration = null;
    }
    if (this.disabledDeregistration) {
        this.disabledDeregistration();
        this.disabledDeregistration = null;
    }
  }
}
