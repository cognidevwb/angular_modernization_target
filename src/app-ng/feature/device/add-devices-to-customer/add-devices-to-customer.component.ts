import { Component, forwardRef, inject } from '@angular/core';
import { DeviceService } from '../../api/services/device.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TbScopeElementDirective } from '../../components/tb-scope-element/tb-scope-element.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `AddDevicesToCustomerController` (module `thingsboard.device`) in src/app/device/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'add-devices-to-customer',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatListModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, forwardRef(() => TbScopeElementDirective)],
  templateUrl: './add-devices-to-customer.component.html',
})
export class AddDevicesToCustomerComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly deviceService = inject(DeviceService);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): elements not resolved to a component: md-virtual-repeat-container
  // TODO(port): template: 1 × md-virtual-repeat-container left in place

  devices: any;
  searchText: any = '';
  theDevices: any;

  constructor() {
    this.devices = this.dialogData.devices;
    this.assign = this.assign;
    this.cancel = this.cancel;
    this.hasData = this.hasData;
    this.noData = this.noData;
    this.searchDeviceTextUpdated = this.searchDeviceTextUpdated;
    this.toggleDeviceSelection = this.toggleDeviceSelection;
    this.theDevices = {
        getItemAtIndex: (index?: any, ...rest: any[]) => {
            if (index > this.devices.data.length) {
                this.theDevices.fetchMoreItems_(index);
                return null;
            }
            var item: any = this.devices.data[index];
            if (item) {
                item.indexNumber = index + 1;
            }
            return item;
        },

        getLength: (...rest: any[]) => {
            if (this.devices.hasNext) {
                return this.devices.data.length + this.devices.nextPageLink.limit;
            } else {
                return this.devices.data.length;
            }
            return undefined;
        },

        fetchMoreItems_: (...rest: any[]) => {
            if (this.devices.hasNext && !this.devices.pending) {
                this.devices.pending = true;
                this.deviceService.getTenantDevices(this.devices.nextPageLink, false).then(
                    (devices?: any) => {
                        this.devices.data = this.devices.data.concat(devices.data);
                        this.devices.nextPageLink = devices.nextPageLink;
                        this.devices.hasNext = devices.hasNext;
                        if (this.devices.hasNext) {
                            this.devices.nextPageLink.limit = this.devices.pageSize;
                        }
                        this.devices.pending = false;
                    },
                    () => {
                        this.devices.hasNext = false;
                        this.devices.pending = false;
                    });
            }
        }
    };
  }

  cancel = (...rest: any[]): any => {
    this.dialog.cancel();
  };

  assign = (...rest: any[]): any => {
    var tasks: any = [];
    for (var deviceId in this.devices.selections) {
        tasks.push(this.deviceService.assignDeviceToCustomer(this.dialogData.customerId, deviceId));
    }
    Promise.all(tasks).then(() => {
        this.dialog.hide();
    });
  };

  noData = (...rest: any[]): any => {
    return this.devices.data.length == 0 && !this.devices.hasNext;
  };

  hasData = (...rest: any[]): any => {
    return this.devices.data.length > 0;
  };

  toggleDeviceSelection = ($event?: any, device?: any, ...rest: any[]): any => {
    $event.stopPropagation();
    var selected: any = (device.selected !== undefined) && device.selected;
    device.selected = !selected;
    if (device.selected) {
        this.devices.selections[device.id.id] = true;
        this.devices.selectedCount++;
    } else {
        delete this.devices.selections[device.id.id];
        this.devices.selectedCount--;
    }
  };

  searchDeviceTextUpdated = (...rest: any[]): any => {
    this.devices = {
        pageSize: this.devices.pageSize,
        data: [],
        nextPageLink: {
            limit: this.devices.pageSize,
            textSearch: this.searchText
        },
        selections: {},
        selectedCount: 0,
        hasNext: true,
        pending: false
    };
  };
}
