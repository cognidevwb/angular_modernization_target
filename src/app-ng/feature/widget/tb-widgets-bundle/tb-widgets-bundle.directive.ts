import { Component, inject, model, output } from '@angular/core';
import { ElementRef } from '@angular/core';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import widgetsBundleFieldsetTemplate from '../../../../app/widget/widgets-bundle-fieldset.tpl.html';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbWidgetsBundle` (module `thingsboard.widget-library`) in src/app/widget/index.js:40.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-widgets-bundle',
  standalone: true,
  imports: [TranslatePipe, MatInputModule, MatFormFieldModule, MatButtonModule, FormsModule],
  templateUrl: './tb-widgets-bundle.directive.html',
})
export class TbWidgetsBundleDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly widgetsBundle = model<any>();
  readonly isEdit = model<any>();
  readonly isReadOnly = model<any>();
  readonly theForm = model<any>();
  readonly onExportWidgetsBundle = output<any>();
  readonly onDeleteWidgetsBundle = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(widgetsBundleFieldsetTemplate);

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    $compile($(this.element.nativeElement).contents())(this);
  }
}
