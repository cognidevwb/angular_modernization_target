import { Component, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { AttributeService } from '../../api/services/attribute.service';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { TbJsonToStringDirective } from '../../components/tb-json-to-string/tb-json-to-string.directive';
import { showAttributeJsonDialog } from '../attribute-dialog-edit-json/attribute-dialog-edit-json.component';

/** What the add-attribute dialog opens with (legacy locals). */
export interface AddAttributeDialogData {
  entityType: string;
  entityId: string;
  attributeScope: string;
}

/**
 * Ported from the AngularJS controller `AddAttributeDialogController` (module `thingsboard.entity`)
 * in src/app/entity/attribute/add-attribute-dialog.controller.js: saves one new attribute and
 * closes with `true`; cancel closes with nothing.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-attribute-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, TbJsonToStringDirective],
  templateUrl: './add-attribute-dialog.component.html',
})
export class AddAttributeDialogComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogRef = inject(MatDialogRef<AddAttributeDialogComponent, boolean>);
  protected readonly attributeService = inject(AttributeService);
  protected readonly dialogData: AddAttributeDialogData = inject(MAT_DIALOG_DATA);
  protected readonly theForm = viewChild<NgForm>('theForm');

  attribute: any = {};
  readonly valueTypes: any = types.valueType;
  readonly valueTypeList: any[] = Object.values(types.valueType);
  private _valueType: any;

  constructor() {
    this.valueType = types.valueType.string;
  }

  get valueType(): any {
    return this._valueType;
  }

  /** The legacy `$watch('valueType')`: a new type starts from its empty value. */
  set valueType(value: any) {
    this._valueType = value;
    if (this._valueType === types.valueType.boolean) {
      this.attribute.value = false;
    } else if (this._valueType === types.valueType.json) {
      this.attribute.value = {};
    } else {
      this.attribute.value = null;
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  add(): void {
    this.theForm()?.form.markAsPristine();
    this.attributeService
      .saveEntityAttributes(this.dialogData.entityType, this.dialogData.entityId, this.dialogData.attributeScope, [this.attribute])
      .then(() => {
        this.dialogRef.close(true);
      });
  }

  addJSON($event: Event): void {
    showAttributeJsonDialog(this.dialog, this.attribute.value, false, $event).then(
      (response) => {
        this.attribute.value = response;
        this.theForm()?.form.markAsDirty();
      },
      () => undefined,
    );
  }
}
