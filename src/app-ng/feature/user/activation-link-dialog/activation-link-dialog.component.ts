import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { ToastService } from '../../services/toast.service';

/** What the users page / add-user dialog open the dialog with. */
export interface ActivationLinkDialogData {
  activationLink: string;
}

/**
 * Ported from the AngularJS controller `ActivationLinkDialogController` (module `thingsboard.user`)
 * with its template src/app/user/activation-link.dialog.tpl.html. Closes with `true` on OK / close.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'activation-link-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './activation-link-dialog.component.html',
})
export class ActivationLinkDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<ActivationLinkDialogComponent, boolean>);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly dialogData: ActivationLinkDialogData = inject(MAT_DIALOG_DATA);

  activationLink: string = this.dialogData.activationLink;

  copyActivationLink(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.activationLink).then(() => this.onActivationLinkCopied());
  }

  onActivationLinkCopied(): void {
    this.toast.showSuccess(this.translate.instant('user.activation-link-copied-message'), 750, document.getElementById('activation-link-dialog-content'), 'bottom left');
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
