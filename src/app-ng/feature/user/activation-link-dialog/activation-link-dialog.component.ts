import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';

import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ActivationLinkDialogController` (module `thingsboard.user`) in src/app/user/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'activation-link-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './activation-link-dialog.component.html',
})
export class ActivationLinkDialogComponent {
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  activationLink: any;

  constructor() {
    this.activationLink = this.dialogData.activationLink;
    this.onActivationLinkCopied = this.onActivationLinkCopied;
    this.close = this.close;
  }

  onActivationLinkCopied = (...rest: any[]): any => {
    this.toast.showSuccess(this.translate.instant('user.activation-link-copied-message'), 750, $('#activation-link-dialog-content'), 'bottom left');
  };

  close = (...rest: any[]): any => {
    this.dialog.closeAll();
  };
}
