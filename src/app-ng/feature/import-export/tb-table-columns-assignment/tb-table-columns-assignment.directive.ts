import { Component, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import tableColumnsAssignment from '../../../../app/import-export/table-columns-assignment.tpl.html';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function TableColumnsAssignmentController(this: any, $scope?: any, types?: any, $timeout?: any) {
    var vm: any = this;

    vm.columnTypes = {};

    vm.columnTypes.name = types.importEntityColumnType.name;
    vm.columnTypes.type = types.importEntityColumnType.type;
    vm.columnTypes.label = types.importEntityColumnType.label;
    vm.columnTypes.description = types.importEntityColumnType.description;

    switch (vm.entityType) {
        case types.entityType.device:
            vm.columnTypes.sharedAttribute = types.importEntityColumnType.sharedAttribute;
            vm.columnTypes.serverAttribute = types.importEntityColumnType.serverAttribute;
            vm.columnTypes.timeseries = types.importEntityColumnType.timeseries;
            vm.columnTypes.accessToken = types.importEntityColumnType.accessToken;
            vm.columnTypes.gateway = types.importEntityColumnType.isGateway;
            break;
        case types.entityType.asset:
            vm.columnTypes.serverAttribute = types.importEntityColumnType.serverAttribute;
            vm.columnTypes.timeseries = types.importEntityColumnType.timeseries;
            break;
    }

    $scope.isColumnTypeDiffers = function(columnType?: any) {
       return columnType !== types.importEntityColumnType.name.value &&
            columnType !== types.importEntityColumnType.type.value &&
            columnType !== types.importEntityColumnType.label.value &&
            columnType !== types.importEntityColumnType.accessToken.value&&
            columnType !== types.importEntityColumnType.isGateway.value&&
            columnType !== types.importEntityColumnType.description.value;
    };

    $scope.$watch('vm.columns', function(newVal?: any){
        if (newVal) {
            var isSelectName: any = false;
            var isSelectType: any = false;
            var isSelectLabel: any = false;
            var isSelectCredentials: any = false;
            var isSelectGateway: any = false;
            var isSelectDescription: any = false;
            for (var i: any = 0; i < newVal.length; i++) {
                switch (newVal[i].type) {
                    case types.importEntityColumnType.name.value:
                        isSelectName = true;
                        break;
                    case types.importEntityColumnType.type.value:
                        isSelectType = true;
                        break;
                    case types.importEntityColumnType.label.value:
                        isSelectLabel = true;
                        break;
                    case types.importEntityColumnType.accessToken.value:
                        isSelectCredentials = true;
                        break;
                    case types.importEntityColumnType.isGateway.value:
                        isSelectGateway = true;
                        break;
                    case types.importEntityColumnType.description.value:
                        isSelectDescription = true;
                }
            }
            if (isSelectName && isSelectType) {
                vm.theForm.$setDirty();
            } else {
                vm.theForm.$setPristine();
            }
            $timeout(function () {
                vm.columnTypes.name.disable = isSelectName;
                vm.columnTypes.type.disable = isSelectType;
                vm.columnTypes.label.disable = isSelectLabel;
                vm.columnTypes.gateway.disable = isSelectGateway;
                vm.columnTypes.description.disable = isSelectDescription;
                if (angular.isDefined(vm.columnTypes.accessToken)) {
                    vm.columnTypes.accessToken.disable = isSelectCredentials;
                }
            });
        }
    }, true);
}

/**
 * Ported from the AngularJS directive `tbTableColumnsAssignment` (module `thingsboard.importexport`) in src/app/import-export/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-table-columns-assignment',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, MatDividerModule, FormsModule],
  templateUrl: './tb-table-columns-assignment.directive.html',
})
export class TbTableColumnsAssignmentDirective {
  readonly theForm = model<any>();
  readonly columns = model<any>();
  readonly entityType = model<any>();

  // TODO(port): elements not resolved to a component: md-table-container
  // TODO(port): template: 1 × md-table-container left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            theForm: '=?',
            columns: '=',
            entityType: '=',
        };
  templateUrl: any = tableColumnsAssignment;
  controller: any = TableColumnsAssignmentController;
  controllerAs: any;
  column: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
