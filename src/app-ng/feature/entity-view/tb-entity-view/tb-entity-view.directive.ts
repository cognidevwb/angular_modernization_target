import { Component, ElementRef, effect, inject, model, output } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { CustomerService } from '../../api/services/customer.service';
import { EntityService } from '../../api/services/entity.service';
import { ToastService } from '../../services/toast.service';
import { types } from '../../common/constants/types';
import { TbEntitySubtypeAutocompleteDirective } from '../../entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';
import { TbEntitySelectDirective } from '../../entity/tb-entity-select/tb-entity-select.directive';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

type AttributeScope = 'cs' | 'sh' | 'ss';

/** `;` — the third chip separator of the legacy `separatorKeys`. */
const SEMICOLON = 186;

/**
 * Ported from the AngularJS directive `tbEntityView` (module `thingsboard.entityView`) in src/app/entity-view/entity-view.directive.js
 * (template src/app/entity-view/entity-view-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-entity-view dialog's form. The md-chips key lists are mat-chip-grids (a change marks
 * the form dirty, as md-chips' ng-model did); the mdp date + time pickers of the start / end are `datetime-local` inputs
 * keeping the legacy clamping (start ≤ end).
 */
@Component({
  selector: 'tb-entity-view',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatExpansionModule, MatChipsModule, MatAutocompleteModule, FormsModule, TbEntitySubtypeAutocompleteDirective, TbEntitySelectDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-entity-view.directive.html',
})
export class TbEntityViewDirective {
  protected readonly rootScope = inject(RootState);
  readonly entityView = model<any>();
  readonly isEdit = model<any>();
  readonly entityViewScope = model<any>();
  readonly theForm = model<any>();
  readonly onAssignToCustomer = output<any>();
  readonly onMakePublic = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onDeleteEntityView = output<any>();

  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly customerService = inject(CustomerService);
  protected readonly entityService = inject(EntityService);
  protected readonly element = inject(ElementRef);

  types: any = types;
  isAssignedToCustomer = false;
  isPublic = false;
  assignedCustomer: any = null;
  allowedEntityTypes: any = [types.entityType.device, types.entityType.asset];
  separatorKeys: number[] = [ENTER, COMMA, SEMICOLON];
  protected attributeSearchText: Record<AttributeScope, string> = { cs: '', sh: '', ss: '' };
  protected attributeDataKeys: any[] = [];
  protected timeseriesDataKeySearchText = '';
  protected timeseriesDataKeys: any[] = [];
  startTimeMs: Date | null = null;
  endTimeMs: Date | null = null;
  maxStartTimeMs: Date | null = null;
  minEndTimeMs: Date | null = null;

  constructor() {
    effect(() => {
      const entityView = this.entityView();
      if (entityView) {
        this.entityViewChanged(entityView);
      }
    });
  }

  /** The legacy `scope.$watch('entityView', …)`. */
  private entityViewChanged(entityView: any): void {
    if (entityView.customerId && entityView.customerId.id !== types.id.nullUid) {
      this.isAssignedToCustomer = true;
      this.customerService.getShortCustomerInfo(entityView.customerId.id).then((customer?: any) => {
        this.assignedCustomer = customer;
        this.isPublic = customer.isPublic;
      });
    } else {
      this.isAssignedToCustomer = false;
      this.isPublic = false;
      this.assignedCustomer = null;
    }
    this.startTimeMs = entityView.startTimeMs > 0 ? new Date(entityView.startTimeMs) : null;
    this.endTimeMs = entityView.endTimeMs > 0 ? new Date(entityView.endTimeMs) : null;
    if (!entityView.keys) {
      entityView.keys = { timeseries: [], attributes: { ss: [], cs: [], sh: [] } };
    }
    this.updateMinMaxDates();
  }

  dataKeysSearch(searchText: string, type: any): Promise<any[]> {
    const entityView = this.entityView();
    if (!entityView?.entityId) {
      return Promise.resolve([]);
    }
    return Promise.resolve(
      this.entityService.getEntityKeys(entityView.entityId.entityType, entityView.entityId.id, searchText, type, { ignoreLoading: true }),
    ).then(
      (keys: any) => keys,
      () => [],
    );
  }

  searchAttributeDataKeys(target: AttributeScope, searchText: string): void {
    this.attributeSearchText[target] = searchText;
    this.dataKeysSearch(searchText, types.dataKeyType.attribute).then((keys) => (this.attributeDataKeys = keys));
  }

