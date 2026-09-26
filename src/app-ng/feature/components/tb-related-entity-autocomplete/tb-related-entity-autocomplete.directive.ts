import { Component, inject, input, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';

import $ from 'jquery';
import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbRelatedEntityAutocomplete` (module `thingsboard.directives.relatedEntityAutocomplete`) in src/app/components/related-entity-autocomplete.directive.js:25.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-related-entity-autocomplete',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbRelatedEntityAutocompleteDirective {
  readonly rootEntityId = model<any>();
  readonly entityType = model<any>();
  readonly entitySubtypes = model<any>();
  readonly excludeEntityIds = model<any>();
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly placeholderText = input<any>();
  readonly notFoundText = input<any>();
  readonly requiredText = input<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$filter' — inject the pipe class and call transform()
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);

  entity: any = null;
  entitySearchText: any = '';
  allEntities: any = null;
  $watch: any;
  protected onChange: (value: any) => void = () => {};

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.$watch('entity', () => {
            this.updateView();
        });
    this.$watch('disabled', () => {
            this.updateView();
        });
  }

  writeValue(value: any): void {
    if (value) {
        this.entityService.getRelatedEntity(value).then(
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

  fetchEntities(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!this.allEntities) {
        this.entityService.getRelatedEntities(this.rootEntityId(), this.entityType(), this.entitySubtypes(), -1, []).then(
            (entities?: any) => {
                if (this.excludeEntityIds() && this.excludeEntityIds().length) {
                    var filteredEntities: any = [];
                    entities.forEach((entity?: any) => {
                        if (this.excludeEntityIds().indexOf(entity.id.id) == -1) {
                            filteredEntities.push(entity);
                        }
                    });
                    entities = filteredEntities;
                }
                this.allEntities = entities;
                this.filterEntities(searchText, deferred);
            },
            function fail() {
                deferred.reject();
            }
        );
    } else {
        this.filterEntities(searchText, deferred);
    }
    return deferred.promise;
  }

  filterEntities(searchText?: any, deferred?: any, ...rest: any[]): any {
    var result: any = $filter('filter')(this.allEntities, {name: searchText});
    deferred.resolve(result);
  }

  entitySearchTextChanged(...rest: any[]): any {
          }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        this.onChange(this.entity ? this.entity.id : null);
    }
  }
}
