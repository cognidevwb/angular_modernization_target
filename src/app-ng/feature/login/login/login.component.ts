import { Component, inject } from '@angular/core';
import { LoginService } from '../../api/services/login.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
const logoSvg = 'assets/svg/logo_title_white.svg';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `LoginController` (module `thingsboard.login`) in src/app/login/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'login',
  standalone: true,
  imports: [TranslatePipe, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDividerModule, MatCardModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly toast = inject(ToastService);
  protected readonly loginService = inject(LoginService);
  protected readonly userService = inject(UserService);
  protected readonly router = inject(Router);
  // TODO(port): AngularJS built-in filters in the template: uppercase — use Angular pipes
  // TODO(port): template: 1 × ui-sref left in place

  logoSvg: any = logoSvg;
  user: any = {
        name: '',
        password: ''
    };
  oauth2Clients: any[] = [];

  // TODO(port): $state.go — $state.go: this.router.navigate([...])

  constructor() {
    this.login = this.login;
  }

  doLogin(...rest: any[]): any {
    this.loginService.login(this.user).then((response?: any) => {
        var token: any = response.data.token;
        var refreshToken: any = response.data.refreshToken;
        this.userService.setUserFromJwtToken(token, refreshToken, true);
    }, (response?: any) => {
        /*if (response && response.data && response.data.message) {
            toast.showError(response.data.message);
        } else if (response && response.statusText) {
            toast.showError(response.statusText);
        } else {
            toast.showError($translate.instant('error.unknown-error'));
        }*/
        if (response && response.data && response.data.errorCode) {
            if (response.data.errorCode === types.serverErrorCode.credentialsExpired) {
this.router.navigate(['/login/resetExpiredPassword'], {queryParams: {resetToken: response.data.resetToken}});
            }
        }
    });
  }

  login = (...rest: any[]): any => {
    this.doLogin();
  };
}
