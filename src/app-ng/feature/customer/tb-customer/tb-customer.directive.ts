import { Component, forwardRef, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TbContactDirective } from '../../components/tb-contact/tb-contact.directive';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;

/**
 * Ported from the AngularJS directive `tbCustomer` (module `thingsboard.customer`) in src/app/customer/index.js:26.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-customer',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, forwardRef(() => TbContactDirective)],
  templateUrl: './tb-customer.directive.html',
})
export class TbCustomerDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly customer = model<any>();
  readonly isEdit = model<any>();
  readonly theForm = model<any>();
  readonly onManageUsers = output<any>();
  readonly onManageAssets = output<any>();
  readonly onManageDevices = output<any>();
  readonly onManageDashboards = output<any>();
  readonly onDeleteCustomer = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  isPublic: any = false;
  $watch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.$watch('customer', (newVal?: any) => {
            if (newVal) {
                if (this.customer().additionalInfo) {
                    this.isPublic = this.customer().additionalInfo.isPublic;
                } else {
                    this.isPublic = false;
                }
            }
        });
  }

  onCustomerIdCopied(...rest: any[]): any {
    this.toast.showSuccess(this.translate.instant('customer.idCopiedMessage'), 750, $($(this.element.nativeElement)).parent().parent(), 'bottom left');
  }
}
