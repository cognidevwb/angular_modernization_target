import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ToastController` (module `thingsboard.toast`) in src/app/services/toast.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'toast',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule],
  templateUrl: './toast.component.html',
})
export class ToastComponent {
  protected readonly snackBar = inject(MatSnackBar);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-toast
  // TODO(port): template: 1 × md-toast left in place

  message: any;

  constructor() {
    this.message = this.dialogData.message;
    this.closeToast = this.closeToast;
  }

  closeToast = (...rest: any[]): any => {
    this.snackBar.hide();
  };
}
