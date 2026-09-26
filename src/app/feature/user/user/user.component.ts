import { Component, Type, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ToastService } from '../../services/toast.service';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { TbUserDirective } from '../tb-user/tb-user.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import { AddUserComponent } from '../add-user/add-user.component';
import { ActivationLinkDialogComponent } from '../activation-link-dialog/activation-link-dialog.component';
import { UserCardComponent } from './user-card.component';

/**
 * Ported from the AngularJS controller `UserController` (module `thingsboard.user`) in src/app/user/index.js:27.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'user',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbUserDirective, TbAuditLogTableDirective],
  templateUrl: './user.component.html',
})
export class UserComponent {
  protected readonly userService = inject(UserService);
  protected readonly toast = inject(ToastService);
  protected readonly dialog = inject(MatDialog);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;

  readonly userCard: Type<unknown> = UserCardComponent;
  readonly addUserDialog: Type<unknown> = AddUserComponent;

  tenantId: any;
  customerId: any;
  usersType: any;
  protected userActionsList: any;
  types: any;
  userGridConfig: GridConfig;
  grid!: TbGridDirective;
  topIndex: any;

  constructor() {
    this.tenantId = this.route.snapshot.params['tenantId'];
    this.customerId = this.route.snapshot.params['customerId'];
    this.usersType = this.route.snapshot.data['usersType'];
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

        actionsList: this.userActionsList,

        onGridInited: this.gridInited,

        parentCtl: this,

        addItemText: (...rest: any[]) => { return this.translate.instant('user.add-user-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('user.no-users-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('user.user-details') }
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
        this.userGridConfig.items = items;
    }
    const topIndex = Number(this.route.snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
        this.userGridConfig.topIndex = topIndex;
    }
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
    return this.translate.instant('user.delete-users-title', {count: selectedCount});
  };

  deleteUsersActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('user.delete-users-action-title', {count: selectedCount});
  };

  deleteUsersText = (...rest: any[]): any => {
    return this.translate.instant('user.delete-users-text');
  };

  gridInited = (grid: TbGridDirective): void => {
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

  openActivationLinkDialog(_event?: any, activationLink?: any): void {
    this.dialog.open(ActivationLinkDialogComponent, { data: { activationLink } });
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
