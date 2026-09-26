import { Component, inject } from '@angular/core';
import { DashboardUtilsService } from '../../common/services/dashboard-utils.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `SelectTargetStateController` (module `thingsboard.dashboard.states`) in src/app/dashboard/states/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'select-target-state',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './select-target-state.component.html',
})
export class SelectTargetStateComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dashboardUtils = inject(DashboardUtilsService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  states: any;
  stateId: any;
  theForm: any;

  constructor() {
    this.states = this.dialogData.states;
    this.stateId = this.dashboardUtils.getRootStateId(this.states);
    this.cancel = this.cancel;
    this.save = this.save;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
    (this.dialog as any).hide(this.stateId);
  };

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
