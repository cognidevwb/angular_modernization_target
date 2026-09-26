import { Component, forwardRef, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { UserService } from '../../api/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbDashboardAutocompleteDirective } from '../../components/tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive';

import $ from 'jquery';
import userFieldsetTemplate from '../../../../app/user/user-fieldset.tpl.html?raw';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbUser` (module `thingsboard.user`) in src/app/user/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-user',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbDashboardAutocompleteDirective)],
  templateUrl: './tb-user.directive.html',
})
export class TbUserDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly user = model<any>();
  readonly isEdit = model<any>();
  readonly theForm = model<any>();
  readonly onDisplayActivationLink = output<any>();
  readonly onResendActivation = output<any>();
  readonly onLoginAsUser = output<any>();
  readonly onDeleteUser = output<any>();
  readonly onSetUserCredentialsEnabled = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 2 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(userFieldsetTemplate);
  loginAsUserEnabled: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.loginAsUserEnabled = this.userService.isUserTokenAccessEnabled();
    $compile($(this.element.nativeElement).contents())(this);
  }

  isTenantAdmin(...rest: any[]): any {
    return this.user() && this.user().authority === 'TENANT_ADMIN';
  }

  isCustomerUser(...rest: any[]): any {
    return this.user() && this.user().authority === 'CUSTOMER_USER';
  }

  isUserCredentialsEnabled(...rest: any[]): any {
    if (this.user() == null || (this.user === undefined) ||
        this.user().additionalInfo == null || (this.user().additionalInfo === undefined) ||
        this.user().additionalInfo.userCredentialsEnabled == null || (this.user().additionalInfo.userCredentialsEnabled === undefined))  {
        return true;
    }
    return this.user().additionalInfo.userCredentialsEnabled === true;
  }
}
