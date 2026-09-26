import { Component, forwardRef, inject, model } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MatDialog } from '@angular/material/dialog';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbWidgetConfigDirective } from '../../components/tb-widget-config/tb-widget-config.directive';

import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let angular: any;
declare let scope: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbEditWidget` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-edit-widget',
  standalone: true,
  imports: [FormsModule, forwardRef(() => TbWidgetConfigDirective)],
  templateUrl: './tb-edit-widget.directive.html',
})
export class TbEditWidgetDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly dashboard = model<any>();
  readonly aliasController = model<any>();
  readonly widgetEditMode = model<any>();
  readonly widget = model<any>();
  readonly widgetLayout = model<any>();
  readonly theForm = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly widgetService = inject(WidgetService);
  protected readonly entityService = inject(EntityService);
  // TODO(port): '$q' — use Promise, or an Observable
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  protected readonly element = inject(ElementRef);

  $watch: any;
  widgetConfig: any;
  typeParameters: any;
  actionSources: any;
  isDataEnabled: any;
  settingsSchema: any;
  dataKeySettingsSchema: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method
  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.$watch('widget', () => {
            if (this.widget()) {
                this.widgetService.getWidgetInfo(this.widget().bundleAlias,
                    this.widget().typeAlias,
                    this.widget().isSystemType).then(
                    (widgetInfo?: any) => {
                        queueMicrotask((scope?: any) => {
                            scope.widgetConfig = {
                                config: scope.widget().config,
                                layout: scope.widgetLayout()
                            };
                            var settingsSchema: any = widgetInfo.typeSettingsSchema || widgetInfo.settingsSchema;
                            var dataKeySettingsSchema: any = widgetInfo.typeDataKeySettingsSchema || widgetInfo.dataKeySettingsSchema;
                            scope.typeParameters = widgetInfo.typeParameters;
                            scope.actionSources = widgetInfo.actionSources;
                            scope.isDataEnabled = !widgetInfo.typeParameters.useCustomDatasources;
                            if (!settingsSchema || settingsSchema === '') {
                                scope.settingsSchema = {};
                            } else {
                                scope.settingsSchema = JSON.parse(settingsSchema);
                            }
                            if (!dataKeySettingsSchema || dataKeySettingsSchema === '') {
                                scope.dataKeySettingsSchema = {};
                            } else {
                                scope.dataKeySettingsSchema = JSON.parse(dataKeySettingsSchema);
                            }

                            scope.functionsOnly = scope.dashboard() ? false : true;

                            scope.theForm().$setPristine();
                        });
                    }
                );
            }
        });
    this.$watch('widgetLayout', () => {
            if (this.widgetLayout() && this.widgetConfig) {
                this.widgetConfig.layout = this.widgetLayout();
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  fetchEntityKeys(entityAliasId?: any, query?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.aliasController().getAliasInfo(entityAliasId).then(
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
  }

  fetchDashboardStates(query?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    var stateIds: any = Object.keys(this.dashboard().configuration.states);
    var result: any = query ? stateIds.filter(
        this.createFilterForDashboardState(query)) : stateIds;
    if (result && result.length) {
        deferred.resolve(result);
    } else {
        deferred.resolve([query]);
    }
    return deferred.promise;
  }

  createFilterForDashboardState(query?: any, ...rest: any[]): any {
    var lowercaseQuery: any = angular.lowercase(query);
    return function filterFn(stateId?: any) {
        return (angular.lowercase(stateId).indexOf(lowercaseQuery) === 0);
    };
  }

  createEntityAlias(event?: any, alias?: any, allowedEntityTypes?: any, ...rest: any[]): any {
    let vm = this;

    var deferred: any = $q.defer();
    var singleEntityAlias: any = {id: null, alias: alias, filter: {}};

    (this.dialog as any).show({
        controller: 'EntityAliasDialogController',
        controllerAs: 'vm',
        locals: {
            isAdd: true,
            allowedEntityTypes: allowedEntityTypes,
            entityAliases: this.dashboard().configuration.entityAliases,
            alias: singleEntityAlias
        },
        parent: $(this.document.body),
        fullscreen: true,
        multiple: true,
        targetEvent: event
    }).then((singleEntityAlias?: any) => {
        this.dashboard().configuration.entityAliases[singleEntityAlias.id] = singleEntityAlias;
        this.aliasController().updateEntityAliases(this.dashboard().configuration.entityAliases);
        deferred.resolve(singleEntityAlias);
    }, function () {
        deferred.reject();
    });

    return deferred.promise;
  }
}
