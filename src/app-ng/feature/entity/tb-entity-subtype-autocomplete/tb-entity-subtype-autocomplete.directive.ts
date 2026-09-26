import { Component, DestroyRef, effect, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { AssetService } from '../../api/services/asset.service';
import { DeviceService } from '../../api/services/device.service';
import { EntityViewService } from '../../api/services/entity-view.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbEntitySubtypeAutocomplete` (module `thingsboard.entity`) in
 * src/app/entity/entity-subtype-autocomplete.directive.js: picks (or types) an asset / device / entity view type;
 * `[(ngModel)]` is the type string. A required, empty type makes the host form invalid (the legacy `subType`
 * input's `required` in the host form).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-entity-subtype-autocomplete',
  standalone: true,
  imports: [TranslatePipe, FormsModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './tb-entity-subtype-autocomplete.directive.html',
  providers: ngModelProviders(TbEntitySubtypeAutocompleteDirective),
})
export class TbEntitySubtypeAutocompleteDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>(false);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly entityType = model<any>();

  protected readonly assetService = inject(AssetService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly rootScope = inject(RootState);

  protected subTypeOptions: any[] = [];
  subType: any = null;
  subTypeSearchText: any = '';
  entitySubtypes: any = null;
  entitySubtypeRequiredText: any;
  entitySubtypeText: any;
  selectEntitySubtypeText: any;
  private savedDeregistration: (() => void) | null = null;
  /** The host's value was rendered once: before that there is nothing to send back (AngularJS skipped an unchanged commit). */
  private rendered = false;

  constructor() {
    super();
    // scope.$watch('entityType', load)
    effect(() => this.load(this.entityType()));
    // scope.$watch('disabled', updateView)
    effect(() => {
      this.disabled();
      this.updateView();
    });
    // a required type is validated whatever its value's origin
    effect(() => {
      this.tbRequired();
      this.validateRequired();
    });
    inject(DestroyRef).onDestroy(() => this.savedDeregistration?.());
  }

  override $render(): void {
    this.rendered = true;
    this.subType = this.$viewValue;
    this.subTypeSearchText = this.subType ?? '';
    this.validateRequired();
  }

  /** `scope.$watch('subType', …)`: a changed type goes out to the host's ngModel. */
  setSubType(value: any): void {
    const prevValue = this.subType;
    this.subType = value;
    if (!isEqual(value, prevValue)) {
      this.updateView();
    }
  }

  comparator = (actual?: any, expected?: any): boolean => {
    if (actual === undefined) {
      return false;
    }
    if (actual === null || expected === null || expected === undefined) {
      return actual === expected || expected === undefined;
    }
    return actual.startsWith(expected);
  };

  fetchSubTypes(searchText?: any): Promise<any[]> {
    return this.loadSubTypes().then((subTypes: any[]) => {
      const result: any[] = subTypes.filter((item: any) => this.comparator(item, searchText));
      if (result && result.length) {
        if (searchText && searchText.length && result.indexOf(searchText) === -1) {
          result.push(searchText);
        }
        result.sort();
        return result;
      }
      return [searchText];
    });
  }

  subTypeSearchTextChanged(searchText?: any): void {
    this.subTypeSearchText = searchText;
    this.fetchSubTypes(searchText).then(
      (result: any[]) => (this.subTypeOptions = result),
      () => undefined,
    );
  }

  updateView(): void {
    if (this.rendered && !this.disabled() && (this.subType ?? null) !== (this.$viewValue ?? null)) {
      this.$setViewValue(this.subType);
    }
    this.validateRequired();
  }

  private validateRequired(): void {
    const empty = this.subType === null || this.subType === undefined || this.subType === '';
    const valid = !(this.tbRequired() && empty);
    if (valid !== !this.$error['required']) {
      this.$setValidity('required', valid);
    }
  }

  loadSubTypes(): Promise<any[]> {
    if (this.entitySubtypes) {
      return Promise.resolve(this.entitySubtypes);
    }
    let entitySubtypesPromise: any;
    if (this.entityType() == types.entityType.asset) {
      entitySubtypesPromise = this.assetService.getAssetTypes({ ignoreLoading: true });
    } else if (this.entityType() == types.entityType.device) {
      entitySubtypesPromise = this.deviceService.getDeviceTypes({ ignoreLoading: true });
    } else if (this.entityType() == types.entityType.entityView) {
      entitySubtypesPromise = this.entityViewService.getEntityViewTypes({ ignoreLoading: true });
    }
    if (!entitySubtypesPromise) {
      return Promise.reject();
    }
    return Promise.resolve(entitySubtypesPromise).then((subtypes?: any) => {
      this.entitySubtypes = (subtypes || []).map((type: any) => type.type);
      return this.entitySubtypes;
    });
  }

  load(entityType: any): void {
    let savedEvent: string | null = null;
    if (entityType == types.entityType.asset) {
      this.selectEntitySubtypeText = 'asset.select-asset-type';
      this.entitySubtypeText = 'asset.asset-type';
      this.entitySubtypeRequiredText = 'asset.asset-type-required';
      savedEvent = 'assetSaved';
    } else if (entityType == types.entityType.device) {
      this.selectEntitySubtypeText = 'device.select-device-type';
      this.entitySubtypeText = 'device.device-type';
      this.entitySubtypeRequiredText = 'device.device-type-required';
      savedEvent = 'deviceSaved';
    } else if (entityType == types.entityType.entityView) {
      this.selectEntitySubtypeText = 'entity-view.select-entity-view-type';
      this.entitySubtypeText = 'entity-view.entity-view-type';
      this.entitySubtypeRequiredText = 'entity-view.entity-view-type-required';
      savedEvent = 'entityViewSaved';
    }
    this.savedDeregistration?.();
    this.savedDeregistration = savedEvent ? this.rootScope.$on(savedEvent, () => (this.entitySubtypes = null)) : null;
  }
}
