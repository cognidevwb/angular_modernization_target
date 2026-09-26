import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TbRelationTypeAutocompleteDirective } from '../tb-relation-type-autocomplete/tb-relation-type-autocomplete.directive';
import { TbEntityTypeListDirective } from '../tb-entity-type-list/tb-entity-type-list.directive';

import { isEqual } from 'lodash-es';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbRelationFilters` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-relation-filters',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatButtonModule, FormsModule, forwardRef(() => TbRelationTypeAutocompleteDirective), forwardRef(() => TbEntityTypeListDirective)],
  templateUrl: './tb-relation-filters.directive.html',
  providers: ngModelProviders(TbRelationFiltersDirective),
})
export class TbRelationFiltersDirective extends NgModelController {
  protected readonly rootScope = injectRoot(RootState);
  readonly allowedEntityTypes = model<any>();

  protected readonly element = inject(ElementRef);

  relationFilters: any = [];
  private prevRelationFilters: any = [];

  ngDoCheck(): void {
    if (!isEqual(this.relationFilters, this.prevRelationFilters)) {
      this.prevRelationFilters = structuredClone(this.relationFilters);
      this.updateValue();
    }
  }

  $render(): void {
    if (this.$viewValue) {
        var value: any = this.$viewValue;
        this.relationFilters.length = 0;
        value.forEach((filter?: any) => {
            this.relationFilters.push(filter);
        });
    }
    this.prevRelationFilters = structuredClone(this.relationFilters);
  }

  addFilter = (...rest: any[]): any => {
    var filter: any = {
        relationType: null,
        entityTypes: []
    };
    this.relationFilters.push(filter);
  };

  removeFilter = ($event?: any, filter?: any, ...rest: any[]): any => {
    var index: any = this.relationFilters.indexOf(filter);
    if (index > -1) {
        this.relationFilters.splice(index, 1);
    }
  };

  updateValue(...rest: any[]): any {
    var value: any = this.$viewValue;
    if (!value) {
        value = [];
        this.$setViewValue(value);
    } else {
        value.length = 0;
    }
    this.relationFilters.forEach(function (filter?: any) {
        value.push(filter);
    });
  }
}
