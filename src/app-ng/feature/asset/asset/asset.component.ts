import { Component, forwardRef, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AssetService } from '../../api/services/asset.service';
import { CustomerService } from '../../api/services/customer.service';
import { DOCUMENT } from '@angular/common';
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
import { TbAssetDirective } from '../tb-asset/tb-asset.directive';
import { TbAttributeTableDirective } from '../../entity/tb-attribute-table/tb-attribute-table.directive';
import { TbAlarmTableDirective } from '../../alarm/tb-alarm-table/tb-alarm-table.directive';
import { TbEventTableDirective } from '../../event/tb-event-table/tb-event-table.directive';
import { TbRelationTableDirective } from '../../entity/tb-relation-table/tb-relation-table.directive';
import { TbAuditLogTableDirective } from '../../audit/tb-audit-log-table/tb-audit-log-table.directive';

import $ from 'jquery';
// @ts-ignore
import addAssetTemplate from '../../../../app/asset/add-asset.tpl.html';
// @ts-ignore
import assetCard from '../../../../app/asset/asset-card.tpl.html';
// @ts-ignore
import assignToCustomerTemplate from '../../../../app/asset/assign-to-customer.tpl.html';
// @ts-ignore
import addAssetsToCustomerTemplate from '../../../../app/asset/add-assets-to-customer.tpl.html';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS controller `AssetController` (module `thingsboard.asset`) in src/app/asset/index.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'asset',
  standalone: true,
  imports: [TranslatePipe, MatTabsModule, CommonModule, TbGridDirective, TbHelpDirective, TbAssetDirective, TbAttributeTableDirective, TbAlarmTableDirective, TbEventTableDirective, TbRelationTableDirective, TbAuditLogTableDirective],
  templateUrl: './asset.component.html',
})
export class AssetComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly assetService = inject(AssetService);
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
  protected assetActionsList: any = [];
  protected assetGroupActionsList: any = [];
  protected assetAddItemActionsList: any;
  types: any;
  assetGridConfig: any;
  assetsScope: any;
  customerAssetsTitle: any;
  grid: any;
  topIndex: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $rootScope.$broadcast — a root scope event: call the service that listens
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    this.customerId = this.route.snapshot.params['customerId'];
    this.assetAddItemActionsList = [
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.grid.addItem($event);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.add') },
            details: (...rest: any[]) => { return this.translate.instant('asset.add-asset-text') },
            icon: "insert_drive_file"
        },
        {
            onAction: ($event?: any, ...rest: any[]) => {
                this.importExport.importEntities($event, this.typesRef.entityType.asset).then(
                    () => {
                        this.grid.refreshList();
                    }
                );
            },
            name: (...rest: any[]) => { return this.translate.instant('action.import') },
            details: (...rest: any[]) => { return this.translate.instant('asset.import') },
            icon: "file_upload"
        }
    ];
    this.types = this.typesRef;
    this.assetGridConfig = {
        deleteItemTitleFunc: this.deleteAssetTitle,
        deleteItemContentFunc: this.deleteAssetText,
        deleteItemsTitleFunc: this.deleteAssetsTitle,
        deleteItemsActionTitleFunc: this.deleteAssetsActionTitle,
        deleteItemsContentFunc: this.deleteAssetsText,

        saveItemFunc: this.saveAsset,

        getItemTitleFunc: this.getAssetTitle,

        itemCardController: 'AssetCardController',
        itemCardTemplateUrl: assetCard,
        parentCtl: this,

        actionsList: this.assetActionsList,
        groupActionsList: this.assetGroupActionsList,
        addItemActions: this.assetAddItemActionsList,

        onGridInited: this.gridInited,

        addItemTemplateUrl: addAssetTemplate,

        addItemText: (...rest: any[]) => { return this.translate.instant('asset.add-asset-text') },
        noItemsText: (...rest: any[]) => { return this.translate.instant('asset.no-assets-text') },
        itemDetailsText: (...rest: any[]) => { return this.translate.instant('asset.asset-details') },
        isDetailsReadOnly: this.isCustomerUser,
        isSelectionEnabled: (...rest: any[]) => {
            return !this.isCustomerUser();
        }
    };
    if ((this.route.snapshot.params['items'] !== undefined) && this.route.snapshot.params['items'] !== null) {
        this.assetGridConfig.items = this.route.snapshot.params['items'];
    }
    if ((this.route.snapshot.params['topIndex'] !== undefined) && this.route.snapshot.params['topIndex'] > 0) {
        this.assetGridConfig.topIndex = this.route.snapshot.params['topIndex'];
    }
    this.assetsScope = (this.router as any).$current.data.assetsType;
    this.assignToCustomer = this.assignToCustomer;
    this.makePublic = this.makePublic;
    this.unassignFromCustomer = this.unassignFromCustomer;
    this.initController();
  }

  initController(...rest: any[]): any {
    var fetchAssetsFunction: any = null;
    var deleteAssetFunction: any = null;
    var refreshAssetsParamsFunction: any = null;

    var user: any = this.userService.getCurrentUser();

    if (user.authority === 'CUSTOMER_USER') {
        this.assetsScope = 'customer_user';
        this.customerId = user.customerId;
    }
    if (this.customerId) {
        this.customerAssetsTitle = this.translate.instant('customer.assets');
        this.customerService.getShortCustomerInfo(this.customerId).then(
            (info?: any) => {
                if (info.isPublic) {
                    this.customerAssetsTitle = this.translate.instant('customer.public-assets');
                }
            }
        );
    }

    if (this.assetsScope === 'tenant') {
        fetchAssetsFunction = (pageLink?: any, assetType?: any) => {
            return this.assetService.getTenantAssets(pageLink, true, null, assetType);
        };
        deleteAssetFunction = (assetId?: any) => {
            return this.assetService.deleteAsset(assetId);
        };
        refreshAssetsParamsFunction = () => {
            return {"topIndex": this.topIndex};
        };

        this.assetActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.makePublic($event, item);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.share') },
            details: (...rest: any[]) => { return this.translate.instant('asset.make-public') },
            icon: "share",
            isEnabled: (asset?: any, ...rest: any[]) => {
                return asset && (!asset.customerId || asset.customerId.id === this.typesRef.id.nullUid);
            }
        });

        this.assetActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.assignToCustomer($event, [ item.id.id ]);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.assign') },
                details: (...rest: any[]) => { return this.translate.instant('asset.assign-to-customer') },
                icon: "assignment_ind",
                isEnabled: (asset?: any, ...rest: any[]) => {
                    return asset && (!asset.customerId || asset.customerId.id === this.typesRef.id.nullUid);
                }
            }
        );

        this.assetActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.unassignFromCustomer($event, item, false);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                details: (...rest: any[]) => { return this.translate.instant('asset.unassign-from-customer') },
                icon: "assignment_return",
                isEnabled: (asset?: any, ...rest: any[]) => {
                    return asset && asset.customerId && asset.customerId.id !== this.typesRef.id.nullUid && !asset.assignedCustomer.isPublic;
                }
            }
        );

        this.assetActionsList.push({
            onAction: ($event?: any, item?: any, ...rest: any[]) => {
                this.unassignFromCustomer($event, item, true);
            },
            name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
            details: (...rest: any[]) => { return this.translate.instant('asset.make-private') },
            icon: "reply",
            isEnabled: (asset?: any, ...rest: any[]) => {
                return asset && asset.customerId && asset.customerId.id !== this.typesRef.id.nullUid && asset.assignedCustomer.isPublic;
            }
        });

        this.assetActionsList.push(
            {
                onAction: ($event?: any, item?: any, ...rest: any[]) => {
                    this.grid.deleteItem($event, item);
                },
                name: (...rest: any[]) => { return this.translate.instant('action.delete') },
                details: (...rest: any[]) => { return this.translate.instant('asset.delete') },
                icon: "delete"
            }
        );

        this.assetGroupActionsList.push(
            {
                onAction: ($event?: any, items?: any, ...rest: any[]) => {
                    this.assignAssetsToCustomer($event, items);
                },
                name: (...rest: any[]) => { return this.translate.instant('asset.assign-assets') },
                details: (selectedCount?: any, ...rest: any[]) => {
                    return this.translate.instant('asset.assign-assets-text', {count: selectedCount}, "messageformat");
                },
                icon: "assignment_ind"
            }
        );

        this.assetGroupActionsList.push(
            {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.grid.deleteItems($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('asset.delete-assets') },
                details: this.deleteAssetsActionTitle,
                icon: "delete"
            }
        );



    } else if (this.assetsScope === 'customer' || this.assetsScope === 'customer_user') {
        fetchAssetsFunction = (pageLink?: any, assetType?: any) => {
            return this.assetService.getCustomerAssets(this.customerId, pageLink, true, null, assetType);
        };
        deleteAssetFunction = (assetId?: any) => {
            return this.assetService.unassignAssetFromCustomer(assetId);
        };
        refreshAssetsParamsFunction = () => {
            return {"customerId": this.customerId, "topIndex": this.topIndex};
        };

        if (this.assetsScope === 'customer') {
            this.assetActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.unassignFromCustomer($event, item, false);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.unassign') },
                    details: (...rest: any[]) => { return this.translate.instant('asset.unassign-from-customer') },
                    icon: "assignment_return",
                    isEnabled: function(asset?: any, ...rest: any[]) {
                        return asset && !asset.assignedCustomer.isPublic;
                    }
                }
            );
            this.assetActionsList.push(
                {
                    onAction: ($event?: any, item?: any, ...rest: any[]) => {
                        this.unassignFromCustomer($event, item, true);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('action.make-private') },
                    details: (...rest: any[]) => { return this.translate.instant('asset.make-private') },
                    icon: "reply",
                    isEnabled: function(asset?: any, ...rest: any[]) {
                        return asset && asset.assignedCustomer.isPublic;
                    }
                }
            );

            this.assetGroupActionsList.push(
                {
                    onAction: ($event?: any, items?: any, ...rest: any[]) => {
                        this.unassignAssetsFromCustomer($event, items);
                    },
                    name: (...rest: any[]) => { return this.translate.instant('asset.unassign-assets') },
                    details: (selectedCount?: any, ...rest: any[]) => {
                        return this.translate.instant('asset.unassign-assets-action-title', {count: selectedCount}, "messageformat");
                    },
                    icon: "assignment_return"
                }
            );

            this.assetGridConfig.addItemAction = {
                onAction: ($event?: any, ...rest: any[]) => {
                    this.addAssetsToCustomer($event);
                },
                name: (...rest: any[]) => { return this.translate.instant('asset.assign-assets') },
                details: (...rest: any[]) => { return this.translate.instant('asset.assign-new-asset') },
                icon: "add"
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

  deleteAssetTitle = (asset?: any, ...rest: any[]): any => {
    return this.translate.instant('asset.delete-asset-title', {assetName: asset.name});
  };

  deleteAssetText = (...rest: any[]): any => {
    return this.translate.instant('asset.delete-asset-text');
  };

  deleteAssetsTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('asset.delete-assets-title', {count: selectedCount}, 'messageformat');
  };

  deleteAssetsActionTitle = (selectedCount?: any, ...rest: any[]): any => {
    return this.translate.instant('asset.delete-assets-action-title', {count: selectedCount}, 'messageformat');
  };

  deleteAssetsText = (...rest: any[]): any => {
    return this.translate.instant('asset.delete-assets-text');
  };

  gridInited = (grid?: any, ...rest: any[]): any => {
    this.grid = grid;
  };

  getAssetTitle = (asset?: any, ...rest: any[]): any => {
    return asset ? asset.name : '';
  };

  saveAsset = (asset?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.assetService.saveAsset(asset).then(
        (savedAsset?: any) => {
            this.rootScope.$broadcast('assetSaved');
            var assets: any = [ savedAsset ];
            this.customerService.applyAssignedCustomersInfo(assets).then(
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
    return this.assetsScope === 'customer_user';
  };

  assignToCustomer = ($event?: any, assetIds?: any, ...rest: any[]): any => {
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
                controller: 'AssignAssetToCustomerController',
                controllerAs: 'vm',
                templateUrl: assignToCustomerTemplate,
                locals: {assetIds: assetIds, customers: customers},
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

  addAssetsToCustomer($event?: any, ...rest: any[]): any {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    var pageSize: any = 10;
    this.assetService.getTenantAssets({limit: pageSize, textSearch: ''}, false).then(
        (_assets?: any) => {
            var assets: any = {
                pageSize: pageSize,
                data: _assets.data,
                nextPageLink: _assets.nextPageLink,
                selections: {},
                selectedCount: 0,
                hasNext: _assets.hasNext,
                pending: false
            };
            if (assets.hasNext) {
                assets.nextPageLink.limit = pageSize;
            }
            (this.dialog as any).show({
                controller: 'AddAssetsToCustomerController',
                controllerAs: 'vm',
                templateUrl: addAssetsToCustomerTemplate,
                locals: {customerId: this.customerId, assets: assets},
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

  assignAssetsToCustomer($event?: any, items?: any, ...rest: any[]): any {
    var assetIds: any = [];
    for (var id in items.selections) {
        assetIds.push(id);
    }
    this.assignToCustomer($event, assetIds);
  }

  unassignFromCustomer = ($event?: any, asset?: any, isPublic?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    var title: any;
    var content: any;
    var label: any;
    if (isPublic) {
        title = this.translate.instant('asset.make-private-asset-title', {assetName: asset.name});
        content = this.translate.instant('asset.make-private-asset-text');
        label = this.translate.instant('asset.make-private');
    } else {
        title = this.translate.instant('asset.unassign-asset-title', {assetName: asset.name});
        content = this.translate.instant('asset.unassign-asset-text');
        label = this.translate.instant('asset.unassign-asset');
    }
    if (window.confirm(title + '\n' + content)) {
        this.assetService.unassignAssetFromCustomer(asset.id.id).then(() => {
            this.grid.refreshList();
        });
    }
  };

  unassignAssetsFromCustomer($event?: any, items?: any, ...rest: any[]): any {
    const title: any = this.translate.instant('asset.unassign-assets-title', {count: items.selectedCount}, 'messageformat');
    const content: any = this.translate.instant('asset.unassign-assets-text');
    if (window.confirm(title + '\n' + content)) {
        var tasks: any = [];
        for (var id in items.selections) {
            tasks.push(this.assetService.unassignAssetFromCustomer(id));
        }
        Promise.all(tasks).then(() => {
            this.grid.refreshList();
        });
    }
  }

  makePublic = ($event?: any, asset?: any, ...rest: any[]): any => {
    if ($event) {
        $event.stopPropagation();
    }
    const title: any = this.translate.instant('asset.make-public-asset-title', {assetName: asset.name});
    const content: any = this.translate.instant('asset.make-public-asset-text');
    if (window.confirm(title + '\n' + content)) {
        this.assetService.makeAssetPublic(asset.id.id).then(() => {
            this.grid.refreshList();
        });
    }
  };
}
