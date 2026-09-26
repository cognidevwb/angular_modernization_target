import { Component, inject, model } from '@angular/core';
import { AssetService } from '../../api/services/asset.service';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import relationTypeAutocompleteTemplate from '../../../../app/entity/relation/relation-type-autocomplete.tpl.html';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbRelationTypeAutocomplete` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-relation-type-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule],
  templateUrl: './tb-relation-type-autocomplete.directive.html',
})
export class TbRelationTypeAutocompleteDirective {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly assetService = inject(AssetService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(relationTypeAutocompleteTemplate);
  hideLabel: any;
  relationType: any = null;
  relationTypeSearchText: any = '';
  relationTypes: any = [];
  $watch: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.hideLabel = (this.attrs.hideLabel !== undefined) ? true : false;
    for (var type in types.entityRelationType) {
            this.relationTypes.push(types.entityRelationType[type]);
        }
    ngModelCtrl.$render = function () {
            this.relationType = ngModelCtrl.$viewValue;
        }
    this.$watch('relationType', (newValue?: any, prevValue?: any) => {
            if (!angular.equals(newValue, prevValue)) {
                this.updateView();
            }
        });
    this.$watch('disabled', () => {
            this.updateView();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  fetchRelationTypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var result: any = $filter('filter')(this.relationTypes, {'$': searchText});
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([searchText]);
    }
    return deferred.promise;
  }

  relationTypeSearchTextChanged(...rest: any[]): any {
          }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        ngModelCtrl.$setViewValue(this.relationType);
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
