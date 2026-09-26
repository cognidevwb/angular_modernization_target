import { Component, Type, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { CustomerService } from '../../api/services/customer.service';
import { AssetService } from '../../api/services/asset.service';
import { UserService } from '../../api/services/user.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { TbAssetDirective } from '../tb-asset/tb-asset.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import { AssetCardComponent } from '../asset-card/asset-card.component';
import { AssignAssetToCustomerComponent } from '../assign-asset-to-customer/assign-asset-to-customer.component';
import { AddAssetsToCustomerComponent } from '../add-assets-to-customer/add-assets-to-customer.component';
import { AddAssetDialogComponent } from './add-asset-dialog.component';

/**
 * Ported from the AngularJS controller `AssetController` (module `thingsboard.asset`) in src/app/asset/asset.controller.js
 * (template src/app/asset/assets.tpl.html): the tenant's / a customer's assets in tb-grid.
 */
@Component({
  selector: 'asset',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbAssetDirective, TbAttributeTableDirective, TbAlarmTableDirective, TbEventTableDirective, TbRelationTableDirective, TbAuditLogTableDirective],
  templateUrl: './asset.component.html',
})
export class AssetComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly assetService = inject(AssetService);
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly importExport = inject(ImportExportService);

  readonly assetCard: Type<unknown> = AssetCardComponent;
  readonly addAssetDialog: Type<unknown> = AddAssetDialogComponent;

  protected customerId: any;
  protected assetActionsList: any[] = [];
  protected assetGroupActionsList: any[] = [];
  protected assetAddItemActionsList: any[];
  types: any = types;
  assetGridConfig: GridConfig;
  assetsScope: any;
  customerAssetsTitle: any;
  grid!: TbGridDirective;
  topIndex: any;

  constructor() {
    const snapshot = this.route.snapshot;
    this.customerId = snapshot.params['customerId'];
    this.assetAddItemActionsList = [
      {
        onAction: ($event?: any) => this.grid.addItem($event),
        name: () => this.translate.instant('action.add'),
        details: () => this.translate.instant('asset.add-asset-text'),
        icon: 'insert_drive_file',
      },
      {
        onAction: ($event?: any) => {
          this.importExport.importEntities($event, types.entityType.asset).then(() => this.grid.refreshList());
        },
        name: () => this.translate.instant('action.import'),
        details: () => this.translate.instant('asset.import'),
        icon: 'file_upload',
      },
    ];
    this.assetGridConfig = {
      deleteItemTitleFunc: this.deleteAssetTitle,
      deleteItemContentFunc: this.deleteAssetText,
      deleteItemsTitleFunc: this.deleteAssetsTitle,
      deleteItemsActionTitleFunc: this.deleteAssetsActionTitle,
      deleteItemsContentFunc: this.deleteAssetsText,

      saveItemFunc: this.saveAsset,

      getItemTitleFunc: this.getAssetTitle,

      parentCtl: this,

      actionsList: this.assetActionsList,
      groupActionsList: this.assetGroupActionsList,
      addItemActions: this.assetAddItemActionsList,

      onGridInited: this.gridInited,

      addItemText: () => this.translate.instant('asset.add-asset-text'),
      noItemsText: () => this.translate.instant('asset.no-assets-text'),
      itemDetailsText: () => this.translate.instant('asset.asset-details'),
      isDetailsReadOnly: this.isCustomerUser,
      isSelectionEnabled: () => !this.isCustomerUser(),
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
      this.assetGridConfig.items = items;
    }
    const topIndex = Number(snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
      this.assetGridConfig.topIndex = topIndex;
    }
    this.assetsScope = snapshot.data['assetsType'];
    this.initController();
  }

  initController(): void {
    let fetchAssetsFunction: any = null;
    let deleteAssetFunction: any = null;
    let refreshAssetsParamsFunction: any = null;

    const user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
      this.assetsScope = 'customer_user';
      this.customerId = user.customerId;
    }
    if (this.customerId) {
      this.customerAssetsTitle = this.translate.instant('customer.assets');
      this.customerService.getShortCustomerInfo(this.customerId).then((info?: any) => {
        if (info.isPublic) {
          this.customerAssetsTitle = this.translate.instant('customer.public-assets');
        }
      });
    }

    if (this.assetsScope === 'tenant') {
      fetchAssetsFunction = (pageLink?: any, assetType?: any) => this.assetService.getTenantAssets(pageLink, true, null, assetType);
      deleteAssetFunction = (assetId?: any) => this.assetService.deleteAsset(assetId);
      refreshAssetsParamsFunction = () => ({ topIndex: this.topIndex });

      this.assetActionsList.push({
        onAction: ($event?: any, item?: any) => this.makePublic($event, item),
        name: () => this.translate.instant('action.share'),
        details: () => this.translate.instant('asset.make-public'),
        icon: 'share',
        isEnabled: (asset?: any) => asset && (!asset.customerId || asset.customerId.id === types.id.nullUid),
      });
      this.assetActionsList.push({
        onAction: ($event?: any, item?: any) => this.assignToCustomer($event, [item.id.id]),
        name: () => this.translate.instant('action.assign'),
        details: () => this.translate.instant('asset.assign-to-customer'),
        icon: 'assignment_ind',
        isEnabled: (asset?: any) => asset && (!asset.customerId || asset.customerId.id === types.id.nullUid),
      });
      this.assetActionsList.push({
        onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, false),
        name: () => this.translate.instant('action.unassign'),
        details: () => this.translate.instant('asset.unassign-from-customer'),
        icon: 'assignment_return',
        isEnabled: (asset?: any) => asset && asset.customerId && asset.customerId.id !== types.id.nullUid && !asset.assignedCustomer.isPublic,
      });
      this.assetActionsList.push({
        onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, true),
        name: () => this.translate.instant('action.make-private'),
        details: () => this.translate.instant('asset.make-private'),
        icon: 'reply',
        isEnabled: (asset?: any) => asset && asset.customerId && asset.customerId.id !== types.id.nullUid && asset.assignedCustomer.isPublic,
      });
      this.assetActionsList.push({
        onAction: ($event?: any, item?: any) => this.grid.deleteItem($event, item),
        name: () => this.translate.instant('action.delete'),
        details: () => this.translate.instant('asset.delete'),
        icon: 'delete',
      });

      this.assetGroupActionsList.push({
        onAction: ($event?: any, items?: any) => this.assignAssetsToCustomer($event, items),
        name: () => this.translate.instant('asset.assign-assets'),
        details: (selectedCount?: any) => this.translate.instant('asset.assign-assets-text', { count: selectedCount }),
        icon: 'assignment_ind',
      });
      this.assetGroupActionsList.push({
        onAction: ($event?: any) => this.grid.deleteItems($event),
        name: () => this.translate.instant('asset.delete-assets'),
        details: this.deleteAssetsActionTitle,
        icon: 'delete',
      });
    } else if (this.assetsScope === 'customer' || this.assetsScope === 'customer_user') {
      fetchAssetsFunction = (pageLink?: any, assetType?: any) => this.assetService.getCustomerAssets(this.customerId, pageLink, true, null, assetType);
      deleteAssetFunction = (assetId?: any) => this.assetService.unassignAssetFromCustomer(assetId);
      refreshAssetsParamsFunction = () => ({ customerId: this.customerId, topIndex: this.topIndex });

      if (this.assetsScope === 'customer') {
        this.assetActionsList.push({
          onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, false),
          name: () => this.translate.instant('action.unassign'),
          details: () => this.translate.instant('asset.unassign-from-customer'),
          icon: 'assignment_return',
          isEnabled: (asset?: any) => asset && !asset.assignedCustomer.isPublic,
        });
        this.assetActionsList.push({
          onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, true),
          name: () => this.translate.instant('action.make-private'),
          details: () => this.translate.instant('asset.make-private'),
          icon: 'reply',
          isEnabled: (asset?: any) => asset && asset.assignedCustomer.isPublic,
        });
        this.assetGroupActionsList.push({
          onAction: ($event?: any, items?: any) => this.unassignAssetsFromCustomer($event, items),
          name: () => this.translate.instant('asset.unassign-assets'),
          details: (selectedCount?: any) => this.translate.instant('asset.unassign-assets-action-title', { count: selectedCount }),
          icon: 'assignment_return',
        });
        this.assetGridConfig.addItemAction = {
          onAction: ($event?: any) => this.addAssetsToCustomer($event),
          name: () => this.translate.instant('asset.assign-assets'),
          details: () => this.translate.instant('asset.assign-new-asset'),
          icon: 'add',
        };
      } else if (this.assetsScope === 'customer_user') {
        this.assetGridConfig.addItemAction = {};
      }
      this.assetGridConfig.addItemActions = [];
    }

    this.assetGridConfig.refreshParamsFunc = refreshAssetsParamsFunction;
    this.assetGridConfig.fetchItemsFunc = fetchAssetsFunction;
    this.assetGridConfig.deleteItemFunc = deleteAssetFunction;
  }

  deleteAssetTitle = (asset?: any): any => this.translate.instant('asset.delete-asset-title', { assetName: asset.name });

  deleteAssetText = (): any => this.translate.instant('asset.delete-asset-text');

  deleteAssetsTitle = (selectedCount?: any): any => this.translate.instant('asset.delete-assets-title', { count: selectedCount });

  deleteAssetsActionTitle = (selectedCount?: any): any => this.translate.instant('asset.delete-assets-action-title', { count: selectedCount });

  deleteAssetsText = (): any => this.translate.instant('asset.delete-assets-text');

  gridInited = (grid: TbGridDirective): void => {
    this.grid = grid;
  };

  getAssetTitle = (asset?: any): any => (asset ? asset.name : '');

  saveAsset = (asset?: any): Promise<any> => {
    return this.assetService.saveAsset(asset).then((savedAsset?: any) => {
      this.rootScope.$broadcast('assetSaved');
      return this.customerService.applyAssignedCustomersInfo([savedAsset]).then((items?: any) =>
        items && items.length == 1 ? items[0] : Promise.reject(),
      );
    });
  };

  isCustomerUser = (): boolean => this.assetsScope === 'customer_user';

  assignToCustomer = ($event?: any, assetIds?: any): void => {
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
        this.openThenRefresh(AssignAssetToCustomerComponent, { assetIds, customers });
      },
      () => undefined,
    );
  };

  addAssetsToCustomer($event?: any): void {
    $event?.stopPropagation?.();
    const pageSize = 10;
    this.assetService.getTenantAssets({ limit: pageSize, textSearch: '' }, false).then(
      (_assets?: any) => {
        const assets: any = {
          pageSize: pageSize,
          data: _assets.data,
          nextPageLink: _assets.nextPageLink,
          selections: {},
          selectedCount: 0,
          hasNext: _assets.hasNext,
          pending: false,
        };
        if (assets.hasNext) {
          assets.nextPageLink.limit = pageSize;
        }
        this.openThenRefresh(AddAssetsToCustomerComponent, { customerId: this.customerId, assets });
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

  assignAssetsToCustomer($event?: any, items?: any): void {
    this.assignToCustomer($event, Object.keys(items.selections));
  }

  unassignFromCustomer = ($event?: any, asset?: any, isPublic?: any): void => {
    $event?.stopPropagation?.();
    let title: any;
    let content: any;
    if (isPublic) {
      title = this.translate.instant('asset.make-private-asset-title', { assetName: asset.name });
      content = this.translate.instant('asset.make-private-asset-text');
    } else {
      title = this.translate.instant('asset.unassign-asset-title', { assetName: asset.name });
      content = this.translate.instant('asset.unassign-asset-text');
    }
    this.confirm(title, content).then(
      () => this.assetService.unassignAssetFromCustomer(asset.id.id).then(() => this.grid.refreshList()),
      () => undefined,
    );
  };

  unassignAssetsFromCustomer($event?: any, items?: any): void {
    this.confirm(
      this.translate.instant('asset.unassign-assets-title', { count: items.selectedCount }),
      this.translate.instant('asset.unassign-assets-text'),
    ).then(
      () => {
        const tasks = Object.keys(items.selections).map((id) => this.assetService.unassignAssetFromCustomer(id));
        Promise.all(tasks).then(() => this.grid.refreshList());
      },
      () => undefined,
    );
  }

  makePublic = ($event?: any, asset?: any): void => {
    $event?.stopPropagation?.();
    this.confirm(
      this.translate.instant('asset.make-public-asset-title', { assetName: asset.name }),
      this.translate.instant('asset.make-public-asset-text'),
    ).then(
      () => this.assetService.makeAssetPublic(asset.id.id).then(() => this.grid.refreshList()),
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
