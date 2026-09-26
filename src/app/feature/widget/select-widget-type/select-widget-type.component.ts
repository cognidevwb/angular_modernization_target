import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `SelectWidgetTypeController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'select-widget-type',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule],
  templateUrl: './select-widget-type.component.html',
})
export class SelectWidgetTypeComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly typesRef: any = types;

  types: any;

  constructor() {
    this.types = this.typesRef;
    this.cancel = this.cancel;
    this.typeSelected = this.typeSelected;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  typeSelected = (widgetType?: any, ...rest: any[]): any => {
    (this.dialog as any).hide(widgetType);
  };
}
