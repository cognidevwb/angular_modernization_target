import { Component, forwardRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';

import $ from 'jquery';
import changePasswordTemplate from '../../../../app/profile/change-password.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let SUPPORTED_LANGS: any;

/**
 * Ported from the AngularJS controller `ProfileController` (module `thingsboard.profile`) in src/app/profile/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'profile',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatProgressBarModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbConfirmOnExitDirective)],
  templateUrl: './profile.component.html',
})
export class ProfileComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly userService = inject(UserService);
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  // TODO(port): AngularJS built-in filters in the template: date — use Angular pipes

  profileUser: any = {};
  languageList: any = SUPPORTED_LANGS;
  theForm: any;

  constructor() {
    this.save = this.save;
    this.changePassword = this.changePassword;
    this.loadProfile();
  }

  loadProfile(...rest: any[]): any {
    this.userService.getUser(this.userService.getCurrentUser().userId).then((user?: any) => {
        this.profileUser = user;
        if (!this.profileUser.additionalInfo) {
            this.profileUser.additionalInfo = {};
        }
        if (!this.profileUser.additionalInfo.lang) {
            this.profileUser.additionalInfo.lang = (this.translate as any).use();
        }
    });
  }

  save = (...rest: any[]): any => {
    this.userService.saveUser(this.profileUser).then((user?: any) => {
        this.translate.use(this.profileUser.additionalInfo.lang);
        this.profileUser = user;
        this.theForm.$setPristine();
    });
  };

  changePassword = ($event?: any, ...rest: any[]): any => {
    let vm = this;
    (this.dialog as any).show({
        controller: 'ChangePasswordController',
        controllerAs: 'vm',
        templateUrl: changePasswordTemplate,
        parent: $(this.document.body),
        fullscreen: true,
        targetEvent: $event
    }).then(function () {
    }, function () {
    });
  };
}
