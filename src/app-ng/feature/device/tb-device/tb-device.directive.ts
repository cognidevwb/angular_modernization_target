import { Component, effect, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { CustomerService } from '../../api/services/customer.service';
import { DeviceService } from '../../api/services/device.service';
import { ToastService } from '../../services/toast.service';
import { types } from '../../common/constants/types';
import { TbEntitySubtypeAutocompleteDirective } from '../../entity/tb-entity-subtype-autocomplete/tb-entity-subtype-autocomplete.directive';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/**
 * Ported from the AngularJS directive `tbDevice` (module `thingsboard.device`) in src/app/device/device.directive.js
 * (template src/app/device/device-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-device dialog's form.
 */
@Component({
  selector: 'tb-device',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, FormsModule, TbEntitySubtypeAutocompleteDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-device.directive.html',
})
export class TbDeviceDirective {
  protected readonly rootScope = inject(RootState);
  readonly device = model<any>();
  readonly isEdit = model<any>();
  readonly deviceScope = model<any>();
  readonly theForm = model<any>();
  readonly onAssignToCustomer = output<any>();
  readonly onMakePublic = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onManageCredentials = output<any>();
  readonly onDeleteDevice = output<any>();

  protected readonly toast = inject(ToastService);
  protected readonly translate = inject(TranslateService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly customerService = inject(CustomerService);
  protected readonly element = inject(ElementRef);

  types: any = types;
  isAssignedToCustomer = false;
  isPublic = false;
  assignedCustomer: any = null;

  constructor() {
    effect(() => {
      const device = this.device();
      if (device) {
        if (device.customerId && device.customerId.id !== types.id.nullUid) {
          this.isAssignedToCustomer = true;
          this.customerService.getShortCustomerInfo(device.customerId.id).then((customer?: any) => {
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

  /** `ng-model="device.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(device: any, key: string, value: any): void {
    device.additionalInfo = device.additionalInfo || {};
    device.additionalInfo[key] = value;
  }

  /** The toast's parent: two levels above this element, as the legacy directive placed it. */
  private toastParent(): any {
    return this.element.nativeElement.parentElement?.parentElement;
  }

  onDeviceIdCopied(): void {
    this.toast.showSuccess(this.translate.instant('device.idCopiedMessage'), 750, this.toastParent(), 'bottom left');
  }

  copyDeviceId(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.device()?.id?.id).then(() => this.onDeviceIdCopied());
  }

  copyAccessToken(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    if (this.device()?.id) {
      this.deviceService.getDeviceCredentials(this.device().id.id, true).then((credentials?: any) => {
        const credentialsId: any = credentials.credentialsId;
        this.clipboardService.copyToClipboard(trigger, credentialsId).then(() => {
          this.toast.showSuccess(this.translate.instant('device.accessTokenCopiedMessage'), 750, this.toastParent(), 'bottom left');
        });
      });
    }
  }
}
