import { Component, Type, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../api/services/customer.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { NgClass } from '@angular/common';
import { goState } from '../../../state-paths';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { CustomerCardComponent } from './customer-card.component';
import { AddCustomerDialogComponent } from './add-customer-dialog.component';
import { TbCustomerDirective } from '../tb-customer/tb-customer.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `CustomerController` (module `thingsboard.customer`) in src/app/customer/index.js:26.
 */
@Component({
  selector: 'customer',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbCustomerDirective, TbAttributeTableDirective, TbAlarmTableDirective, TbEventTableDirective, TbRelationTableDirective, TbAuditLogTableDirective],
  templateUrl: './customer.component.html',
})
export class CustomerComponent {
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;

  readonly customerCard: Type<unknown> = CustomerCardComponent;
  readonly addCustomerDialog: Type<unknown> = AddCustomerDialogComponent;

  protected customerActionsList: any;
  types: any;
  customerGridConfig: GridConfig;
  grid!: TbGridDirective;

  constructor() {
    this.customerActionsList = [
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.openCustomerUsers($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('user.users') },
            details: (...rest: any[]) => { return this.translate.instant('customer.manage-customer-users') },
            icon: "account_circle",
            isEnabled: function(customer?: any, ...rest: any[]) {
                return customer && (!customer.additionalInfo || !customer.additionalInfo.isPublic);
            }
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.openCustomerAssets($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('asset.assets') },
            details: (customer?: any, ...rest: any[]) => {
                if (customer && customer.additionalInfo && customer.additionalInfo.isPublic) {
                    return this.translate.instant('customer.manage-public-assets')
                } else {
                    return this.translate.instant('customer.manage-customer-assets')
                }
                return undefined;
            },
            icon: "domain"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.openCustomerDevices($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('device.devices') },
            details: (customer?: any, ...rest: any[]) => {
                if (customer && customer.additionalInfo && customer.additionalInfo.isPublic) {
                    return this.translate.instant('customer.manage-public-devices')
                } else {
                    return this.translate.instant('customer.manage-customer-devices')
                }
                return undefined;
            },
            icon: "devices_other"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.openCustomerDashboards($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('dashboard.dashboards') },
            details: (customer?: any, ...rest: any[]) => {
                if (customer && customer.additionalInfo && customer.additionalInfo.isPublic) {
                    return this.translate.instant('customer.manage-public-dashboards')
                } else {
                    return this.translate.instant('customer.manage-customer-dashboards')
                }
                return undefined;
            },
            icon: "dashboard"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.deleteItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.delete') },
            details: (...rest: any[]) => { return this.translate.instant('customer.delete') },
            icon: "delete",
            isEnabled: function(customer?: any, ...rest: any[]) {
                return customer && (!customer.additionalInfo || !customer.additionalInfo.isPublic);
            }
        }
    ];
    this.types = this.typesRef;
    this.customerGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: this.deleteCustomerTitle,
        deleteItemContentFunc: this.deleteCustomerText,
        deleteItemsTitleFunc: this.deleteCustomersTitle,
        deleteItemsActionTitleFunc: this.deleteCustomersActionTitle,
        deleteItemsContentFunc: this.deleteCustomersText,

        fetchItemsFunc: this.fetchCustomers,
        saveItemFunc: this.saveCustomer,
        deleteItemFunc: this.deleteCustomer,

        getItemTitleFunc: this.getCustomerTitle,


        actionsList: this.customerActionsList,

        onGridInited: this.gridInited,


        addItemText: (...rest: any[]) => { return this.translate.instant('customer.add-customer-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('customer.no-customers-text') },
        itemDetailsText: (customer?: any, ...rest: any[]) => {
            if (customer && (!customer.additionalInfo || !customer.additionalInfo.isPublic)) {
                return this.translate.instant('customer.customer-details')
            } else {
                return '';
            }
            return undefined;
        },
        isSelectionEnabled: function (customer?: any, ...rest: any[]) {
            return customer && (!customer.additionalInfo || !customer.additionalInfo.isPublic);
        },
        isDetailsReadOnly: function (customer?: any, ...rest: any[]) {
            return customer && customer.additionalInfo && customer.additionalInfo.isPublic;
        }
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
        this.customerGridConfig.items = items;
    }
    const topIndex = Number(this.route.snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
        this.customerGridConfig.topIndex = topIndex;
    }
  }

  deleteCustomerTitle = (customer?: any, ...rest: any[]): any => {
    return this.translate.instant('customer.delete-customer-title', {customerTitle: customer.title});
  };

  deleteCustomerText = (...rest: any[]): any => {
    return this.translate.instant('customer.delete-customer-text');
  };

  deleteCustomersTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('customer.delete-customers-title', {count: selectedCount});
  };

  deleteCustomersActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('customer.delete-customers-action-title', {count: selectedCount});
  };

  deleteCustomersText = (...rest: any[]): any => {
    return this.translate.instant('customer.delete-customers-text');
  };

  gridInited = (grid: TbGridDirective): void => {
    this.grid = grid;
  };

  fetchCustomers = (pageLink?: any, ...rest: any[]): any => {
    return this.customerService.getCustomers(pageLink);
  };

  saveCustomer = (customer?: any, ...rest: any[]): any => {
    return this.customerService.saveCustomer(customer);
  };

  deleteCustomer = (customerId?: any, ...rest: any[]): any => {
    return this.customerService.deleteCustomer(customerId);
  };

  getCustomerTitle = (customer?: any, ...rest: any[]): any => {
    return customer ? customer.title : '';
  };

  openCustomerUsers = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    goState(this.router, 'home.customers.users', {customerId: customer.id.id});
  };

  openCustomerAssets = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    goState(this.router, 'home.customers.assets', {customerId: customer.id.id});
  };

  openCustomerDevices = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    goState(this.router, 'home.customers.devices', {customerId: customer.id.id});
  };

  openCustomerDashboards = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    goState(this.router, 'home.customers.dashboards', {customerId: customer.id.id});
  };
}
