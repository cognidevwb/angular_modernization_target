import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';

import $ from 'jquery';

/**
 * Ported from the AngularJS directive `tbGridCardContent` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-grid-card-content',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbGridCardContentDirective {
  readonly parentCtl = model<any>(undefined, { alias: 'parentCtl' });
  readonly gridCtl = model<any>(undefined, { alias: 'gridCtl' });
  readonly itemTemplate = model<any>(undefined, { alias: 'itemTemplate' });
  readonly itemController = model<any>(undefined, { alias: 'itemController' });
  readonly item = model<any>(undefined, { alias: 'item' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$controller' — an AngularJS built-in with no Angular counterpart
  protected readonly element = inject(ElementRef);

  protected controllerInstance: any = null;
  $watch: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.$watch('itemTemplate',
            () => {
                this.initContent();
            }
        );
    this.$watch('itemController',
            () => {
                this.initContent();
            }
        );
    this.$watch('parentCtl',
            () => {
                this.controllerInstance.parentCtl = this.parentCtl();
            }
        );
    this.$watch('item',
            () => {
                this.controllerInstance.item = this.item();
            }
        );
  }

  initContent(...rest: any[]): any {
    let vm = this;
    if (this.itemTemplate() && this.itemController() && !this.controllerInstance) {
        $(this.element.nativeElement).html(this.itemTemplate());
        var locals: any = {};
        Object.assign(locals, {$scope: this, $element: $(this.element.nativeElement)});
        var controller: any = (window as any).$controller(this.itemController(), locals, true, 'vm');
        controller.instance = controller();
        this.controllerInstance = controller.instance;
        this.controllerInstance.item = this.item();
        this.controllerInstance.parentCtl = this.parentCtl();
        (window as any).$compile($(this.element.nativeElement).contents())(this);
    }
  }
}
