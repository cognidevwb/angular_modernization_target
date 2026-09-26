import { Component, ElementRef, effect, inject, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ClipboardService } from '../../services/clipboard.service';
import { DashboardService } from '../../api/services/dashboard.service';
import { ToastService } from '../../services/toast.service';
import { TbSocialSharePanelDirective } from '../../components/tb-social-share-panel/tb-social-share-panel.directive';
import { RootState } from '../../../root-state';
import { joinParentForm } from '../../components/tb-grid/legacy-form';

/**
 * Ported from the AngularJS directive `tbDashboardDetails` (module `thingsboard.dashboard`) in src/app/dashboard/dashboard.directive.js
 * (template src/app/dashboard/dashboard-fieldset.tpl.html). Its inputs join the form of the page that hosts it:
 * the grid's details form, or the add-dashboard dialog's form.
 */
@Component({
  selector: 'tb-dashboard-details',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, TbSocialSharePanelDirective],
  viewProviders: joinParentForm,
  templateUrl: './tb-dashboard-details.directive.html',
})
export class TbDashboardDetailsDirective {
  protected readonly rootScope = inject(RootState);
  readonly dashboard = model<any>();
  readonly isEdit = model<any>();
  readonly customerId = model<any>();
  readonly dashboardScope = model<any>();
  readonly theForm = model<any>();
  readonly onMakePublic = output<any>();
  readonly onMakePrivate = output<any>();
  readonly onManageAssignedCustomers = output<any>();
  readonly onUnassignFromCustomer = output<any>();
  readonly onExportDashboard = output<any>();
  readonly onDeleteDashboard = output<any>();

  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly clipboardService = inject(ClipboardService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly element = inject(ElementRef);

  publicLink: any = null;

  constructor() {
    effect(() => {
      const dashboard = this.dashboard();
      if (dashboard) {
        this.publicLink = dashboard.publicCustomerId ? this.dashboardService.getPublicDashboardLink(dashboard) : null;
      }
    });
  }

  /** `ng-model="dashboard.configuration.description"`: creates `configuration` on first write, as AngularJS did. */
  setDescription(dashboard: any, value: any): void {
    dashboard.configuration = dashboard.configuration || {};
    dashboard.configuration.description = value;
  }

  onPublicLinkCopied(): void {
    this.toast.showSuccess(this.translate.instant('dashboard.public-link-copied-message'), 750, this.element.nativeElement.parentElement?.parentElement, 'bottom left');
  }

  copyPublicLink(e: any): void {
    const trigger: any = e.delegateTarget || e.currentTarget;
    this.clipboardService.copyToClipboard(trigger, this.publicLink).then(() => this.onPublicLinkCopied());
  }
}
