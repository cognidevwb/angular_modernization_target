import { Component, ViewEncapsulation, inject } from '@angular/core';
import { MAT_SNACK_BAR_DATA, MatSnackBarRef } from '@angular/material/snack-bar';
import { MatButtonModule } from '@angular/material/button';
import { TranslatePipe } from '@ngx-translate/core';

/** What ToastService hands the toast: the (html) message and which legacy template it stands for. */
export interface ToastData {
  message: any;
  kind: 'info' | 'success' | 'error';
}

/**
 * Ported from the AngularJS controller `ToastController` (module `thingsboard.toast`) in src/app/services/toast.controller.js
 * with the three templates it served (info-/success-/error-toast.tpl.html, styles toast.scss): the message as html
 * and a Close button that hides the toast.
 */
@Component({
  selector: 'toast',
  standalone: true,
  imports: [TranslatePipe, MatButtonModule],
  templateUrl: './toast.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .tb-toast-panel.mat-mdc-snack-bar-container .mat-mdc-snackbar-surface { max-width: 100%; }
      .tb-toast-panel.tb-info-toast .md-toast-content { padding: 18px; font-size: 18px; }
      .tb-toast-panel.tb-success-toast { --mat-snack-bar-container-color: #008000; }
      .tb-toast-panel.tb-success-toast .mat-mdc-snackbar-surface { background-color: #008000 !important; }
      .tb-toast-panel.tb-error-toast { --mat-snack-bar-container-color: #800000; }
      .tb-toast-panel.tb-error-toast .mat-mdc-snackbar-surface { background-color: #800000 !important; }
      .tb-toast-panel .md-toast-content { display: flex; align-items: center; height: 100%; max-height: 100%; font-size: 18px; color: #fff; }
      .tb-toast-panel .md-toast-text { flex: 1; }
      .tb-toast-panel .md-toast-content button { color: #fff; margin-left: 12px; }
      .tb-toast-panel.tb-info-toast .md-toast-content button { color: var(--mat-sys-inverse-primary, #ffab40); }
    `,
  ],
})
export class ToastComponent {
  protected readonly snackBarRef = inject<MatSnackBarRef<ToastComponent>>(MatSnackBarRef);
  protected readonly data: ToastData = inject(MAT_SNACK_BAR_DATA);

  message: any = this.data.message;

  closeToast(): void {
    this.snackBarRef.dismiss();
  }
}
