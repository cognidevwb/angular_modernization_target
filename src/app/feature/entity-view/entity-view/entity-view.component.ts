import { Component, Type, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { CustomerService } from '../../api/services/customer.service';
import { EntityViewService } from '../../api/services/entity-view.service';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { TbEntityViewDirective } from '../tb-entity-view/tb-entity-view.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import { EntityViewCardComponent } from '../entity-view-card/entity-view-card.component';
import { AssignEntityViewToCustomerComponent } from '../assign-entity-view-to-customer/assign-entity-view-to-customer.component';
import { AddEntityViewsToCustomerComponent } from '../add-entity-views-to-customer/add-entity-views-to-customer.component';
import { AddEntityViewDialogComponent } from './add-entity-view-dialog.component';

/**
 * Ported from the AngularJS controller `EntityViewController` (module `thingsboard.entityView`) in src/app/entity-view/entity-view.controller.js
 * (template src/app/entity-view/entity-views.tpl.html): the tenant's / a customer's entity views in tb-grid.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'entity-view',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbEntityViewDirective, TbAttributeTableDirective, TbAlarmTableDirective, TbEventTableDirective, TbRelationTableDirective, TbAuditLogTableDirective],
  templateUrl: './entity-view.component.html',
})
export class EntityViewComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);

  readonly entityViewCard: Type<unknown> = EntityViewCardComponent;
  readonly addEntityViewDialog: Type<unknown> = AddEntityViewDialogComponent;

  protected customerId: any;
  protected entityViewActionsList: any[] = [];
  protected entityViewGroupActionsList: any[] = [];
  types: any = types;
  entityViewGridConfig: GridConfig;
  entityViewsScope: any;
  customerEntityViewsTitle: any;
  grid!: TbGridDirective;
  topIndex: any;

  constructor() {
    const snapshot = this.route.snapshot;
    this.customerId = snapshot.params['customerId'];
    this.entityViewGridConfig = {
      deleteItemTitleFunc: this.deleteEntityViewTitle,
      deleteItemContentFunc: this.deleteEntityViewText,
      deleteItemsTitleFunc: this.deleteEntityViewsTitle,
      deleteItemsActionTitleFunc: this.deleteEntityViewsActionTitle,
      deleteItemsContentFunc: this.deleteEntityViewsText,

      saveItemFunc: this.saveEntityView,

      getItemTitleFunc: this.getEntityViewTitle,

      parentCtl: this,

      actionsList: this.entityViewActionsList,
      groupActionsList: this.entityViewGroupActionsList,

      onGridInited: this.gridInited,

      addItemText: () => this.translate.instant('entity-view.add-entity-view-text'),
      noItemsText: () => this.translate.instant('entity-view.no-entity-views-text'),
      itemDetailsText: () => this.translate.instant('entity-view.entity-view-details'),
      isDetailsReadOnly: this.isCustomerUser,
      isSelectionEnabled: () => !this.isCustomerUser(),
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
      this.entityViewGridConfig.items = items;
    }
    const topIndex = Number(snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
      this.entityViewGridConfig.topIndex = topIndex;
    }
    this.entityViewsScope = snapshot.data['entityViewsType'];
    this.initController();
  }

  initController(): void {
    let fetchEntityViewsFunction: any = null;
    let deleteEntityViewFunction: any = null;
    let refreshEntityViewsParamsFunction: any = null;

    const user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
      this.entityViewsScope = 'customer_user';
      this.customerId = user.customerId;
    }
    if (this.customerId) {
      this.customerEntityViewsTitle = this.translate.instant('customer.entity-views');
      this.customerService.getShortCustomerInfo(this.customerId).then((info?: any) => {
        if (info.isPublic) {
          this.customerEntityViewsTitle = this.translate.instant('customer.public-entity-views');
        }
      });
    }

    if (this.entityViewsScope === 'tenant') {
      fetchEntityViewsFunction = (pageLink?: any, entityViewType?: any) => this.entityViewService.getTenantEntityViews(pageLink, true, null, entityViewType);
      deleteEntityViewFunction = (entityViewId?: any) => this.entityViewService.deleteEntityView(entityViewId);
      refreshEntityViewsParamsFunction = () => ({ topIndex: this.topIndex });

      this.entityViewActionsList.push({
        onAction: ($event?: any, item?: any) => this.makePublic($event, item),
        name: () => this.translate.instant('action.share'),
        details: () => this.translate.instant('entity-view.make-public'),
        icon: 'share',
        isEnabled: (entityView?: any) => entityView && (!entityView.customerId || entityView.customerId.id === types.id.nullUid),
      });
      this.entityViewActionsList.push({
        onAction: ($event?: any, item?: any) => this.assignToCustomer($event, [item.id.id]),
        name: () => this.translate.instant('action.assign'),
        details: () => this.translate.instant('entity-view.assign-to-customer'),
        icon: 'assignment_ind',
        isEnabled: (entityView?: any) => entityView && (!entityView.customerId || entityView.customerId.id === types.id.nullUid),
      });
      this.entityViewActionsList.push({
        onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, false),
        name: () => this.translate.instant('action.unassign'),
        details: () => this.translate.instant('entity-view.unassign-from-customer'),
        icon: 'assignment_return',
        isEnabled: (entityView?: any) =>
          entityView && entityView.customerId && entityView.customerId.id !== types.id.nullUid && !entityView.assignedCustomer.isPublic,
      });
      this.entityViewActionsList.push({
        onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, true),
        name: () => this.translate.instant('action.make-private'),
        details: () => this.translate.instant('entity-view.make-private'),
        icon: 'reply',
        isEnabled: (entityView?: any) =>
          entityView && entityView.customerId && entityView.customerId.id !== types.id.nullUid && entityView.assignedCustomer.isPublic,
      });
      this.entityViewActionsList.push({
        onAction: ($event?: any, item?: any) => this.grid.deleteItem($event, item),
        name: () => this.translate.instant('action.delete'),
        details: () => this.translate.instant('entity-view.delete'),
        icon: 'delete',
      });

      this.entityViewGroupActionsList.push({
        onAction: ($event?: any, items?: any) => this.assignEntityViewsToCustomer($event, items),
        name: () => this.translate.instant('entity-view.assign-entity-views'),
        details: (selectedCount?: any) => this.translate.instant('entity-view.assign-entity-views-text', { count: selectedCount }),
        icon: 'assignment_ind',
      });
      this.entityViewGroupActionsList.push({
        onAction: ($event?: any) => this.grid.deleteItems($event),
        name: () => this.translate.instant('entity-view.delete-entity-views'),
        details: this.deleteEntityViewsActionTitle,
        icon: 'delete',
      });
    } else if (this.entityViewsScope === 'customer' || this.entityViewsScope === 'customer_user') {
      fetchEntityViewsFunction = (pageLink?: any, entityViewType?: any) =>
        this.entityViewService.getCustomerEntityViews(this.customerId, pageLink, true, null, entityViewType);
      deleteEntityViewFunction = (entityViewId?: any) => this.entityViewService.unassignEntityViewFromCustomer(entityViewId);
      refreshEntityViewsParamsFunction = () => ({ customerId: this.customerId, topIndex: this.topIndex });

      if (this.entityViewsScope === 'customer') {
        this.entityViewActionsList.push({
          onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, false),
          name: () => this.translate.instant('action.unassign'),
          details: () => this.translate.instant('entity-view.unassign-from-customer'),
          icon: 'assignment_return',
          isEnabled: (entityView?: any) => entityView && !entityView.assignedCustomer.isPublic,
        });
        this.entityViewGroupActionsList.push({
          onAction: ($event?: any, items?: any) => this.unassignEntityViewsFromCustomer($event, items),
          name: () => this.translate.instant('entity-view.unassign-entity-views'),
          details: (selectedCount?: any) => this.translate.instant('entity-view.unassign-entity-views-action-title', { count: selectedCount }),
          icon: 'assignment_return',
        });
        this.entityViewGridConfig.addItemAction = {
          onAction: ($event?: any) => this.addEntityViewsToCustomer($event),
          name: () => this.translate.instant('entity-view.assign-entity-views'),
          details: () => this.translate.instant('entity-view.assign-new-entity-view'),
          icon: 'add',
        };
      } else if (this.entityViewsScope === 'customer_user') {
        this.entityViewGridConfig.addItemAction = {};
      }
    }

    this.entityViewGridConfig.refreshParamsFunc = refreshEntityViewsParamsFunction;
    this.entityViewGridConfig.fetchItemsFunc = fetchEntityViewsFunction;
    this.entityViewGridConfig.deleteItemFunc = deleteEntityViewFunction;
  }

  deleteEntityViewTitle = (entityView?: any): any => this.translate.instant('entity-view.delete-entity-view-title', { entityViewName: entityView.name });

  deleteEntityViewText = (): any => this.translate.instant('entity-view.delete-entity-view-text');

  deleteEntityViewsTitle = (selectedCount?: any): any => this.translate.instant('entity-view.delete-entity-views-title', { count: selectedCount });

  deleteEntityViewsActionTitle = (selectedCount?: any): any =>
    this.translate.instant('entity-view.delete-entity-views-action-title', { count: selectedCount });

  deleteEntityViewsText = (): any => this.translate.instant('entity-view.delete-entity-views-text');

  gridInited = (grid: TbGridDirective): void => {
    this.grid = grid;
  };

  getEntityViewTitle = (entityView?: any): any => (entityView ? entityView.name : '');

  saveEntityView = (entityView?: any): Promise<any> => {
    return Promise.resolve(this.entityViewService.saveEntityView(entityView)).then((savedEntityView?: any) => {
      this.rootScope.$broadcast('entityViewSaved');
      return Promise.resolve(this.customerService.applyAssignedCustomersInfo([savedEntityView])).then((items?: any) =>
        items && items.length == 1 ? items[0] : Promise.reject(),
      );
    });
  };

  isCustomerUser = (): boolean => this.entityViewsScope === 'customer_user';

  assignToCustomer = ($event?: any, entityViewIds?: any): void => {
    $event?.stopPropagation?.();
    const pageSize = 10;
    this.customerService.getCustomers({ limit: pageSize, textSearch: '' }).then(
      (_customers?: any) => {
        const customers: any = {
          pageSize: pageSize,
          data: _customers.data,
          nextPageLink: _customers.nextPageLink,
          selection: null,
          hasNext: _customers.hasNext,
          pending: false,
        };
        if (customers.hasNext) {
          customers.nextPageLink.limit = pageSize;
        }
        this.openThenRefresh(AssignEntityViewToCustomerComponent, { entityViewIds, customers });
      },
      () => undefined,
    );
  };

  addEntityViewsToCustomer($event?: any): void {
    $event?.stopPropagation?.();
    const pageSize = 10;
    this.entityViewService.getTenantEntityViews({ limit: pageSize, textSearch: '' }, false).then(
      (_entityViews?: any) => {
        const entityViews: any = {
          pageSize: pageSize,
          data: _entityViews.data,
          nextPageLink: _entityViews.nextPageLink,
          selections: {},
          selectedCount: 0,
          hasNext: _entityViews.hasNext,
          pending: false,
        };
        if (entityViews.hasNext) {
          entityViews.nextPageLink.limit = pageSize;
        }
        this.openThenRefresh(AddEntityViewsToCustomerComponent, { customerId: this.customerId, entityViews });
      },
      () => undefined,
    );
  }

  /** Opens `component` with `data`; refreshes the grid when it closes with a result. */
  private openThenRefresh(component: Type<unknown>, data: any): void {
    firstValueFrom(this.dialog.open(component, { data }).afterClosed()).then((result) => {
      if (result) {
        this.grid.refreshList();
      }
    });
  }

  assignEntityViewsToCustomer($event?: any, items?: any): void {
    this.assignToCustomer($event, Object.keys(items.selections));
  }

  unassignFromCustomer = ($event?: any, entityView?: any, isPublic?: any): void => {
    $event?.stopPropagation?.();
    let title: any;
    let content: any;
    if (isPublic) {
      title = this.translate.instant('entity-view.make-private-entity-view-title', { entityViewName: entityView.name });
      content = this.translate.instant('entity-view.make-private-entity-view-text');
    } else {
      title = this.translate.instant('entity-view.unassign-entity-view-title', { entityViewName: entityView.name });
      content = this.translate.instant('entity-view.unassign-entity-view-text');
    }
    this.confirm(title, content).then(
      () => this.entityViewService.unassignEntityViewFromCustomer(entityView.id.id).then(() => this.grid.refreshList()),
      () => undefined,
    );
  };

  unassignEntityViewsFromCustomer($event?: any, items?: any): void {
    this.confirm(
      this.translate.instant('entity-view.unassign-entity-views-title', { count: items.selectedCount }),
      this.translate.instant('entity-view.unassign-entity-views-text'),
    ).then(
      () => {
        const tasks = Object.keys(items.selections).map((id) => this.entityViewService.unassignEntityViewFromCustomer(id));
        Promise.all(tasks).then(() => this.grid.refreshList());
      },
      () => undefined,
    );
  }

  makePublic = ($event?: any, entityView?: any): void => {
    $event?.stopPropagation?.();
    this.confirm(
      this.translate.instant('entity-view.make-public-entity-view-title', { entityViewName: entityView.name }),
      this.translate.instant('entity-view.make-public-entity-view-text'),
    ).then(
      () => this.entityViewService.makeEntityViewPublic(entityView.id.id).then(() => this.grid.refreshList()),
      () => undefined,
    );
  };

  /** The legacy confirm dialog, with the page's yes / no buttons. */
  private confirm(title: string, htmlContent: string): Promise<void> {
    return showConfirm(this.dialog, {
      title,
      htmlContent,
      cancel: this.translate.instant('action.no'),
      ok: this.translate.instant('action.yes'),
    });
  }
}
