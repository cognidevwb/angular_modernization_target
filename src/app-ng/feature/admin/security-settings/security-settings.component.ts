import { Component, forwardRef, inject } from '@angular/core';
import { AdminService } from '../../api/services/admin.service';
import { FormsModule } from '@angular/forms';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbConfirmOnExitDirective } from '../../components/tb-confirm-on-exit/tb-confirm-on-exit.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $mdExpansionPanel: any;

/**
 * Ported from the AngularJS controller `SecuritySettingsController` (module `thingsboard.admin`) in src/app/admin/index.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'security-settings',
  standalone: true,
  imports: [TranslatePipe, MatProgressBarModule, MatInputModule, MatFormFieldModule, MatCardModule, MatButtonModule, FormsModule, forwardRef(() => TbHelpDirective), forwardRef(() => TbConfirmOnExitDirective)],
  templateUrl: './security-settings.component.html',
})
export class SecuritySettingsComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly adminService = inject(AdminService);
  // TODO(port): '$mdExpansionPanel' — a mat-expansion-panel, reached with viewChild
  // TODO(port): elements not resolved to a component: md-expansion-panel-group, md-expansion-panel, md-expansion-panel-collapsed, md-expansion-panel-icon, md-expansion-panel-expanded, md-expansion-panel-header, md-expansion-panel-content
  // TODO(port): template: 2 × md-expansion-panel left in place
  // TODO(port): template: 2 × md-expansion-panel-collapsed left in place
  // TODO(port): template: 2 × md-expansion-panel-content left in place
  // TODO(port): template: 2 × md-expansion-panel-expanded left in place
  // TODO(port): template: 1 × md-expansion-panel-group left in place
  // TODO(port): template: 2 × md-expansion-panel-header left in place
  // TODO(port): template: 4 × md-expansion-panel-icon left in place
  // TODO(port): template: 10 × ng-message left in place
  // TODO(port): template: 8 × ng-messages left in place

  $mdExpansionPanel: any = $mdExpansionPanel;
  securitySettings: any;
  settingsForm: any;

  constructor() {
    this.save = this.save;
    this.loadSettings();
  }

  loadSettings(...rest: any[]): any {
    this.adminService.getSecuritySettings().then((securitySettings?: any) => {
        this.securitySettings = securitySettings;
    });
  }

  save = (...rest: any[]): any => {
    this.adminService.saveSecuritySettings(this.securitySettings).then((securitySettings?: any) => {
        this.securitySettings = securitySettings;
        this.settingsForm.$setPristine();
    });
  };
}
