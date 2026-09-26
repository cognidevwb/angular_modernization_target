import { Component, forwardRef, inject } from '@angular/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { TbSocialSharePanelDirective } from '../../components/tb-social-share-panel/tb-social-share-panel.directive';

import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `MakeDashboardPublicDialogController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'make-dashboard-public-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule, forwardRef(() => TbSocialSharePanelDirective)],
  templateUrl: './make-dashboard-public-dialog.component.html',
})
export class MakeDashboardPublicDialogComponent {
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  dashboard: any;
  publicLink: any;

  constructor() {
    this.dashboard = this.dialogData.dashboard;
    this.publicLink = this.dashboardService.getPublicDashboardLink(this.dialogData.dashboard);
    this.onPublicLinkCopied = this.onPublicLinkCopied;
    this.close = this.close;
  }

  onPublicLinkCopied = (...rest: any[]): any => {
    this.toast.showSuccess(this.translate.instant('dashboard.public-link-copied-message'), 750, $('#make-dialog-public-content'), 'bottom left');
  };

  close = (...rest: any[]): any => {
    this.dialog.hide();
  };
}
