import { Component, inject } from '@angular/core';
import { LoginService } from '../../api/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ChangePasswordController` (module `thingsboard.profile`) in src/app/profile/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'change-password',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './change-password.component.html',
})
export class ChangePasswordComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly dialog = inject(MatDialog);
  protected readonly loginService = inject(LoginService);

  currentPassword: any = '';
  newPassword: any = '';
  newPassword2: any = '';
  theForm: any;

  constructor() {
    this.cancel = this.cancel;
    this.changePassword = this.changePassword;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  changePassword = (...rest: any[]): any => {
    if (this.newPassword !== this.newPassword2) {
        this.toast.showError(this.translate.instant('login.passwords-mismatch-error'));
    } else {
        this.loginService.changePassword(this.currentPassword, this.newPassword).then(() => {
            this.theForm.$setPristine();
    (this.dialog as any).hide();
        });
    }
  };
}
