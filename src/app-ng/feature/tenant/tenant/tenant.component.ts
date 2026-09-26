import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { TenantService } from '../../api/services/tenant.service';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbTenantDirective } from '../tb-tenant/tb-tenant.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import addTenantTemplate from '../../../../app/tenant/add-tenant.tpl.html?raw';
import tenantCard from '../../../../app/tenant/tenant-card.tpl.html?raw';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `TenantController` (module `thingsboard.tenant`) in src/app/tenant/index.js:26.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tenant',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbTenantDirective), forwardRef(() => TbAttributeTableDirective), forwardRef(() => TbAlarmTableDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRelationTableDirective)],
  templateUrl: './tenant.component.html',
})
export class TenantComponent {
  protected readonly tenantService = inject(TenantService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  // TODO(port): elements not resolved to a component: details-buttons

  protected tenantActionsList: any;
  types: any;
  tenantGridConfig: any;
  grid: any;

  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

  constructor() {
    this.tenantActionsList = [
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.openTenantUsers($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('tenant.admins') },
            details: (...rest: any[]) => { return this.translate.instant('tenant.manage-tenant-admins') },
            icon: "account_circle"
        },
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.deleteItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.delete') },
            details: (...rest: any[]) => { return this.translate.instant('tenant.delete') },
            icon: "delete"
        }
    ];
    this.types = this.typesRef;
    this.tenantGridConfig = {

        refreshParamsFunc: null,

        deleteItemTitleFunc: this.deleteTenantTitle,
        deleteItemContentFunc: this.deleteTenantText,
        deleteItemsTitleFunc: this.deleteTenantsTitle,
        deleteItemsActionTitleFunc: this.deleteTenantsActionTitle,
        deleteItemsContentFunc: this.deleteTenantsText,

        fetchItemsFunc: this.fetchTenants,
        saveItemFunc: this.saveTenant,
        deleteItemFunc: this.deleteTenant,

        getItemTitleFunc: this.getTenantTitle,

        itemCardTemplateUrl: tenantCard,

        actionsList: this.tenantActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addTenantTemplate,

        addItemText: (...rest: any[]) => { return this.translate.instant('tenant.add-tenant-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('tenant.no-tenants-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('tenant.tenant-details') }
    };
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.tenantGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.tenantGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.openTenantUsers = this.openTenantUsers;
  }

  deleteTenantTitle = (tenant?: any, ...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenant-title', {tenantTitle: tenant.title});
  };

  deleteTenantText = (...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenant-text');
  };

  deleteTenantsTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenants-title', {count: selectedCount}, 'messageformat');
  };

  deleteTenantsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenants-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteTenantsText = (...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenants-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  fetchTenants = (pageLink?: any, ...rest: any[]): any => {
    return this.tenantService.getTenants(pageLink);
  };

  saveTenant = (tenant?: any, ...rest: any[]): any => {
    return this.tenantService.saveTenant(tenant);
  };

  deleteTenant = (tenantId?: any, ...rest: any[]): any => {
    return this.tenantService.deleteTenant(tenantId);
  };

  getTenantTitle = (tenant?: any, ...rest: any[]): any => {
    return tenant ? tenant.title : '';
  };

  openTenantUsers = ($event?: any, tenant?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    (this.router as any).go('home.tenants.users', {tenantId: tenant.id.id});
  };
}
