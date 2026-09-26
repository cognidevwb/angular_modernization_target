import { Component, Type, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { TenantService } from '../../api/services/tenant.service';
import { types } from '../../common/constants/types';
import { goState } from '../../../state-paths';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { TbTenantDirective } from '../tb-tenant/tb-tenant.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TenantCardComponent } from './tenant-card.component';
import { AddTenantDialogComponent } from './add-tenant-dialog.component';

/**
 * Ported from the AngularJS controller `TenantController` (module `thingsboard.tenant`) in src/app/tenant/index.js:26.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tenant',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbTenantDirective, TbAttributeTableDirective, TbAlarmTableDirective, TbEventTableDirective, TbRelationTableDirective],
  templateUrl: './tenant.component.html',
})
export class TenantComponent {
  protected readonly tenantService = inject(TenantService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;

  readonly tenantCard: Type<unknown> = TenantCardComponent;
  readonly addTenantDialog: Type<unknown> = AddTenantDialogComponent;

  protected tenantActionsList: any;
  types: any;
  tenantGridConfig: GridConfig;
  grid!: TbGridDirective;

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

        actionsList: this.tenantActionsList,

        onGridInited: this.gridInited,

        addItemText: (...rest: any[]) => { return this.translate.instant('tenant.add-tenant-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('tenant.no-tenants-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('tenant.tenant-details') }
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
        this.tenantGridConfig.items = items;
    }
    const topIndex = Number(this.route.snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
        this.tenantGridConfig.topIndex = topIndex;
    }
  }

  deleteTenantTitle = (tenant?: any, ...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenant-title', {tenantTitle: tenant.title});
  };

  deleteTenantText = (...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenant-text');
  };

  deleteTenantsTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenants-title', {count: selectedCount});
  };

  deleteTenantsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenants-action-title', {count: selectedCount});
  };

  deleteTenantsText = (...rest: any[]): any => {
    return this.translate.instant('tenant.delete-tenants-text');
  };

  gridInited = (grid: TbGridDirective): void => {
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
    goState(this.router, 'home.tenants.users', {tenantId: tenant.id.id});
  };
}
