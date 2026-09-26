import { Component, forwardRef, inject, input, model } from '@angular/core';
import { AttributeService } from '../../api/services/attribute.service';
import { DOCUMENT } from '@angular/common';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';
import { UtilsService } from '../../common/services/utils.service';
import { WidgetService } from '../../api/services/widget.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbWidgetsBundleSelectDirective } from '../../components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive';
import { TbDashboardDirective } from '../../components/tb-dashboard/tb-dashboard.directive';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
const attributeTableTemplate = require('../../../../app/entity/attribute/attribute-table.tpl.html') as any;
const addAttributeDialogTemplate = require('../../../../app/entity/attribute/add-attribute-dialog.tpl.html') as any;
const addWidgetToDashboardDialogTemplate = require('../../../../app/entity/attribute/add-widget-to-dashboard-dialog.tpl.html') as any;
const editAttributeValueTemplate = require('../../../../app/entity/attribute/edit-attribute-value.tpl.html') as any;
import EditAttributeValueController from '../../../../app/entity/attribute/edit-attribute-value.controller';
import AliasController from '../../../../app/api/alias-controller';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $mdEditDialog: any;
declare let $mdUtil: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAttributeTable` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-attribute-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbWidgetsBundleSelectDirective), forwardRef(() => TbDashboardDirective)],
  templateUrl: './tb-attribute-table.directive.html',
})
export class TbAttributeTableDirective {
  readonly entityId = model<any>();
  readonly entityName = model<any>();
  readonly disableAttributeScopeSelection = input<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly rootScope = inject(RootState);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$mdEditDialog' — an AngularJS built-in with no Angular counterpart
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly utils = inject(UtilsService);
  protected readonly typesRef: any = types;
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly entityService = inject(EntityService);
  protected readonly attributeService = inject(AttributeService);
  protected readonly widgetService = inject(WidgetService);
  protected readonly element = inject(ElementRef);
  protected readonly destroyRef = inject(DestroyRef);
  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): AngularJS built-in filters in the template: date — use Angular pipes
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

  protected template: any = $templateCache.get(attributeTableTemplate);
  types: any;
  entityType: any;
  attributeScope: any;
  attributes: any = {
            count: 0,
            data: []
        };
  selectedAttributes: any = [];
  mode: any = 'default';
  subscriptionId: any = null;
  query: any = {
            order: 'key',
            limit: 5,
            page: 1,
            search: null
        };
  $watch: any;
  aliasController: any;
  attributeScopeSelectionReadonly: any;
  attributeScopes: any;
  attributesDeferred: any;
  firstBundle: any;
  selectedWidgetsBundleAlias: any;
  widgetsBundle: any;
  widgetsBundleWatch: any;
  widgetsCarousel: any;
  widgetsIndexWatch: any;
  widgetsList: any;
  widgetsListCache: any;
  widgetsLoaded: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.entityType = this.attrs.entityType;
    if (this.entityType === this.typesRef.entityType.device || this.entityType === this.typesRef.entityType.entityView) {
            this.attributeScopes = this.typesRef.attributesScope;
            this.attributeScopeSelectionReadonly = false;
        } else {
            this.attributeScopes = {};
            this.attributeScopes.server = this.typesRef.attributesScope.server;
            this.attributeScopeSelectionReadonly = true;
        }
    this.attributeScope = this.getAttributeScopeByValue(this.attrs.defaultAttributeScope);
    if (this.entityType != this.typesRef.entityType.device) {
            if (this.attributeScope != this.typesRef.latestTelemetry) {
                this.attributeScope = this.attributeScopes.server;
            }
        }
    this.$watch("entityId", (newVal?: any) => {
            if (newVal) {
                this.resetFilter();
                this.getEntityAttributes(false, true);
            }
        });
    this.$watch("attributeScope", (newVal?: any, prevVal?: any) => {
            if (newVal && !angular.equals(newVal, prevVal)) {
                this.mode = 'default';
                this.query.search = null;
                this.selectedAttributes = [];
                this.getEntityAttributes(false, true);
            }
        });
    this.$watch("query.search", (newVal?: any, prevVal?: any) => {
            if (!angular.equals(newVal, prevVal) && this.query.search != null) {
                this.getEntityAttributes();
            }
        });
    this.destroyRef.onDestroy(() => {
            if (this.subscriptionId) {
                this.attributeService.unsubscribeForEntityAttributes(this.subscriptionId);
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  getAttributeScopeByValue(attributeScopeValue?: any, ...rest: any[]): any {
    if (this.types.latestTelemetry.value === attributeScopeValue) {
        return this.types.latestTelemetry;
    }
    for (var attrScope in this.attributeScopes) {
        if (this.attributeScopes[attrScope].value === attributeScopeValue) {
            return this.attributeScopes[attrScope];
        }
    }
    return undefined;
  }

  resetFilter(...rest: any[]): any {
    this.mode = 'default';
    this.query.search = null;
    this.selectedAttributes = [];
    this.attributeScope = this.getAttributeScopeByValue(this.attrs.defaultAttributeScope);
  }

  enterFilterMode(event?: any, ...rest: any[]): any {
    let $button: any = $(event.currentTarget);
    let $toolbarsContainer: any = $button.closest('.toolbarsContainer');

    this.query.search = '';

    setTimeout(() => {
        $toolbarsContainer.find('.searchInput').focus();
    })
  }

  exitFilterMode(...rest: any[]): any {
    this.query.search = null;
    this.getEntityAttributes();
  }

  success(attributes?: any, update?: any, apply?: any, ...rest: any[]): any {
    this.attributes = attributes;
    if (!update) {
        this.selectedAttributes = [];
    }
    if (apply) {

    }
  }

  onReorder(...rest: any[]): any {
    this.getEntityAttributes(false, false);
  }

  onPaginate(...rest: any[]): any {
    this.getEntityAttributes(false, false);
  }

  getEntityAttributes(forceUpdate?: any, reset?: any, ...rest: any[]): any {
    if (this.attributesDeferred) {
        this.attributesDeferred.resolve();
    }
    if (this.entityId() && this.entityType && this.attributeScope) {
        if (reset) {
            this.attributes = {
                count: 0,
                data: []
            };
        }
        this.checkSubscription();
        this.attributesDeferred = this.attributeService.getEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value,
            this.query, (attributes?: any, update?: any, apply?: any) => {
                this.success(attributes, update || forceUpdate, apply);
            }
        );
    } else {
        var deferred: any = $q.defer();
        this.attributesDeferred = deferred;
        this.success({
            count: 0,
            data: []
        });
        deferred.resolve();
    }
  }

  checkSubscription(...rest: any[]): any {
    var newSubscriptionId: any = null;
    if (this.entityId() && this.entityType && this.attributeScope.clientSide && this.mode != 'widget') {
        newSubscriptionId = this.attributeService.subscribeForEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value);
    }
    if (this.subscriptionId && this.subscriptionId != newSubscriptionId) {
        this.attributeService.unsubscribeForEntityAttributes(this.subscriptionId);
    }
    this.subscriptionId = newSubscriptionId;
  }

  editAttribute($event?: any, attribute?: any, ...rest: any[]): any {
    if (!this.attributeScope.clientSide) {
        $event.stopPropagation();
        $mdEditDialog.show({
            controller: EditAttributeValueController,
            templateUrl: editAttributeValueTemplate,
            locals: {
                attributeValue: attribute.value,
                save: (model?: any, ...rest: any[]) => {
                    var updatedAttribute: any = structuredClone(attribute);
                    updatedAttribute.value = model.value;
                    this.attributeService.saveEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value, [updatedAttribute]).then(
                        () => {
                            this.getEntityAttributes();
                        }
                    );
                }
            },
            targetEvent: $event
        });
    }
  }

  addAttribute($event?: any, ...rest: any[]): any {
    let vm = this;
    if (!this.attributeScope.clientSide) {
        $event.stopPropagation();
        (this.dialog as any).show({
            controller: 'AddAttributeDialogController',
            controllerAs: 'vm',
            templateUrl: addAttributeDialogTemplate,
            parent: $(this.document.body),
            locals: {
                entityType: this.entityType,
                entityId: this.entityId(),
                attributeScope: this.attributeScope.value
            },
            fullscreen: true,
            targetEvent: $event
        }).then(() => {
            this.getEntityAttributes();
        });
    }
  }

  deleteAttributes($event?: any, ...rest: any[]): any {
    if (!this.attributeScope.clientSide) {
        $event.stopPropagation();
        var confirm: any = (this.dialog as any).confirm()
            .targetEvent($event)
            .title(this.translate.instant('attribute.delete-attributes-title', {count: this.selectedAttributes.length}, 'messageformat'))
            .htmlContent(this.translate.instant('attribute.delete-attributes-text'))
            .ariaLabel(this.translate.instant('attribute.delete-attributes'))
            .cancel(this.translate.instant('action.no'))
            .ok(this.translate.instant('action.yes'));
        (this.dialog as any).show(confirm).then(() => {
            this.attributeService.deleteEntityAttributes(this.entityType, this.entityId(), this.attributeScope.value, this.selectedAttributes).then(
                () => {
                    this.selectedAttributes = [];
                    this.getEntityAttributes();
                }
            )
        });
    }
  }

  nextWidget(...rest: any[]): any {
    $mdUtil.nextTick(() => {
        if (this.widgetsCarousel.index < this.widgetsList.length - 1) {
            this.widgetsCarousel.index++;
        }
    });
  }

  prevWidget(...rest: any[]): any {
    $mdUtil.nextTick(() => {
        if (this.widgetsCarousel.index > 0) {
            this.widgetsCarousel.index--;
        }
    });
  }

  enterWidgetMode(...rest: any[]): any {

    if (this.widgetsIndexWatch) {
        this.widgetsIndexWatch();
        this.widgetsIndexWatch = null;
    }

    if (this.widgetsBundleWatch) {
        this.widgetsBundleWatch();
        this.widgetsBundleWatch = null;
    }

    this.mode = 'widget';
    this.checkSubscription();
    this.widgetsList = [];
    this.widgetsListCache = [];
    this.widgetsLoaded = false;
    this.widgetsCarousel = {
        index: 0
    }
    this.widgetsBundle = null;
    this.firstBundle = true;
    this.selectedWidgetsBundleAlias = this.typesRef.systemBundleAlias.cards;

    var entityAlias: any = {
        id: this.utils.guid(),
        alias: this.entityName(),
        filter: this.dashboardUtils.createSingleEntityFilter(this.entityType, this.entityId())
    };
    var entitiAliases: any = {};
    entitiAliases[entityAlias.id] = entityAlias;

    var stateController: any = {
        getStateParams: function (...rest: any[]) {
            return {};
        }
    };
    this.aliasController = new AliasController(this, $q, $filter, this.utils,
        this.typesRef, this.entityService, stateController, entitiAliases);

    var dataKeyType: any = this.attributeScope === this.typesRef.latestTelemetry ?
        this.typesRef.dataKeyType.timeseries : this.typesRef.dataKeyType.attribute;

    var datasource: any = {
        type: this.typesRef.datasourceType.entity,
        entityAliasId: entityAlias.id,
        dataKeys: []
    };
    var i: any = 0;
    for (var attr: any = 0; attr < this.selectedAttributes.length; attr++) {
        var attribute: any = this.selectedAttributes[attr];
        var dataKey: any = {
            name: attribute.key,
            label: attribute.key,
            type: dataKeyType,
            color: this.utils.getMaterialColor(i),
            settings: {},
            _hash: Math.random()
        };
        datasource.dataKeys.push(dataKey);
        i++;
    }

    this.widgetsIndexWatch = this.$watch('widgetsCarousel.index', (newVal?: any, prevVal?: any) => {
        if (this.mode === 'widget' && (newVal != prevVal)) {
            var index: any = this.widgetsCarousel.index;
            for (var i: any = 0; i < this.widgetsList.length; i++) {
                this.widgetsList[i].splice(0, this.widgetsList[i].length);
                if (i === index) {
                    this.widgetsList[i].push(this.widgetsListCache[i][0]);
                }
            }
        }
    });

    this.widgetsBundleWatch = this.$watch('widgetsBundle', (newVal?: any, prevVal?: any) => {
        if (this.mode === 'widget' && (this.firstBundle === true || newVal != prevVal)) {
            this.widgetsList = [];
            this.widgetsListCache = [];
            this.widgetsCarousel.index = 0;
            this.firstBundle = false;
            if (this.widgetsBundle) {
                this.widgetsLoaded = false;
                var bundleAlias: any = this.widgetsBundle.alias;
                var isSystem: any = this.widgetsBundle.tenantId.id === this.typesRef.id.nullUid;
                this.widgetService.getBundleWidgetTypes(this.widgetsBundle.alias, isSystem).then(
                    (widgetTypes?: any) => {

                        widgetTypes = $filter('orderBy')(widgetTypes, ['-descriptor.type', '-createdTime']);

                        for (var i: any = 0; i < widgetTypes.length; i++) {
                            var widgetType: any = widgetTypes[i];
                            var widgetInfo: any = this.widgetService.toWidgetInfo(widgetType);
                            if (widgetInfo.type !== this.typesRef.widgetType.static.value) {
                                var sizeX: any = widgetInfo.sizeX * 2;
                                var sizeY: any = widgetInfo.sizeY * 2;
                                var col: any = Math.floor(Math.max(0, (20 - sizeX) / 2));
                                var widget: any = {
                                    isSystemType: isSystem,
                                    bundleAlias: bundleAlias,
                                    typeAlias: widgetInfo.alias,
                                    type: widgetInfo.type,
                                    title: widgetInfo.widgetName,
                                    sizeX: sizeX,
                                    sizeY: sizeY,
                                    row: 0,
                                    col: col,
                                    config: JSON.parse(widgetInfo.defaultConfig)
                                };

                                widget.config.title = widgetInfo.widgetName;
                                widget.config.datasources = [datasource];
                                var length: any;
                                if (this.attributeScope === this.typesRef.latestTelemetry && widgetInfo.type !== this.typesRef.widgetType.rpc.value) {
                                    length = this.widgetsListCache.push([widget]);
                                    this.widgetsList.push(length === 1 ? [widget] : []);
                                } else if (widgetInfo.type === this.typesRef.widgetType.latest.value) {
                                    length = this.widgetsListCache.push([widget]);
                                    this.widgetsList.push(length === 1 ? [widget] : []);
                                }
                            }
                        }
                        this.widgetsLoaded = true;
                    }
                );
            }
        }
    });
  }

  exitWidgetMode(...rest: any[]): any {
    if (this.widgetsBundleWatch) {
        this.widgetsBundleWatch();
        this.widgetsBundleWatch = null;
    }
    if (this.widgetsIndexWatch) {
        this.widgetsIndexWatch();
        this.widgetsIndexWatch = null;
    }
    this.selectedWidgetsBundleAlias = null;
    this.mode = 'default';
    this.getEntityAttributes(true);
  }

  addWidgetToDashboard($event?: any, ...rest: any[]): any {
    let vm = this;
    if (this.mode === 'widget' && this.widgetsListCache.length > 0) {
        var widget: any = this.widgetsListCache[this.widgetsCarousel.index][0];
        $event.stopPropagation();
        (this.dialog as any).show({
            controller: 'AddWidgetToDashboardDialogController',
            controllerAs: 'vm',
            templateUrl: addWidgetToDashboardDialogTemplate,
            parent: $(this.document.body),
            locals: {
                entityId: this.entityId(),
                entityType: this.entityType,
                entityName: this.entityName(),
                widget: structuredClone(widget)
            },
            fullscreen: true,
            targetEvent: $event
        }).then(function () {

        });
    }
  }

  loading(...rest: any[]): any {
    return this.rootScope.loading;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
