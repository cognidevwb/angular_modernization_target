import { Component, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `SelectTargetLayoutController` (module `thingsboard.dashboard.layouts`) in
 * src/app/dashboard/layouts/select-target-layout.controller.js: closes with the chosen layout id ('main' / 'right'),
 * or with nothing when cancelled.
 */
@Component({
  selector: 'select-target-layout',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './select-target-layout.component.html',
})
export class SelectTargetLayoutComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dialogRef = inject<MatDialogRef<SelectTargetLayoutComponent, any>>(MatDialogRef);

  cancel(): void {
    this.dialogRef.close();
  }

  selectLayout(theForm: NgForm, layoutId: string): void {
    theForm.form.markAsPristine();
    this.dialogRef.close(layoutId);
  }
}
