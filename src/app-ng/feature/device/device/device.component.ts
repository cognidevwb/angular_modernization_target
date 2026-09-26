import { Component, Type, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { CustomerService } from '../../api/services/customer.service';
import { DeviceService } from '../../api/services/device.service';
import { UserService } from '../../api/services/user.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { TbDeviceDirective } from '../tb-device/tb-device.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbExtensionTableDirective } from '../../extension/tb-extension-table/tb-extension-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import { DeviceCardComponent } from '../device-card/device-card.component';
import { AssignDeviceToCustomerComponent } from '../assign-device-to-customer/assign-device-to-customer.component';
import { AddDevicesToCustomerComponent } from '../add-devices-to-customer/add-devices-to-customer.component';
import { ManageDeviceCredentialsComponent } from '../manage-device-credentials/manage-device-credentials.component';
import { AddDeviceDialogComponent } from './add-device-dialog.component';

/**
 * Ported from the AngularJS controller `DeviceController` (module `thingsboard.device`) in src/app/device/device.controller.js
 * (template src/app/device/devices.tpl.html): the tenant's / a customer's devices in tb-grid.
 */
@Component({
  selector: 'device',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbDeviceDirective, TbAttributeTableDirective, TbAlarmTableDirective, TbEventTableDirective, TbRelationTableDirective, TbExtensionTableDirective, TbAuditLogTableDirective],
  templateUrl: './device.component.html',
})
export class DeviceComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly importExport = inject(ImportExportService);

  readonly deviceCard: Type<unknown> = DeviceCardComponent;
  readonly addDeviceDialog: Type<unknown> = AddDeviceDialogComponent;

  protected customerId: any;
  protected deviceActionsList: any[] = [];
  protected deviceGroupActionsList: any[] = [];
  protected deviceAddItemActionsList: any[];
  types: any = types;
  deviceGridConfig: GridConfig;
  devicesScope: any;
  customerDevicesTitle: any;
  grid!: TbGridDirective;
  topIndex: any;

  constructor() {
    const snapshot = this.route.snapshot;
    this.customerId = snapshot.params['customerId'];
    this.deviceAddItemActionsList = [
      {
        onAction: ($event?: any) => this.grid.addItem($event),
        name: () => this.translate.instant('action.add'),
        details: () => this.translate.instant('device.add-device-text'),
        icon: 'insert_drive_file',
      },
      {
        onAction: ($event?: any) => {
          this.importExport.importEntities($event, types.entityType.device).then(() => this.grid.refreshList());
        },
        name: () => this.translate.instant('action.import'),
        details: () => this.translate.instant('device.import'),
        icon: 'file_upload',
      },
    ];
    this.deviceGridConfig = {
      deleteItemTitleFunc: this.deleteDeviceTitle,
      deleteItemContentFunc: this.deleteDeviceText,
      deleteItemsTitleFunc: this.deleteDevicesTitle,
      deleteItemsActionTitleFunc: this.deleteDevicesActionTitle,
      deleteItemsContentFunc: this.deleteDevicesText,

      saveItemFunc: this.saveDevice,

      getItemTitleFunc: this.getDeviceTitle,

      parentCtl: this,

      actionsList: this.deviceActionsList,
      groupActionsList: this.deviceGroupActionsList,
      addItemActions: this.deviceAddItemActionsList,

      onGridInited: this.gridInited,

      noItemsText: () => this.translate.instant('device.no-devices-text'),
      itemDetailsText: () => this.translate.instant('device.device-details'),
      isDetailsReadOnly: this.isCustomerUser,
      isSelectionEnabled: () => !this.isCustomerUser(),
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
      this.deviceGridConfig.items = items;
    }
    const topIndex = Number(snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
      this.deviceGridConfig.topIndex = topIndex;
    }
    this.devicesScope = snapshot.data['devicesType'];
    this.initController();
  }

  initController(): void {
    let fetchDevicesFunction: any = null;
    let deleteDeviceFunction: any = null;
    let refreshDevicesParamsFunction: any = null;

    const user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
      this.devicesScope = 'customer_user';
      this.customerId = user.customerId;
    }
    if (this.customerId) {
      this.customerDevicesTitle = this.translate.instant('customer.devices');
      this.customerService.getShortCustomerInfo(this.customerId).then((info?: any) => {
        if (info.isPublic) {
          this.customerDevicesTitle = this.translate.instant('customer.public-devices');
        }
      });
    }

    if (this.devicesScope === 'tenant') {
      fetchDevicesFunction = (pageLink?: any, deviceType?: any) => this.deviceService.getTenantDevices(pageLink, true, null, deviceType);
      deleteDeviceFunction = (deviceId?: any) => this.deviceService.deleteDevice(deviceId);
      refreshDevicesParamsFunction = () => ({ topIndex: this.topIndex });

      this.deviceActionsList.push({
        onAction: ($event?: any, item?: any) => this.makePublic($event, item),
        name: () => this.translate.instant('action.share'),
        details: () => this.translate.instant('device.make-public'),
        icon: 'share',
        isEnabled: (device?: any) => device && (!device.customerId || device.customerId.id === types.id.nullUid),
      });
      this.deviceActionsList.push({
        onAction: ($event?: any, item?: any) => this.assignToCustomer($event, [item.id.id]),
        name: () => this.translate.instant('action.assign'),
        details: () => this.translate.instant('device.assign-to-customer'),
        icon: 'assignment_ind',
        isEnabled: (device?: any) => device && (!device.customerId || device.customerId.id === types.id.nullUid),
      });
      this.deviceActionsList.push({
        onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, false),
        name: () => this.translate.instant('action.unassign'),
        details: () => this.translate.instant('device.unassign-from-customer'),
        icon: 'assignment_return',
        isEnabled: (device?: any) => device && device.customerId && device.customerId.id !== types.id.nullUid && !device.assignedCustomer.isPublic,
      });
      this.deviceActionsList.push({
        onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, true),
        name: () => this.translate.instant('action.make-private'),
        details: () => this.translate.instant('device.make-private'),
        icon: 'reply',
        isEnabled: (device?: any) => device && device.customerId && device.customerId.id !== types.id.nullUid && device.assignedCustomer.isPublic,
      });
      this.deviceActionsList.push({
        onAction: ($event?: any, item?: any) => this.manageCredentials($event, item),
        name: () => this.translate.instant('device.credentials'),
        details: () => this.translate.instant('device.manage-credentials'),
        icon: 'security',
      });
      this.deviceActionsList.push({
        onAction: ($event?: any, item?: any) => this.grid.deleteItem($event, item),
        name: () => this.translate.instant('action.delete'),
        details: () => this.translate.instant('device.delete'),
        icon: 'delete',
      });

      this.deviceGroupActionsList.push({
        onAction: ($event?: any, items?: any) => this.assignDevicesToCustomer($event, items),
        name: () => this.translate.instant('device.assign-devices'),
        details: (selectedCount?: any) => this.translate.instant('device.assign-devices-text', { count: selectedCount }),
        icon: 'assignment_ind',
      });
      this.deviceGroupActionsList.push({
        onAction: ($event?: any) => this.grid.deleteItems($event),
        name: () => this.translate.instant('device.delete-devices'),
        details: this.deleteDevicesActionTitle,
        icon: 'delete',
      });
    } else if (this.devicesScope === 'customer' || this.devicesScope === 'customer_user') {
      fetchDevicesFunction = (pageLink?: any, deviceType?: any) => this.deviceService.getCustomerDevices(this.customerId, pageLink, true, null, deviceType);
      deleteDeviceFunction = (deviceId?: any) => this.deviceService.unassignDeviceFromCustomer(deviceId);
      refreshDevicesParamsFunction = () => ({ customerId: this.customerId, topIndex: this.topIndex });

      if (this.devicesScope === 'customer') {
        this.deviceActionsList.push({
          onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, false),
          name: () => this.translate.instant('action.unassign'),
          details: () => this.translate.instant('device.unassign-from-customer'),
          icon: 'assignment_return',
          isEnabled: (device?: any) => device && !device.assignedCustomer.isPublic,
        });
        this.deviceActionsList.push({
          onAction: ($event?: any, item?: any) => this.unassignFromCustomer($event, item, true),
          name: () => this.translate.instant('action.make-private'),
          details: () => this.translate.instant('device.make-private'),
          icon: 'reply',
          isEnabled: (device?: any) => device && device.assignedCustomer.isPublic,
        });
        this.deviceActionsList.push({
          onAction: ($event?: any, item?: any) => this.manageCredentials($event, item),
          name: () => this.translate.instant('device.credentials'),
          details: () => this.translate.instant('device.manage-credentials'),
          icon: 'security',
        });
        this.deviceGroupActionsList.push({
          onAction: ($event?: any, items?: any) => this.unassignDevicesFromCustomer($event, items),
          name: () => this.translate.instant('device.unassign-devices'),
          details: (selectedCount?: any) => this.translate.instant('device.unassign-devices-action-title', { count: selectedCount }),
          icon: 'assignment_return',
        });
        this.deviceGridConfig.addItemAction = {
          onAction: ($event?: any) => this.addDevicesToCustomer($event),
          name: () => this.translate.instant('device.assign-devices'),
          details: () => this.translate.instant('device.assign-new-device'),
          icon: 'add',
        };
      } else if (this.devicesScope === 'customer_user') {
        this.deviceActionsList.push({
          onAction: ($event?: any, item?: any) => this.manageCredentials($event, item),
          name: () => this.translate.instant('device.credentials'),
          details: () => this.translate.instant('device.view-credentials'),
          icon: 'security',
        });
        this.deviceGridConfig.addItemAction = {};
      }
      this.deviceGridConfig.addItemActions = [];
    }

    this.deviceGridConfig.refreshParamsFunc = refreshDevicesParamsFunction;
    this.deviceGridConfig.fetchItemsFunc = fetchDevicesFunction;
    this.deviceGridConfig.deleteItemFunc = deleteDeviceFunction;
  }

  deleteDeviceTitle = (device?: any): any => this.translate.instant('device.delete-device-title', { deviceName: device.name });

  deleteDeviceText = (): any => this.translate.instant('device.delete-device-text');

  deleteDevicesTitle = (selectedCount?: any): any => this.translate.instant('device.delete-devices-title', { count: selectedCount });

  deleteDevicesActionTitle = (selectedCount?: any): any => this.translate.instant('device.delete-devices-action-title', { count: selectedCount });

  deleteDevicesText = (): any => this.translate.instant('device.delete-devices-text');

  gridInited = (grid: TbGridDirective): void => {
    this.grid = grid;
  };

  getDeviceTitle = (device?: any): any => (device ? device.name : '');

  saveDevice = (device?: any): Promise<any> => {
    return this.deviceService.saveDevice(device).then((savedDevice?: any) => {
      this.rootScope.$broadcast('deviceSaved');
      return this.customerService.applyAssignedCustomersInfo([savedDevice]).then((items?: any) =>
        items && items.length == 1 ? items[0] : Promise.reject(),
      );
    });
  };

  isCustomerUser = (): boolean => this.devicesScope === 'customer_user';

  assignToCustomer = ($event?: any, deviceIds?: any): void => {
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
        this.openThenRefresh(AssignDeviceToCustomerComponent, { deviceIds, customers });
      },
      () => undefined,
    );
  };

  addDevicesToCustomer($event?: any): void {
    $event?.stopPropagation?.();
    const pageSize = 10;
    this.deviceService.getTenantDevices({ limit: pageSize, textSearch: '' }, false).then(
      (_devices?: any) => {
        const devices: any = {
          pageSize: pageSize,
          data: _devices.data,
          nextPageLink: _devices.nextPageLink,
          selections: {},
          selectedCount: 0,
          hasNext: _devices.hasNext,
          pending: false,
        };
        if (devices.hasNext) {
          devices.nextPageLink.limit = pageSize;
        }
        this.openThenRefresh(AddDevicesToCustomerComponent, { customerId: this.customerId, devices });
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

  assignDevicesToCustomer($event?: any, items?: any): void {
    this.assignToCustomer($event, Object.keys(items.selections));
  }

  unassignFromCustomer = ($event?: any, device?: any, isPublic?: any): void => {
    $event?.stopPropagation?.();
    let title: any;
    let content: any;
    if (isPublic) {
      title = this.translate.instant('device.make-private-device-title', { deviceName: device.name });
      content = this.translate.instant('device.make-private-device-text');
    } else {
      title = this.translate.instant('device.unassign-device-title', { deviceName: device.name });
      content = this.translate.instant('device.unassign-device-text');
    }
    this.confirm(title, content).then(
      () => this.deviceService.unassignDeviceFromCustomer(device.id.id).then(() => this.grid.refreshList()),
      () => undefined,
    );
  };

  unassignDevicesFromCustomer($event?: any, items?: any): void {
    this.confirm(
      this.translate.instant('device.unassign-devices-title', { count: items.selectedCount }),
      this.translate.instant('device.unassign-devices-text'),
    ).then(
      () => {
        const tasks = Object.keys(items.selections).map((id) => this.deviceService.unassignDeviceFromCustomer(id));
        Promise.all(tasks).then(() => this.grid.refreshList());
      },
      () => undefined,
    );
  }

  makePublic = ($event?: any, device?: any): void => {
    $event?.stopPropagation?.();
    this.confirm(
      this.translate.instant('device.make-public-device-title', { deviceName: device.name }),
      this.translate.instant('device.make-public-device-text'),
    ).then(
      () => this.deviceService.makeDevicePublic(device.id.id).then(() => this.grid.refreshList()),
      () => undefined,
    );
  };

  manageCredentials = ($event?: any, device?: any): void => {
    $event?.stopPropagation?.();
    this.dialog.open(ManageDeviceCredentialsComponent, { data: { deviceId: device.id.id, isReadOnly: this.isCustomerUser() } });
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
