import { Component, inject, model, output, ChangeDetectionStrategy } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { TbDashboardAutocompleteDirective } from '../../components/tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/** The legacy `ng-pattern` of the user's email. */
const EMAIL_PATTERN = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\_\-0-9]+\.)+[a-zA-Z]{2,}))$/;

/**
 * Ported from the AngularJS directive `tbUser` (module `thingsboard.user`) in src/app/user/user.directive.js
 * (template src/app/user/user-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-user dialog's form.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-user',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, FormsModule, TbDashboardAutocompleteDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-user.directive.html',
})
export class TbUserDirective {
  protected readonly rootScope = inject(RootState);
  readonly user = model<any>();
  readonly isEdit = model<any>();
  readonly theForm = model<any>();
  readonly onDisplayActivationLink = output<any>();
  readonly onResendActivation = output<any>();
  readonly onLoginAsUser = output<any>();
  readonly onDeleteUser = output<any>();
  readonly onSetUserCredentialsEnabled = output<any>();

  protected readonly userService = inject(UserService);
  protected readonly emailPattern = EMAIL_PATTERN;

  loginAsUserEnabled: any = this.userService.isUserTokenAccessEnabled();

  isTenantAdmin(): boolean {
    return !!this.user() && this.user().authority === 'TENANT_ADMIN';
  }

  isCustomerUser(): boolean {
    return !!this.user() && this.user().authority === 'CUSTOMER_USER';
  }

  isUserCredentialsEnabled(): boolean {
    const user = this.user();
    if (user == null || user.additionalInfo == null || user.additionalInfo.userCredentialsEnabled == null) {
      return true;
    }
    return user.additionalInfo.userCredentialsEnabled === true;
  }

  /** `ng-model="user.additionalInfo.x"`: creates `additionalInfo` on first write, as AngularJS did. */
  setAdditionalInfo(user: any, key: string, value: any): void {
    user.additionalInfo = user.additionalInfo || {};
    user.additionalInfo[key] = value;
  }
}
