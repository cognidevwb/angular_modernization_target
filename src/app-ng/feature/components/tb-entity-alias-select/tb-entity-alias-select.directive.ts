import { Component, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ENTER } from '@angular/cdk/keycodes';
import { EntityService } from '../../api/services/entity.service';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import $ from 'jquery';
const entityAliasSelectTemplate: string = '';

/**
 * Ported from the AngularJS directive `tbEntityAliasSelect` (module `thingsboard.directives.entityAliasSelect`) in src/app/components/entity-alias-select.directive.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-alias-select',
  standalone: true,
  template: '', // TODO(port): no template found
  providers: ngModelProviders(TbEntityAliasSelectDirective),
})
export class TbEntityAliasSelectDirective extends NgModelController {
  readonly tbRequired = model<any>();
  readonly aliasController = model<any>();
  readonly allowedEntityTypes = model<any>();
  readonly onCreateEntityAlias = output<any>();

  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);

protected template: any = entityAliasSelectTemplate;
  entityAliasList: any = [];
  entityAlias: any = null;
  $watch: any;
  entityAliasSearchText: any;
  ngControl: any;
  onChange: any;

  // TODO(port): `scope.onCreateEntityAlias(…)` — its result was read; an output emits and returns nothing: take the value from an input callback instead
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.$watch('aliasController', () => {
            this.entityAliasList = [];
            var entityAliases: any = this.aliasController().getEntityAliases();
            for (var aliasId in entityAliases) {
                if (this.allowedEntityTypes()) {
                    if (!this.entityService.filterAliasByEntityTypes(entityAliases[aliasId], this.allowedEntityTypes())) {
                        continue;
                    }
                }
                this.entityAliasList.push(entityAliases[aliasId]);
            }
        });
    this.$watch('entityAlias', () => {
            this.updateView();
        });
  }

  override $render(): void {
    if (this.$viewValue) {
      this.entityAlias = this.$viewValue;
    }
  }

  updateValidity(...rest: any[]): any {
    var value: any = this.$viewValue;
    var valid: any = (value !== undefined) && value != null || !this.tbRequired();
    this.ngControl?.control?.setErrors(valid ? null : { entityAlias: true });
  }

  entityAliasSearch(entityAliasSearchText?: any, ...rest: any[]): any {
    return entityAliasSearchText ? this.entityAliasList.filter(
        this.createFilterForEntityAlias(entityAliasSearchText)) : this.entityAliasList;
  }

  createFilterForEntityAlias(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = query.toLowerCase();
    return function filterFn(entityAlias?: any) {
        return (entityAlias.alias.toLowerCase().indexOf(lowercaseQuery) === 0);
    };
  }

  updateView(...rest: any[]): any {
    this.onChange?.(this.entityAlias);
    this.updateValidity();
  }

  textIsNotEmpty(text?: any, ...rest: any[]): any {
    return (text && text != null && text.length > 0) ? true : false;
  }

  entityAliasEnter($event?: any, ...rest: any[]): any {
    if ($event.keyCode === ENTER) {
        $event.preventDefault();
        if (!this.entityAlias) {
            var found: any = this.entityAliasSearch(this.entityAliasSearchText);
            found = found.length > 0;
            if (!found) {
                this.createEntityAlias($event, this.entityAliasSearchText);
            }
        }
    }
  }

  createEntityAlias(event?: any, alias?: any, ...rest: any[]): any {
    var autoChild: any = $('#entity-autocomplete', $(this.element.nativeElement))[0].firstElementChild;
    var el: any = $(autoChild);
    el.scope().$mdAutocompleteCtrl.hidden = true;
    el.scope().$mdAutocompleteCtrl.hasNotFound = false;
    event.preventDefault();
    var promise: any = this.onCreateEntityAlias.emit({event: event, alias: alias, allowedEntityTypes: this.allowedEntityTypes()});
    if (promise) {
        promise.then(
            (newAlias?: any) => {
                el.scope().$mdAutocompleteCtrl.hasNotFound = true;
                if (newAlias) {
                    this.entityAliasList.push(newAlias);
                    this.entityAlias = newAlias;
                }
            },
            function fail() {
                el.scope().$mdAutocompleteCtrl.hasNotFound = true;
            }
        );
    } else {
        el.scope().$mdAutocompleteCtrl.hasNotFound = true;
    }
  }
}
