import { Component, inject, model } from '@angular/core';
import { AssetService } from '../../api/services/asset.service';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { EntityViewService } from '../../api/services/entity-view.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import $ from 'jquery';
import { isEqual } from 'lodash-es';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;

/**
 * Ported from the AngularJS directive `tbEntitySubtypeAutocomplete` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-subtype-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './tb-entity-subtype-autocomplete.directive.html',
  providers: ngModelProviders(TbEntitySubtypeAutocompleteDirective),
})
export class TbEntitySubtypeAutocompleteDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly entityType = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly assetService = inject(AssetService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected subTypeOptions: any[] = [];
  subType: any = null;
  subTypeSearchText: any = '';
  entitySubtypes: any = null;
  $on: any;
  $watch: any;
  entitySubtypeRequiredText: any;
  entitySubtypeText: any;
  selectEntitySubtypeText: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    this.$watch('entityType', () => {
            this.load();
        });
    this.$watch('subType', (newValue?: any, prevValue?: any) => {
            if (!isEqual(newValue, prevValue)) {
                this.updateView();
            }
        });
    this.$watch('disabled', () => {
            this.updateView();
        });
  }

  override $render(): void {
    this.subType = this.$viewValue;
  }

  comparator = (actual?: any, expected?: any, ...rest: any[]): any => {
    if ((actual === undefined)) {
        return false;
    }
    if ((actual === null) || (expected === null)) {
        return actual === expected;
    }
    return actual.startsWith(expected);
  };

  fetchSubTypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadSubTypes().then(
        (subTypes?: any) => {
            var result: any = subTypes.filter((item: any) => this.comparator(item, searchText));
            if (result && result.length) {
                if (searchText && searchText.length && result.indexOf(searchText) === -1) {
                    result.push(searchText);
                }
                result.sort();
                deferred.resolve(result);
            } else {
                deferred.resolve([searchText]);
            }
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  subTypeSearchTextChanged(searchText?: any, ...rest: any[]): any {
    this.subTypeSearchText = searchText;
    this.fetchSubTypes(searchText).then((result: any[]) => {
        this.subTypeOptions = result;
    });
  }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        this.$setViewValue(this.subType);
    }
  }

  loadSubTypes(...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!this.entitySubtypes) {
        var entitySubtypesPromise: any;
        if (this.entityType() == types.entityType.asset) {
            entitySubtypesPromise = this.assetService.getAssetTypes({ignoreLoading: true});
        } else if (this.entityType() == types.entityType.device) {
            entitySubtypesPromise = this.deviceService.getDeviceTypes({ignoreLoading: true});
        } else if (this.entityType() == types.entityType.entityView) {
            entitySubtypesPromise = this.entityViewService.getEntityViewTypes({ignoreLoading: true});
        }
        if (entitySubtypesPromise) {
            entitySubtypesPromise.then(
                (types?: any) => {
                    this.entitySubtypes = [];
                    types.forEach((type?: any) => {
                        this.entitySubtypes.push(type.type);
                    });
                    deferred.resolve(this.entitySubtypes);
                },
                function fail() {
                    deferred.reject();
                }
            );
        } else {
            deferred.reject();
        }
    } else {
        deferred.resolve(this.entitySubtypes);
    }
    return deferred.promise;
  }

  load(...rest: any[]): any {
    if (this.entityType() == types.entityType.asset) {
        this.selectEntitySubtypeText = 'asset.select-asset-type';
        this.entitySubtypeText = 'asset.asset-type';
        this.entitySubtypeRequiredText = 'asset.asset-type-required';
        this.$on('assetSaved', () => {
            this.entitySubtypes = null;
        });
    } else if (this.entityType() == types.entityType.device) {
        this.selectEntitySubtypeText = 'device.select-device-type';
        this.entitySubtypeText = 'device.device-type';
        this.entitySubtypeRequiredText = 'device.device-type-required';
        this.$on('deviceSaved', () => {
            this.entitySubtypes = null;
        });
    } else if (this.entityType() == types.entityType.entityView) {
        this.selectEntitySubtypeText = 'entity-view.select-entity-view-type';
        this.entitySubtypeText = 'entity-view.entity-view-type';
        this.entitySubtypeRequiredText = 'entity-view.entity-view-type-required';
        this.$on('entityViewSaved', () => {
            this.entitySubtypes = null;
        });
    }
  }
}
