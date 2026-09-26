import { attachLegacyForm, lateLegacyForm, LegacyForm } from '../../components/tb-grid/legacy-form';
import { Component, inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule, NgForm } from '@angular/forms';

import $ from 'jquery';
const dashboardSettingsTemplate = '../../../../app/dashboard/dashboard-settings.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ManageDashboardLayoutsController` (module `thingsboard.dashboard.layouts`) in src/app/dashboard/layouts/index.js:20.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'manage-dashboard-layouts',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule],
  templateUrl: './manage-dashboard-layouts.component.html',
})
export class ManageDashboardLayoutsComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  layouts: any;
  displayLayouts: any;
  /** The legacy `theForm` FormController, over the template's `<form name="theForm">`. */
  readonly theForm: LegacyForm = lateLegacyForm('theForm');
  @ViewChild('theFormRef') set theFormRef(form: NgForm | undefined) {
    attachLegacyForm(this.theForm, form);
  }

  constructor() {
    this.openLayoutSettings = this.openLayoutSettings;
    this.cancel = this.cancel;
    this.save = this.save;
    this.layouts = this.dialogData.layouts;
    this.displayLayouts = {
        main: (this.layouts.main !== undefined),
        right: (this.layouts.right !== undefined)
    }
    for (var l in this.displayLayouts) {
        if (!this.layouts[l]) {
            this.layouts[l] = this.dashboardUtils.createDefaultLayoutData();
        }
    }
  }

  openLayoutSettings = ($event?: any, layoutId?: any, ...rest: any[]): any => {
    let vm = this;
    var gridSettings: any = structuredClone(this.layouts[layoutId].gridSettings);
(this.dialog as any).show({
        controller: 'DashboardSettingsController',
        controllerAs: 'vm',
        templateUrl: dashboardSettingsTemplate,
        locals: {
            settings: null,
            gridSettings: gridSettings
        },
        parent: $(this.document.body),
        multiple: true,
        fullscreen: true,
        targetEvent: $event
    }).then((data?: any) => {
        var gridSettings: any = data.gridSettings;
        if (gridSettings) {
            this.dashboardUtils.updateLayoutSettings(this.layouts[layoutId], gridSettings);
        }
        this.theForm.$setDirty();
    }, function () {
    });
  };

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
    for (var l in this.displayLayouts) {
        if (!this.displayLayouts[l]) {
            if (this.layouts[l]) {
                delete this.layouts[l];
            }
        }
    }
    (this.dialog as any).hide(this.layouts);
  };
}
