import { RouterLink } from '@angular/router';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoginService } from '../../api/services/login.service';
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
 * Ported from the AngularJS controller `CreatePasswordController` (module `thingsboard.login`) in src/app/login/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'create-password',
  standalone: true,
  imports: [RouterLink, TranslatePipe, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCardModule, MatButtonModule, FormsModule],
  templateUrl: './create-password.component.html',
})
export class CreatePasswordComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly loginService = inject(LoginService);
  protected readonly userService = inject(UserService);

  password: any = '';
  password2: any = '';

  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

  constructor() {
    this.createPassword = this.createPassword;
  }

  createPassword = (...rest: any[]): any => {
    if (this.password !== this.password2) {
        this.toast.showError(this.translate.instant('login.passwords-mismatch-error'));
    } else {
        this.loginService.activate(this.route.snapshot.params['activateToken'], this.password).then((response?: any) => {
            var token: any = response.data.token;
            var refreshToken: any = response.data.refreshToken;
            this.userService.setUserFromJwtToken(token, refreshToken, true);
        }, function fail() {
        });
    }
  };
}
