import { Component, input } from '@angular/core';

/**
 * The card body of a user: first and last name.
 * Rendered by tb-grid for each item (legacy card template src/app/user/user-card.tpl.html).
 */
@Component({
  selector: 'user-card',
  standalone: true,
  imports: [],
  template: `<div class="tb-uppercase">{{ item() ? ((item().firstName ? item().firstName : '') + ' ' + (item().lastName ? item().lastName : '')) : '' }}</div>`,
})
export class UserCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
}
