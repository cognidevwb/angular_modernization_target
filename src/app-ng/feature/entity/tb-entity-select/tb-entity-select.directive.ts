import { Component, OnInit, effect, forwardRef, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { isEqual } from 'lodash-es';
import { EntityService } from '../../api/services/entity.service';
import { types } from '../../common/constants/types';
import { TbEntityTypeSelectDirective } from '../tb-entity-type-select/tb-entity-type-select.directive';
import { TbEntityAutocompleteDirective } from '../tb-entity-autocomplete/tb-entity-autocomplete.directive';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntitySelect` (module `thingsboard.entity`) in src/app/entity/entity-select.directive.js:
 * an entity type select plus an entity autocomplete; `[(ngModel)]` is the entity id `{entityType, id}` (null until both are
 * chosen). A required, empty value makes the host form invalid (the legacy inner controls' `required` in the host form).
 */
@Component({
  selector: 'tb-entity-select',
  standalone: true,
  imports: [FormsModule, forwardRef(() => TbEntityTypeSelectDirective), forwardRef(() => TbEntityAutocompleteDirective)],
  templateUrl: './tb-entity-select.directive.html',
  providers: ngModelProviders(TbEntitySelectDirective),
})
export class TbEntitySelectDirective extends NgModelController implements OnInit {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>(false);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly allowedEntityTypes = model<any>();
  readonly useAliasEntityTypes = model<any>();

  protected readonly entityService = inject(EntityService);

  entityTypeCurrentTenant: any = types.aliasEntityType.current_tenant;
  protected entityTypes: any;
  protected entityTypeKeys: string[] = [];
  model: any = {};
  defaultEntityType: any;
  displayEntityTypeSelect = true;
  /** The legacy watchers ran from the first `$render` on. */
  private watching = false;
  private prevDisabled: any;

  constructor() {
    super();
    // scope.$watch('disabled', …)
    effect(() => {
      const disabled = this.disabled();
      if (this.watching && !isEqual(disabled, this.prevDisabled)) {
        this.updateView();
      }
      this.prevDisabled = disabled;
    });
    effect(() => {
      this.tbRequired();
      this.validateRequired();
    });
  }

  ngOnInit(): void {
    this.entityTypes = this.entityService.prepareAllowedEntityTypesList(this.allowedEntityTypes(), this.useAliasEntityTypes());
    this.entityTypeKeys = Object.keys(this.entityTypes);
    if (this.entityTypeKeys.length === 1) {
      this.displayEntityTypeSelect = false;
      this.defaultEntityType = this.entityTypes[this.entityTypeKeys[0]];
    } else {
      this.displayEntityTypeSelect = true;
    }
    if (!this.watching) {
      this.model = { entityType: this.defaultEntityType };
    } else if (!this.model.entityType) {
      this.model.entityType = this.defaultEntityType;
    }
  }

  override $render(): void {
    if (this.$viewValue) {
      const value: any = this.$viewValue;
      this.model.entityType = value.entityType;
      this.model.entityId = value.id;
    } else {
      this.model.entityType = this.defaultEntityType;
      this.model.entityId = null;
    }
    this.watching = true;
    this.validateRequired();
  }

  /** `scope.$watch('model.entityType', …)`. */
  setEntityType(entityType: any): void {
    const prev = this.model.entityType;
    this.model.entityType = entityType;
    if (this.watching && !isEqual(entityType, prev)) {
      this.updateView();
    }
  }

  /** `scope.$watch('model.entityId', …)`. */
  setEntityId(entityId: any): void {
    const prev = this.model.entityId;
    this.model.entityId = entityId;
    if (this.watching && !isEqual(entityId, prev)) {
      this.updateView();
    }
  }

  updateView(): void {
    if (!this.disabled()) {
      let value: any = this.$viewValue;
      if (this.model && this.model.entityType && (this.model.entityId || this.model.entityType === this.entityTypeCurrentTenant)) {
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
    this.validateRequired();
  }

  private validateRequired(): void {
    const valid = !(this.tbRequired() && !this.$viewValue);
    if (valid !== !this.$error['required']) {
      this.$setValidity('required', valid);
    }
  }
}
