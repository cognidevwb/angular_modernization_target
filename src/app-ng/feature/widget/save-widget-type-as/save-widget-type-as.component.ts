import { Component, forwardRef, inject } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../api/services/user.service';
import { FormsModule } from '@angular/forms';
import { TbWidgetsBundleSelectDirective } from '../../components/tb-widgets-bundle-select/tb-widgets-bundle-select.directive';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/** What the dialog closes with on save. */
export interface SaveWidgetTypeAsResult {
  widgetName: string;
  bundleId: string;
  bundleAlias: string;
}

/**
 * Ported from the AngularJS controller `SaveWidgetTypeAsController` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Closes with the new title and target bundle on save, with nothing on cancel.
 */
@Component({
  selector: 'save-widget-type-as',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbWidgetsBundleSelectDirective)],
  templateUrl: './save-widget-type-as.component.html',
})
export class SaveWidgetTypeAsComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly dialogRef = inject(MatDialogRef<SaveWidgetTypeAsComponent, SaveWidgetTypeAsResult>);
  protected readonly userService = inject(UserService);

  bundlesScope: any = 'system';
  widgetName: any;
  widgetsBundle: any;

  constructor() {
    if (this.userService.getAuthority() === 'TENANT_ADMIN') {
        this.bundlesScope = 'tenant';
    }
  }

  cancel(): void {
    this.dialogRef.close();
  }

  saveAs(): void {
    this.dialogRef.close({ widgetName: this.widgetName, bundleId: this.widgetsBundle.id.id, bundleAlias: this.widgetsBundle.alias });
  }
}
