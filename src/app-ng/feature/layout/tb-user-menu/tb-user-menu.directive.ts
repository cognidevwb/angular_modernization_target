import { Component, model } from '@angular/core';
// @ts-expect-error - no type declarations exist for the raw .html template import
import userMenuTemplate from '../../../../app/layout/user-menu.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function UserMenuController(this: any, $scope?: any, userService?: any, $translate?: any, $state?: any) {

    var vm: any = this;

    var dashboardUser: any = userService.getCurrentUser();

    vm.authorityName = authorityName;
    vm.logout = logout;
    vm.openProfile = openProfile;
    vm.userDisplayName = userDisplayName;

    function authorityName() {
        var name: any = "user.anonymous";
        if (dashboardUser) {
            var authority: any = dashboardUser.authority;
            if (authority === 'SYS_ADMIN') {
                name = 'user.sys-admin';
            } else if (authority === 'TENANT_ADMIN') {
                name = 'user.tenant-admin';
            } else if (authority === 'CUSTOMER_USER') {
                name = 'user.customer';
            }
        }
        return $translate.instant(name);
    }

    function userDisplayName() {
        var name: any = "";
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

    function openProfile() {
        $state.go('home.profile');
    }

    function logout() {
        userService.logout();
    }
}

/**
 * Ported from the AngularJS directive `tbUserMenu` (module `thingsboard.directives.usermenu`) in src/app/layout/user-menu.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-user-menu',
  standalone: true,
  imports: [TranslatePipe, MatMenuModule, MatIconModule, MatButtonModule],
  templateUrl: './tb-user-menu.directive.html',
})
export class TbUserMenuDirective {
  readonly displayUserInfo = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            displayUserInfo: '=',
        };
  controller: any = UserMenuController;
  controllerAs: any;
  templateUrl: any = userMenuTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
