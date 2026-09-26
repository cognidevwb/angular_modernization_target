import { Component, ElementRef, effect, inject, model, output, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { ToastService } from '../../services/toast.service';
import { TbContactDirective } from '../../components/tb-contact/tb-contact.directive';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/**
 * Ported from the AngularJS directive `tbCustomer` (module `thingsboard.customer`) in src/app/customer/customer.directive.js
 * (template src/app/customer/customer-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-customer dialog's form.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-customer',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, TbContactDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-customer.directive.html',
})
export class TbCustomerDirective {
  protected readonly rootScope = inject(RootState);
  readonly customer = model<any>();
  readonly isEdit = model<any>();
  readonly theForm = model<any>();
  readonly onManageUsers = output<any>();
  readonly onManageAssets = output<any>();
  readonly onManageDevices = output<any>();
  readonly onManageDashboards = output<any>();
  readonly onDeleteCustomer = output<any>();

  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly element = inject(ElementRef);

  isPublic = false;

  constructor() {
    effect(() => {
      const customer = this.customer();
      if (customer) {
        this.isPublic = customer.additionalInfo ? customer.additionalInfo.isPublic : false;
      }
    });
  }

  /** `ng-model="customer.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(customer: any, key: string, value: any): void {
    customer.additionalInfo = customer.additionalInfo || {};
    customer.additionalInfo[key] = value;
  }

  onCustomerIdCopied(): void {
    this.toast.showSuccess(this.translate.instant('customer.idCopiedMessage'), 750, this.element.nativeElement.parentElement?.parentElement, 'bottom left');
  }

  copyCustomerId(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.customer()?.id?.id).then(() => this.onCustomerIdCopied());
  }
}
