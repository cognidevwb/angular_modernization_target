import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';

import $ from 'jquery';
import alarmHeaderTemplate from '../../../../app/alarm/alarm-header.tpl.html?raw';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAlarmHeader` (module `thingsboard.alarm`) in src/app/alarm/index.js:21.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-alarm-header]',
  standalone: true,
})
export class TbAlarmHeaderDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(alarmHeaderTemplate);

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    $compile($(this.element.nativeElement).contents())(this);
  }
}
