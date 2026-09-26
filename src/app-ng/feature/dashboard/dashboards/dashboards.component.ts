import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../api/services/customer.service';
import { DOCUMENT } from '@angular/common';
import { DashboardService } from '../../api/services/dashboard.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbDashboardDetailsDirective } from '../tb-dashboard-details/tb-dashboard-details.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';

import $ from 'jquery';
import addDashboardTemplate from '../../../../app/dashboard/add-dashboard.tpl.html';
import dashboardCard from '../../../../app/dashboard/dashboard-card.tpl.html';
import addDashboardsToCustomerTemplate from '../../../../app/dashboard/add-dashboards-to-customer.tpl.html';
import makeDashboardPublicDialogTemplate from '../../../../app/dashboard/make-dashboard-public-dialog.tpl.html';
import manageAssignedCustomersTemplate from '../../../../app/dashboard/manage-assigned-customers.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS controller `DashboardsController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'dashboards',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbDashboardDetailsDirective), forwardRef(() => TbAuditLogTableDirective)],
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
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly translate = inject(TranslateService);
  // TODO(port): elements not resolved to a component: details-buttons

  protected customerId: any;
  protected dashboardActionsList: any;
  protected dashboardGroupActionsList: any = [];
  types: any;
  dashboardGridConfig: any;
  dashboardsScope: any;
  customerDashboardsTitle: any;
  grid: any;
  topIndex: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

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
        itemCardController: 'DashboardCardController',
        itemCardTemplateUrl: dashboardCard,
        parentCtl: this,

        actionsList: this.dashboardActionsList,
        groupActionsList: this.dashboardGroupActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addDashboardTemplate,

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
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.dashboardGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.dashboardGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.dashboardsScope = this.router.$current.data.dashboardsType;
    this.makePublic = this.makePublic;
    this.makePrivate = this.makePrivate;
    this.manageAssignedCustomers = this.manageAssignedCustomers;
    this.unassignFromCustomer = this.unassignFromCustomer;
    this.exportDashboard = this.exportDashboard;
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
                        return this.translate.instant('dashboard.assign-dashboards-text', {count: selectedCount}, "messageformat");
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
                    return this.translate.instant('dashboard.unassign-dashboards-action-text', {count: selectedCount}, "messageformat");
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
        this.dashboardGridConfig.addItemActions.push({
            onAction: ($event?: any, ...rest: any[]) => {
                this.grid.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.create') },
            details: (...rest: any[]) => { return this.translate.instant('dashboard.create-new-dashboard') },
            icon: "insert_drive_file"
        });
        this.dashboardGridConfig.addItemActions.push({
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
                        return this.translate.instant('dashboard.unassign-dashboards-action-title', {count: selectedCount}, "messageformat");
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
    return this.translate.instant('dashboard.delete-dashboards-title', {count: selectedCount}, 'messageformat');
  };

  deleteDashboardsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboards-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteDashboardsText = (...rest: any[]): any => {
    return this.translate.instant('dashboard.delete-dashboards-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  getDashboardTitle = (dashboard?: any, ...rest: any[]): any => {
    return dashboard ? dashboard.title : '';
  };

  loadDashboard = (dashboard?: any, ...rest: any[]): any => {
    return this.dashboardService.getDashboard(dashboard.id.id);
  };

  saveDashboard = (dashboard?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.dashboardService.saveDashboard(dashboard).then(
        (savedDashboard?: any) => {
            var dashboards: any = [ savedDashboard ];
            this.customerService.applyAssignedCustomersInfo(dashboards).then(
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

  showManageAssignedCustomersDialog($event?: any, dashboardIds?: any, actionType?: any, assignedCustomers?: any, ...rest: any[]): any {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    this.dialog.show({
        controller: 'ManageAssignedCustomersController',
        controllerAs: 'vm',
        templateUrl: manageAssignedCustomersTemplate,
        locals: {actionType: actionType, dashboardIds: dashboardIds, assignedCustomers: assignedCustomers},
        parent: $(this.document.body),
        fullscreen: true,
        targetEvent: $event
    }).then(() => {
        this.grid.refreshList();
    }, function () {
    });
  }

  addDashboardsToCustomer($event?: any, ...rest: any[]): any {
    let vm = this;
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
            this.dialog.show({
                controller: 'AddDashboardsToCustomerController',
                controllerAs: 'vm',
                templateUrl: addDashboardsToCustomerTemplate,
                locals: {customerId: this.customerId, dashboards: dashboards},
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

  unassignFromCustomer = ($event?: any, dashboard?: any, customerId?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any = this.translate.instant('dashboard.unassign-dashboard-title', {dashboardTitle: dashboard.title});
    var content: any = this.translate.instant('dashboard.unassign-dashboard-text');
    var label: any = this.translate.instant('dashboard.unassign-dashboard');
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(title)
        .htmlContent(content)
        .ariaLabel(label)
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
        this.dashboardService.unassignDashboardFromCustomer(customerId, dashboard.id.id).then(() => {
            this.grid.refreshList();
        });
    });
  };

  makePublic = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    this.dashboardService.makeDashboardPublic(dashboard.id.id).then((dashboard?: any) => {
        this.dialog.show({
            controller: 'MakeDashboardPublicDialogController',
            controllerAs: 'vm',
            templateUrl: makeDashboardPublicDialogTemplate,
            locals: {dashboard: dashboard},
            parent: $(this.document.body),
            fullscreen: true,
            targetEvent: $event
        }).then(() => {
            this.grid.refreshList();
        });
    });
  };

  makePrivate = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any = this.translate.instant('dashboard.make-private-dashboard-title', {dashboardTitle: dashboard.title});
    var content: any = this.translate.instant('dashboard.make-private-dashboard-text');
    var label: any = this.translate.instant('dashboard.make-private-dashboard');
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(title)
        .htmlContent(content)
        .ariaLabel(label)
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
        this.dashboardService.makeDashboardPrivate(dashboard.id.id).then(() => {
            this.grid.refreshList();
        });
    });
  };

  exportDashboard = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.exportDashboard(dashboard.id.id);
  };

  unassignDashboardsFromCustomer($event?: any, items?: any, customerId?: any, ...rest: any[]): any {
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(this.translate.instant('dashboard.unassign-dashboards-title', {count: items.selectedCount}, 'messageformat'))
        .htmlContent(this.translate.instant('dashboard.unassign-dashboards-text'))
        .ariaLabel(this.translate.instant('dashboard.unassign-dashboards'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
        var tasks: any = [];
        for (var id in items.selections) {
            tasks.push(this.dashboardService.unassignDashboardFromCustomer(customerId, id));
        }
        Promise.all(tasks).then(() => {
            this.grid.refreshList();
        });
    });
  }

  openDashboard = ($event?: any, dashboard?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    if (this.dashboardsScope === 'customer') {
        this.router.go('home.customers.dashboards.dashboard', {
            customerId: this.customerId,
            dashboardId: dashboard.id.id
        });
    } else {
        this.router.go('home.dashboards.dashboard', {dashboardId: dashboard.id.id});
    }
  };
}
