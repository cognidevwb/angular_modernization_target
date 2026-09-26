import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../api/services/customer.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbCustomerDirective } from '../tb-customer/tb-customer.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import addCustomerTemplate from '../../../../app/customer/add-customer.tpl.html?raw';
import customerCard from '../../../../app/customer/customer-card.tpl.html?raw';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `CustomerController` (module `thingsboard.customer`) in src/app/customer/index.js:26.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'customer',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbCustomerDirective), forwardRef(() => TbAttributeTableDirective), forwardRef(() => TbAlarmTableDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRelationTableDirective), forwardRef(() => TbAuditLogTableDirective)],
  templateUrl: './customer.component.html',
})
export class CustomerComponent {
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  // TODO(port): elements not resolved to a component: details-buttons

  protected customerActionsList: any;
  types: any;
  customerGridConfig: any;
  grid: any;

  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

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

        itemCardTemplateUrl: customerCard,

        actionsList: this.customerActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addCustomerTemplate,

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
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.customerGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.customerGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.openCustomerUsers = this.openCustomerUsers;
    this.openCustomerAssets = this.openCustomerAssets;
    this.openCustomerDevices = this.openCustomerDevices;
    this.openCustomerDashboards = this.openCustomerDashboards;
  }

  deleteCustomerTitle = (customer?: any, ...rest: any[]): any => {
    return this.translate.instant('customer.delete-customer-title', {customerTitle: customer.title});
  };

  deleteCustomerText = (...rest: any[]): any => {
    return this.translate.instant('customer.delete-customer-text');
  };

  deleteCustomersTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('customer.delete-customers-title', {count: selectedCount}, 'messageformat');
  };

  deleteCustomersActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('customer.delete-customers-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteCustomersText = (...rest: any[]): any => {
    return this.translate.instant('customer.delete-customers-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
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
    (this.router as any).go('home.customers.users', {customerId: customer.id.id});
  };

  openCustomerAssets = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    (this.router as any).go('home.customers.assets', {customerId: customer.id.id});
  };

  openCustomerDevices = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    (this.router as any).go('home.customers.devices', {customerId: customer.id.id});
  };

  openCustomerDashboards = ($event?: any, customer?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    (this.router as any).go('home.customers.dashboards', {customerId: customer.id.id});
  };
}