  searchTimeseriesDataKeys(searchText: string): void {
    this.timeseriesDataKeySearchText = searchText;
    this.dataKeysSearch(searchText, types.dataKeyType.timeseries).then((keys) => (this.timeseriesDataKeys = keys));
  }

  addAttributeKey(target: AttributeScope, item: any): void {
    this.pushKey(this.entityView().keys.attributes[target], item && item.name !== undefined ? item.name : item);
    this.attributeSearchText[target] = '';
  }

  addAttributeKeyFromInput(target: AttributeScope, event: MatChipInputEvent): void {
    this.pushKey(this.entityView().keys.attributes[target], (event.value || '').trim());
    event.chipInput?.clear();
    this.attributeSearchText[target] = '';
  }

  removeAttributeKey(target: AttributeScope, item: any): void {
    this.removeKey(this.entityView().keys.attributes[target], item);
  }

  addTimeseriesKey(item: any): void {
    this.pushKey(this.entityView().keys.timeseries, item && item.name !== undefined ? item.name : item);
    this.timeseriesDataKeySearchText = '';
  }

  addTimeseriesKeyFromInput(event: MatChipInputEvent): void {
    this.pushKey(this.entityView().keys.timeseries, (event.value || '').trim());
    event.chipInput?.clear();
    this.timeseriesDataKeySearchText = '';
  }

  removeTimeseriesKey(item: any): void {
    this.removeKey(this.entityView().keys.timeseries, item);
  }

  /** md-chips kept its list unique and marked the form dirty on a change. */
  private pushKey(keys: any[], name: any): void {
    if (name && keys.indexOf(name) === -1) {
      keys.push(name);
      this.theForm()?.$setDirty();
    }
  }

  private removeKey(keys: any[], item: any): void {
    const index = keys.indexOf(item);
    if (index >= 0) {
      keys.splice(index, 1);
      this.theForm()?.$setDirty();
    }
  }

  /** The legacy `scope.$watch('startTimeMs', …)`: a start after the end is moved to the end. */
  setStartTime(value: string): void {
    let date = this.fromLocal(value);
    if (date && this.maxStartTimeMs && date.getTime() > this.maxStartTimeMs.getTime()) {
      date = new Date(this.maxStartTimeMs.getTime());
    }
    this.startTimeMs = date;
    this.updateMinMaxDates();
  }

  /** The legacy `scope.$watch('endTimeMs', …)`: an end before the start is moved to the start. */
  setEndTime(value: string): void {
    let date = this.fromLocal(value);
    if (date && this.minEndTimeMs && date.getTime() < this.minEndTimeMs.getTime()) {
      date = new Date(this.minEndTimeMs.getTime());
    }
    this.endTimeMs = date;
    this.updateMinMaxDates();
  }

  updateMinMaxDates(): void {
    const entityView = this.entityView();
    if (entityView) {
      if (this.endTimeMs) {
        this.maxStartTimeMs = new Date(this.endTimeMs.getTime());
        entityView.endTimeMs = this.endTimeMs.getTime();
      } else {
        entityView.endTimeMs = 0;
      }
      if (this.startTimeMs) {
        this.minEndTimeMs = new Date(this.startTimeMs.getTime());
        entityView.startTimeMs = this.startTimeMs.getTime();
      } else {
        entityView.startTimeMs = 0;
      }
    }
  }

  /** A Date as a `datetime-local` value (local time, minutes precision), '' for none. */
  toLocal(date: Date | null): string {
    if (!date) {
      return '';
    }
    const pad = (n: number): string => String(n).padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  private fromLocal(value: string): Date | null {
    if (!value) {
      return null;
    }
    const date = new Date(value);
    return isNaN(date.getTime()) ? null : date;
  }

  /** `ng-model="entityView.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(entityView: any, key: string, value: any): void {
    entityView.additionalInfo = entityView.additionalInfo || {};
    entityView.additionalInfo[key] = value;
  }

  onEntityViewIdCopied(): void {
    this.toast.showSuccess(this.translate.instant('entity-view.idCopiedMessage'), 750, this.element.nativeElement.parentElement?.parentElement, 'bottom left');
  }

  copyEntityViewId(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.entityView()?.id?.id).then(() => this.onEntityViewIdCopied());
  }
}
