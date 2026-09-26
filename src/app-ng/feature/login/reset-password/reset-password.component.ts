import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../api/services/login.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ResetPasswordController` (module `thingsboard.login`) in src/app/login/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'reset-password',
  standalone: true,
  imports: [TranslatePipe, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCardModule, MatButtonModule, FormsModule],
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly route = inject(ActivatedRoute);
  protected readonly router = inject(Router);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly loginService = inject(LoginService);
  protected readonly userService = inject(UserService);
  // TODO(port): template: 1 × ui-sref left in place

  newPassword: any = '';
  newPassword2: any = '';
  isExpiredPassword: any;

  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

  constructor() {
    this.resetPassword = this.resetPassword;
    this.isExpiredPassword = (this.router as any).$current.data.expiredPassword === true;
  }

  resetPassword = (...rest: any[]): any => {
    if (this.newPassword !== this.newPassword2) {
        this.toast.showError(this.translate.instant('login.passwords-mismatch-error'));
    } else {
        this.loginService.resetPassword(this.route.snapshot.params['resetToken'], this.newPassword).then((response?: any) => {
            var token: any = response.data.token;
            var refreshToken: any = response.data.refreshToken;
            this.userService.setUserFromJwtToken(token, refreshToken, true);
        }, function fail() {
        });
    }
  };
}
