import { Component, OnInit, effect, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { DashboardService } from '../../api/services/dashboard.service';
import { UserService } from '../../api/services/user.service';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbDashboardAutocomplete` (module `thingsboard.directives.dashboardAutocomplete`)
 * in src/app/components/dashboard-autocomplete.directive.js:28: picks a dashboard by title;
 * `[(ngModel)]` is the dashboard id (string).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-dashboard-autocomplete',
  standalone: true,
  imports: [FormsModule, MatAutocompleteModule, MatFormFieldModule, MatInputModule, TranslatePipe],
  template: `
<mat-form-field class="tb-dashboard-autocomplete" style="width: 100%;">
    <input matInput type="text" name="dashboard"
           [placeholder]="'dashboard.select-dashboard' | translate"
           [required]="!!tbRequired()"
           [disabled]="!!disabled()"
           [ngModel]="dashboardSearchText"
           (ngModelChange)="onSearchTextChange($event)"
           (focus)="onFocus()"
           [matAutocomplete]="auto">
    <mat-autocomplete #auto="matAutocomplete" class="tb-dashboard-autocomplete" [displayWith]="displayDashboard"
                      (optionSelected)="onDashboardSelected($event)">
        @for (item of dashboards; track item?.id?.id) {
        <mat-option [value]="item">
            <div class="tb-dashboard-item"><span>{{ item.title }}</span></div>
        </mat-option>
        }
        @if (!dashboards.length) {
        <mat-option disabled>
            <div class="tb-not-found">
                <span>{{ 'dashboard.no-dashboards-matching' | translate: { entity: dashboardSearchText } }}</span>
            </div>
        </mat-option>
        }
    </mat-autocomplete>
    @if (tbRequired() && !dashboard) {
    <mat-error>{{ 'dashboard.dashboard-required' | translate }}</mat-error>
    }
</mat-form-field>
`,
  providers: ngModelProviders(TbDashboardAutocompleteDirective),
})
export class TbDashboardAutocompleteDirective extends NgModelController implements OnInit {
  readonly dashboardsScope = input<any>();
  readonly tenantId = model<any>();
  readonly customerId = model<any>();
  readonly theForm = model<any>();
  readonly tbRequired = model<any>(false);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly selectFirstDashboard = model<any>();

  protected readonly dashboardService = inject(DashboardService);
  protected readonly userService = inject(UserService);

  dashboard: any = null;
  dashboardSearchText: any = '';
  dashboards: any[] = [];
  private watching = false;
  private prevDisabled: any;

  constructor() {
    super();
    // `scope.$watch('disabled', …)` once the value was rendered
    effect(() => {
      const disabled = this.disabled();
      if (this.watching && !isEqual(disabled, this.prevDisabled)) {
        this.updateView();
      }
      this.prevDisabled = disabled;
    });
  }

  ngOnInit(): void {
    if (this.selectFirstDashboard()) {
      this.fetchDashboards('').then(
        (dashboards: any[]) => {
          if (dashboards.length > 0) {
            this.setDashboard(dashboards[0]);
          }
        },
        () => {},
      );
    }
  }

  override $render(): void {
    if (this.$viewValue) {
      this.dashboardService.getDashboardInfo(this.$viewValue).then(
        (dashboard: any) => {
          this.dashboard = dashboard;
          this.dashboardSearchText = dashboard;
          this.watching = true;
        },
        () => {
          this.dashboard = null;
          this.updateView();
          this.watching = true;
        },
      );
    } else {
      this.dashboard = null;
      this.dashboardSearchText = '';
      this.watching = true;
    }
  }

  readonly displayDashboard = (item: any): string => (item && typeof item === 'object' ? item.title : item ?? '');

  onSearchTextChange(text: any): void {
    this.dashboardSearchText = text;
    if (typeof text === 'string') {
      if (this.dashboard) {
        this.setDashboard(null);
      }
      this.loadDashboards(text);
    }
  }

  /** md-min-length="0": the list opens on focus. */
  onFocus(): void {
    this.loadDashboards(typeof this.dashboardSearchText === 'string' ? this.dashboardSearchText : '');
  }

  onDashboardSelected(event: MatAutocompleteSelectedEvent): void {
    this.setDashboard(event.option.value);
  }

  fetchDashboards(searchText: string): Promise<any[]> {
    const pageLink = { limit: 50, textSearch: searchText };
    let promise: Promise<any>;
    if (this.dashboardsScope() === 'customer' || this.userService.getAuthority() === 'CUSTOMER_USER') {
      promise = this.customerId()
        ? this.dashboardService.getCustomerDashboards(this.customerId(), pageLink, { ignoreLoading: true })
        : Promise.resolve({ data: [] });
    } else if (this.userService.getAuthority() === 'SYS_ADMIN') {
      promise = this.tenantId()
        ? this.dashboardService.getTenantDashboardsByTenantId(this.tenantId(), pageLink, { ignoreLoading: true })
        : Promise.resolve({ data: [] });
    } else {
      promise = this.dashboardService.getTenantDashboards(pageLink, { ignoreLoading: true });
    }
    return Promise.resolve(promise).then((result: any) => result.data);
  }

  updateView(): void {
    if (!this.disabled()) {
      this.$setViewValue(this.dashboard ? this.dashboard.id.id : null);
    }
  }

  private loadDashboards(text: string): void {
    this.fetchDashboards(text).then(
      (dashboards) => (this.dashboards = dashboards),
      () => (this.dashboards = []),
    );
  }

  /** `scope.$watch('dashboard', …)`: a changed selection goes to the form. */
  private setDashboard(dashboard: any): void {
    if (!isEqual(dashboard, this.dashboard)) {
      this.dashboard = dashboard;
      if (dashboard) {
        this.dashboardSearchText = dashboard;
      }
      this.updateView();
    }
  }
}
