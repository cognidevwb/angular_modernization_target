import { Component, forwardRef, inject, model } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntitySelectDirective } from '../tb-entity-select/tb-entity-select.directive';
import { TbEntityTypeSelectDirective } from '../tb-entity-type-select/tb-entity-type-select.directive';
import { TbEntityListDirective } from '../tb-entity-list/tb-entity-list.directive';
import { TbEntitySubtypeAutocompleteDirective } from '../tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';
import { TbRelationFiltersDirective } from '../tb-relation-filters/tb-relation-filters.directive';
import { TbRelationTypeAutocompleteDirective } from '../tb-relation-type-autocomplete/tb-relation-type-autocomplete.directive';
import { TbEntitySubtypeListDirective } from '../tb-entity-subtype-list/tb-entity-subtype-list.directive';

import $ from 'jquery';
import entityFilterTemplate from '../../../../app/entity/entity-filter.tpl.html?raw';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntityFilter` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-filter',
  standalone: true,
  imports: [TranslatePipe, MatSlideToggleModule, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule, forwardRef(() => TbEntitySelectDirective), forwardRef(() => TbEntityTypeSelectDirective), forwardRef(() => TbEntityListDirective), forwardRef(() => TbEntitySubtypeAutocompleteDirective), forwardRef(() => TbRelationFiltersDirective), forwardRef(() => TbRelationTypeAutocompleteDirective), forwardRef(() => TbEntitySubtypeListDirective)],
  templateUrl: './tb-entity-filter.directive.html',
})
export class TbEntityFilterDirective {
  readonly theForm = model<any>();
  readonly allowedEntityTypes = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  protected readonly typesRef: any = types;
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 2 × ng-message left in place
  // TODO(port): template: 2 × ng-messages left in place

  protected template: any = $templateCache.get(entityFilterTemplate);
  ngModelCtrl: any = ngModelCtrl;
  types: any;
  aliasFilterTypes: any;
  $watch: any;
  filter: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.aliasFilterTypes = this.entityService.getAliasFilterTypesByEntityTypes(this.allowedEntityTypes());
    this.$watch('filter.type', (newType?: any, prevType?: any) => {
            if (newType && newType != prevType) {
                this.updateFilter();
            }
        });
    this.$watch('filter', () => {
            this.updateView();
        });
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                this.filter = ngModelCtrl.$viewValue;
            } else {
                this.filter = {
                    type: null,
                    resolveMultiple: false
                }
            }
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateFilter(...rest: any[]): any {
    var filter: any = {};
    filter.type = this.filter.type;
    filter.resolveMultiple = true;
    switch (filter.type) {
        case this.typesRef.aliasFilterType.singleEntity.value:
            filter.singleEntity = null;
            filter.resolveMultiple = false;
            break;
        case this.typesRef.aliasFilterType.entityList.value:
            filter.entityType = null;
            filter.entityList = [];
            break;
        case this.typesRef.aliasFilterType.entityName.value:
            filter.entityType = null;
            filter.entityNameFilter = '';
            break;
        case this.typesRef.aliasFilterType.stateEntity.value:
            filter.stateEntityParamName = null;
            filter.defaultStateEntity = null;
            filter.resolveMultiple = false;
            break;
        case this.typesRef.aliasFilterType.assetType.value:
            filter.assetType = null;
            filter.assetNameFilter = '';
            break;
        case this.typesRef.aliasFilterType.deviceType.value:
            filter.deviceType = null;
            filter.deviceNameFilter = '';
            break;
        case this.typesRef.aliasFilterType.entityViewType.value:
            filter.entityViewType = null;
            filter.entityViewNameFilter = '';
            break;
        case this.typesRef.aliasFilterType.relationsQuery.value:
        case this.typesRef.aliasFilterType.assetSearchQuery.value:
        case this.typesRef.aliasFilterType.deviceSearchQuery.value:
        case this.typesRef.aliasFilterType.entityViewSearchQuery.value:
            filter.rootStateEntity = false;
            filter.stateEntityParamName = null;
            filter.defaultStateEntity = null;
            filter.rootEntity = null;
            filter.direction = this.typesRef.entitySearchDirection.from;
            filter.maxLevel = 1;
            filter.fetchLastLevelOnly = false;
            if (filter.type === this.typesRef.aliasFilterType.relationsQuery.value) {
                filter.filters = [];
            } else if (filter.type === this.typesRef.aliasFilterType.assetSearchQuery.value) {
                filter.relationType = null;
                filter.assetTypes = [];
            } else if (filter.type === this.typesRef.aliasFilterType.deviceSearchQuery.value) {
                filter.relationType = null;
                filter.deviceTypes = [];
            } else if (filter.type === this.typesRef.aliasFilterType.entityViewSearchQuery.value) {
                filter.relationType = null;
                filter.entityViewTypes = [];
            }
            break;
    }
    this.filter = filter;
  }

  updateView(...rest: any[]): any {
    ngModelCtrl.$setViewValue(this.filter);
  }
}
