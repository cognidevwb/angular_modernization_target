import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import eventHeaderLcEventTemplate from '../../../../app/event/event-header-lc-event.tpl.html?raw';
import eventHeaderStatsTemplate from '../../../../app/event/event-header-stats.tpl.html?raw';
import eventHeaderErrorTemplate from '../../../../app/event/event-header-error.tpl.html?raw';
import eventHeaderDebugRuleNodeTemplate from '../../../../app/event/event-header-debug-rulenode.tpl.html?raw';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbEventHeader` (module `thingsboard.event`) in src/app/event/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-event-header]',
  standalone: true,
})
export class TbEventHeaderDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.attrs.$observe('eventType', () => {
            this.loadTemplate();
        });
  }

  getTemplate(eventType?: any, ...rest: any[]): any {
    var template: any = '';
    switch(eventType) {
        case types.eventType.lcEvent.value:
            template = eventHeaderLcEventTemplate;
            break;
        case types.eventType.stats.value:
            template = eventHeaderStatsTemplate;
            break;
        case types.eventType.error.value:
            template = eventHeaderErrorTemplate;
            break;
        case types.debugEventType.debugRuleNode.value:
            template = eventHeaderDebugRuleNodeTemplate;
            break;
        case types.debugEventType.debugRuleChain.value:
            template = eventHeaderDebugRuleNodeTemplate;
            break;
    }
    return $templateCache.get(template);
  }

  loadTemplate(...rest: any[]): any {
    $(this.element.nativeElement).html(this.getTemplate(this.attrs.eventType));
    $compile($(this.element.nativeElement).contents())(this);
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
