import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { RootState } from '../../../root-state';
import { types } from '../../common/constants/types';
import { TbJsonContentDirective } from '../../components/tb-json-content/tb-json-content.directive';

/** What the JSON value editor opens with (legacy locals `jsonValue`, `readOnly`). */
export interface AttributeDialogEditJsonData {
  jsonValue: unknown;
  readOnly: boolean;
}

/**
 * Ported from the AngularJS controller `AttributeDialogEditJsonController`
 * (src/app/entity/attribute/attribute-dialog-edit-json.controller.js + .tpl.html):
 * edits a JSON value as text; closes with the parsed object on save.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-attribute-dialog-edit-json',
  standalone: true,
  imports: [FormsModule, MatDialogModule, MatButtonModule, MatIconModule, MatToolbarModule, TranslatePipe, TbJsonContentDirective],
  template: `
<div class="attribute-edit-json-dialog">
  <form #theForm="ngForm" (ngSubmit)="save()">
    <mat-toolbar>
      <div class="md-toolbar-tools">
        <h2>{{ 'details.edit-json' | translate }}</h2>
        <span flex></span>
        <button mat-icon-button type="button" (click)="cancel()" [attr.aria-label]="'action.close' | translate">
          <mat-icon aria-label="Close">close</mat-icon>
        </button>
      </div>
    </mat-toolbar>
    <mat-dialog-content>
      <div class="md-dialog-content">
        <tb-json-content name="json" [(ngModel)]="json"
                         [label]="'value.json-value' | translate"
                         [contentType]="contentType"
                         [validateContent]="true"
                         [hideErrorToast]="true"
                         [fillHeight]="false"
                         [ngReadonly]="readOnly">
        </tb-json-content>
      </div>
    </mat-dialog-content>
    <mat-dialog-actions layout="row" layout-align="end center" class="action-buttons">
      <button mat-raised-button color="primary" type="submit"
              [disabled]="rootScope.loading || theForm.invalid || !theForm.dirty">
        {{ 'action.save' | translate }}
      </button>
      <button mat-button type="button" id="cancel-btn" [disabled]="rootScope.loading" (click)="cancel()">
        {{ 'action.cancel' | translate }}
      </button>
    </mat-dialog-actions>
  </form>
</div>
  `,
})
export class AttributeDialogEditJsonComponent {
  protected readonly rootScope = inject(RootState);
  private readonly dialogRef = inject(MatDialogRef<AttributeDialogEditJsonComponent, unknown>);
  private readonly data: AttributeDialogEditJsonData = inject(MAT_DIALOG_DATA);

  json = JSON.stringify(this.data.jsonValue, null, 4);
  readonly readOnly = this.data.readOnly;
  readonly contentType = types.contentType.JSON.value;

  save(): void {
    this.dialogRef.close(JSON.parse(this.json));
  }

  cancel(): void {
    this.dialogRef.close();
  }
}

/** `$mdDialog.show(...)` of this dialog: resolves with the edited value, rejects when cancelled. */
export function showAttributeJsonDialog(dialog: MatDialog, jsonValue: unknown, readOnly: boolean, $event?: Event): Promise<unknown> {
  if ($event) {
    $event.stopPropagation();
  }
  const ref = dialog.open<AttributeDialogEditJsonComponent, AttributeDialogEditJsonData, unknown>(AttributeDialogEditJsonComponent, {
    data: { jsonValue, readOnly },
    panelClass: 'tb-dialog',
  });
  return firstValueFrom(ref.afterClosed()).then((result) => (result === undefined ? Promise.reject() : result));
}
