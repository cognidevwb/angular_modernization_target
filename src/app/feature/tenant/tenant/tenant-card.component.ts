import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { ContactShortPipe } from '../../components/pipes/contact-short.pipe';

/**
 * The card body of a tenant: its short contact line.
 * Rendered by tb-grid for each item (legacy card template src/app/tenant/tenant-card.tpl.html).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tenant-card',
  standalone: true,
  imports: [ContactShortPipe],
  template: `<div class="tb-uppercase">{{ item() | contactShort }}</div>`,
})
export class TenantCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
}
