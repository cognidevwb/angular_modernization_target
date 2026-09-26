import { Directive, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import eventErrorDialogTemplate from '../../../../app/event/event-content-dialog.tpl.html';
import eventRowLcEventTemplate from '../../../../app/event/event-row-lc-event.tpl.html';
import eventRowStatsTemplate from '../../../../app/event/event-row-stats.tpl.html';
import eventRowErrorTemplate from '../../../../app/event/event-row-error.tpl.html';
import eventRowDebugRuleNodeTemplate from '../../../../app/event/event-row-debug-rulenode.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let scope: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbEventRow` (module `thingsboard.event`) in src/app/event/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-event-row]',
  standalone: true,
})
export class TbEventRowDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  protected readonly typesRef: any = types;
  protected readonly utils = inject(UtilsService);
  protected readonly element = inject(ElementRef);

  types: any;
  event: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.attrs.$observe('eventType', () => {
            this.loadTemplate();
        });
    this.types = this.typesRef;
    this.event = this.attrs.event;
    $compile($(this.element.nativeElement).contents())(this);
  }

  getTemplate(eventType?: any, ...rest: any[]): any {
    var template: any = '';
    switch(eventType) {
        case this.typesRef.eventType.lcEvent.value:
            template = eventRowLcEventTemplate;
            break;
        case this.typesRef.eventType.stats.value:
            template = eventRowStatsTemplate;
            break;
        case this.typesRef.eventType.error.value:
            template = eventRowErrorTemplate;
            break;
        case this.typesRef.debugEventType.debugRuleNode.value:
            template = eventRowDebugRuleNodeTemplate;
            break;
        case this.typesRef.debugEventType.debugRuleChain.value:
            template = eventRowDebugRuleNodeTemplate;
            break;
    }
    return $templateCache.get(template);
  }

  loadTemplate(...rest: any[]): any {
    $(this.element.nativeElement).html(this.getTemplate(this.attrs.eventType));
    $compile($(this.element.nativeElement).contents())(this);
  }

  showContent($event?: any, content?: any, title?: any, contentType?: any, ...rest: any[]): any {
    let vm = this;
    var onShowingCallback: any = {
        onShowing: function(...rest: any[]){}
    }
    if (!contentType) {
        contentType = null;
    }
    var sortedContent: any;
    try {
        sortedContent = JSON.stringify(this.utils.sortObjectKeys(JSON.parse(content)));
    }
    catch(err: any) {
        sortedContent = content;
    }
    this.dialog.show({
        controller: 'EventContentDialogController',
        controllerAs: 'vm',
        templateUrl: eventErrorDialogTemplate,
        locals: {content: sortedContent, title: title, contentType: contentType, showingCallback: onShowingCallback},
        parent: $(this.document.body),
        fullscreen: true,
        targetEvent: $event,
        multiple: true,
        onShowing: (scope?: any, element?: any, ...rest: any[]) => {
            onShowingCallback.onShowing(scope, element);
        }
    });
  }

  checkTooltip($event?: any, ...rest: any[]): any {
    var el: any = $event.target;
    var $el: any = $(el);
    if(el.offsetWidth < el.scrollWidth && !$el.attr('title')){
        $el.attr('title', $el.text());
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
