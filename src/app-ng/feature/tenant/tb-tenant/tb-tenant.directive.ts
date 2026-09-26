import { Component, ElementRef, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
 * Ported from the AngularJS directive `tbTenant` (module `thingsboard.tenant`) in src/app/tenant/tenant.directive.js
 * (template src/app/tenant/tenant-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-tenant dialog's form.
 */
@Component({
  selector: 'tb-tenant',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, FormsModule, TbContactDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-tenant.directive.html',
})
export class TbTenantDirective {
  protected readonly rootScope = inject(RootState);
  readonly tenant = model<any>();
  readonly isEdit = model<any>();
  readonly theForm = model<any>();
  readonly onManageUsers = output<any>();
  readonly onDeleteTenant = output<any>();

  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly element = inject(ElementRef);

  /** `ng-model="tenant.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(tenant: any, key: string, value: any): void {
    tenant.additionalInfo = tenant.additionalInfo || {};
    tenant.additionalInfo[key] = value;
  }

  onTenantIdCopied(): void {
    this.toast.showSuccess(this.translate.instant('tenant.idCopiedMessage'), 750, this.element.nativeElement.parentElement?.parentElement, 'bottom left');
  }

  copyTenantId(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.tenant()?.id?.id).then(() => this.onTenantIdCopied());
  }
}
