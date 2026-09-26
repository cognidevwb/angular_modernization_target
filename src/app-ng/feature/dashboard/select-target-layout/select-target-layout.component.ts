import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `SelectTargetLayoutController` (module `thingsboard.dashboard.layouts`) in src/app/dashboard/layouts/index.js:20.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'select-target-layout',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './select-target-layout.component.html',
})
export class SelectTargetLayoutComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);

  theForm: any;

  constructor() {
    this.cancel = this.cancel;
    this.selectLayout = this.selectLayout;
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  selectLayout = ($event?: any, layoutId?: any, ...rest: any[]): any => {
    this.theForm.$setPristine();
    this.dialog.hide(layoutId);
  };
}
