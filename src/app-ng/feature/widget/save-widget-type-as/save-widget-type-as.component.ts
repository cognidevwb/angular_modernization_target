import { Component, forwardRef, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UserService } from '../../api/services/user.service';
import { FormsModule } from '@angular/forms';
import { TbWidgetsBundleSelectDirective } from '../../components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `SaveWidgetTypeAsController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'save-widget-type-as',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbWidgetsBundleSelectDirective)],
  templateUrl: './save-widget-type-as.component.html',
})
export class SaveWidgetTypeAsComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly userService = inject(UserService);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  bundlesScope: any = 'system';
  widgetName: any;
  widgetsBundle: any;

  constructor() {
    this.saveAs = this.saveAs;
    this.cancel = this.cancel;
    this.widgetName;
    this.widgetsBundle;
    if (this.userService.getAuthority() === 'TENANT_ADMIN') {
        this.bundlesScope = 'tenant';
    }
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  saveAs = (...rest: any[]): any => {
    (this.dialog as any).hide({widgetName: this.widgetName, bundleId: this.widgetsBundle.id.id, bundleAlias: this.widgetsBundle.alias});
  };
}
