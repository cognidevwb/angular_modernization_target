import { Component, input } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';

/**
 * Ported from the AngularJS directive `tbEventHeader` (module `thingsboard.event`) in src/app/event/index.js:23.
 * The four header templates the legacy link compiled in by `event-type` are the `@switch` arms below.
 */
@Component({
  selector: '[tb-event-header]',
  standalone: true,
  imports: [TranslatePipe],
  template: `
@switch (headerKind()) {
@case ('lcEvent') {
<div class="tb-cell" flex="30">{{ 'event.event-time' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.server' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.event' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.status' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.error' | translate }}</div>
}
@case ('stats') {
<div class="tb-cell" flex>{{ 'event.event-time' | translate }}</div>
<div class="tb-cell" flex>{{ 'event.server' | translate }}</div>
<div class="tb-cell tb-number" flex>{{ 'event.messages-processed' | translate }}</div>
<div class="tb-cell tb-number" flex>{{ 'event.errors-occurred' | translate }}</div>
}
@case ('error') {
<div class="tb-cell" flex="30">{{ 'event.event-time' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.server' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.method' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.error' | translate }}</div>
}
@case ('debugRuleNode') {
<div hide-xs hide-sm class="tb-cell" flex="25">{{ 'event.event-time' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.server' | translate }}</div>
<div class="tb-cell" flex="10">{{ 'event.type' | translate }}</div>
<div class="tb-cell" flex="15">{{ 'event.entity' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.message-id' | translate }}</div>
<div class="tb-cell" flex="20">{{ 'event.message-type' | translate }}</div>
<div class="tb-cell" flex="15">{{ 'event.relation-type' | translate }}</div>
<div class="tb-cell" flex="10">{{ 'event.data' | translate }}</div>
<div class="tb-cell" flex="10">{{ 'event.metadata' | translate }}</div>
<div class="tb-cell" flex="10">{{ 'event.error' | translate }}</div>
}
}
`,
})
export class TbEventHeaderDirective {
  readonly eventType = input<string>();

  /** Which header template the event type selects (legacy `getTemplate`). */
  protected headerKind(): 'lcEvent' | 'stats' | 'error' | 'debugRuleNode' | null {
    switch (this.eventType()) {
      case types.eventType.lcEvent.value:
        return 'lcEvent';
      case types.eventType.stats.value:
        return 'stats';
      case types.eventType.error.value:
        return 'error';
      case types.debugEventType.debugRuleNode.value:
      case types.debugEventType.debugRuleChain.value:
        return 'debugRuleNode';
      default:
        return null;
    }
  }
}
