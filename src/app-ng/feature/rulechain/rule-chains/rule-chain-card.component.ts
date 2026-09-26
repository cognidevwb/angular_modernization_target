import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * The card body of a rule chain: "Root" on the root chain.
 * Rendered by tb-grid for each item (legacy card template src/app/rulechain/rulechain-card.tpl.html).
 */
@Component({
  selector: 'rule-chain-card',
  standalone: true,
  imports: [TranslatePipe],
  template: `@if (item() && item().root) {<div>{{ 'rulechain.root' | translate }}</div>}`,
})
export class RuleChainCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
}
