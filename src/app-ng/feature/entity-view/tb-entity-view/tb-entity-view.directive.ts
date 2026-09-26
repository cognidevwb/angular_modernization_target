import { Component, forwardRef, inject, model, output } from '@angular/core';
import { ClipboardService } from '../../services/clipboard.service';
import { CustomerService } from '../../api/services/customer.service';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { EntityViewService } from '../../api/services/entity-view.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbEntitySubtypeAutocompleteDirective } from '../../entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';
import { TbEntitySelectDirective } from '../../entity/tb-entity-select/tb-entity-select.directive';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatChipsModule, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $mdConstant: any;
declare let $mdExpansionPanel: any;
declare let $q: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbEntityView` (module `thingsboard.entityView`) in src/app/entity-view/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-view',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatExpansionModule, MatChipsModule, MatAutocompleteModule, CommonModule, FormsModule, forwardRef(() => TbEntitySubtypeAutocompleteDirective), forwardRef(() => TbEntitySelectDirective)],
  templateUrl: './tb-entity-view.directive.html',
})
export class TbEntityViewDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly entityView = model<any>();
  readonly isEdit = model<any>();
  readonly entityViewScope = model<any>();
  readonly theForm = model<any>();
  readonly onAssignToCustomer = output<any>();
  readonly onMakePublic = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onDeleteEntityView = output<any>();

  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$mdConstant' — key codes: @angular/cdk/keycodes
  // TODO(port): '$mdExpansionPanel' — a mat-expansion-panel, reached with viewChild
  protected readonly typesRef: any = types;
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly customerService = inject(CustomerService);
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-expansion-panel-group, md-expansion-panel, md-expansion-panel-collapsed, md-expansion-panel-icon, md-expansion-panel-expanded, md-expansion-panel-header, md-expansion-panel-content, md-chips, md-autocomplete, mdp-date-picker, mdp-time-picker
  // TODO(port): template: 4 × md-autocomplete left in place
  // TODO(port): template: 4 × md-chips left in place
  // TODO(port): template: 2 × md-expansion-panel left in place
  // TODO(port): template: 2 × md-expansion-panel-collapsed left in place
  // TODO(port): template: 2 × md-expansion-panel-content left in place
  // TODO(port): template: 2 × md-expansion-panel-expanded left in place
  // TODO(port): template: 1 × md-expansion-panel-group left in place
  // TODO(port): template: 2 × md-expansion-panel-header left in place
  // TODO(port): template: 4 × md-expansion-panel-icon left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  attributesPanelId: any = (Math.random()*1000).toFixed(0);
  timeseriesPanelId: any = (Math.random()*1000).toFixed(0);
  $mdExpansionPanel: any = $mdExpansionPanel;
  types: any;
  isAssignedToCustomer: any = false;
  isPublic: any = false;
  assignedCustomer: any = null;
  allowedEntityTypes: any;
  protected semicolon: any = 186;
  separatorKeys: any;
  protected attributeDataKeySearchText: string = '';
  protected selectedAttributeDataKey: any = null;
  protected attributeDataKeys: any[] = [];
  protected timeseriesDataKeySearchText: string = '';
  protected selectedTimeseriesDataKey: any = null;
  protected timeseriesDataKeys: any[] = [];
  $watch: any;
  endTimeMs: any;
  maxStartTimeMs: any;
  minEndTimeMs: any;
  startTimeMs: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.types = this.typesRef;
    this.allowedEntityTypes = [this.typesRef.entityType.device, this.typesRef.entityType.asset];
    this.separatorKeys = [$mdConstant.KEY_CODE.ENTER, $mdConstant.KEY_CODE.COMMA, this.semicolon];
    this.$watch('entityView', (newVal?: any) => {
            if (newVal) {
                if (this.entityView().customerId && this.entityView().customerId.id !== this.typesRef.id.nullUid) {
                    this.isAssignedToCustomer = true;
                    this.customerService.getShortCustomerInfo(this.entityView().customerId.id).then(
                        (customer?: any) => {
                            this.assignedCustomer = customer;
                            this.isPublic = customer.isPublic;
                        }
                    );
                } else {
                    this.isAssignedToCustomer = false;
                    this.isPublic = false;
                    this.assignedCustomer = null;
                }
                if (this.entityView().startTimeMs > 0) {
                    this.startTimeMs = new Date(this.entityView().startTimeMs);
                } else {
                    this.startTimeMs = null;
                }
                if (this.entityView().endTimeMs > 0) {
                    this.endTimeMs = new Date(this.entityView().endTimeMs);
                } else {
                    this.endTimeMs = null;
                }
                if (!this.entityView().keys) {
                    this.entityView().keys = {};
                    this.entityView().keys.timeseries = [];
                    this.entityView().keys.attributes = {};
                    this.entityView().keys.attributes.ss = [];
                    this.entityView().keys.attributes.cs = [];
                    this.entityView().keys.attributes.sh = [];
                }
            }
        });
    this.$watch('startTimeMs', (newDate?: any) => {
            if (newDate) {
                if (newDate.getTime() > this.maxStartTimeMs) {
                    this.startTimeMs = structuredClone(this.maxStartTimeMs);
                }
            }
            this.updateMinMaxDates();
        });
    this.$watch('endTimeMs', (newDate?: any) => {
            if (newDate) {
                if (newDate.getTime() < this.minEndTimeMs) {
                    this.endTimeMs = structuredClone(this.minEndTimeMs);
                }
            }
            this.updateMinMaxDates();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  dataKeysSearch(searchText?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.entityService.getEntityKeys(this.entityView().entityId.entityType, this.entityView().entityId.id, searchText, type, {ignoreLoading: true}).then(
        function success(keys?: any) {
            deferred.resolve(keys);
        },
        function fail() {
            deferred.resolve([]);
        }
    );
    return deferred.promise;

  }

  searchAttributeDataKeys(searchText: string): void {
    this.attributeDataKeySearchText = searchText;
    this.dataKeysSearch(searchText, this.types.dataKeyType.attribute).then((keys: any) => {
      this.attributeDataKeys = keys;
    });
  }

  searchTimeseriesDataKeys(searchText: string): void {
    this.timeseriesDataKeySearchText = searchText;
    this.dataKeysSearch(searchText, this.types.dataKeyType.timeseries).then((keys: any) => {
      this.timeseriesDataKeys = keys;
    });
  }

  addAttributeKey(target: 'cs' | 'sh' | 'ss', item: any): void {
    const name = item && item.name !== undefined ? item.name : item;
    if (name) {
      this.entityView().keys.attributes[target].push(name);
    }
    this.attributeDataKeySearchText = '';
  }

  removeAttributeKey(target: 'cs' | 'sh' | 'ss', item: any): void {
    const keys = this.entityView().keys.attributes[target];
    const index = keys.indexOf(item);
    if (index >= 0) {
      keys.splice(index, 1);
    }
  }

  addAttributeKeyFromInput(target: 'cs' | 'sh' | 'ss', event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.entityView().keys.attributes[target].push(value);
    }
    event.chipInput?.clear();
    this.attributeDataKeySearchText = '';
  }

  addTimeseriesKey(item: any): void {
    const name = item && item.name !== undefined ? item.name : item;
    if (name) {
      this.entityView().keys.timeseries.push(name);
    }
    this.timeseriesDataKeySearchText = '';
  }

  removeTimeseriesKey(item: any): void {
    const keys = this.entityView().keys.timeseries;
    const index = keys.indexOf(item);
    if (index >= 0) {
      keys.splice(index, 1);
    }
  }

  addTimeseriesKeyFromInput(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    if (value) {
      this.entityView().keys.timeseries.push(value);
    }
    event.chipInput?.clear();
    this.timeseriesDataKeySearchText = '';
  }

  updateMinMaxDates(...rest: any[]): any {
    if (this.entityView()) {
        if (this.endTimeMs) {
            this.maxStartTimeMs = structuredClone(new Date(this.endTimeMs.getTime()));
            this.entityView().endTimeMs = this.endTimeMs.getTime();
        } else {
            this.entityView().endTimeMs = 0;
        }
        if (this.startTimeMs) {
            this.minEndTimeMs = structuredClone(new Date(this.startTimeMs.getTime()));
            this.entityView().startTimeMs = this.startTimeMs.getTime();
        } else {
            this.entityView().startTimeMs = 0;
        }
    }
  }

  onEntityViewIdCopied(...rest: any[]): any {
    this.toast.showSuccess(this.translate.instant('entity-view.idCopiedMessage'), 750, $($(this.element.nativeElement)).parent().parent(), 'bottom left');
  }
}
