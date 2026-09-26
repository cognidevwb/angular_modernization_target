import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import contactTemplate from '../../../../app/components/contact.tpl.html';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let countries: any;
declare let postalCodePatterns: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbContact` (module `thingsboard.directives.contact`) in src/app/components/contact.directive.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-contact',
  standalone: true,
  imports: [MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './tb-contact.directive.html',
})
export class TbContactDirective {
  readonly contact = model<any>();
  readonly isEdit = model<any>();
  readonly theForm = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  countries: any = countries;
  postalCodePatterns: any = postalCodePatterns;
  protected template: any = $templateCache.get(contactTemplate);

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    $compile($(this.element.nativeElement).contents())(this);
  }
}
