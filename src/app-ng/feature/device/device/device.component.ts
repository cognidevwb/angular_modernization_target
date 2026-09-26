import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../api/services/customer.service';
import { DOCUMENT } from '@angular/common';
import { DeviceService } from '../../api/services/device.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbDeviceDirective } from '../tb-device/tb-device.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbExtensionTableDirective } from '../../extension/tb-extension-table/tb-extension-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';

import $ from 'jquery';
// @ts-ignore
import addDeviceTemplate from '../../../../app/device/add-device.tpl.html';
// @ts-ignore
import deviceCard from '../../../../app/device/device-card.tpl.html';
// @ts-ignore
import assignToCustomerTemplate from '../../../../app/device/assign-to-customer.tpl.html';
// @ts-ignore
import addDevicesToCustomerTemplate from '../../../../app/device/add-devices-to-customer.tpl.html';
// @ts-ignore
import deviceCredentialsTemplate from '../../../../app/device/device-credentials.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.

/**
 * Ported from the AngularJS controller `DeviceController` (module `thingsboard.device`) in src/app/device/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'device',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbDeviceDirective), forwardRef(() => TbAttributeTableDirective), forwardRef(() => TbAlarmTableDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRelationTableDirective), forwardRef(() => TbExtensionTableDirective), forwardRef(() => TbAuditLogTableDirective)],
  templateUrl: './device.component.html',
})
export class DeviceComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly importExport = inject(ImportExportService);
  // TODO(port): elements not resolved to a component: details-buttons

  protected customerId: any;
  protected deviceActionsList: any = [];
  protected deviceGroupActionsList: any = [];
  protected deviceAddItemActionsList: any;
  types: any;
  deviceGridConfig: any;
  devicesScope: any;
  customerDevicesTitle: any;
  grid: any;
  topIndex: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    this.customerId = this.route.snapshot.params['customerId'];
    this.deviceAddItemActionsList = [
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.grid.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.add') },
            details: (...rest: any[]) => { return this.translate.instant('device.add-device-text') },
            icon: "insert_drive_file"
        },
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.importExport.importEntities($event, this.typesRef.entityType.device).then(
                    () => {
                        this.grid.refreshList();
                    }
                );
            },
            name: (...rest: any[]) => { return this.translate.instant('action.import') },
            details: (...rest: any[]) => { return this.translate.instant('device.import') },
            icon: "file_upload"
        }
    ];
    this.types = this.typesRef;
    this.deviceGridConfig = {
        deleteItemTitleFunc: this.deleteDeviceTitle,
        deleteItemContentFunc: this.deleteDeviceText,
        deleteItemsTitleFunc: this.deleteDevicesTitle,
        deleteItemsActionTitleFunc: this.deleteDevicesActionTitle,
        deleteItemsContentFunc: this.deleteDevicesText,

        saveItemFunc: this.saveDevice,

        getItemTitleFunc: this.getDeviceTitle,

        itemCardController: 'DeviceCardController',
        itemCardTemplateUrl: deviceCard,
        parentCtl: this,

        actionsList: this.deviceActionsList,
        groupActionsList: this.deviceGroupActionsList,
        addItemActions: this.deviceAddItemActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addDeviceTemplate,

        noItemsText: (...rest: any[]) => { return this.translate.instant('device.no-devices-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('device.device-details') },
        isDetailsReadOnly: this.isCustomerUser,
        isSelectionEnabled: (...rest: any[]) => {
            return !this.isCustomerUser();
        }
    };
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.deviceGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.deviceGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.devicesScope = (this.router as any).$current.data.devicesType;
    this.assignToCustomer = this.assignToCustomer;
    this.makePublic = this.makePublic;
    this.unassignFromCustomer = this.unassignFromCustomer;
    this.manageCredentials = this.manageCredentials;
    this.initController();
  }

  initController(...rest: any[]): any {
    var fetchDevicesFunction: any = null;
    var deleteDeviceFunction: any = null;
    var refreshDevicesParamsFunction: any = null;

    var user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
        this.devicesScope = 'customer_user';
        this.customerId = user.customerId;
    }
    if (this.customerId) {
        this.customerDevicesTitle = this.translate.instant('customer.devices');
        this.customerService.getShortCustomerInfo(this.customerId).then(
            (info?: any) => {
                if (info.isPublic) {
                    this.customerDevicesTitle = this.translate.instant('customer.public-devices');
                }
            }
        );
    }

    if (this.devicesScope === 'tenant') {
        fetchDevicesFunction = (pageLink?: any, deviceType?: any) => {
            return this.deviceService.getTenantDevices(pageLink, true, null, deviceType);
        };
        deleteDeviceFunction = (deviceId?: any) => {
            return this.deviceService.deleteDevice(deviceId);
        };
        refreshDevicesParamsFunction = () => {
            return {"topIndex": this.topIndex};
        };

        this.deviceActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.makePublic($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.share') },
            details: (...rest: any[]) => { return this.translate.instant('device.make-public') },
            icon: "share",
            isEnabled: (device?: any, ...rest: any[]) => {
                return device && (!device.customerId || device.customerId.id === this.typesRef.id.nullUid);
            }
        });

        this.deviceActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.assignToCustomer($event, [ item.id.id ]);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.assign') },
                details: (...rest: any[]) => { return this.translate.instant('device.assign-to-customer') },
                icon: "assignment_ind",
                isEnabled: (device?: any, ...rest: any[]) => {
                    return device && (!device.customerId || device.customerId.id === this.typesRef.id.nullUid);
                }
            }
        );

        this.deviceActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.unassignFromCustomer($event, item, false);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                details: (...rest: any[]) => { return this.translate.instant('device.unassign-from-customer') },
                icon: "assignment_return",
                isEnabled: (device?: any, ...rest: any[]) => {
                    return device && device.customerId && device.customerId.id !== this.typesRef.id.nullUid && !device.assignedCustomer.isPublic;
                }
            }
        );

        this.deviceActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.unassignFromCustomer($event, item, true);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
            details: (...rest: any[]) => { return this.translate.instant('device.make-private') },
            icon: "reply",
            isEnabled: (device?: any, ...rest: any[]) => {
                return device && device.customerId && device.customerId.id !== this.typesRef.id.nullUid && device.assignedCustomer.isPublic;
            }
        });

        this.deviceActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.manageCredentials($event, item);
                },
                name: (...rest: any[]) => { return this.translate.instant('device.credentials') },
                details: (...rest: any[]) => { return this.translate.instant('device.manage-credentials') },
                icon: "security"
            }
        );

        this.deviceActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.grid.deleteItem($event, item);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.delete') },
                details: (...rest: any[]) => { return this.translate.instant('device.delete') },
                icon: "delete"
            }
        );

        this.deviceGroupActionsList.push(
            {
                onAction: ($event?: any, items?: any, ...rest: any[]) => {
                    this.assignDevicesToCustomer($event, items);
                },
                name: (...rest: any[]) => { return this.translate.instant('device.assign-devices') },
                details: (selectedCount?: any, ...rest: any[]) => {
                    return this.translate.instant('device.assign-devices-text', {count: selectedCount}, "messageformat");
                },
                icon: "assignment_ind"
            }
        );

        this.deviceGroupActionsList.push(
            {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.grid.deleteItems($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('device.delete-devices') },
                details: this.deleteDevicesActionTitle,
                icon: "delete"
            }
        );



    } else if (this.devicesScope === 'customer' || this.devicesScope === 'customer_user') {
        fetchDevicesFunction = (pageLink?: any, deviceType?: any) => {
            return this.deviceService.getCustomerDevices(this.customerId, pageLink, true, null, deviceType);
        };
        deleteDeviceFunction = (deviceId?: any) => {
            return this.deviceService.unassignDeviceFromCustomer(deviceId);
        };
        refreshDevicesParamsFunction = () => {
            return {"customerId": this.customerId, "topIndex": this.topIndex};
        };

        if (this.devicesScope === 'customer') {
            this.deviceActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.unassignFromCustomer($event, item, false);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                    details: (...rest: any[]) => { return this.translate.instant('device.unassign-from-customer') },
                    icon: "assignment_return",
                    isEnabled: function(device?: any, ...rest: any[]) {
                        return device && !device.assignedCustomer.isPublic;
                    }
                }
            );
            this.deviceActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.unassignFromCustomer($event, item, true);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
                    details: (...rest: any[]) => { return this.translate.instant('device.make-private') },
                    icon: "reply",
                    isEnabled: function(device?: any, ...rest: any[]) {
                        return device && device.assignedCustomer.isPublic;
                    }
                }
            );

            this.deviceActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.manageCredentials($event, item);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('device.credentials') },
                    details: (...rest: any[]) => { return this.translate.instant('device.manage-credentials') },
                    icon: "security"
                }
            );

            this.deviceGroupActionsList.push(
                {
                    onAction: ($event?: any, items?: any, ...rest: any[]) => {
                        this.unassignDevicesFromCustomer($event, items);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('device.unassign-devices') },
                    details: (selectedCount?: any, ...rest: any[]) => {
                        return this.translate.instant('device.unassign-devices-action-title', {count: selectedCount}, "messageformat");
                    },
                    icon: "assignment_return"
                }
            );

            this.deviceGridConfig.addItemAction = {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.addDevicesToCustomer($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('device.assign-devices') },
                details: (...rest: any[]) => { return this.translate.instant('device.assign-new-device') },
                icon: "add"
            };

        } else if (this.devicesScope === 'customer_user') {
            this.deviceActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.manageCredentials($event, item);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('device.credentials') },
                    details: (...rest: any[]) => { return this.translate.instant('device.view-credentials') },
                    icon: "security"
                }
            );

            this.deviceGridConfig.addItemAction = {};
        }
        this.deviceGridConfig.addItemActions = [];

    }

    this.deviceGridConfig.refreshParamsFunc = refreshDevicesParamsFunction;
    this.deviceGridConfig.fetchItemsFunc = fetchDevicesFunction;
    this.deviceGridConfig.deleteItemFunc = deleteDeviceFunction;

  }

  deleteDeviceTitle = (device?: any, ...rest: any[]): any => {
    return this.translate.instant('device.delete-device-title', {deviceName: device.name});
  };

  deleteDeviceText = (...rest: any[]): any => {
    return this.translate.instant('device.delete-device-text');
  };

  deleteDevicesTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('device.delete-devices-title', {count: selectedCount}, 'messageformat');
  };

  deleteDevicesActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('device.delete-devices-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteDevicesText = (...rest: any[]): any => {
    return this.translate.instant('device.delete-devices-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  getDeviceTitle = (device?: any, ...rest: any[]): any => {
    return device ? device.name : '';
  };

  saveDevice = (device?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.deviceService.saveDevice(device).then(
        (savedDevice?: any) => {
            this.rootScope.$broadcast('deviceSaved');
            var devices: any = [ savedDevice ];
            this.customerService.applyAssignedCustomersInfo(devices).then(
                function success(items?: any) {
                    if (items && items.length == 1) {
                        deferred.resolve(items[0]);
                    } else {
                        deferred.reject();
                    }
                },
                function fail() {
                    deferred.reject();
                }
            );
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  };

  isCustomerUser = (...rest: any[]): any => {
    return this.devicesScope === 'customer_user';
  };

  assignToCustomer = ($event?: any, deviceIds?: any, ...rest: any[]): any => {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    var pageSize: any = 10;
    this.customerService.getCustomers({limit: pageSize, textSearch: ''}).then(
        (_customers?: any) => {
            var customers: any = {
                pageSize: pageSize,
                data: _customers.data,
                nextPageLink: _customers.nextPageLink,
                selection: null,
                hasNext: _customers.hasNext,
                pending: false
            };
            if (customers.hasNext) {
                customers.nextPageLink.limit = pageSize;
            }
            (this.dialog as any).show({
                controller: 'AssignDeviceToCustomerController',
                controllerAs: 'vm',
                templateUrl: assignToCustomerTemplate,
                locals: {deviceIds: deviceIds, customers: customers},
                parent: $(this.document.body),
                fullscreen: true,
                targetEvent: $event
            }).then(() => {
                this.grid.refreshList();
            }, function () {
            });
        },
        function fail() {
        });
  };

  addDevicesToCustomer($event?: any, ...rest: any[]): any {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    var pageSize: any = 10;
    this.deviceService.getTenantDevices({limit: pageSize, textSearch: ''}, false).then(
        (_devices?: any) => {
            var devices: any = {
                pageSize: pageSize,
                data: _devices.data,
                nextPageLink: _devices.nextPageLink,
                selections: {},
                selectedCount: 0,
                hasNext: _devices.hasNext,
                pending: false
            };
            if (devices.hasNext) {
                devices.nextPageLink.limit = pageSize;
            }
            (this.dialog as any).show({
                controller: 'AddDevicesToCustomerController',
                controllerAs: 'vm',
                templateUrl: addDevicesToCustomerTemplate,
                locals: {customerId: this.customerId, devices: devices},
                parent: $(this.document.body),
                fullscreen: true,
                targetEvent: $event
            }).then(() => {
                this.grid.refreshList();
            }, function () {
            });
        },
        function fail() {
        });
  }

  assignDevicesToCustomer($event?: any, items?: any, ...rest: any[]): any {
    var deviceIds: any = [];
    for (var id in items.selections) {
        deviceIds.push(id);
    }
    this.assignToCustomer($event, deviceIds);
  }

  unassignFromCustomer = ($event?: any, device?: any, isPublic?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any;
    var content: any;
    var label: any;
    if (isPublic) {
        title = this.translate.instant('device.make-private-device-title', {deviceName: device.name});
        content = this.translate.instant('device.make-private-device-text');
        label = this.translate.instant('device.make-private');
    } else {
        title = this.translate.instant('device.unassign-device-title', {deviceName: device.name});
        content = this.translate.instant('device.unassign-device-text');
        label = this.translate.instant('device.unassign-device');
    }
    var confirm: any = (this.dialog as any).confirm()
        .targetEvent($event)
        .title(title)
        .htmlContent(content)
        .ariaLabel(label)
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    (this.dialog as any).show(confirm).then(() => {
        this.deviceService.unassignDeviceFromCustomer(device.id.id).then(() => {
            this.grid.refreshList();
        });
    });
  };

  unassignDevicesFromCustomer($event?: any, items?: any, ...rest: any[]): any {
    var confirm: any = (this.dialog as any).confirm()
        .targetEvent($event)
        .title(this.translate.instant('device.unassign-devices-title', {count: items.selectedCount}, 'messageformat'))
        .htmlContent(this.translate.instant('device.unassign-devices-text'))
        .ariaLabel(this.translate.instant('device.unassign-device'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    (this.dialog as any).show(confirm).then(() => {
        var tasks: any = [];
        for (var id in items.selections) {
            tasks.push(this.deviceService.unassignDeviceFromCustomer(id));
        }
        Promise.all(tasks).then(() => {
            this.grid.refreshList();
        });
    });
  }

  makePublic = ($event?: any, device?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var confirm: any = (this.dialog as any).confirm()
        .targetEvent($event)
        .title(this.translate.instant('device.make-public-device-title', {deviceName: device.name}))
        .htmlContent(this.translate.instant('device.make-public-device-text'))
        .ariaLabel(this.translate.instant('device.make-public'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    (this.dialog as any).show(confirm).then(() => {
        this.deviceService.makeDevicePublic(device.id.id).then(() => {
            this.grid.refreshList();
        });
    });
  };

  manageCredentials = ($event?: any, device?: any, ...rest: any[]): any => {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    (this.dialog as any).show({
        controller: 'ManageDeviceCredentialsController',
        controllerAs: 'vm',
        templateUrl: deviceCredentialsTemplate,
        locals: {deviceId: device.id.id, isReadOnly: this.isCustomerUser()},
        parent: $(this.document.body),
        fullscreen: true,
        targetEvent: $event
    }).then(function () {
    }, function () {
    });
  };
}
