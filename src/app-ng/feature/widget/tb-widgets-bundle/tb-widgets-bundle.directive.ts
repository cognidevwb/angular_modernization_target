import { Component, model, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbWidgetsBundle` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-widgets-bundle',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './tb-widgets-bundle.directive.html',
})
export class TbWidgetsBundleDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly widgetsBundle = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();
  readonly theForm = model<any>();
  readonly onExportWidgetsBundle = output<any>();
  readonly onDeleteWidgetsBundle = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place
}
