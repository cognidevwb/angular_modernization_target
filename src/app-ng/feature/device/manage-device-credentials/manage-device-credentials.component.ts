import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { DeviceService } from '../../api/services/device.service';
import { RootState } from '../../../root-state';

/** What the devices page opens the dialog with. */
export interface ManageDeviceCredentialsData {
  deviceId: string;
  isReadOnly: boolean;
}

/**
 * Ported from the AngularJS controller `ManageDeviceCredentialsController` (module `thingsboard.device`)
 * with its template src/app/device/device-credentials.tpl.html. Closes with the saved credentials.
 */
@Component({
  selector: 'manage-device-credentials',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './manage-device-credentials.component.html',
})
export class ManageDeviceCredentialsComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly deviceService = inject(DeviceService);
  protected readonly dialogRef = inject(MatDialogRef<ManageDeviceCredentialsComponent>);
  protected readonly dialogData: ManageDeviceCredentialsData = inject(MAT_DIALOG_DATA);
  protected readonly theForm = viewChild<NgForm>('theForm');

  credentialsTypes = [
    { name: 'Access token', value: 'ACCESS_TOKEN' },
    { name: 'X.509 Certificate', value: 'X509_CERTIFICATE' },
  ];
  deviceCredentials: any = {};
  isReadOnly: boolean;

  constructor() {
    this.isReadOnly = this.dialogData.isReadOnly;
    this.loadDeviceCredentials();
  }

  loadDeviceCredentials(): void {
    this.deviceService.getDeviceCredentials(this.dialogData.deviceId).then((deviceCredentials?: any) => {
      this.deviceCredentials = deviceCredentials;
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }

  valid(): boolean {
    return !!(this.deviceCredentials &&
      (this.deviceCredentials.credentialsType === 'ACCESS_TOKEN'
        && this.deviceCredentials.credentialsId
        && this.deviceCredentials.credentialsId.length > 0
        || this.deviceCredentials.credentialsType === 'X509_CERTIFICATE'
        && this.deviceCredentials.credentialsValue
        && this.deviceCredentials.credentialsValue.length > 0));
  }

  clear(): void {
    this.deviceCredentials.credentialsId = null;
    this.deviceCredentials.credentialsValue = null;
  }

  save(): void {
    this.deviceService.saveDeviceCredentials(this.deviceCredentials).then((deviceCredentials?: any) => {
      this.deviceCredentials = deviceCredentials;
      this.theForm()?.form.markAsPristine();
      this.dialogRef.close(deviceCredentials);
    });
  }
}
