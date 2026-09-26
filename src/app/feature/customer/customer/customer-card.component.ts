import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ContactShortPipe } from '../../components/pipes/contact-short.pipe';

/**
 * The card body of a customer: its short contact line (hidden for the public customer).
 * Rendered by tb-grid for each item (legacy card template src/app/customer/customer-card.tpl.html).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'customer-card',
  standalone: true,
  imports: [ContactShortPipe],
  template: `<div [hidden]="!(item() && (!item().additionalInfo || !item().additionalInfo.isPublic))" class="tb-uppercase">{{ item() | contactShort }}</div>`,
})
export class CustomerCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
}
