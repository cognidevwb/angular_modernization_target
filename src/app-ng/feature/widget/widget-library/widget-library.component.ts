import { Component, forwardRef, inject, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DOCUMENT } from '@angular/common';
import { EntityService } from '../../api/services/entity.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { goState } from '../../../state-paths';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { UtilsService } from '../../common/services/utils.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { TbDashboardDirective } from '../../components/tb-dashboard/tb-dashboard.directive';

import $ from 'jquery';
import AliasController from '../../../legacy-lib/api/alias-controller';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
import { firstValueFrom } from 'rxjs';
import { orderBy } from 'lodash-es';
import { SelectWidgetTypeComponent } from '../select-widget-type/select-widget-type.component';

const $filter = (name: string): any => {
  if (name === 'orderBy') {
    return (array: any[], predicate: any) => {
      const predicates = Array.isArray(predicate) ? predicate : [predicate];
      const props = predicates.map((p: string) => p.replace(/^[-+]/, ''));
      const orders = predicates.map((p: string) => (p.startsWith('-') ? 'desc' : 'asc'));
      return orderBy(array, props, orders as any);
    };
  }
  return (x: any) => x;
};

/**
 * Ported from the AngularJS controller `WidgetLibraryController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 5 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'widget-library',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatButtonModule, forwardRef(() => TbDashboardDirective)],
  templateUrl: './widget-library.component.html',
})
export class WidgetLibraryComponent {
  protected readonly rootScope = inject(RootState);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly widgetService = inject(WidgetService);
  protected readonly userService = inject(UserService);
  protected readonly importExport = inject(ImportExportService);
  protected readonly router = inject(Router);
  protected readonly route = inject(ActivatedRoute);
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly utils = inject(UtilsService);
  protected readonly entityService = inject(EntityService);
  // TODO(port): elements not resolved to a component: md-fab-speed-dial, md-fab-trigger, md-fab-actions
  // TODO(port): template: 1 × md-fab-actions left in place
  // TODO(port): template: 1 × md-fab-speed-dial left in place
  // TODO(port): template: 1 × md-fab-trigger left in place

  protected widgetsBundleId: any;
  widgetTypes: any = [];
  dashboardInitComplete: any = false;
  protected addItemActionsOpen: any = false;
  protected stateController: any = {
        getStateParams: function(...rest: any[]) {
            return {};
        }
    };
  aliasController: any;
  widgetsBundle: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $state.current — $state.current: this.router.url, or the ActivatedRoute snapshot
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): $state.params — $state.params: this.route.snapshot.params
  // TODO(port): $stateParams — $stateParams: this.route.snapshot.params

  constructor() {
    this.widgetsBundleId = this.route.snapshot.params['widgetsBundleId'];
    this.widgetsBundle;
    this.aliasController = new AliasController(this, $q, $filter, this.utils,
        types, this.entityService, this.stateController, {});
    this.noData = this.noData;
    this.dashboardInited = this.dashboardInited;
    this.dashboardInitFailed = this.dashboardInitFailed;
    this.addWidgetType = this.addWidgetType;
    this.openWidgetType = this.openWidgetType;
    this.exportWidgetType = this.exportWidgetType;
    this.importWidgetType = this.importWidgetType;
    this.removeWidgetType = this.removeWidgetType;
    this.loadWidgetLibrary = this.loadWidgetLibrary;
    this.addWidgetType = this.addWidgetType;
    this.isReadOnly = this.isReadOnly;
  }

  loadWidgetLibrary = (...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.rootScope.loading = true;
    this.widgetService.getWidgetsBundle(this.widgetsBundleId).then(
        (widgetsBundle?: any) => {
            this.widgetsBundle = widgetsBundle;
            if (this.widgetsBundle) {
                var bundleAlias: any = this.widgetsBundle.alias;
                var isSystem: any = this.widgetsBundle.tenantId.id === types.id.nullUid;

                this.widgetService.getBundleWidgetTypes(bundleAlias, isSystem).then(
                    (widgetTypes?: any) => {
                        const loadNext = (i?: any): any => {
                            var widgetType: any = widgetTypes[i];
                            queueMicrotask(() => {
                                var widgetTypeInfo: any = this.widgetService.toWidgetInfo(widgetType);
                                var sizeX: any = 8;
                                var sizeY: any = Math.floor(widgetTypeInfo.sizeY);
                                var widget: any = {
                                    typeId: widgetType.id,
                                    isSystemType: isSystem,
                                    bundleAlias: bundleAlias,
                                    typeAlias: widgetTypeInfo.alias,
                                    type: widgetTypeInfo.type,
                                    title: widgetTypeInfo.widgetName,
                                    sizeX: sizeX,
                                    sizeY: sizeY,
                                    row: top,
                                    col: col,
                                    config: JSON.parse(widgetTypeInfo.defaultConfig)
                                };
                                widget.config.title = widgetTypeInfo.widgetName;
                                this.widgetTypes.push(widget);
                                top+=sizeY;
                                if (top > lastTop[column] + 10) {
                                    lastTop[column] = top;
                                    column++;
                                    if (column > 2) {
                                        column = 0;
                                    }
                                    top = lastTop[column];
                                    col = column * 8;
                                }
                                loadNextOrComplete(i);
                            });
                       }

                        widgetTypes = $filter('orderBy')(widgetTypes, ['-descriptor.type','-createdTime']);

                        var top: any = 0;
                        var lastTop: any = [0, 0, 0];
                        var col: any = 0;
                        var column: any = 0;

                        if (widgetTypes.length > 0) {
                            loadNext(0);
                        } else {
                            this.rootScope.loading = false;
                            deferred.resolve();
                        }

                        const loadNextOrComplete = (i?: any): any => {
                            i++;
                            if (i < widgetTypes.length) {
                                loadNext(i);
                            } else {
                                this.rootScope.loading = false;
                                deferred.resolve();
                            }
                        }


                    }
                );
            } else {
                this.rootScope.loading = false;
                deferred.resolve();
            }
        }, () => {
            this.rootScope.loading = false;
            deferred.reject();
        }
    );
    return deferred.promise;
  };

  noData = (...rest: any[]): any => {
    return this.dashboardInitComplete && this.widgetTypes.length == 0;
  };

  dashboardInitFailed = (...rest: any[]): any => {
    this.dashboardInitComplete = true;
  };

  dashboardInited = (...rest: any[]): any => {
    this.dashboardInitComplete = true;
  };

  addWidgetType = ($event?: any, ...rest: any[]): any => {
    this.openWidgetType($event);
  };

  isReadOnly = (...rest: any[]): any => {
    if (this.userService.getAuthority() === 'TENANT_ADMIN') {
        return !this.widgetsBundle || this.widgetsBundle.tenantId.id === types.id.nullUid;
    } else {
        return this.userService.getAuthority() != 'SYS_ADMIN';
    }
    return undefined;
  };

  openWidgetType = (event?: any, widget?: any, ...rest: any[]): any => {
    let vm = this;
    if (event) {
        event.stopPropagation();
    }
    if (widget) {
        goState(this.router, 'home.widgets-bundles.widget-types.widget-type',
            {widgetTypeId: widget.typeId.id});
    } else {
        firstValueFrom(this.dialog.open(SelectWidgetTypeComponent, {
            panelClass: 'tb-dialog'
        }).afterClosed()).then((widgetType?: any) => {
            if (widgetType !== undefined) {
                goState(this.router, 'home.widgets-bundles.widget-types.widget-type',
                    {widgetType: widgetType});
            }
        }, () => {
        });
    }
  };

  exportWidgetType = (event?: any, widget?: any, ...rest: any[]): any => {
    event.stopPropagation();
    this.importExport.exportWidgetType(widget.typeId.id);
  };

  importWidgetType = ($event?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    this.importExport.importWidgetType($event, this.widgetsBundle.alias).then(
        () => {
            goState(this.router, 'home.widgets-bundles.widget-types', this.route.snapshot.params);
        },
        function fail() {}
    );
  };

  removeWidgetType = (event?: any, widget?: any, ...rest: any[]): any => {
    const confirmed = window.confirm(
        this.translate.instant('widget.remove-widget-type-title', {widgetName: widget.config.title}) + '\n' +
        this.translate.instant('widget.remove-widget-type-text')
    );
    if (confirmed) {
        this.widgetService.deleteWidgetType(widget.bundleAlias, widget.typeAlias, widget.isSystemType).then(
            () => {
                this.widgetTypes.splice(this.widgetTypes.indexOf(widget), 1);
            },
            function fail() {}
        );
    }
  };
}
