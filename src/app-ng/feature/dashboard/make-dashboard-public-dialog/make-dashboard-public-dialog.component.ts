import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { ClipboardService } from '../../services/clipboard.service';
import { ToastService } from '../../services/toast.service';
import { TbSocialSharePanelDirective } from '../../components/tb-social-share-panel/tb-social-share-panel.directive';

/** What the dashboards page opens the dialog with: the dashboard just made public. */
export interface MakeDashboardPublicDialogData {
  dashboard: any;
}

/**
 * Ported from the AngularJS controller `MakeDashboardPublicDialogController` (module `thingsboard.dashboard`)
 * with its template src/app/dashboard/make-dashboard-public-dialog.tpl.html. Closes with `true` on OK / close.
 */
@Component({
  selector: 'make-dashboard-public-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule, TbSocialSharePanelDirective],
  templateUrl: './make-dashboard-public-dialog.component.html',
})
export class MakeDashboardPublicDialogComponent {
  protected readonly dialogRef = inject(MatDialogRef<MakeDashboardPublicDialogComponent, boolean>);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogData: MakeDashboardPublicDialogData = inject(MAT_DIALOG_DATA);

  dashboard: any = this.dialogData.dashboard;
  publicLink: any = this.dashboardService.getPublicDashboardLink(this.dialogData.dashboard);

  copyPublicLink(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.publicLink).then(() => this.onPublicLinkCopied());
  }

  onPublicLinkCopied(): void {
    this.toast.showSuccess(this.translate.instant('dashboard.public-link-copied-message'), 750, document.getElementById('make-dialog-public-content'), 'bottom left');
  }

  close(): void {
    this.dialogRef.close(true);
  }
}
