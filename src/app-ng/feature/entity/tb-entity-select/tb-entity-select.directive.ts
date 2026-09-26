import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntityTypeSelectDirective } from '../tb-entity-type-select/tb-entity-type-select.directive';
import { TbEntityAutocompleteDirective } from '../tb-entity-autocomplete/tb-entity-autocomplete.directive';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntitySelect` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-select',
  standalone: true,
  imports: [FormsModule, forwardRef(() => TbEntityTypeSelectDirective), forwardRef(() => TbEntityAutocompleteDirective)],
  templateUrl: './tb-entity-select.directive.html',
})
export class TbEntitySelectDirective {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly allowedEntityTypes = model<any>();
  readonly useAliasEntityTypes = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
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

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
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
    ngModelCtrl.$render = function () {
            this.destroyWatchers();
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                this.model.entityType = value.entityType;
                this.model.entityId = value.id;
            } else {
                this.model.entityType = this.defaultEntityType;
                this.model.entityId = null;
            }
            this.initWatchers();
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        var value: any = ngModelCtrl.$viewValue;
        if (this.model && this.model.entityType &&
            (this.model.entityId || this.model.entityType === this.entityTypeCurrentTenant)) {
            if (!value) {
                value = {};
            }
            value.entityType = this.model.entityType;
            value.id = this.model.entityId;
            ngModelCtrl.$setViewValue(value);
        } else {
            ngModelCtrl.$setViewValue(null);
        }
    }
  }

  initWatchers(...rest: any[]): any {
    this.entityTypeDeregistration = this.$watch('model.entityType', (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal)) {
            this.updateView();
        }
    });

    this.entityIdDeregistration = this.$watch('model.entityId', (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal)) {
            this.updateView();
        }
    });

    this.disabledDeregistration = this.$watch('disabled', (newVal?: any, prevVal?: any) => {
        if (!angular.equals(newVal, prevVal)) {
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
