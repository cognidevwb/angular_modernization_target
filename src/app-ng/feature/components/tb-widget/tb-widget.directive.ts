import { Component, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { WidgetService } from '../../api/services/widget.service';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $controller: any;
declare let $scope: any;

/**
 * Ported from the AngularJS directive `tbWidget` (module `thingsboard.directives.widget`) in src/app/components/widget/widget.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-widget, [tb-widget]',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbWidgetDirective {
  // TODO(port): '$controller' — an AngularJS built-in with no Angular counterpart
  protected readonly widgetService = inject(WidgetService);
  protected readonly element = inject(ElementRef);

  protected locals: any;
  protected widget: any;
  protected widgetController: any;
  protected gridsterItem: any;
  $eval: any;
  $on: any;
  loadingData: any;

  // TODO(port): link(scope, elem, attrs) — `elem` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.locals = this.attrs.locals;
    this.widget = this.locals.widget;
    this.gridsterItemInitialized$.subscribe((item?: any) => {
                this.gridsterItem = item;
                if (this.widgetController) {
                    this.widgetController.gridsterItemInitialized(this.gridsterItem);
                }
            });
    this.widgetService.getWidgetInfo(this.widget.bundleAlias, this.widget.typeAlias, this.widget.isSystemType).then(
                (widgetInfo?: any) => {
                    this.loadFromWidgetInfo(widgetInfo);
                }
            );
  }

  loadFromWidgetInfo(widgetInfo?: any, ...rest: any[]): any {

    this.loadingData = true;

    $(this.element.nativeElement).addClass("tb-widget");

    var widgetNamespace: any = "widget-type-" + (this.widget.isSystemType ? 'sys-' : '')
        + this.widget.bundleAlias + '-'
        + this.widget.typeAlias;

    $(this.element.nativeElement).addClass(widgetNamespace);

    var widgetType: any = this.widgetService.getWidgetTypeFunction(this.widget.bundleAlias, this.widget.typeAlias, this.widget.isSystemType);

    Object.assign(this.locals, {$scope: this, $element: $(this.element.nativeElement), widgetInfo: widgetInfo, widgetType: widgetType});

    this.widgetController = this;

    if (this.gridsterItem) {
        this.widgetController.gridsterItemInitialized(this.gridsterItem);
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
