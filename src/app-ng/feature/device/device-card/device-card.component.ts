import { Component } from '@angular/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS controller `DeviceCardController` (module `thingsboard.device`) in src/app/device/index.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'device-card',
  standalone: true,
  template: '', // TODO(port): this controller's screen template is the templateUrl of its route in the legacy router
})
export class DeviceCardComponent {
  protected readonly typesRef: any = types;

  types: any;
  item: any;
  parentCtl: any;

  constructor() {
    this.types = this.typesRef;
  }

  isAssignedToCustomer(...rest: any[]): any {
    if (this.item && this.item.customerId && this.parentCtl.devicesScope === 'tenant' &&
        this.item.customerId.id != this.types.id.nullUid && !this.item.assignedCustomer.isPublic) {
        return true;
    }
    return false;
  }

  isPublic(...rest: any[]): any {
    if (this.item && this.item.assignedCustomer && this.parentCtl.devicesScope === 'tenant' && this.item.assignedCustomer.isPublic) {
        return true;
    }
    return false;
  }
}
