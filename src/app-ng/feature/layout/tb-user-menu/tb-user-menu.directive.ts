import { Component, inject, model } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { goState } from '../../../state-paths';

/**
 * Ported from the AngularJS directive `tbUserMenu` (module `thingsboard.directives.usermenu`) in src/app/layout/user-menu.directive.js:24.
 * Its `UserMenuController` (controllerAs `vm`) is this class.
 */
@Component({
  selector: 'tb-user-menu',
  standalone: true,
  imports: [TranslatePipe, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './tb-user-menu.directive.html',
})
export class TbUserMenuDirective {
  readonly displayUserInfo = model<any>();

  protected readonly userService = inject(UserService);
  protected readonly translate = inject(TranslateService);
  protected readonly router = inject(Router);

  private readonly dashboardUser: any = this.userService.getCurrentUser();

  authorityName(): string {
    var name: any = "user.anonymous";
    if (this.dashboardUser) {
        var authority: any = this.dashboardUser.authority;
        if (authority === 'SYS_ADMIN') {
            name = 'user.sys-admin';
        } else if (authority === 'TENANT_ADMIN') {
            name = 'user.tenant-admin';
        } else if (authority === 'CUSTOMER_USER') {
            name = 'user.customer';
        }
    }
    return this.translate.instant(name);
  }

  userDisplayName(): string {
    var name: any = "";
    const dashboardUser = this.dashboardUser;
    if (dashboardUser) {
        if ((dashboardUser.firstName && dashboardUser.firstName.length > 0) ||
            (dashboardUser.lastName && dashboardUser.lastName.length > 0)) {
            if (dashboardUser.firstName) {
                name += dashboardUser.firstName;
            }
            if (dashboardUser.lastName) {
                if (name.length > 0) {
                    name += " ";
                }
                name += dashboardUser.lastName;
            }
        } else {
            name = dashboardUser.email;
        }
    }
    return name;
  }

  openProfile(): void {
    goState(this.router, 'home.profile');
  }

  logout(): void {
    this.userService.logout();
  }
}
