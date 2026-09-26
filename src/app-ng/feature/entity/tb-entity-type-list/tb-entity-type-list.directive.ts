import { Component, inject, model, effect, DoCheck, ChangeDetectionStrategy } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { isEqual } from 'lodash-es';
import { $q } from '../../../core/q';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntityTypeList` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-entity-type-list',
  standalone: true,
  imports: [FormsModule, MatFormFieldModule, MatChipsModule, MatIconModule, MatAutocompleteModule, TranslatePipe],
  templateUrl: './tb-entity-type-list.directive.html',
  providers: ngModelProviders(TbEntityTypeListDirective),
})
export class TbEntityTypeListDirective extends NgModelController implements DoCheck {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly tbRequired = model<any>();
  readonly allowedEntityTypes = model<any>();
  readonly ignoreAuthorityFilter = model<any>();

  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly translate = inject(TranslateService);
  protected readonly entityService = inject(EntityService);
  // TODO(port): elements not resolved to a component: md-chips, md-autocomplete, md-item-template, md-not-found, md-chip-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-chip-template left in place
  // TODO(port): template: 1 × md-chips left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × md-not-found left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  placeholder: any;
  secondaryPlaceholder: any;
  protected entityTypes: any;
  entityTypesList: any = [];
  entityTypeList: any;
  inputTouched: any;
  entityTypeSearchText = '';
  private prevEntityTypeList: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  constructor() {
    super();
    effect(() => {
            this.updateValidity();
        });
  }

  ngOnInit(): void {
    // Reads its inputs: they are set after the constructor (the legacy link ran with the scope bound), so this runs in ngOnInit.
    this.placeholder = this.tbRequired() ? this.translate.instant('entity.enter-entity-type')
                                : this.translate.instant('entity.any-entity');
    this.secondaryPlaceholder = '+' + this.translate.instant('entity.entity-type');
    if (this.ignoreAuthorityFilter() && this.allowedEntityTypes()
            && this.allowedEntityTypes().length) {
            this.entityTypes = {};
            this.allowedEntityTypes().forEach((entityTypeValue?: any) => {
                var entityType: any = this.entityTypeFromValue(entityTypeValue);
                if (entityType) {
                    this.entityTypes[entityType] = entityTypeValue;
                }
            });
        } else {
            this.entityTypes = this.entityService.prepareAllowedEntityTypesList(this.allowedEntityTypes());
        }
    for (var type in this.entityTypes) {
            var entityTypeInfo: any = {};
            entityTypeInfo.value = this.entityTypes[type];
            entityTypeInfo.name = this.translate.instant(types.entityTypeTranslations[entityTypeInfo.value].type) + '';
            this.entityTypesList.push(entityTypeInfo);
        }
  }


  override $render(): void {
    const entityTypeList: any[] = [];
    const value: any = this.$viewValue;
    if (value && value.length) {
        value.forEach((type?: any) => {
            const entityTypeInfo: any = {};
            entityTypeInfo.value = type;
            entityTypeInfo.name = this.translate.instant(types.entityTypeTranslations[entityTypeInfo.value].type) + '';
            entityTypeList.push(entityTypeInfo);
        });
    }
    this.entityTypeList = entityTypeList;
  }

  ngDoCheck(): void {
    if (!isEqual(this.entityTypeList, this.prevEntityTypeList)) {
        this.prevEntityTypeList = this.entityTypeList ? JSON.parse(JSON.stringify(this.entityTypeList)) : this.entityTypeList;
        this.updateEntityTypeList();
    }
  }

  remove(entityType?: any): void {
    const index = this.entityTypeList ? this.entityTypeList.indexOf(entityType) : -1;
    if (index >= 0) {
        this.entityTypeList.splice(index, 1);
        this.updateEntityTypeList();
    }
  }

  onBlur(): void {
    this.inputTouched = true;
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    if (!this.entityTypeList) {
        this.entityTypeList = [];
    }
    this.entityTypeList.push(event.option.value);
    this.entityTypeSearchText = '';
    this.updateEntityTypeList();
  }

  entityTypeFromValue(entityTypeValue?: any, ...rest: any[]): any {
    for (var entityType in types.entityType) {
        if (types.entityType[entityType] === entityTypeValue) {
            return entityType;
        }
    }
    return null;
  }

  fetchEntityTypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var entityTypes: any = (this.entityTypesList || []).filter((item: any) => {
        return !searchText || (item.name && String(item.name).toLowerCase().indexOf(String(searchText).toLowerCase()) !== -1);
    });
    deferred.resolve(entityTypes);
    return deferred.promise;
  }

  updateValidity(...rest: any[]): any {
    var value: any = this.$viewValue;
    var valid: any = !this.tbRequired() || value && value.length > 0;
    this.$setValidity('entityTypeList', valid);
  }

  updateEntityTypeList(...rest: any[]): any {
    var values: any = this.$viewValue;
    if (!values) {
        values = [];
        this.$setViewValue(values);
    } else {
        values.length = 0;
    }
    if (this.entityTypeList && this.entityTypeList.length) {
        this.entityTypeList.forEach(function (entityType?: any) {
            values.push(entityType.value);
        });
    }
    this.updateValidity();
  }
}
