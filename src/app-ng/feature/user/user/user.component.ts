import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbUserDirective } from '../tb-user/tb-user.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';

import $ from 'jquery';
import addUserTemplate from '../../../../app/user/add-user.tpl.html';
import userCard from '../../../../app/user/user-card.tpl.html';
import activationLinkDialogTemplate from '../../../../app/user/activation-link.dialog.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `UserController` (module `thingsboard.user`) in src/app/user/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'user',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbUserDirective), forwardRef(() => TbAuditLogTableDirective)],
  templateUrl: './user.component.html',
})
export class UserComponent {
  protected readonly userService = inject(UserService);
  protected readonly toast = inject(ToastService);
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  // TODO(port): elements not resolved to a component: details-buttons

  protected tenantId: any;
  protected customerId: any;
  protected usersType: any;
  protected userActionsList: any;
  types: any;
  userGridConfig: any;
  grid: any;
  topIndex: any;

  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

  constructor() {
    this.tenantId = this.route.snapshot.params['tenantId'];
    this.customerId = this.route.snapshot.params['customerId'];
    this.usersType = this.router.$current.data.usersType;
    this.userActionsList = [
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.loginAsUser(item);
            },
            name: (...rest: any[]) => { return this.translate.instant('login.login') },
            details: (...rest: any[]) => { return this.translate.instant(this.usersType === 'tenant' ? 'user.login-as-tenant-admin' : 'user.login-as-customer-user') },
            icon: "login",
            isEnabled: (...rest: any[]) => {
                return this.userService.isUserTokenAccessEnabled();
            }
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.deleteItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.delete') },
            details: (...rest: any[]) => { return this.translate.instant('user.delete') },
            icon: "delete"
        }
    ];
    this.types = this.typesRef;
    this.userGridConfig = {
        deleteItemTitleFunc: this.deleteUserTitle,
        deleteItemContentFunc: this.deleteUserText,
        deleteItemsTitleFunc: this.deleteUsersTitle,
        deleteItemsActionTitleFunc: this.deleteUsersActionTitle,
        deleteItemsContentFunc: this.deleteUsersText,

        deleteItemFunc: this.deleteUser,

        getItemTitleFunc: this.getUserTitle,
        itemCardTemplateUrl: userCard,

        actionsList: this.userActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addUserTemplate,
        addItemController: 'AddUserController',

        addItemText: (...rest: any[]) => { return this.translate.instant('user.add-user-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('user.no-users-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('user.user-details') }
    };
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.userGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.userGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.displayActivationLink = this.displayActivationLink;
    this.resendActivation = this.resendActivation;
    this.loginAsUser = this.loginAsUser;
    this.setUserCredentialsEnabled = this.setUserCredentialsEnabled;
    this.initController();
  }

  initController(...rest: any[]): any {
    var fetchUsersFunction: any = null;
    var saveUserFunction: any = null;
    var refreshUsersParamsFunction: any = null;

    if (this.usersType === 'tenant') {
        fetchUsersFunction = (pageLink?: any) => {
            return this.userService.getTenantAdmins(this.tenantId, pageLink);
        };
        saveUserFunction = (user?: any) => {
            user.authority = "TENANT_ADMIN";
            user.tenantId = {
                entityType: this.typesRef.entityType.tenant,
                id: this.tenantId
            };
            return this.userService.saveUser(user);
        };
        refreshUsersParamsFunction = () => {
            return {"tenantId": this.tenantId, "topIndex": this.topIndex};
        };

    } else if (this.usersType === 'customer') {
        fetchUsersFunction = (pageLink?: any) => {
            return this.userService.getCustomerUsers(this.customerId, pageLink);
        };
        saveUserFunction = (user?: any) => {
            user.authority = "CUSTOMER_USER";
            user.customerId = {
                entityType: this.typesRef.entityType.customer,
                id: this.customerId
            };
            return this.userService.saveUser(user);
        };
        refreshUsersParamsFunction = () => {
            return {"customerId": this.customerId, "topIndex": this.topIndex};
        };
    }

    this.userGridConfig.refreshParamsFunc = refreshUsersParamsFunction;
    this.userGridConfig.fetchItemsFunc = fetchUsersFunction;
    this.userGridConfig.saveItemFunc = saveUserFunction;
  }

  deleteUserTitle = (user?: any, ...rest: any[]): any => {
    return this.translate.instant('user.delete-user-title', {userEmail: user.email});
  };

  deleteUserText = (...rest: any[]): any => {
    return this.translate.instant('user.delete-user-text');
  };

  deleteUsersTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('user.delete-users-title', {count: selectedCount}, 'messageformat');
  };

  deleteUsersActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('user.delete-users-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteUsersText = (...rest: any[]): any => {
    return this.translate.instant('user.delete-users-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  getUserTitle = (user?: any, ...rest: any[]): any => {
    return user ? user.email : '';
  };

  deleteUser = (userId?: any, ...rest: any[]): any => {
    return this.userService.deleteUser(userId);
  };

  displayActivationLink = (event?: any, user?: any, ...rest: any[]): any => {
    this.userService.getActivationLink(user.id.id).then(
        (activationLink?: any) => {
            this.openActivationLinkDialog(event, activationLink);
        }
    );
  };

  setUserCredentialsEnabled = (user?: any, userCredentialsEnabled?: any, ...rest: any[]): any => {
    this.userService.setUserCredentialsEnabled(user.id.id, userCredentialsEnabled).then(
        () => {
            if (!user.additionalInfo) {
                user.additionalInfo = {};
            }
            user.additionalInfo.userCredentialsEnabled = userCredentialsEnabled;
            if (userCredentialsEnabled) {
                this.toast.showSuccess(this.translate.instant('user.enable-account-message'));
            } else {
                this.toast.showSuccess(this.translate.instant('user.disable-account-message'));
            }
        }
    )
  };

  openActivationLinkDialog(event?: any, activationLink?: any, ...rest: any[]): any {
    let vm = this;
    this.dialog.show({
        controller: 'ActivationLinkDialogController',
        controllerAs: 'vm',
        templateUrl: activationLinkDialogTemplate,
        locals: {
            activationLink: activationLink
        },
        parent: $(this.document.body),
        fullscreen: true,
        multiple: true,
        targetEvent: event
    });
  }

  resendActivation = (user?: any, ...rest: any[]): any => {
    this.userService.sendActivationEmail(user.email).then(() => {
        this.toast.showSuccess(this.translate.instant('user.activation-email-sent-message'));
    });
  };

  loginAsUser = (user?: any, ...rest: any[]): any => {
    this.userService.loginAsUser(user.id.id);
  };
}
