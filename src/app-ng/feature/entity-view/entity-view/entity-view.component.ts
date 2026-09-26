import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CustomerService } from '../../api/services/customer.service';
import { DOCUMENT } from '@angular/common';
import { EntityViewService } from '../../api/services/entity-view.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { TbGridDirective } from '../../components/tb-grid/tb-grid.directive';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbEntityViewDirective } from '../tb-entity-view/tb-entity-view.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';

import $ from 'jquery';
import addEntityViewTemplate from '../../../../app/entity-view/add-entity-view.tpl.html';
import entityViewCard from '../../../../app/entity-view/entity-view-card.tpl.html';
import assignToCustomerTemplate from '../../../../app/entity-view/assign-to-customer.tpl.html';
import addEntityViewsToCustomerTemplate from '../../../../app/entity-view/add-entity-views-to-customer.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS controller `EntityViewController` (module `thingsboard.entityView`) in src/app/entity-view/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'entity-view',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, forwardRef(() => TbGridDirective), forwardRef(() => TbHelpDirective), forwardRef(() => TbEntityViewDirective), forwardRef(() => TbAttributeTableDirective), forwardRef(() => TbAlarmTableDirective), forwardRef(() => TbEventTableDirective), forwardRef(() => TbRelationTableDirective), forwardRef(() => TbAuditLogTableDirective)],
  templateUrl: './entity-view.component.html',
})
export class EntityViewComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly entityViewService = inject(EntityViewService);
  protected readonly customerService = inject(CustomerService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  // TODO(port): elements not resolved to a component: details-buttons

  protected customerId: any;
  protected entityViewActionsList: any = [];
  protected entityViewGroupActionsList: any = [];
  types: any;
  entityViewGridConfig: any;
  entityViewsScope: any;
  customerEntityViewsTitle: any;
  grid: any;
  topIndex: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    this.customerId = this.route.snapshot.params['customerId'];
    this.types = this.typesRef;
    this.entityViewGridConfig = {
        deleteItemTitleFunc: this.deleteEntityViewTitle,
        deleteItemContentFunc: this.deleteEntityViewText,
        deleteItemsTitleFunc: this.deleteEntityViewsTitle,
        deleteItemsActionTitleFunc: this.deleteEntityViewsActionTitle,
        deleteItemsContentFunc: this.deleteEntityViewsText,

        saveItemFunc: this.saveEntityView,

        getItemTitleFunc: this.getEntityViewTitle,

        itemCardController: 'EntityViewCardController',
        itemCardTemplateUrl: entityViewCard,
        parentCtl: this,

        actionsList: this.entityViewActionsList,
        groupActionsList: this.entityViewGroupActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addEntityViewTemplate,

        addItemText: (...rest: any[]) => { return this.translate.instant('entity-view.add-entity-view-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('entity-view.no-entity-views-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('entity-view.entity-view-details') },
        isDetailsReadOnly: this.isCustomerUser,
        isSelectionEnabled: (...rest: any[]) => {
            return !this.isCustomerUser();
        }
    };
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.entityViewGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.entityViewGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.entityViewsScope = this.router.$current.data.entityViewsType;
    this.assignToCustomer = this.assignToCustomer;
    this.makePublic = this.makePublic;
    this.unassignFromCustomer = this.unassignFromCustomer;
    this.initController();
  }

  initController(...rest: any[]): any {
    var fetchEntityViewsFunction: any = null;
    var deleteEntityViewFunction: any = null;
    var refreshEntityViewsParamsFunction: any = null;

    var user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
        this.entityViewsScope = 'customer_user';
        this.customerId = user.customerId;
    }
    if (this.customerId) {
        this.customerEntityViewsTitle = this.translate.instant('customer.entity-views');
        this.customerService.getShortCustomerInfo(this.customerId).then(
            (info?: any) => {
                if (info.isPublic) {
                    this.customerEntityViewsTitle = this.translate.instant('customer.public-entity-views');
                }
            }
        );
    }

    if (this.entityViewsScope === 'tenant') {
        fetchEntityViewsFunction = (pageLink?: any, entityViewType?: any) => {
            return this.entityViewService.getTenantEntityViews(pageLink, true, null, entityViewType);
        };
        deleteEntityViewFunction = (entityViewId?: any) => {
            return this.entityViewService.deleteEntityView(entityViewId);
        };
        refreshEntityViewsParamsFunction = () => {
            return {"topIndex": this.topIndex};
        };

        this.entityViewActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.makePublic($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.share') },
            details: (...rest: any[]) => { return this.translate.instant('entity-view.make-public') },
            icon: "share",
            isEnabled: (entityView?: any, ...rest: any[]) => {
                return entityView && (!entityView.customerId || entityView.customerId.id === this.typesRef.id.nullUid);
            }
        });

        this.entityViewActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.assignToCustomer($event, [ item.id.id ]);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.assign') },
                details: (...rest: any[]) => { return this.translate.instant('entity-view.assign-to-customer') },
                icon: "assignment_ind",
                isEnabled: (entityView?: any, ...rest: any[]) => {
                    return entityView && (!entityView.customerId || entityView.customerId.id === this.typesRef.id.nullUid);
                }
            }
        );

        this.entityViewActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.unassignFromCustomer($event, item, false);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                details: (...rest: any[]) => { return this.translate.instant('entity-view.unassign-from-customer') },
                icon: "assignment_return",
                isEnabled: (entityView?: any, ...rest: any[]) => {
                    return entityView && entityView.customerId && entityView.customerId.id !== this.typesRef.id.nullUid && !entityView.assignedCustomer.isPublic;
                }
            }
        );

        this.entityViewActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.unassignFromCustomer($event, item, true);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
            details: (...rest: any[]) => { return this.translate.instant('entity-view.make-private') },
            icon: "reply",
            isEnabled: (entityView?: any, ...rest: any[]) => {
                return entityView && entityView.customerId && entityView.customerId.id !== this.typesRef.id.nullUid && entityView.assignedCustomer.isPublic;
            }
        });

        this.entityViewActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.grid.deleteItem($event, item);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.delete') },
                details: (...rest: any[]) => { return this.translate.instant('entity-view.delete') },
                icon: "delete"
            }
        );

        this.entityViewGroupActionsList.push(
            {
                onAction: ($event?: any, items?: any, ...rest: any[]) => {
                    this.assignEntityViewsToCustomer($event, items);
                },
                name: (...rest: any[]) => { return this.translate.instant('entity-view.assign-entity-views') },
                details: (selectedCount?: any, ...rest: any[]) => {
                    return this.translate.instant('entity-view.assign-entity-views-text', {count: selectedCount}, "messageformat");
                },
                icon: "assignment_ind"
            }
        );

        this.entityViewGroupActionsList.push(
            {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.grid.deleteItems($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('entity-view.delete-entity-views') },
                details: this.deleteEntityViewsActionTitle,
                icon: "delete"
            }
        );



    } else if (this.entityViewsScope === 'customer' || this.entityViewsScope === 'customer_user') {
        fetchEntityViewsFunction = (pageLink?: any, entityViewType?: any) => {
            return this.entityViewService.getCustomerEntityViews(this.customerId, pageLink, true, null, entityViewType);
        };
        deleteEntityViewFunction = (entityViewId?: any) => {
            return this.entityViewService.unassignEntityViewFromCustomer(entityViewId);
        };
        refreshEntityViewsParamsFunction = () => {
            return {"customerId": this.customerId, "topIndex": this.topIndex};
        };

        if (this.entityViewsScope === 'customer') {
            this.entityViewActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.unassignFromCustomer($event, item, false);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                    details: (...rest: any[]) => { return this.translate.instant('entity-view.unassign-from-customer') },
                    icon: "assignment_return",
                    isEnabled: function(entityView?: any, ...rest: any[]) {
                        return entityView && !entityView.assignedCustomer.isPublic;
                    }
                }
            );

            this.entityViewGroupActionsList.push(
                {
                    onAction: ($event?: any, items?: any, ...rest: any[]) => {
                        this.unassignEntityViewsFromCustomer($event, items);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('entity-view.unassign-entity-views') },
                    details: (selectedCount?: any, ...rest: any[]) => {
                        return this.translate.instant('entity-view.unassign-entity-views-action-title', {count: selectedCount}, "messageformat");
                    },
                    icon: "assignment_return"
                }
            );

            this.entityViewGridConfig.addItemAction = {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.addEntityViewsToCustomer($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('entity-view.assign-entity-views') },
                details: (...rest: any[]) => { return this.translate.instant('entity-view.assign-new-entity-view') },
                icon: "add"
            };


        } else if (this.entityViewsScope === 'customer_user') {
            this.entityViewGridConfig.addItemAction = {};
        }
    }

    this.entityViewGridConfig.refreshParamsFunc = refreshEntityViewsParamsFunction;
    this.entityViewGridConfig.fetchItemsFunc = fetchEntityViewsFunction;
    this.entityViewGridConfig.deleteItemFunc = deleteEntityViewFunction;

  }

  deleteEntityViewTitle = (entityView?: any, ...rest: any[]): any => {
    return this.translate.instant('entity-view.delete-entity-view-title', {entityViewName: entityView.name});
  };

  deleteEntityViewText = (...rest: any[]): any => {
    return this.translate.instant('entity-view.delete-entity-view-text');
  };

  deleteEntityViewsTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('entity-view.delete-entity-views-title', {count: selectedCount}, 'messageformat');
  };

  deleteEntityViewsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('entity-view.delete-entity-views-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteEntityViewsText = (...rest: any[]): any => {
    return this.translate.instant('entity-view.delete-entity-views-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  getEntityViewTitle = (entityView?: any, ...rest: any[]): any => {
    return entityView ? entityView.name : '';
  };

  saveEntityView = (entityView?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.entityViewService.saveEntityView(entityView).then(
        (savedEntityView?: any) => {
            this.rootScope.$broadcast('entityViewSaved');
            var entityViews: any = [ savedEntityView ];
            this.customerService.applyAssignedCustomersInfo(entityViews).then(
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
    return this.entityViewsScope === 'customer_user';
  };

  assignToCustomer = ($event?: any, entityViewIds?: any, ...rest: any[]): any => {
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
            this.dialog.show({
                controller: 'AssignEntityViewToCustomerController',
                controllerAs: 'vm',
                templateUrl: assignToCustomerTemplate,
                locals: {entityViewIds: entityViewIds, customers: customers},
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

  addEntityViewsToCustomer($event?: any, ...rest: any[]): any {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    var pageSize: any = 10;
    this.entityViewService.getTenantEntityViews({limit: pageSize, textSearch: ''}, false).then(
        (_entityViews?: any) => {
            var entityViews: any = {
                pageSize: pageSize,
                data: _entityViews.data,
                nextPageLink: _entityViews.nextPageLink,
                selections: {},
                selectedCount: 0,
                hasNext: _entityViews.hasNext,
                pending: false
            };
            if (entityViews.hasNext) {
                entityViews.nextPageLink.limit = pageSize;
            }
            this.dialog.show({
                controller: 'AddEntityViewsToCustomerController',
                controllerAs: 'vm',
                templateUrl: addEntityViewsToCustomerTemplate,
                locals: {customerId: this.customerId, entityViews: entityViews},
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

  assignEntityViewsToCustomer($event?: any, items?: any, ...rest: any[]): any {
    var entityViewIds: any = [];
    for (var id in items.selections) {
        entityViewIds.push(id);
    }
    this.assignToCustomer($event, entityViewIds);
  }

  unassignFromCustomer = ($event?: any, entityView?: any, isPublic?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any;
    var content: any;
    var label: any;
    if (isPublic) {
        title = this.translate.instant('entity-view.make-private-entity-view-title', {entityViewName: entityView.name});
        content = this.translate.instant('entity-view.make-private-entity-view-text');
        label = this.translate.instant('entity-view.make-private');
    } else {
        title = this.translate.instant('entity-view.unassign-entity-view-title', {entityViewName: entityView.name});
        content = this.translate.instant('entity-view.unassign-entity-view-text');
        label = this.translate.instant('entity-view.unassign-entity-view');
    }
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(title)
        .htmlContent(content)
        .ariaLabel(label)
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
        this.entityViewService.unassignEntityViewFromCustomer(entityView.id.id).then(() => {
            this.grid.refreshList();
        });
    });
  };

  unassignEntityViewsFromCustomer($event?: any, items?: any, ...rest: any[]): any {
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(this.translate.instant('entity-view.unassign-entity-views-title', {count: items.selectedCount}, 'messageformat'))
        .htmlContent(this.translate.instant('entity-view.unassign-entity-views-text'))
        .ariaLabel(this.translate.instant('entity-view.unassign-entity-view'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
        var tasks: any = [];
        for (var id in items.selections) {
            tasks.push(this.entityViewService.unassignEntityViewFromCustomer(id));
        }
        Promise.all(tasks).then(() => {
            this.grid.refreshList();
        });
    });
  }

  makePublic = ($event?: any, entityView?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var confirm: any = this.dialog.confirm()
        .targetEvent($event)
        .title(this.translate.instant('entity-view.make-public-entity-view-title', {entityViewName: entityView.name}))
        .htmlContent(this.translate.instant('entity-view.make-public-entity-view-text'))
        .ariaLabel(this.translate.instant('entity-view.make-public'))
        .cancel(this.translate.instant('action.no'))
        .ok(this.translate.instant('action.yes'));
    this.dialog.show(confirm).then(() => {
        this.entityViewService.makeEntityViewPublic(entityView.id.id).then(() => {
            this.grid.refreshList();
        });
    });
  };
}
