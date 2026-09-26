import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';

import $ from 'jquery';
import { bindMethods } from '../../legacy-injector';
import infoToast from '../../../app/services/info-toast.tpl.html?raw';
import successToast from '../../../app/services/success-toast.tpl.html?raw';
import errorToast from '../../../app/services/error-toast.tpl.html?raw';

/**
 * Ported from the AngularJS factory `toast` (module `thingsboard.toast`) in src/app/services/toast.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly __bound = bindMethods(this);
  private readonly snackBar = inject(MatSnackBar);
  private readonly document = inject(DOCUMENT);

  private showing: any = false;

  showInfo(infoMessage?: any, delay?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    this.showMessage(infoToast, infoMessage, delay, toastParent, position);
  }

  showSuccess(successMessage?: any, delay?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    this.showMessage(successToast, successMessage, delay, toastParent, position);
  }

  showMessage(templateUrl?: any, message?: any, delay?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    let vm = this;
    if (!toastParent) {
        toastParent = $(this.document.getElementById('toast-parent'));
    }
    if (!position) {
        position = 'top left';
    }
    (this.snackBar as any).show({
        hideDelay: delay || 0,
        position: position,
        controller: 'ToastController',
        controllerAs: 'vm',
        templateUrl: templateUrl,
        locals: {message: message},
        parent: toastParent
    });
  }

  showError(errorMessage?: any, toastParent?: any, position?: any, ...rest: any[]): any {
    let vm = this;
    if (!this.showing) {
        if (!toastParent) {
            toastParent = $(this.document.getElementById('toast-parent'));
        }
        if (!position) {
            position = 'top left';
        }
        this.showing = true;
        (this.snackBar as any).show({
            hideDelay: 0,
            position: position,
            controller: 'ToastController',
            controllerAs: 'vm',
            templateUrl: errorToast,
            locals: {message: errorMessage},
            parent: toastParent
        }).then(() => {
            this.showing = false;
        }, () => {
            this.showing = false;
        });
    }
  }

  hide(...rest: any[]): any {
    if (this.showing) {
        (this.snackBar as any).hide();
    }
  }
}
