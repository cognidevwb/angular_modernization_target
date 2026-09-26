import { Component, forwardRef, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';
import { TbMenuLinkDirective } from '../tb-menu-link/tb-menu-link.directive';

import $ from 'jquery';
import sidemenuTemplate from '../../../../app/components/side-menu.tpl.html?raw';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbSideMenu` (module `thingsboard.directives.sideMenu`) in src/app/components/side-menu.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-side-menu',
  standalone: true,
  imports: [CommonModule, forwardRef(() => TbMenuLinkDirective)],
  templateUrl: './tb-side-menu.directive.html',
})
export class TbSideMenuDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly menu = inject(MenuService);
  protected readonly element = inject(ElementRef);

  sections: any;
  protected template: any = sidemenuTemplate;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.sections = this.menu.getSections();
    $(this.element.nativeElement).html(this.template);
    $(this.element.nativeElement).contents().each((_, el) => (el as any).__ngContext__ = this);
  }
}
