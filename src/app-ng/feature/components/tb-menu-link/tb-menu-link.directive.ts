import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MenuService } from '../../services/menu.service';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import menulinkTemplate from '../../../../app/components/menu-link.tpl.html';
import menutoggleTemplate from '../../../../app/components/menu-toggle.tpl.html';
import { NospacePipe } from '../pipes/nospace.pipe';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbMenuLink` (module `thingsboard.directives.menuLink`) in src/app/components/menu-link.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-menu-link',
  standalone: true,
  imports: [TranslatePipe, MatIconModule, MatButtonModule, NospacePipe, CommonModule],
  templateUrl: './tb-menu-link.directive.html',
})
export class TbMenuLinkDirective {
  readonly section = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly menu = inject(MenuService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ui-sref left in place
  // TODO(port): template: 1 × ui-sref-active-eq left in place

  protected template: any;
  sectionActive: any;
  sectionHeight: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    if (this.section().type === 'link') {
            this.template = $templateCache.get(menulinkTemplate);
        } else {
            this.template = $templateCache.get(menutoggleTemplate);

            var parentNode: any = this.element.nativeElement.parentNode.parentNode.parentNode;
            if (parentNode.classList.contains('parent-list-item')) {
                var heading: any = parentNode.querySelector('h2');
                this.element.nativeElement.firstChild.setAttribute('aria-describedby', heading.id);
            }

            this.sectionActive = () => {
                return this.menu.sectionActive(this.section());
            };

            this.sectionHeight = () => {
                return this.menu.sectionHeight(this.section());
            };
        }
    $(this.element.nativeElement).html(this.template);
    $compile($(this.element.nativeElement).contents())(this);
  }
}
