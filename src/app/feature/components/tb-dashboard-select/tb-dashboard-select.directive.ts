import { Component, ElementRef, inject, Injector, input, model, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { DashboardSelectPanelComponent } from '../dashboard-select-panel/dashboard-select-panel.component';
import { MdPanelRef, mdPanelPlacement, openMdPanel } from '../md-panel/md-panel';

/**
 * Ported from the AngularJS directive `tbDashboardSelect` (src/app/components/dashboard-select.directive.js)
 * with its template dashboard-select.tpl.html: a select of the tenant's (or the customer's) dashboards on wide
 * screens, a button opening the dashboard select panel on narrow ones. `[(ngModel)]` is the dashboard id.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-dashboard-select',
  standalone: true,
  imports: [MatButtonModule, MatIconModule, MatSelectModule, MatTooltipModule, TranslatePipe],
  template: `
    <mat-select hide-xs hide-sm hide-md [required]="!!tbRequired()" [disabled]="!!disabled()"
                [value]="dashboardId" (selectionChange)="onDashboardIdChange($event.value)"
                [attr.aria-label]="'dashboard.dashboard' | translate">
      @for (dashboard of dashboards; track dashboard.id.id) {
        <mat-option [value]="dashboard.id.id">{{ dashboard.title }}</mat-option>
      }
    </mat-select>
    <section hide-gt-md class="tb-dashboard-select">
      <button mat-icon-button type="button" [attr.aria-label]="'dashboard.select-dashboard' | translate"
              (click)="openDashboardSelectPanel($event)"
              [matTooltip]="'dashboard.select-dashboard' | translate" matTooltipPosition="above">
        <mat-icon [attr.aria-label]="'dashboard.select-dashboard' | translate" class="material-icons">dashboards</mat-icon>
      </button>
    </section>
  `,
  providers: ngModelProviders(TbDashboardSelectDirective),
})
export class TbDashboardSelectDirective extends NgModelController implements OnInit {
  readonly dashboardsScope = input<any>();
  readonly customerId = model<any>();
  readonly tbRequired = model<any>(false);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });

  protected readonly overlay = inject(Overlay);
  protected readonly injector = inject(Injector);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);

  dashboardId: any = null;
  dashboards: any[] = [];
  private readonly pageLink: any = { limit: 100 };
  private panelRef?: MdPanelRef;

  /** The legacy link loaded the dashboards once the scope's bindings were set. */
  ngOnInit(): void {
    let promise: Promise<any>;
    if (this.dashboardsScope() === 'customer' || this.userService.getAuthority() === 'CUSTOMER_USER') {
      const customerId = this.customerId();
      if (customerId && customerId != types.id.nullUid) {
        promise = this.dashboardService.getCustomerDashboards(customerId, this.pageLink, { ignoreLoading: true });
      } else {
        promise = Promise.resolve({ data: [] });
      }
    } else {
      promise = this.dashboardService.getTenantDashboards(this.pageLink, { ignoreLoading: true });
    }
    promise.then((result: any) => {
      this.dashboards = result.data;
    }, () => {
      this.dashboards = [];
    });
  }

  override $render(): void {
    this.dashboardId = this.$viewValue ? this.$viewValue : null;
  }

  /** `scope.$watch('dashboardId', …)`. */
  onDashboardIdChange(dashboardId: any): void {
    if (dashboardId !== this.dashboardId) {
      this.dashboardId = dashboardId;
      this.updateView();
    }
  }

  updateView(): void {
    this.$setViewValue(this.dashboardId);
  }

  openDashboardSelectPanel(_event?: any): void {
    if (this.disabled()) {
      return;
    }
    const host: HTMLElement = this.element.nativeElement;
    const panelHeight = window.matchMedia('(min-height: 350px)').matches ? 250 : 150;
    this.panelRef = openMdPanel(this.overlay, this.injector, {
      origin: host,
      component: DashboardSelectPanelComponent,
      panelClass: 'tb-dashboard-select-panel',
      ...mdPanelPlacement(host, 300, panelHeight, 'CENTER'),
      locals: {
        dashboards: this.dashboards,
        dashboardId: this.dashboardId,
        onDashboardSelected: (dashboardId: any) => {
          this.panelRef?.close();
          this.onDashboardIdChange(dashboardId);
        },
      },
    });
  }
}
