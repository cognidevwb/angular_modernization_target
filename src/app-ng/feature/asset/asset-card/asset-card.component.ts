import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS controller `AssetCardController` (module `thingsboard.asset`) in src/app/asset/index.js:29,
 * with its card template src/app/asset/asset-card.tpl.html. Rendered by tb-grid for each asset.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'asset-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div flex layout="column" style="margin-top: -10px;">
      <div style="text-transform: uppercase; padding-bottom: 10px;">{{ item()?.type }}</div>
      <div class="tb-small" [hidden]="!isAssignedToCustomer()">{{ 'asset.assignedToCustomer' | translate }} '{{ item()?.assignedCustomer?.title }}'</div>
      <div class="tb-small" [hidden]="!isPublic()">{{ 'asset.public' | translate }}</div>
    </div>
  `,
})
export class AssetCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();

  isAssignedToCustomer(): boolean {
    const item = this.item();
    return !!(item && item.customerId && this.parentCtl()?.assetsScope === 'tenant' &&
      item.customerId.id != types.id.nullUid && !item.assignedCustomer?.isPublic);
  }

  isPublic(): boolean {
    const item = this.item();
    return !!(item && item.assignedCustomer && this.parentCtl()?.assetsScope === 'tenant' && item.assignedCustomer.isPublic);
  }
}
