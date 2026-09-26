import { Component, forwardRef, inject, model, output } from '@angular/core';
import { DashboardService } from '../../api/services/dashboard.service';
import { ElementRef } from '@angular/core';
import { ToastService } from '../../services/toast.service';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbSocialSharePanelDirective } from '../../components/tb-social-share-panel/tb-social-share-panel.directive';

import $ from 'jquery';
// @ts-ignore
import dashboardFieldsetTemplate from '../../../../app/dashboard/dashboard-fieldset.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbDashboardDetails` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-dashboard-details',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, FormsModule, forwardRef(() => TbSocialSharePanelDirective)],
  templateUrl: './tb-dashboard-details.directive.html',
})
export class TbDashboardDetailsDirective {
  protected readonly rootScope = injectRoot(RootState);
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

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly toast = inject(ToastService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(dashboardFieldsetTemplate);
  publicLink: any = null;
  $watch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.$watch('dashboard', (newVal?: any) => {
            if (newVal) {
                if (this.dashboard().publicCustomerId) {
                    this.publicLink = this.dashboardService.getPublicDashboardLink(this.dashboard());
                } else {
                    this.publicLink = null;
                }
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  onPublicLinkCopied(...rest: any[]): any {
    this.toast.showSuccess(this.translate.instant('dashboard.public-link-copied-message'), 750, $($(this.element.nativeElement)).parent().parent(), 'bottom left');
  }
}
