import { Component, inject, input, model } from '@angular/core';
import { AssetService } from '../../api/services/asset.service';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { EntityViewService } from '../../api/services/entity-view.service';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import entitySubtypeSelectTemplate from '../../../../app/entity/entity-subtype-select.tpl.html?raw';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntitySubtypeSelect` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-subtype-select',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './tb-entity-subtype-select.directive.html',
})
export class TbEntitySubtypeSelectDirective {
  readonly theForm = model<any>();
  readonly entityType = model<any>();
  readonly entitySubtypesList = model<any>();
  readonly typeTranslatePrefix = input<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly assetService = inject(AssetService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(entitySubtypeSelectTemplate);
  ngModelCtrl: any = ngModelCtrl;
  entitySubtypes: any = [];
  $on: any;
  $watch: any;
  entitySubtype: any;
  entitySubtypeRequiredText: any;
  entitySubtypeTitle: any;
  showLabel: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    if ((this.attrs.hideLabel !== undefined)) {
            this.showLabel = false;
        } else {
            this.showLabel = true;
        }
    this.$watch('entityType', () => {
            this.load();
        });
    this.$watch('entitySubtype', (newValue?: any, prevValue?: any) => {
            if (!angular.equals(newValue, prevValue)) {
                this.updateView();
            }
        });
    ngModelCtrl.$render = function () {
            this.entitySubtype = ngModelCtrl.$viewValue;
        };
    $compile($(this.element.nativeElement).contents())(this);
  }

  subTypeName(subType?: any, ...rest: any[]): any {
    if (subType && subType.length) {
        if (this.typeTranslatePrefix()) {
            return this.translate.instant(this.typeTranslatePrefix() + '.' + subType);
        } else {
            return subType;
        }
    } else {
        return this.translate.instant('entity.all-subtypes');
    }
    return undefined;
  }

  updateView(...rest: any[]): any {
    ngModelCtrl.$setViewValue(this.entitySubtype);
  }

  loadSubTypes(...rest: any[]): any {
    this.entitySubtypes = [];
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
                this.entitySubtypes.push('');
                types.forEach((type?: any) => {
                    this.entitySubtypes.push(type.type);
                });
                if (this.entitySubtypes.indexOf(this.entitySubtype) == -1) {
                    this.entitySubtype = '';
                }
            },
            function fail() {}
        );
    }

  }

  load(...rest: any[]): any {
    if (this.entityType() == types.entityType.asset) {
        this.entitySubtypeTitle = 'asset.asset-type';
        this.entitySubtypeRequiredText = 'asset.asset-type-required';
    } else if (this.entityType() == types.entityType.device) {
        this.entitySubtypeTitle = 'device.device-type';
        this.entitySubtypeRequiredText = 'device.device-type-required';
    } else if (this.entityType() == types.entityType.entityView) {
        this.entitySubtypeTitle = 'entity-view.entity-view-type';
        this.entitySubtypeRequiredText = 'entity-view.entity-view-type-required';
    }
    this.entitySubtypes.length = 0;
    if (this.entitySubtypesList() && this.entitySubtypesList().length) {
        this.entitySubtypesList().forEach((subType?: any) => {
            this.entitySubtypes.push(subType);
        });
    } else {
        this.loadSubTypes();
        if (this.entityType() == types.entityType.asset) {
            this.$on('assetSaved', () => {
                this.loadSubTypes();
            });
        } else if (this.entityType() == types.entityType.device) {
            this.$on('deviceSaved', () => {
                this.loadSubTypes();
            });
        } else if (this.entityType() == types.entityType.entityView) {
            this.$on('entityViewSaved', () => {
                this.loadSubTypes();
            });
        }
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
