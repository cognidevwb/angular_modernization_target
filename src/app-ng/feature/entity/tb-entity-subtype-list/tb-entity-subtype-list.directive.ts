import { Component, inject, model } from '@angular/core';
import { AssetService } from '../../api/services/asset.service';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { EntityViewService } from '../../api/services/entity-view.service';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $mdUtil: any;
declare let $q: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntitySubtypeList` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-subtype-list',
  standalone: true,
  imports: [FormsModule, MatChipsModule, MatAutocompleteModule, MatIconModule, TranslatePipe],
  templateUrl: './tb-entity-subtype-list.directive.html',
})
export class TbEntitySubtypeListDirective {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly tbRequired = model<any>();
  readonly entityType = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly assetService = inject(AssetService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-chips, md-autocomplete, md-item-template, md-not-found, md-chip-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-chip-template left in place
  // TODO(port): template: 1 × md-chips left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × md-not-found left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  ngModelCtrl: any = ngModelCtrl;
  entitySubtypesList: any = [];
  entitySubtypes: any = null;
  entitySubtypeSearchText: any = '';
  filteredSubtypes: any = [];
  $watch: any;
  inputTouched: any;
  noSubtypesMathingText: any;
  placeholder: any;
  secondaryPlaceholder: any;
  subtypeListEmptyText: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    if (this.entityType() == types.entityType.asset) {
            this.placeholder = this.tbRequired() ? this.translate.instant('asset.enter-asset-type')
                : this.translate.instant('asset.any-asset');
            this.secondaryPlaceholder = '+' + this.translate.instant('asset.asset-type');
            this.noSubtypesMathingText = 'asset.no-asset-types-matching';
            this.subtypeListEmptyText = 'asset.asset-type-list-empty';
        } else if (this.entityType() == types.entityType.device) {
            this.placeholder = this.tbRequired() ? this.translate.instant('device.enter-device-type')
                : this.translate.instant('device.any-device');
            this.secondaryPlaceholder = '+' + this.translate.instant('device.device-type');
            this.noSubtypesMathingText = 'device.no-device-types-matching';
            this.subtypeListEmptyText = 'device.device-type-list-empty';
        } else if (this.entityType() == types.entityType.entityView) {
            this.placeholder = this.tbRequired() ? this.translate.instant('entity-view.enter-entity-view-type')
                : this.translate.instant('entity-view.any-entity-view');
            this.secondaryPlaceholder = '+' + this.translate.instant('entity-view.entity-view-type');
            this.noSubtypesMathingText = 'entity-view.no-entity-view-types-matching';
            this.subtypeListEmptyText = 'entity-view.entity-view-type-list-empty';
        }
    this.$watch('tbRequired', () => {
            this.updateValidity();
        });
    ngModelCtrl.$render = function () {
            this.entitySubtypesList = ngModelCtrl.$viewValue;
            if (!this.entitySubtypesList) {
                this.entitySubtypesList = [];
            }
        }
    this.$watch('entitySubtypesList', () => {
            ngModelCtrl.$setViewValue(this.entitySubtypesList);
            this.updateValidity();
        }, true);
    $compile($(this.element.nativeElement).contents())(this);
    $mdUtil.nextTick(() =>{
            var inputElement: any = $('input', $(this.element.nativeElement));
            inputElement.on('blur', () => {
                this.inputTouched = true;
            } );
        });
  }

  fetchEntitySubtypes(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadSubTypes().then(
        function success(subTypes?: any) {
            var result: any = $filter('filter')(subTypes, {'$': searchText});
            if (result && result.length) {
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

  onSearchTextChanged(): void {
    this.fetchEntitySubtypes(this.entitySubtypeSearchText).then((result: any) => {
      this.filteredSubtypes = result;
    });
  }

  onSubtypeSelected(event: MatAutocompleteSelectedEvent): void {
    const value = event.option.value;
    if (value) {
      this.entitySubtypesList.push(value);
      ngModelCtrl.$setViewValue(this.entitySubtypesList);
      this.updateValidity();
    }
    this.entitySubtypeSearchText = '';
  }

  removeSubtype(subtype: any): void {
    const index = this.entitySubtypesList.indexOf(subtype);
    if (index >= 0) {
      this.entitySubtypesList.splice(index, 1);
      ngModelCtrl.$setViewValue(this.entitySubtypesList);
      this.updateValidity();
    }
  }

  updateValidity(...rest: any[]): any {
    var value: any = ngModelCtrl.$viewValue;
    var valid: any = !this.tbRequired() || value && value.length > 0;
    ngModelCtrl.$setValidity('entitySubtypesList', valid);
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
}
