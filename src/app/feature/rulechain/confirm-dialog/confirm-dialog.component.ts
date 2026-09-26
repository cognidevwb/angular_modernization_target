import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { firstValueFrom } from 'rxjs';

/** What `$mdDialog.confirm()` was configured with. */
export interface ConfirmDialogData {
  title: string;
  htmlContent?: string;
  textContent?: string;
  ok: string;
  cancel: string;
}

/**
 * The `$mdDialog.confirm()` dialog: a title, an HTML or text body, and
 * cancel / ok buttons; closes with `true` on ok.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-confirm-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>{{ data.title }}</h2>
    <mat-dialog-content>
      @if (data.htmlContent) {
        <div [innerHTML]="data.htmlContent"></div>
      } @else {
        <p>{{ data.textContent }}</p>
      }
    </mat-dialog-content>
    <mat-dialog-actions align="end">
      <button mat-button type="button" (click)="dialogRef.close(false)">{{ data.cancel }}</button>
      <button mat-button color="primary" type="button" (click)="dialogRef.close(true)">{{ data.ok }}</button>
    </mat-dialog-actions>
  `,
})
export class ConfirmDialogComponent {
  protected readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);
  protected readonly dialogRef = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
}

/** `$mdDialog.show(confirm)`: resolves when confirmed, rejects when cancelled. */
export function showConfirm(dialog: MatDialog, data: ConfirmDialogData): Promise<void> {
  return firstValueFrom(dialog.open(ConfirmDialogComponent, { data }).afterClosed()).then((ok) =>
    ok ? undefined : Promise.reject(),
  );
}
