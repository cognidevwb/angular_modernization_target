import { Component, forwardRef, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { EntityService } from '../../api/services/entity.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbWidgetConfigDirective } from '../../components/tb-widget-config/tb-widget-config.directive';

import $ from 'jquery';
// @ts-ignore
import entityAliasDialogTemplate from '../../../../app/entity/alias/entity-alias-dialog.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;

/**
 * Ported from the AngularJS controller `AddWidgetController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'add-widget',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbHelpDirective), forwardRef(() => TbWidgetConfigDirective)],
  templateUrl: './add-widget.component.html',
})
export class AddWidgetComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly widgetService = inject(WidgetService);
  protected readonly entityService = inject(EntityService);
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly document = inject(DOCUMENT);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  dashboard: any;
  aliasController: any;
  widget: any;
  widgetInfo: any;
  functionsOnly: any = false;
  widgetConfig: any;
  protected settingsSchema_local: any;
  protected dataKeySettingsSchema_local: any;
  dataKeySettingsSchema: any;
  settingsSchema: any;
  theForm: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method
  // TODO(port): `dataKeySettingsSchema` was both a local and a member the class exposes; the local is `dataKeySettingsSchema_local`, the member stays `dataKeySettingsSchema`
  // TODO(port): `settingsSchema` was both a local and a member the class exposes; the local is `settingsSchema_local`, the member stays `settingsSchema`

  constructor() {
    this.dashboard = this.dialogData.dashboard;
    this.aliasController = this.dialogData.aliasController;
    this.widget = this.dialogData.widget;
    this.widgetInfo = this.dialogData.widgetInfo;
    this.helpLinkIdForWidgetType = this.helpLinkIdForWidgetType;
    this.add = this.add;
    this.cancel = this.cancel;
    this.fetchEntityKeys = this.fetchEntityKeys;
    this.fetchDashboardStates = this.fetchDashboardStates;
    this.createEntityAlias = this.createEntityAlias;
    this.widgetConfig = {
        config: this.widget.config,
        layout: {}
    };
    this.widgetConfig.layout.mobileOrder = this.widget.config.mobileOrder;
    this.widgetConfig.layout.mobileHeight = this.widget.config.mobileHeight;
    this.settingsSchema_local = this.widgetInfo.typeSettingsSchema || this.dialogData.widgetInfo.settingsSchema;
    this.dataKeySettingsSchema_local = this.widgetInfo.typeDataKeySettingsSchema || this.dialogData.widgetInfo.dataKeySettingsSchema;
    if (!this.settingsSchema_local || this.settingsSchema_local === '') {
        this.settingsSchema = {};
    } else {
        this.settingsSchema = JSON.parse(this.settingsSchema_local);
    }
    if (!this.dataKeySettingsSchema_local || this.dataKeySettingsSchema_local === '') {
        this.dataKeySettingsSchema = {};
    } else {
        this.dataKeySettingsSchema = JSON.parse(this.dataKeySettingsSchema_local);
    }
  }

  helpLinkIdForWidgetType = (...rest: any[]): any => {
    var link: any = 'widgetsConfig';
    if (this.widget && this.widget.type) {
        switch (this.widget.type) {
            case types.widgetType.timeseries.value: {
                link = 'widgetsConfigTimeseries';
                break;
            }
            case types.widgetType.latest.value: {
                link = 'widgetsConfigLatest';
                break;
            }
            case types.widgetType.rpc.value: {
                link = 'widgetsConfigRpc';
                break;
            }
            case types.widgetType.alarm.value: {
                link = 'widgetsConfigAlarm';
                break;
            }
            case types.widgetType.static.value: {
                link = 'widgetsConfigStatic';
                break;
            }
        }
    }
    return link;
  };

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  add = (...rest: any[]): any => {
    if (this.theForm.$valid) {
        this.theForm.$setPristine();
        this.widget.config = this.widgetConfig.config;
        this.widget.config.mobileOrder = this.widgetConfig.layout.mobileOrder;
        this.widget.config.mobileHeight = this.widgetConfig.layout.mobileHeight;
        (this.dialog as any).hide({widget: this.widget});
    }
  };

  fetchEntityKeys = (entityAliasId?: any, query?: any, type?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    this.aliasController.getAliasInfo(entityAliasId).then(
        (aliasInfo?: any) => {
            var entity: any = aliasInfo.currentEntity;
            if (entity) {
                this.entityService.getEntityKeys(entity.entityType, entity.id, query, type, {ignoreLoading: true}).then(
                    function success(keys?: any) {
                        deferred.resolve(keys);
                    },
                    function fail() {
                        deferred.resolve([]);
                    }
                );
            } else {
                deferred.resolve([]);
            }
        },
        function fail() {
            deferred.resolve([]);
        }
    );
    return deferred.promise;
  };

  fetchDashboardStates = (query?: any, ...rest: any[]): any => {
    var deferred: any = $q.defer();
    var stateIds: any = Object.keys(this.dashboard.configuration.states);
    var result: any = query ? stateIds.filter(
        this.createFilterForDashboardState(query)) : stateIds;
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([query]);
    }
    return deferred.promise;
  };

  createFilterForDashboardState(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = angular.lowercase(query);
    return function filterFn(stateId?: any) {
        return (angular.lowercase(stateId).indexOf(lowercaseQuery) === 0);
    };
  }

  createEntityAlias = (event?: any, alias?: any, allowedEntityTypes?: any, ...rest: any[]): any => {
    let vm = this;

    var deferred: any = $q.defer();
    var singleEntityAlias: any = {id: null, alias: alias, filter: {}};

    (this.dialog as any).show({
        controller: 'EntityAliasDialogController',
        controllerAs: 'vm',
        templateUrl: entityAliasDialogTemplate,
        locals: {
            isAdd: true,
            allowedEntityTypes: allowedEntityTypes,
            entityAliases: this.dashboard.configuration.entityAliases,
            alias: singleEntityAlias
        },
        parent: $(this.document.body),
        fullscreen: true,
        multiple: true,
        targetEvent: event
    }).then((singleEntityAlias?: any) => {
        this.dashboard.configuration.entityAliases[singleEntityAlias.id] = singleEntityAlias;
        this.aliasController.updateEntityAliases(this.dashboard.configuration.entityAliases);
        deferred.resolve(singleEntityAlias);
    }, function () {
        deferred.reject();
    });

    return deferred.promise;
  };
}
