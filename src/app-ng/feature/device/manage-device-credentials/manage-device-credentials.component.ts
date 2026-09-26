import { Component, inject } from '@angular/core';
import { DeviceService } from '../../api/services/device.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ManageDeviceCredentialsController` (module `thingsboard.device`) in src/app/device/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'manage-device-credentials',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './manage-device-credentials.component.html',
})
export class ManageDeviceCredentialsComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly deviceService = inject(DeviceService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): template: 3 × ng-message left in place
  // TODO(port): template: 2 × ng-messages left in place

  credentialsTypes: any = [
        {
            name: 'Access token',
            value: 'ACCESS_TOKEN'
        },
        {
            name: 'X.509 Certificate',
            value: 'X509_CERTIFICATE'
        }
    ];
  deviceCredentials: any = {};
  isReadOnly: any;
  theForm: any;

  constructor() {
    this.isReadOnly = this.dialogData.isReadOnly;
    this.valid = this.valid;
    this.cancel = this.cancel;
    this.save = this.save;
    this.clear = this.clear;
    this.loadDeviceCredentials();
  }

  loadDeviceCredentials(...rest: any[]): any {
    this.deviceService.getDeviceCredentials(this.dialogData.deviceId).then((deviceCredentials?: any) => {
        this.deviceCredentials = deviceCredentials;
    });
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  valid = (...rest: any[]): any => {
    return this.deviceCredentials &&
           (this.deviceCredentials.credentialsType === 'ACCESS_TOKEN'
               && this.deviceCredentials.credentialsId
               && this.deviceCredentials.credentialsId.length > 0
               || this.deviceCredentials.credentialsType === 'X509_CERTIFICATE'
               && this.deviceCredentials.credentialsValue
               && this.deviceCredentials.credentialsValue.length > 0);
  };

  clear = (...rest: any[]): any => {
    this.deviceCredentials.credentialsId = null;
    this.deviceCredentials.credentialsValue = null;
  };

  save = (...rest: any[]): any => {
    this.deviceService.saveDeviceCredentials(this.deviceCredentials).then((deviceCredentials?: any) => {
        this.deviceCredentials = deviceCredentials;
        this.theForm.$setPristine();
        this.dialog.hide();
    });
  };
}
