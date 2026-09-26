import { Component, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import relationTableTemplate from '../../../../app/entity/relation/relation-table.tpl.html?raw';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function RelationTableController(this: any, $scope?: any, $q?: any, $mdDialog?: any, $document?: any, $translate?: any, $filter?: any, $timeout?: any, utils?: any, types?: any, entityRelationService?: any) {

    let vm: any = this;

    vm.types = types;

    vm.direction = vm.types.entitySearchDirection.from;

    vm.relations = [];
    vm.relationsCount = 0;
    vm.allRelations = [];
    vm.selectedRelations = [];

    vm.query = {
        order: 'type',
        limit: 5,
        page: 1,
        search: null
    };

    vm.enterFilterMode = enterFilterMode;
    vm.exitFilterMode = exitFilterMode;
    vm.onReorder = onReorder;
    vm.onPaginate = onPaginate;
    vm.addRelation = addRelation;
    vm.editRelation = editRelation;
    vm.deleteRelation = deleteRelation;
    vm.deleteRelations = deleteRelations;
    vm.reloadRelations = reloadRelations;
    vm.updateRelations = updateRelations;

    $scope.$watch("vm.entityId", function(newVal?: any, prevVal?: any) {
        if (newVal && !angular.equals(newVal, prevVal)) {
            reloadRelations();
        }
    });

    $scope.$watch("vm.direction", function(newVal?: any, prevVal?: any) {
        if (newVal && !angular.equals(newVal, prevVal)) {
            reloadRelations();
        }
    });

    $scope.$watch("vm.query.search", function(newVal?: any, prevVal?: any) {
        if (!angular.equals(newVal, prevVal) && vm.query.search != null) {
            updateRelations();
        }
    });

    function enterFilterMode (event?: any) {
        let $button: any = (window as any).angular.element(event.currentTarget);
        let $toolbarsContainer: any = $button.closest('.toolbarsContainer');

        vm.query.search = '';

        $timeout(()=>{
            $toolbarsContainer.find('.searchInput').focus();
        })
    }

    function exitFilterMode () {
        vm.query.search = null;
        updateRelations();
    }

    function onReorder () {
        updateRelations();
    }

    function onPaginate () {
        updateRelations();
    }

    function addRelation($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        openRelationDialog($event);
    }

    function editRelation($event?: any, relation?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        openRelationDialog($event, relation);
    }

    function openRelationDialog($event?: any, relation?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        var isAdd: any = false;
        if (!relation) {
            isAdd = true;
            var entityId: any = {
                id: vm.entityId,
                entityType: vm.entityType
            };
            relation = {};
            if (vm.direction == vm.types.entitySearchDirection.from) {
                relation.from = entityId;
            } else {
                relation.to = entityId;
            }
        }
        var onShowingCallback: any = {
            onShowing: function(){}
        }
        $mdDialog.show({
            controller: (window as any).RelationController,
            controllerAs: 'vm',
            templateUrl: (relationTemplate as any),
            parent: (window as any).angular.element($document[0].body),
            locals: { isAdd: isAdd,
                      direction: vm.direction,
                      relation: relation,
                      showingCallback: onShowingCallback},
            targetEvent: $event,
            fullscreen: true,
            multiple: true,
            onShowing: function(scope?: any, element?: any) {
                onShowingCallback.onShowing(scope, element);
            }
        }).then(function () {
            reloadRelations();
        }, function () {
        });
    }

    function deleteRelation($event?: any, relation?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (relation) {
            var title: any;
            var content: any;
            if (vm.direction == vm.types.entitySearchDirection.from) {
                title = $translate.instant('relation.delete-to-relation-title', {entityName: relation.toName});
                content = $translate.instant('relation.delete-to-relation-text', {entityName: relation.toName});
            } else {
                title = $translate.instant('relation.delete-from-relation-title', {entityName: relation.fromName});
                content = $translate.instant('relation.delete-from-relation-text', {entityName: relation.fromName});
            }

            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));
            $mdDialog.show(confirm).then(function () {
                entityRelationService.deleteRelation(
                    relation.from.id,
                    relation.from.entityType,
                    relation.type,
                    relation.to.id,
                    relation.to.entityType).then(
                    function success() {
                        reloadRelations();
                    }
                );
            });
        }
    }

    function deleteRelations($event?: any) {
        if ($event) {
            $event.stopPropagation();
        }
        if (vm.selectedRelations && vm.selectedRelations.length > 0) {
            var title: any;
            var content: any;
            if (vm.direction == vm.types.entitySearchDirection.from) {
                title = $translate.instant('relation.delete-to-relations-title', {count: vm.selectedRelations.length}, 'messageformat');
                content = $translate.instant('relation.delete-to-relations-text');
            } else {
                title = $translate.instant('relation.delete-from-relations-title', {count: vm.selectedRelations.length}, 'messageformat');
                content = $translate.instant('relation.delete-from-relations-text');
            }
            var confirm: any = $mdDialog.confirm()
                .targetEvent($event)
                .title(title)
                .htmlContent(content)
                .ariaLabel(title)
                .cancel($translate.instant('action.no'))
                .ok($translate.instant('action.yes'));
            $mdDialog.show(confirm).then(function () {
                var tasks: any = [];
                for (var i: any=0;i<vm.selectedRelations.length;i++) {
                    var relation: any = vm.selectedRelations[i];
                    tasks.push( entityRelationService.deleteRelation(
                        relation.from.id,
                        relation.from.entityType,
                        relation.type,
                        relation.to.id,
                        relation.to.entityType));
                }
                $q.all(tasks).then(function () {
                    reloadRelations();
                });

            });
        }
    }

    function reloadRelations () {
        vm.allRelations.length = 0;
        vm.relations.length = 0;
        vm.relationsPromise;
        if (vm.direction == vm.types.entitySearchDirection.from) {
            vm.relationsPromise = entityRelationService.findInfoByFrom(vm.entityId, vm.entityType);
        } else {
            vm.relationsPromise = entityRelationService.findInfoByTo(vm.entityId, vm.entityType);
        }
        vm.relationsPromise.then(
            function success(allRelations?: any) {
                allRelations.forEach(function(relation?: any) {
                    if (vm.direction == vm.types.entitySearchDirection.from) {
                        relation.toEntityTypeName = $translate.instant(types.entityTypeTranslations[relation.to.entityType].type);
                    } else {
                        relation.fromEntityTypeName = $translate.instant(types.entityTypeTranslations[relation.from.entityType].type);
                    }
                });
                vm.allRelations = allRelations;
                vm.selectedRelations = [];
                vm.updateRelations();
                vm.relationsPromise = null;
            },
            function fail() {
                vm.allRelations = [];
                vm.selectedRelations = [];
                vm.updateRelations();
                vm.relationsPromise = null;
            }
        )
    }

    function updateRelations () {
        vm.selectedRelations = [];
        var result: any = $filter('orderBy')(vm.allRelations, vm.query.order);
        if (vm.query.search != null) {
            result = $filter('filter')(result, {$: vm.query.search});
        }
        vm.relationsCount = result.length;
        var startIndex: any = vm.query.limit * (vm.query.page - 1);
        vm.relations = result.slice(startIndex, startIndex + vm.query.limit);
    }

}

/**
 * Ported from the AngularJS directive `tbRelationTable` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-relation-table',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './tb-relation-table.directive.html',
})
export class TbRelationTableDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly entityId = model<any>();
  readonly entityType = input<any>();

  // TODO(port): elements not resolved to a component: md-table-container, md-table-pagination
  // TODO(port): template: 1 × md-table-container left in place
  // TODO(port): template: 1 × md-table-pagination left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            entityId: '=',
            entityType: '@'
        };
  controller: any = RelationTableController;
  controllerAs: any;
  templateUrl: any = relationTableTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
