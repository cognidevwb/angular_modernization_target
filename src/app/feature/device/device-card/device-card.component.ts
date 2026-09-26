import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS controller `DeviceCardController` (module `thingsboard.device`) in src/app/device/index.js:29,
 * with its card template src/app/device/device-card.tpl.html. Rendered by tb-grid for each device.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'device-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div flex layout="column" style="margin-top: -10px;">
      <div style="text-transform: uppercase; padding-bottom: 5px;">{{ item()?.type }}</div>
      <div class="tb-card-description">{{ item()?.additionalInfo?.description }}</div>
      <div style="padding-top: 5px;" class="tb-small" [hidden]="!isAssignedToCustomer()">{{ 'device.assignedToCustomer' | translate }} '{{ item()?.assignedCustomer?.title }}'</div>
      <div style="padding-top: 5px;" class="tb-small" [hidden]="!isPublic()">{{ 'device.public' | translate }}</div>
    </div>
  `,
})
export class DeviceCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();

  isAssignedToCustomer(): boolean {
    const item = this.item();
    return !!(item && item.customerId && this.parentCtl()?.devicesScope === 'tenant' &&
      item.customerId.id != types.id.nullUid && !item.assignedCustomer?.isPublic);
  }

  isPublic(): boolean {
    const item = this.item();
    return !!(item && item.assignedCustomer && this.parentCtl()?.devicesScope === 'tenant' && item.assignedCustomer.isPublic);
  }
}
