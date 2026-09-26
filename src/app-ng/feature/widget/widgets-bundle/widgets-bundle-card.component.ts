import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * The card body of a widgets bundle: "System" on a system bundle.
 * Rendered by tb-grid for each item (legacy card template src/app/widget/widgets-bundle-card.tpl.html).
 */
@Component({
  selector: 'widgets-bundle-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `@if (item() && parentCtl()?.types?.id?.nullUid === item().tenantId?.id) {<div class="tb-uppercase">{{ 'widgets-bundle.system' | translate }}</div>}`,
})
export class WidgetsBundleCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
}
