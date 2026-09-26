import { Component, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { types } from '../../common/constants/types';
import { TbJsonToStringDirective } from '../../components/tb-json-to-string/tb-json-to-string.directive';
import { showAttributeJsonDialog } from '../attribute-dialog-edit-json/attribute-dialog-edit-json.component';

/** What the value editor opens with (legacy local `attributeValue`). */
export interface EditAttributeValueDialogData {
  attributeValue: unknown;
}

/**
 * Ported from `$mdEditDialog` + `EditAttributeValueController`
 * (src/app/entity/attribute/edit-attribute-value.controller.js + .tpl.html): edits one attribute's
 * value and type; closes with the new value on update, with nothing on cancel.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-edit-attribute-value-dialog',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatCheckboxModule, MatFormFieldModule, MatIconModule, MatInputModule, MatSelectModule, MatTooltipModule, TranslatePipe, TbJsonToStringDirective],
  template: `
<form #editDialog="ngForm" class="tb-edit-dialog" (ngSubmit)="submit()" [hidden]="hideDialog">
  <div layout="column" class="md-content" style="width: 400px; padding: 16px;">
    <fieldset>
      <section layout="row">
        <mat-form-field flex="40" class="md-block">
          <mat-label>{{ 'value.type' | translate }}</mat-label>
          <mat-select name="valueType" [ngModel]="valueType" (ngModelChange)="setValueType($event)">
            @for (type of valueTypeList; track type.value) {
            <mat-option [value]="type">
              <mat-icon [svgIcon]="type.icon"></mat-icon>
              <span>{{ type.name | translate }}</span>
            </mat-option>
            }
          </mat-select>
        </mat-form-field>
        @if (valueType === valueTypes.string) {
        <mat-form-field flex="60" class="md-block">
          <mat-label>{{ 'value.string-value' | translate }}</mat-label>
          <input matInput required name="value" [(ngModel)]="model.value">
          <mat-error>{{ 'attribute.value-required' | translate }}</mat-error>
        </mat-form-field>
        }
        @if (valueType === valueTypes.integer) {
        <mat-form-field flex="60" class="md-block">
          <mat-label>{{ 'value.integer-value' | translate }}</mat-label>
          <input matInput required name="value" type="number" step="1" pattern="^-?[0-9]+$" [(ngModel)]="model.value">
          @if (editDialog.controls['value']?.hasError('pattern')) {
          <mat-error>{{ 'value.invalid-integer-value' | translate }}</mat-error>
          } @else {
          <mat-error>{{ 'attribute.value-required' | translate }}</mat-error>
          }
        </mat-form-field>
        }
        @if (valueType === valueTypes.double) {
        <mat-form-field flex="60" class="md-block">
          <mat-label>{{ 'value.double-value' | translate }}</mat-label>
          <input matInput required name="value" type="number" step="any" [(ngModel)]="model.value">
          <mat-error>{{ 'attribute.value-required' | translate }}</mat-error>
        </mat-form-field>
        }
        @if (valueType === valueTypes.boolean) {
        <div layout="column" layout-align="center" flex="60">
          <mat-checkbox name="value" [(ngModel)]="model.value" style="margin-bottom: 0;">
            {{ (model.value ? 'value.true' : 'value.false') | translate }}
          </mat-checkbox>
        </div>
        }
        @if (valueType === valueTypes.json) {
        <div layout="row" layout-align="center" flex="60">
          <mat-form-field class="md-block">
            <mat-label>{{ 'value.json-value' | translate }}</mat-label>
            <input matInput required tb-json-to-string name="value" [(ngModel)]="model.value">
            <mat-error>{{ 'attribute.value-required' | translate }}</mat-error>
          </mat-form-field>
          <button mat-icon-button type="button" style="margin: 18px 0;" (click)="editJSON($event)"
                  [attr.aria-label]="'action.edit' | translate" [matTooltip]="'action.edit' | translate" matTooltipPosition="above">
            <mat-icon>open_in_new</mat-icon>
          </button>
        </div>
        }
      </section>
    </fieldset>
  </div>
  <div layout="row" layout-align="end" class="md-actions">
    <button mat-button type="button" (click)="dismiss()">{{ 'action.cancel' | translate }}</button>
    <button mat-raised-button color="primary" type="submit" [disabled]="editDialog.invalid || !editDialog.dirty">
      {{ 'action.update' | translate }}
    </button>
  </div>
</form>
  `,
})
export class EditAttributeValueDialogComponent {
  private readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef<EditAttributeValueDialogComponent, unknown>);
  private readonly data: EditAttributeValueDialogData = inject(MAT_DIALOG_DATA);
  private readonly editDialog = viewChild<NgForm>('editDialog');

  readonly valueTypes: any = types.valueType;
  readonly valueTypeList: any[] = Object.values(types.valueType);
  model: { value: any } = { value: this.data.attributeValue };
  valueType: any = this.initialType(this.data.attributeValue);
  hideDialog = false;

  private initialType(value: unknown): any {
    if (value === true || value === false) {
      return types.valueType.boolean;
    }
    if (typeof value === 'number') {
      return value.toString().indexOf('.') == -1 ? types.valueType.integer : types.valueType.double;
    }
    if (value !== null && typeof value === 'object') {
      return types.valueType.json;
    }
    return types.valueType.string;
  }

  /** The legacy `$watch('valueType')`: a new type starts from its empty value. */
  setValueType(valueType: any): void {
    if (valueType === this.valueType) {
      return;
    }
    this.valueType = valueType;
    if (valueType === types.valueType.boolean) {
      this.model.value = false;
    } else if (valueType === types.valueType.json) {
      this.model.value = {};
    } else {
      this.model.value = null;
    }
  }

  dismiss(): void {
    this.dialogRef.close();
  }

  submit(): void {
    if (this.editDialog()?.invalid) {
      return;
    }
    this.dialogRef.close(this.model);
  }

  editJSON($event: Event): void {
    this.hideDialog = true;
    showAttributeJsonDialog(this.dialog, this.model.value, false, $event).then(
      (response) => {
        this.hideDialog = false;
        if (!isEqual(response, this.model.value)) {
          this.editDialog()?.form.markAsDirty();
        }
        this.model.value = response;
      },
      () => {
        this.hideDialog = false;
      },
    );
  }
}
