import { Component, forwardRef, inject } from '@angular/core';
import { AdminService } from '../../api/services/admin.service';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `AdminController` (module `thingsboard.admin`) in src/app/admin/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'admin',
  standalone: true,
  imports: [TranslatePipe, MatProgressBarModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatCardModule, MatButtonModule, FormsModule, forwardRef(() => TbConfirmOnExitDirective)],
  templateUrl: './admin.component.html',
})
export class AdminComponent {
  protected readonly adminService = inject(AdminService);
  protected readonly toast = inject(ToastService);
  protected readonly rootScope = inject(RootState);
  protected readonly router = inject(Router);
  protected readonly translate = inject(TranslateService);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  smtpProtocols: any = ('smtp smtps').split(' ').map(function (protocol?: any) {
        return protocol;
    });
  tlsVersions: any = ['TLSv1', 'TLSv1.1', 'TLSv1.2', 'TLSv1.3'];
  settings: any;
  settingsForm: any;
  testMailSent: any;

  constructor() {
    this.save = this.save;
    this.sendTestMail = this.sendTestMail;
    this.translate('admin.test-mail-sent').then((translation?: any) => {
        this.testMailSent = translation;
    }, (translationId?: any) => {
        this.testMailSent = translationId;
    });
    this.loadSettings();
  }

  loadSettings(...rest: any[]): any {
    this.adminService.getAdminSettings(this.router.$current.data.key).then((settings?: any) => {
        this.settings = settings;
        if(this.settings.jsonValue && this.settings.jsonValue.enableTls && (typeof this.settings.jsonValue.enableTls === 'string')){
            this.settings.jsonValue.enableTls = this.settings.jsonValue.enableTls === 'true';
        }
    });
  }

  save = (...rest: any[]): any => {
    this.adminService.saveAdminSettings(this.settings).then((settings?: any) => {
        this.settings = settings;
        this.settingsForm.$setPristine();
    });
  };

  sendTestMail = (...rest: any[]): any => {
    this.adminService.sendTestMail(this.settings).then(() => {
        this.toast.showSuccess(this.translate.instant('admin.test-mail-sent'));
    });
  };
}
