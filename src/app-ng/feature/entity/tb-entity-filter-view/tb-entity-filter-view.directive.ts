import { Component, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

import $ from 'jquery';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbEntityFilterView` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-entity-filter-view',
  standalone: true,
  templateUrl: './tb-entity-filter-view.directive.html',
})
export class TbEntityFilterViewDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);

  ngModelCtrl: any = ngModelCtrl;
  types: any;
  filterDisplayValue: any = '';
  $watch: any;
  filter: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.types = this.typesRef;
    this.$watch('filter', () => {
            this.updateDisplayValue();
        });
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                this.filter = ngModelCtrl.$viewValue;
            } else {
                this.filter = null;
            }
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateDisplayValue(...rest: any[]): any {
    if (this.filter && this.filter.type) {
        var entityType: any;
        var prefix: any;
        switch (this.filter.type) {
            case this.typesRef.aliasFilterType.singleEntity.value:
                entityType = this.filter.singleEntity.entityType;
                this.filterDisplayValue = this.translate.instant(this.typesRef.entityTypeTranslations[entityType].list, {count: 1}, 'messageformat');
                break;
            case this.typesRef.aliasFilterType.entityList.value:
                entityType = this.filter.entityType;
                var count: any = this.filter.entityList.length;
                this.filterDisplayValue = this.translate.instant(this.typesRef.entityTypeTranslations[entityType].list, {count: count}, 'messageformat');
                break;
            case this.typesRef.aliasFilterType.entityName.value:
                entityType = this.filter.entityType;
                prefix = this.filter.entityNameFilter;
                this.filterDisplayValue = this.translate.instant(this.typesRef.entityTypeTranslations[entityType].nameStartsWith, {prefix: prefix});
                break;
            case this.typesRef.aliasFilterType.stateEntity.value:
                this.filterDisplayValue = this.translate.instant('alias.filter-type-state-entity-description');
                break;
            case this.typesRef.aliasFilterType.assetType.value:
                var assetType: any = this.filter.assetType;
                prefix = this.filter.assetNameFilter;
                if (prefix && prefix.length) {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-asset-type-and-name-description', {assetType: assetType, prefix: prefix});
                } else {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-asset-type-description', {assetType: assetType});
                }
                break;
            case this.typesRef.aliasFilterType.deviceType.value:
                var deviceType: any = this.filter.deviceType;
                prefix = this.filter.deviceNameFilter;
                if (prefix && prefix.length) {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-device-type-and-name-description', {deviceType: deviceType, prefix: prefix});
                } else {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-device-type-description', {deviceType: deviceType});
                }
                break;
            case this.typesRef.aliasFilterType.entityViewType.value:
                var entityViewType: any = this.filter.entityViewType;
                prefix = this.filter.entityViewNameFilter;
                if (prefix && prefix.length) {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-entity-view-type-and-name-description', {entityViewType: entityViewType, prefix: prefix});
                } else {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-entity-view-type-description', {entityViewType: entityViewType});
                }
                break;
            case this.typesRef.aliasFilterType.relationsQuery.value:
                var rootEntityText: any;
                var directionText: any;
                var allEntitiesText: any = this.translate.instant('alias.all-entities');
                var anyRelationText: any = this.translate.instant('alias.any-relation');
                if (this.filter.rootStateEntity) {
                    rootEntityText = this.translate.instant('alias.state-entity');
                } else {
                    rootEntityText = this.translate.instant(this.typesRef.entityTypeTranslations[this.filter.rootEntity.entityType].type);
                }
                directionText = this.translate.instant('relation.direction-type.' + this.filter.direction);
                var relationFilters: any = this.filter.filters;
                if (relationFilters && relationFilters.length) {
                    var relationFiltersDisplayValues: any = [];
                    relationFilters.forEach((relationFilter?: any) => {
                        var entitiesText: any;
                        if (relationFilter.entityTypes && relationFilter.entityTypes.length) {
                            var entitiesNamesList: any = [];
                            relationFilter.entityTypes.forEach((entityType?: any) => {
                                entitiesNamesList.push(
                                    this.translate.instant(this.typesRef.entityTypeTranslations[entityType].typePlural)
                                );
                            });
                            entitiesText = entitiesNamesList.join(', ');
                        } else {
                            entitiesText = allEntitiesText;
                        }
                        var relationTypeText: any;
                        if (relationFilter.relationType && relationFilter.relationType.length) {
                            relationTypeText = "'" + relationFilter.relationType + "'";
                        } else {
                            relationTypeText = anyRelationText;
                        }
                        var relationFilterDisplayValue: any = this.translate.instant('alias.filter-type-relations-query-description',
                            {
                                entities: entitiesText,
                                relationType: relationTypeText,
                                direction: directionText,
                                rootEntity: rootEntityText
                            }
                        );
                        relationFiltersDisplayValues.push(relationFilterDisplayValue);
                    });
                    this.filterDisplayValue = relationFiltersDisplayValues.join(', ');
                } else {
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-relations-query-description',
                        {
                            entities: allEntitiesText,
                            relationType: anyRelationText,
                            direction: directionText,
                            rootEntity: rootEntityText
                        }
                    );
                }
                break;
            case this.typesRef.aliasFilterType.assetSearchQuery.value:
            case this.typesRef.aliasFilterType.deviceSearchQuery.value:
            case this.typesRef.aliasFilterType.entityViewSearchQuery.value:
                allEntitiesText = this.translate.instant('alias.all-entities');
                anyRelationText = this.translate.instant('alias.any-relation');
                if (this.filter.rootStateEntity) {
                    rootEntityText = this.translate.instant('alias.state-entity');
                } else {
                    rootEntityText = this.translate.instant(this.typesRef.entityTypeTranslations[this.filter.rootEntity.entityType].type);
                }
                directionText = this.translate.instant('relation.direction-type.' + this.filter.direction);
                var relationTypeText: any;
                if (this.filter.relationType && this.filter.relationType.length) {
                    relationTypeText = "'" + this.filter.relationType + "'";
                } else {
                    relationTypeText = anyRelationText;
                }

                var translationValues: any = {
                    relationType: relationTypeText,
                    direction: directionText,
                    rootEntity: rootEntityText
                }

                if (this.filter.type == this.typesRef.aliasFilterType.assetSearchQuery.value) {
                    var assetTypesQuoted: any = [];
                    this.filter.assetTypes.forEach(function(assetType?: any) {
                        assetTypesQuoted.push("'"+assetType+"'");
                    });
                    var assetTypesText: any = assetTypesQuoted.join(', ');
                    translationValues.assetTypes = assetTypesText;
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-asset-search-query-description',
                        translationValues
                    );
                } else if (this.filter.type == this.typesRef.aliasFilterType.deviceSearchQuery.value) {
                    var deviceTypesQuoted: any = [];
                    this.filter.deviceTypes.forEach(function(deviceType?: any) {
                        deviceTypesQuoted.push("'"+deviceType+"'");
                    });
                    var deviceTypesText: any = deviceTypesQuoted.join(', ');
                    translationValues.deviceTypes = deviceTypesText;
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-device-search-query-description',
                        translationValues
                    );
                } else if (this.filter.type == this.typesRef.aliasFilterType.entityViewSearchQuery.value) {
                    var entityViewTypesQuoted: any = [];
                    this.filter.entityViewTypes.forEach(function(entityViewType?: any) {
                        entityViewTypesQuoted.push("'"+entityViewType+"'");
                    });
                    var entityViewTypesText: any = entityViewTypesQuoted.join(', ');
                    translationValues.entityViewTypes = entityViewTypesText;
                    this.filterDisplayValue = this.translate.instant('alias.filter-type-entity-view-search-query-description',
                        translationValues
                    );
                }
                break;
            default:
                this.filterDisplayValue = this.filter.type;
                break;
        }
    } else {
        this.filterDisplayValue = '';
    }
  }
}
