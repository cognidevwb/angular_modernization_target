import { Component, Type, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgClass } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { CustomerService } from '../../api/services/customer.service';
import { DashboardService } from '../../api/services/dashboard.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { goState } from '../../../state-paths';
import { GridConfig, TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbGridHelpButtonComponent } from '../../components/tb-grid/grid-help-button.component';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';
import { TbDashboardDetailsDirective } from '../tb-dashboard-details/tb-dashboard-details.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';
import { DashboardCardComponent } from '../dashboard-card/dashboard-card.component';
import { AddDashboardsToCustomerComponent } from '../add-dashboards-to-customer/add-dashboards-to-customer.component';
import { MakeDashboardPublicDialogComponent } from '../make-dashboard-public-dialog/make-dashboard-public-dialog.component';
import { ManageAssignedCustomersComponent } from '../manage-assigned-customers/manage-assigned-customers.component';
import { AddDashboardDialogComponent } from './add-dashboard-dialog.component';

/**
 * Ported from the AngularJS controller `DashboardsController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'dashboards',
  standalone: true,
  imports: [TranslatePipe, NgClass, MatTabsModule, TbGridDirective, TbGridHelpButtonComponent, TbDashboardDetailsDirective, TbAuditLogTableDirective],
  templateUrl: './dashboards.component.html',
})
export class DashboardsComponent {
  protected readonly userService = inject(UserService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly customerService = inject(CustomerService);
  protected readonly importExport = inject(ImportExportService);
  protected readonly typesRef: any = types;
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);

  readonly dashboardCard: Type<unknown> = DashboardCardComponent;
  readonly addDashboardDialog: Type<unknown> = AddDashboardDialogComponent;

  protected customerId: any;
  protected dashboardActionsList: any;
  protected dashboardGroupActionsList: any = [];
  types: any;
  dashboardGridConfig: GridConfig;
  dashboardsScope: any;
  customerDashboardsTitle: any;
  grid!: TbGridDirective;
  topIndex: any;

  constructor() {
    this.customerId = this.route.snapshot.params['customerId'];
    this.dashboardActionsList = [
        {
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.grid.openItem($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('dashboard.details') },
            details: (...rest: any[]) => { return this.translate.instant('dashboard.dashboard-details') },
            icon: "edit"
        }
    ];
    this.types = this.typesRef;
    this.dashboardGridConfig = {
        deleteItemTitleFunc: this.deleteDashboardTitle,
        deleteItemContentFunc: this.deleteDashboardText,
        deleteItemsTitleFunc: this.deleteDashboardsTitle,
        deleteItemsActionTitleFunc: this.deleteDashboardsActionTitle,
        deleteItemsContentFunc: this.deleteDashboardsText,

        loadItemDetailsFunc: this.loadDashboard,

        saveItemFunc: this.saveDashboard,

        clickItemFunc: this.openDashboard,

        getItemTitleFunc: this.getDashboardTitle,
        parentCtl: this,

        actionsList: this.dashboardActionsList,
        groupActionsList: this.dashboardGroupActionsList,

        onGridInited: this.gridInited,

        addItemText: (...rest: any[]) => { return this.translate.instant('dashboard.add-dashboard-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('dashboard.no-dashboards-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('dashboard.dashboard-details') },
        isDetailsReadOnly: (...rest: any[]) => {
            return this.dashboardsScope === 'customer_user';
        },
        isSelectionEnabled: (...rest: any[]) => {
            return !(this.dashboardsScope === 'customer_user');
        }
    };
    const items = this.router.getCurrentNavigation()?.extras.state?.['items'];
    if (items !== undefined && items !== null) {
        this.dashboardGridConfig.items = items;
    }
    const topIndex = Number(this.route.snapshot.queryParams['topIndex']);
    if (topIndex > 0) {
        this.dashboardGridConfig.topIndex = topIndex;
    }
    this.dashboardsScope = this.route.snapshot.data['dashboardsType'];
    this.initController();
  }

  initController(...rest: any[]): any {
    var fetchDashboardsFunction: any = null;
    var deleteDashboardFunction: any = null;
    var refreshDashboardsParamsFunction: any = null;

    var user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
        this.dashboardsScope = 'customer_user';
        this.customerId = user.customerId;
    }

    if (this.customerId) {
        this.customerId = this.customerId;
        this.customerDashboardsTitle = this.translate.instant('customer.dashboards');
        this.customerService.getShortCustomerInfo(this.customerId).then(
            (info?: any) => {
                if (info.isPublic) {
                    this.customerDashboardsTitle = this.translate.instant('customer.public-dashboards');
                }
            }
        );
    }

    if (this.dashboardsScope === 'tenant') {
        fetchDashboardsFunction = (pageLink?: any) => {
            return this.dashboardService.getTenantDashboards(pageLink);
        };
        deleteDashboardFunction = (dashboardId?: any) => {
            return this.dashboardService.deleteDashboard(dashboardId);
        };
        refreshDashboardsParamsFunction = () => {
            return {"topIndex": this.topIndex};
        };

        this.dashboardActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.exportDashboard($event, item);
                },
                name: (...rest: any[]) => { this.translate.instant('action.export') },
                details: (...rest: any[]) => { return this.translate.instant('dashboard.export') },
                icon: "file_download"
            });

        this.dashboardActionsList.push({
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.makePublic($event, item);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.share') },
                details: (...rest: any[]) => { return this.translate.instant('dashboard.make-public') },
                icon: "share",
                isEnabled: function(dashboard?: any, ...rest: any[]) {
                    return dashboard && !dashboard.publicCustomerId;
                }
            });
        this.dashboardActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.makePrivate($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
            details: (...rest: any[]) => { return this.translate.instant('dashboard.make-private') },
            icon: "reply",
            isEnabled: function(dashboard?: any, ...rest: any[]) {
                return dashboard && dashboard.publicCustomerId;
            }
        });
        this.dashboardActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.manageAssignedCustomers($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.assign') },
            details: (...rest: any[]) => { return this.translate.instant('dashboard.manage-assigned-customers') },
            icon: "assignment_ind",
            isEnabled: function(dashboard?: any, ...rest: any[]) {
                return dashboard;
            }
        });

        /*dashboardActionsList.push({
                onAction: function ($event, item) {
                    assignToCustomer($event, [ item.id.id ]);
                },
                name: function() { return $translate.instant('action.assign') },
                details: function() { return $translate.instant('dashboard.assign-to-customer') },
                icon: "assignment_ind",
                isEnabled: function(dashboard) {
                    return dashboard && (!dashboard.customerId || dashboard.customerId.id === types.id.nullUid);
                }
            });*/
        /*dashboardActionsList.push({
                onAction: function ($event, item) {
                    unassignFromCustomer($event, item, false);
                },
                name: function() { return $translate.instant('action.unassign') },
                details: function() { return $translate.instant('dashboard.unassign-from-customer') },
                icon: "assignment_return",
                isEnabled: function(dashboard) {
                    return dashboard && dashboard.customerId && dashboard.customerId.id !== types.id.nullUid && !dashboard.assignedCustomer.isPublic;
                }
            });*/

        this.dashboardActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.grid.deleteItem($event, item);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.delete') },
                details: (...rest: any[]) => { return this.translate.instant('dashboard.delete') },
                icon: "delete"
            }
        );

        this.dashboardGroupActionsList.push(
                {
                    onAction: ($event?: any, items?: any, ...rest: any[]) => {
                        this.assignDashboardsToCustomers($event, items);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('dashboard.assign-dashboards') },
                    details: (selectedCount?: any, ...rest: any[]) => {
                        return this.translate.instant('dashboard.assign-dashboards-text', {count: selectedCount});
                    },
                    icon: "assignment_ind"
                }
        );
        this.dashboardGroupActionsList.push(
            {
                onAction: ($event?: any, items?: any, ...rest: any[]) => {
                    this.unassignDashboardsFromCustomers($event, items);
                },
                name: (...rest: any[]) => { return this.translate.instant('dashboard.unassign-dashboards') },
                details: (selectedCount?: any, ...rest: any[]) => {
                    return this.translate.instant('dashboard.unassign-dashboards-action-text', {count: selectedCount});
                },
                icon: "assignment_return"                }
        );

        this.dashboardGroupActionsList.push(
            {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.grid.deleteItems($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('dashboard.delete-dashboards') },
                details: this.deleteDashboardsActionTitle,
                icon: "delete"
            }
        );

        this.dashboardGridConfig.addItemActions = [];
        this.dashboardGridConfig.addItemActions!.push({
            onAction: ($event?: any, ...rest: any[]) => {
                this.grid.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.create') },
            details: (...rest: any[]) => { return this.translate.instant('dashboard.create-new-dashboard') },
            icon: "insert_drive_file"
        });
        this.dashboardGridConfig.addItemActions!.push({
            onAction: ($event?: any, ...rest: any[]) => {
                this.importExport.importDashboard($event).then(
                    () => {
                        this.grid.refreshList();
                    }
                );
            },
            name: (...rest: any[]) => { return this.translate.instant('action.import') },
            details: (...rest: any[]) => { return this.translate.instant('dashboard.import') },
            icon: "file_upload"
        });
    } else if (this.dashboardsScope === 'customer' || this.dashboardsScope === 'customer_user') {
        fetchDashboardsFunction = (pageLink?: any) => {
            return this.dashboardService.getCustomerDashboards(this.customerId, pageLink);
        };
        deleteDashboardFunction = (dashboardId?: any) => {
            return this.dashboardService.unassignDashboardFromCustomer(this.customerId, dashboardId);
        };
        refreshDashboardsParamsFunction = () => {
            return {"customerId": this.customerId, "topIndex": this.topIndex};
        };

        if (this.dashboardsScope === 'customer') {
            this.dashboardActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.exportDashboard($event, item);
                    },
                    name: (...rest: any[]) => { this.translate.instant('action.export') },
                    details: (...rest: any[]) => { return this.translate.instant('dashboard.export') },
                    icon: "file_download"
                }
            );

            this.dashboardActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.makePrivate($event, item);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
                    details: (...rest: any[]) => { return this.translate.instant('dashboard.make-private') },
                    icon: "reply",
                    isEnabled: (dashboard?: any, ...rest: any[]) => {
                        return dashboard && this.customerId == dashboard.publicCustomerId;
                    }
                }
            );

            this.dashboardActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.unassignFromCustomer($event, item, this.customerId);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                    details: (...rest: any[]) => { return this.translate.instant('dashboard.unassign-from-customer') },
                    icon: "assignment_return",
                    isEnabled: (dashboard?: any, ...rest: any[]) => {
                        return dashboard && this.customerId != dashboard.publicCustomerId;
                    }
                }
            );

            this.dashboardGroupActionsList.push(
                {
                    onAction: ($event?: any, items?: any, ...rest: any[]) => {
                        this.unassignDashboardsFromCustomer($event, items, this.customerId);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('dashboard.unassign-dashboards') },
                    details: (selectedCount?: any, ...rest: any[]) => {
                        return this.translate.instant('dashboard.unassign-dashboards-action-title', {count: selectedCount});
                    },
                    icon: "assignment_return"
                }
            );

            this.dashboardGridConfig.addItemAction = {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.addDashboardsToCustomer($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('dashboard.assign-dashboards') },
                details: (...rest: any[]) => { return this.translate.instant('dashboard.assign-new-dashboard') },
                icon: "add"
            };
        } else if (this.dashboardsScope === 'customer_user') {
            this.dashboardGridConfig.addItemAction = {};
        }
    }

    this.dashboardGridConfig.refreshParamsFunc = refreshDashboardsParamsFunction;
    this.dashboardGridConfig.fetchItemsFunc = fetchDashboardsFunction;
    this.dashboardGridConfig.deleteItemFunc = deleteDashboardFunction;

  }

  deleteDashboardTitle = (dashboard?: any, ...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboard-title', {dashboardTitle: dashboard.title});
  };

  deleteDashboardText = (...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboard-text');
  };

  deleteDashboardsTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboards-title', {count: selectedCount});
  };

  deleteDashboardsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboards-action-title', {count: selectedCount});
  };

  deleteDashboardsText = (...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboards-text');
  };

  gridInited = (grid: TbGridDirective): void => {
    this.grid = grid;
  };

  getDashboardTitle = (dashboard?: any, ...rest: any[]): any => {
    return dashboard ? dashboard.title : '';
  };

  loadDashboard = (dashboard?: any, ...rest: any[]): any => {
    return this.dashboardService.getDashboard(dashboard.id.id);
  };

  saveDashboard = (dashboard?: any): Promise<any> => {
    return this.dashboardService.saveDashboard(dashboard).then((savedDashboard?: any) =>
      this.customerService.applyAssignedCustomersInfo([savedDashboard]).then((items?: any) =>
        items && items.length == 1 ? items[0] : Promise.reject(),
      ),
    );
  };

  manageAssignedCustomers = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    this.showManageAssignedCustomersDialog($event, [dashboard.id.id], 'manage', dashboard.assignedCustomersIds);
  };

  assignDashboardsToCustomers($event?: any, items?: any, ...rest: any[]): any {
    var dashboardIds: any = [];
    for (var id in items.selections) {
        dashboardIds.push(id);
    }
    this.showManageAssignedCustomersDialog($event, dashboardIds, 'assign');
  }

  unassignDashboardsFromCustomers($event?: any, items?: any, ...rest: any[]): any {
    var dashboardIds: any = [];
    for (var id in items.selections) {
        dashboardIds.push(id);
    }
    this.showManageAssignedCustomersDialog($event, dashboardIds, 'unassign');
  }

  showManageAssignedCustomersDialog($event?: any, dashboardIds?: any, actionType?: any, assignedCustomers?: any): void {
    $event?.stopPropagation?.();
    this.openThenRefresh(ManageAssignedCustomersComponent, { actionType, dashboardIds, assignedCustomers });
  }

  /** Opens `component` with `data`; refreshes the grid when it closes with a result. */
  private openThenRefresh(component: Type<unknown>, data: any): void {
    firstValueFrom(this.dialog.open(component, { data }).afterClosed()).then((result) => {
      if (result) {
        this.grid.refreshList();
      }
    });
  }

  /** The legacy confirm dialog, with the page's yes / no buttons. */
  private confirm(title: string, htmlContent: string): Promise<void> {
    return showConfirm(this.dialog, {
      title,
      htmlContent,
      cancel: this.translate.instant('action.no'),
      ok: this.translate.instant('action.yes'),
    });
  }

  addDashboardsToCustomer($event?: any, ...rest: any[]): any {
    if ($event) {
        $event.stopPropagation();
    }
    var pageSize: any = 10;
    this.dashboardService.getTenantDashboards({limit: pageSize, textSearch: ''}).then(
        (_dashboards?: any) => {
            var dashboards: any = {
                pageSize: pageSize,
                data: _dashboards.data,
                nextPageLink: _dashboards.nextPageLink,
                selections: {},
                selectedCount: 0,
                hasNext: _dashboards.hasNext,
                pending: false
            };
            if (dashboards.hasNext) {
                dashboards.nextPageLink.limit = pageSize;
            }
            this.openThenRefresh(AddDashboardsToCustomerComponent, {customerId: this.customerId, dashboards: dashboards});
        },
        function fail() {
        });
  }

  unassignFromCustomer = ($event?: any, dashboard?: any, customerId?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any = this.translate.instant('dashboard.unassign-dashboard-title', {dashboardTitle: dashboard.title});
    var content: any = this.translate.instant('dashboard.unassign-dashboard-text');
    this.confirm(title, content).then(() => {
        this.dashboardService.unassignDashboardFromCustomer(customerId, dashboard.id.id).then(() => {
            this.grid.refreshList();
        });
    }, () => undefined);
  };

  makePublic = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    this.dashboardService.makeDashboardPublic(dashboard.id.id).then((dashboard?: any) => {
        firstValueFrom(this.dialog.open(MakeDashboardPublicDialogComponent, {data: {dashboard: dashboard}}).afterClosed()).then((closed) => {
            if (closed) {
                this.grid.refreshList();
            }
        });
    });
  };

  makePrivate = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any = this.translate.instant('dashboard.make-private-dashboard-title', {dashboardTitle: dashboard.title});
    var content: any = this.translate.instant('dashboard.make-private-dashboard-text');
    this.confirm(title, content).then(() => {
        this.dashboardService.makeDashboardPrivate(dashboard.id.id).then(() => {
            this.grid.refreshList();
        });
    }, () => undefined);
  };

  exportDashboard = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.exportDashboard(dashboard.id.id);
  };

  unassignDashboardsFromCustomer($event?: any, items?: any, customerId?: any, ...rest: any[]): any {
    this.confirm(this.translate.instant('dashboard.unassign-dashboards-title', {count: items.selectedCount}), this.translate.instant('dashboard.unassign-dashboards-text')).then(() => {
        var tasks: any = [];
        for (var id in items.selections) {
            tasks.push(this.dashboardService.unassignDashboardFromCustomer(customerId, id));
        }
        Promise.all(tasks).then(() => {
            this.grid.refreshList();
        });
    }, () => undefined);
  }

  openDashboard = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    if (this.dashboardsScope === 'customer') {
        goState(this.router, 'home.customers.dashboards.dashboard', {
            customerId: this.customerId,
            dashboardId: dashboard.id.id
        });
    } else {
        goState(this.router, 'home.dashboards.dashboard', {dashboardId: dashboard.id.id});
    }
  };
}
