import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { RootState } from '../../../root-state';
import { PagedListState, fetchMorePage, newPagedList, onPagedListScrolled } from '../../components/tb-grid/paged-list';
import { DeviceService } from '../../api/services/device.service';

/** What the customer's devices page opens the dialog with: the customer and the first page of tenant devices. */
export interface AddDevicesToCustomerData {
  customerId: string;
  devices: PagedListState;
}

/**
 * Ported from the AngularJS controller `AddDevicesToCustomerController` (module `thingsboard.device`)
 * with its template src/app/device/add-devices-to-customer.tpl.html. Closes with `true` once the selected devices are assigned.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'add-devices-to-customer',
  standalone: true,
  imports: [TranslatePipe, FormsModule, ScrollingModule, MatDialogModule, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule],
  templateUrl: './add-devices-to-customer.component.html',
})
export class AddDevicesToCustomerComponent {
  protected readonly rootScope = inject(RootState);
  protected readonly deviceService = inject(DeviceService);
  protected readonly dialogRef = inject(MatDialogRef<AddDevicesToCustomerComponent, boolean>);
  protected readonly dialogData: AddDevicesToCustomerData = inject(MAT_DIALOG_DATA);

  devices: PagedListState = this.dialogData.devices;
  searchText = '';

  private readonly fetchDevices = (pageLink: any) => this.deviceService.getTenantDevices(pageLink, false);

  cancel(): void {
    this.dialogRef.close();
  }

  assign(): void {
    const tasks = Object.keys(this.devices['selections']).map((id) => this.deviceService.assignDeviceToCustomer(this.dialogData.customerId, id));
    Promise.all(tasks).then(() => this.dialogRef.close(true));
  }

  noData(): boolean {
    return this.devices.data.length == 0 && !this.devices.hasNext;
  }

  hasData(): boolean {
    return this.devices.data.length > 0;
  }

  onScrolled(index: number): void {
    onPagedListScrolled(this.devices, index, this.fetchDevices);
  }

  toggleDeviceSelection(device: any): void {
    const selected = device.selected !== undefined && device.selected;
    device.selected = !selected;
    if (device.selected) {
      this.devices['selections'][device.id.id] = true;
      this.devices['selectedCount']++;
    } else {
      delete this.devices['selections'][device.id.id];
      this.devices['selectedCount']--;
    }
  }

  searchDeviceTextUpdated(): void {
    this.devices = newPagedList(this.devices.pageSize, this.searchText, { selections: {}, selectedCount: 0 });
    fetchMorePage(this.devices, this.fetchDevices);
  }
}
