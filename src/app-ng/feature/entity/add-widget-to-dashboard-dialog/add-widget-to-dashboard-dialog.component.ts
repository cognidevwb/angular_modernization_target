import { Component, forwardRef, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRadioModule } from '@angular/material/radio';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { firstValueFrom } from 'rxjs';
import { DashboardService } from '../../api/services/dashboard.service';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { ItembufferService } from '../../services/itembuffer.service';
import { UtilsService } from '../../common/services/utils.service';
import { RootState } from '../../../root-state';
import { goState } from '../../../state-paths';
import { TbDashboardAutocompleteDirective } from '../../components/tb-dashboard-autocomplete/tb-dashboard-autocomplete.directive';
import { SelectTargetStateComponent } from '../../dashboard/select-target-state/select-target-state.component';
import { SelectTargetLayoutComponent } from '../../dashboard/select-target-layout/select-target-layout.component';

/** What the dialog opens with (legacy locals). */
export interface AddWidgetToDashboardDialogData {
  entityId: string;
  entityType: string;
  entityName: string;
  widget: any;
}

/**
 * Ported from the AngularJS controller `AddWidgetToDashboardDialogController` (module `thingsboard.entity`)
 * in src/app/entity/attribute/add-widget-to-dashboard-dialog.controller.js: adds the widget to an existing
 * dashboard (asking for the target state and layout when there is a choice) or to a new one, then
 * optionally opens that dashboard. Closes with `true` once saved.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-widget-to-dashboard-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatRadioModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbDashboardAutocompleteDirective)],
  templateUrl: './add-widget-to-dashboard-dialog.component.html',
})
export class AddWidgetToDashboardDialogComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogRef = inject(MatDialogRef<AddWidgetToDashboardDialogComponent, boolean>);
  protected readonly router = inject(Router);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly utils = inject(UtilsService);
  protected readonly itembuffer = inject(ItembufferService);
  protected readonly dashboardService = inject(DashboardService);
  protected readonly dialogData: AddWidgetToDashboardDialogData = inject(MAT_DIALOG_DATA);
  protected readonly theForm = viewChild<NgForm>('theForm');

  widget: any = this.dialogData.widget;
  dashboardId: any = null;
  addToDashboardType: any = 0;
  newDashboard: any = {};
  openDashboard: any = false;

  cancel(): void {
    this.dialogRef.close();
  }

  /** Resolves with the chosen state id (asks only when the dashboard has more than one). */
  selectTargetState(dashboard: any): Promise<string> {
    const states = dashboard.configuration.states;
    const stateIds = Object.keys(states);
    if (stateIds.length <= 1) {
      return Promise.resolve(stateIds[0]);
    }
    const ref = this.dialog.open(SelectTargetStateComponent, { data: { states }, panelClass: 'tb-dialog' });
    return firstValueFrom(ref.afterClosed()).then((stateId) => (stateId === undefined ? Promise.reject() : stateId));
  }

  /** Resolves with the chosen layout id (asks only when the state has more than one). */
  selectTargetLayout(dashboard: any, targetState: string): Promise<string> {
    const layouts = dashboard.configuration.states[targetState].layouts;
    const layoutIds = Object.keys(layouts);
    if (layoutIds.length <= 1) {
      return Promise.resolve(layoutIds[0]);
    }
    const ref = this.dialog.open(SelectTargetLayoutComponent, { panelClass: 'tb-dialog' });
    return firstValueFrom(ref.afterClosed()).then((layoutId) => (layoutId === undefined ? Promise.reject() : layoutId));
  }

  add(): void {
    if (this.addToDashboardType === 0) {
      this.dashboardService.getDashboard(this.dashboardId).then(
        (loaded: any) => {
          const dashboard = this.dashboardUtils.validateAndUpdateDashboard(loaded);
          this.selectTargetState(dashboard)
            .then((targetState) =>
              this.selectTargetLayout(dashboard, targetState).then((targetLayout) => {
                this.addWidgetToDashboard(dashboard, targetState, targetLayout);
              }),
            )
            .catch(() => undefined);
        },
        () => undefined,
      );
    } else {
      this.addWidgetToDashboard(this.newDashboard, 'default', 'main');
    }
  }

  addWidgetToDashboard(theDashboard: any, targetState: string, targetLayout: string): void {
    const aliasesInfo: any = {
      datasourceAliases: {},
      targetDeviceAliases: {},
    };
    aliasesInfo.datasourceAliases[0] = {
      alias: this.dialogData.entityName,
      filter: this.dashboardUtils.createSingleEntityFilter(this.dialogData.entityType, this.dialogData.entityId),
    };
    this.itembuffer.addWidgetToDashboard(theDashboard, targetState, targetLayout, this.widget, aliasesInfo, null, 48, null, -1, -1).then(
      (updated: any) => {
        this.dashboardService.saveDashboard(updated).then((dashboard: any) => {
          this.theForm()?.form.markAsPristine();
          this.dialogRef.close(true);
          if (this.openDashboard) {
            const stateParams: any = {
              dashboardId: dashboard.id.id,
            };
            const stateIds = Object.keys(dashboard.configuration.states);
            if (stateIds.indexOf(targetState) > 0) {
              stateParams.state = this.utils.objToBase64([{ id: targetState, params: {} }]);
            }
            goState(this.router, 'home.dashboards.dashboard', stateParams);
          }
        });
      },
    );
  }
}
