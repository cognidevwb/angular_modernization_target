import { Component, ElementRef, inject, Input, OnInit } from '@angular/core';
import { WidgetService } from '../../api/services/widget.service';
import { WidgetComponent } from '../widget/widget.component';

/**
 * Ported from the AngularJS directive `tbWidget` (src/app/components/widget/widget.directive.js).
 *
 * The dashboard grid renders one per widget with the `locals` the legacy template passed
 * (`tb-widget locals="…"`). It loads the widget type (`widgetService.getWidgetInfo`), marks
 * its element with the widget type's CSS namespace, and starts the widget runtime
 * (`WidgetController` → `<widget>`) with the widget info and the widget type's function.
 */
@Component({
  selector: 'tb-widget, [tb-widget]',
  standalone: true,
  imports: [WidgetComponent],
  template: `
    @if (widgetInfo) {
      <widget [locals]="locals" [widgetInfo]="widgetInfo" [widgetType]="widgetType"></widget>
    }
  `,
  host: { flex: '', style: 'display: block; position: relative; min-height: 0;' },
})
export class TbWidgetDirective implements OnInit {
  @Input() locals: any;

  protected readonly widgetService = inject(WidgetService);
  protected readonly element = inject(ElementRef);

  widgetInfo: any = null;
  widgetType: any = null;

  ngOnInit(): void {
    const widget = this.locals.widget;
    this.widgetService.getWidgetInfo(widget.bundleAlias, widget.typeAlias, widget.isSystemType).then((widgetInfo?: any) => {
      this.loadFromWidgetInfo(widgetInfo);
    });
  }

  loadFromWidgetInfo(widgetInfo?: any): void {
    const widget = this.locals.widget;
    const el: HTMLElement = this.element.nativeElement;
    el.classList.add('tb-widget');
    const widgetNamespace = 'widget-type-' + (widget.isSystemType ? 'sys-' : '') + widget.bundleAlias + '-' + widget.typeAlias;
    el.classList.add(widgetNamespace);
    this.widgetType = this.widgetService.getWidgetTypeFunction(widget.bundleAlias, widget.typeAlias, widget.isSystemType);
    this.widgetInfo = widgetInfo;
  }
}
