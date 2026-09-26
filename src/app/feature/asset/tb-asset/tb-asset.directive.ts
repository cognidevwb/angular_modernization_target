import { Component, ElementRef, effect, inject, model, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { CustomerService } from '../../api/services/customer.service';
import { ToastService } from '../../services/toast.service';
import { types } from '../../common/constants/types';
import { TbEntitySubtypeAutocompleteDirective } from '../../entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/**
 * Ported from the AngularJS directive `tbAsset` (module `thingsboard.asset`) in src/app/asset/asset.directive.js
 * (template src/app/asset/asset-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-asset dialog's form.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-asset',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, TbEntitySubtypeAutocompleteDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-asset.directive.html',
})
export class TbAssetDirective {
  protected readonly rootScope = inject(RootState);
  readonly asset = model<any>();
  readonly isEdit = model<any>();
  readonly assetScope = model<any>();
  readonly theForm = model<any>();
  readonly onAssignToCustomer = output<any>();
  readonly onMakePublic = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onDeleteAsset = output<any>();

  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly customerService = inject(CustomerService);
  protected readonly element = inject(ElementRef);

  types: any = types;
  isAssignedToCustomer = false;
  isPublic = false;
  assignedCustomer: any = null;

  constructor() {
    effect(() => {
      const asset = this.asset();
      if (asset) {
        if (asset.customerId && asset.customerId.id !== types.id.nullUid) {
          this.isAssignedToCustomer = true;
          this.customerService.getShortCustomerInfo(asset.customerId.id).then((customer?: any) => {
            this.assignedCustomer = customer;
            this.isPublic = customer.isPublic;
          });
        } else {
          this.isAssignedToCustomer = false;
          this.isPublic = false;
          this.assignedCustomer = null;
        }
      }
    });
  }

  /** `ng-model="asset.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(asset: any, key: string, value: any): void {
    asset.additionalInfo = asset.additionalInfo || {};
    asset.additionalInfo[key] = value;
  }

  onAssetIdCopied(): void {
    this.toast.showSuccess(this.translate.instant('asset.idCopiedMessage'), 750, this.element.nativeElement.parentElement?.parentElement, 'bottom left');
  }

  copyAssetId(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.asset()?.id?.id).then(() => this.onAssetIdCopied());
  }
}
