import { Component, forwardRef, inject } from '@angular/core';
import { AttributeService } from '../../api/services/attribute.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbJsonToStringDirective } from '../../components/tb-json-to-string/tb-json-to-string.directive';
import attributeDialogEditJsonTemplate from '../../../../app/entity/attribute/attribute-dialog-edit-json.tpl.html';
import AttributeDialogEditJsonController from '../../../../app/entity/attribute/attribute-dialog-edit-json.controller';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `AddAttributeDialogController` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'add-attribute-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbJsonToStringDirective)],
  templateUrl: './add-attribute-dialog.component.html',
})
export class AddAttributeDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  protected readonly attributeService = inject(AttributeService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): template: 6 × ng-message left in place
  // TODO(port): template: 5 × ng-messages left in place

  attribute: any = {};
  valueTypes: any = types.valueType;
  valueType: any = types.valueType.string;
  theForm: any;

  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    this.add = this.add;
    this.cancel = this.cancel;
    $scope.$watch('vm.valueType', () => {
        if (this.valueType === types.valueType.boolean) {
            this.attribute.value = false;
        } else if (this.valueType === types.valueType.json) {
            this.attribute.value = {};
        } else {
            this.attribute.value = null;
        }
    });
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  add = (...rest: any[]): any => {
    this.theForm.$setPristine();
    this.attributeService.saveEntityAttributes(this.dialogData.entityType, this.dialogData.entityId, this.dialogData.attributeScope, [this.attribute]).then(
        () => {
            this.dialog.hide();
        }
    );
  };

  addJSON($event?: any, ...rest: any[]): any {
    this.showJsonDialog($event, this.attribute.value, false).then((response?: any) => {
        this.attribute.value = response;
    })
  }

  showJsonDialog($event?: any, jsonValue?: any, readOnly?: any, ...rest: any[]): any {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    return this.dialog.show({
        controller: AttributeDialogEditJsonController,
        controllerAs: 'vm',
        templateUrl: attributeDialogEditJsonTemplate,
        locals: {
            jsonValue: jsonValue,
            readOnly: readOnly
        },
        targetEvent: $event,
        fullscreen: true,
        multiple: true,
    });
  }
}
