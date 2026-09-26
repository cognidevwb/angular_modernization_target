import { RouterLink } from '@angular/router';
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { LoginService } from '../../api/services/login.service';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
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
 * Ported from the AngularJS controller `ResetPasswordRequestController` (module `thingsboard.login`) in src/app/login/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'reset-password-request',
  standalone: true,
  imports: [RouterLink, TranslatePipe, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCardModule, MatButtonModule, FormsModule],
  templateUrl: './reset-password-request.component.html',
})
export class ResetPasswordRequestComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly loginService = inject(LoginService);

  email: any = '';

  constructor() {
    this.sendResetPasswordLink = this.sendResetPasswordLink;
  }

  sendResetPasswordLink = (...rest: any[]): any => {
    this.loginService.sendResetPasswordLink(this.email).then(() => {
        this.toast.showSuccess(this.translate.instant('login.password-link-sent-message'));
    }, function fail() {
    });
  };
}
