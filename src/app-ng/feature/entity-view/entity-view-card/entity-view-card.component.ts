import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS controller `EntityViewCardController` (module `thingsboard.entityView`) in src/app/entity-view/index.js:28,
 * with its card template src/app/entity-view/entity-view-card.tpl.html. Rendered by tb-grid for each entity view.
 */
@Component({
  selector: 'entity-view-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `
    <div flex layout="column" style="margin-top: -10px;">
      <div style="text-transform: uppercase; padding-bottom: 5px;">{{ item()?.type }}</div>
      <div class="tb-card-description">{{ item()?.additionalInfo?.description }}</div>
      <div style="padding-top: 5px;" class="tb-small" [hidden]="!isAssignedToCustomer()">{{ 'entity-view.assignedToCustomer' | translate }} '{{ item()?.assignedCustomer?.title }}'</div>
    </div>
  `,
})
export class EntityViewCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();

  isAssignedToCustomer(): boolean {
    const item = this.item();
    return !!(item && item.customerId && this.parentCtl()?.entityViewsScope === 'tenant' &&
      item.customerId.id != types.id.nullUid && !item.assignedCustomer?.isPublic);
  }

  isPublic(): boolean {
    const item = this.item();
    return !!(item && item.assignedCustomer && this.parentCtl()?.entityViewsScope === 'tenant' && item.assignedCustomer.isPublic);
  }
}
