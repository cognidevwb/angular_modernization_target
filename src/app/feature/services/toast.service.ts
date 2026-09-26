import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarHorizontalPosition, MatSnackBarRef, MatSnackBarVerticalPosition } from '@angular/material/snack-bar';

import { bindMethods } from '../../bind-methods';
import { ToastComponent, ToastData } from './toast/toast.component';

/**
 * Ported from the AngularJS factory `toast` (module `thingsboard.toast`) in src/app/services/toast.service.js:
 * `$mdToast.show({templateUrl, locals: {message}, hideDelay, position, parent})` is `MatSnackBar.openFromComponent`
 * with the toast component (the legacy templates' look), the same delay (0 = stays until closed), the same
 * `'top left'`-style position, laid out inside `parent` (default `#toast-parent`) as `$mdToast` did.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly __bound = bindMethods(this);
  private readonly snackBar = inject(MatSnackBar);
  private readonly document = inject(DOCUMENT);

  private showing: any = false;

  showInfo(infoMessage?: any, delay?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    this.showMessage('info', infoMessage, delay, toastParent, position);
  }

  showSuccess(successMessage?: any, delay?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    this.showMessage('success', successMessage, delay, toastParent, position);
  }

  showMessage(kind?: any, message?: any, delay?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    return this.open(kind || 'info', message, delay || 0, toastParent, position);
  }

  showError(errorMessage?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    if (!this.showing) {
      this.showing = true;
      const ref = this.open('error', errorMessage, 0, toastParent, position);
      ref.afterDismissed().subscribe(() => {
        this.showing = false;
      });
    }
  }

  hide(...rest: any[]): any {
    if (this.showing) {
      this.snackBar.dismiss();
    }
  }

  private open(kind: ToastData['kind'], message: any, delay: number, toastParent: any, position: any): MatSnackBarRef<ToastComponent> {
    const [vertical, horizontal] = this.toPosition(position || 'top left');
    const config: MatSnackBarConfig<ToastData> = {
      data: { message, kind },
      duration: delay > 0 ? delay : undefined,
      verticalPosition: vertical,
      horizontalPosition: horizontal,
      panelClass: ['tb-toast-panel', `tb-${kind}-toast`],
    };
    const ref = this.snackBar.openFromComponent(ToastComponent, config);
    this.placeInParent(ref, this.parentElement(toastParent));
    return ref;
  }

  /** `'top left'`, `'bottom right'`, `'top'`… → the snack bar's vertical / horizontal positions. */
  private toPosition(position: string): [MatSnackBarVerticalPosition, MatSnackBarHorizontalPosition] {
    const parts = String(position).split(/\s+/);
    const vertical: MatSnackBarVerticalPosition = parts.includes('bottom') ? 'bottom' : 'top';
    const horizontal: MatSnackBarHorizontalPosition = parts.includes('left')
      ? 'left'
      : parts.includes('right')
        ? 'right'
        : parts.includes('start')
          ? 'start'
          : parts.includes('end')
            ? 'end'
            : 'center';
    return [vertical, horizontal];
  }

  /** The toast's parent: a jQuery collection or an element as the callers pass it, else `#toast-parent`. */
  private parentElement(toastParent: any): HTMLElement | null {
    const parent = toastParent && toastParent.jquery ? toastParent[0] : toastParent;
    if (parent instanceof HTMLElement) {
      return parent;
    }
    return this.document.getElementById('toast-parent');
  }

  /** `$mdToast` laid the toast out inside `parent`: bound the overlay's wrapper to the parent's box. */
  private placeInParent(ref: MatSnackBarRef<ToastComponent>, parent: HTMLElement | null): void {
    if (!parent || !parent.isConnected) {
      return;
    }
    const rect = parent.getBoundingClientRect();
    if (!rect.width || !rect.height) {
      return;
    }
    const host: HTMLElement | undefined = (ref.containerInstance as any)?._elementRef?.nativeElement;
    const wrapper = host?.closest('.cdk-global-overlay-wrapper') as HTMLElement | null;
    if (wrapper) {
      wrapper.style.position = 'fixed';
      wrapper.style.top = `${rect.top}px`;
      wrapper.style.left = `${rect.left}px`;
      wrapper.style.width = `${rect.width}px`;
      wrapper.style.height = `${rect.height}px`;
    }
  }
}
