import { Component, inject, model } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import $ from 'jquery';
// @ts-ignore
import materialIconSelectTemplate from '../../../../app/components/material-icon-select.tpl.html';
// @ts-ignore
import materialIconsDialogTemplate from '../../../../app/components/material-icons-dialog.tpl.html';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbMaterialIconSelect` (module `thingsboard.directives.materialIconSelect`) in src/app/components/material-icon-select.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-material-icon-select',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbMaterialIconSelectDirective {
  readonly tbRequired = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);

  protected template: any = materialIconSelectTemplate;
  icon: any = null;
  $watch: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                this.icon = ngModelCtrl.$viewValue;
            }
            if (!this.icon || !this.icon.length) {
                this.icon = 'more_horiz';
            }
        }
    this.$watch('icon', () => {
            this.updateView();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  updateView(...rest: any[]): any {
    ngModelCtrl.$setViewValue(this.icon);
  }

  openIconDialog($event?: any, ...rest: any[]): any {
    let vm = this;
    if ($event) {
        $event.stopPropagation();
    }
    this.dialog.show({
        controller: 'MaterialIconsDialogController',
        controllerAs: 'vm',
        templateUrl: materialIconsDialogTemplate,
        parent: $(this.document.body),
        locals: {icon: this.icon},
        multiple: true,
        fullscreen: true,
        targetEvent: $event
    }).then((icon?: any) => {
        this.icon = icon;
    });
  }
}
