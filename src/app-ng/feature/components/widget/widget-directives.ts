import { Type } from '@angular/core';

import { TbGatewayFormDirective } from '../tb-gateway-form/tb-gateway-form.directive';
import { DateRangeNavigatorWidgetDirective } from '../../widget/date-range-navigator-widget/date-range-navigator-widget.directive';
import { TbAlarmsTableWidgetDirective } from '../../widget/tb-alarms-table-widget/tb-alarms-table-widget.directive';
import { TbEntitiesHierarchyWidgetDirective } from '../../widget/tb-entities-hierarchy-widget/tb-entities-hierarchy-widget.directive';
import { TbEntitiesTableWidgetDirective } from '../../widget/tb-entities-table-widget/tb-entities-table-widget.directive';
import { TbExtensionsTableWidgetDirective } from '../../widget/tb-extensions-table-widget/tb-extensions-table-widget.directive';
import { TbKnobDirective } from '../../widget/tb-knob/tb-knob.directive';
import { TbLedIndicatorDirective } from '../../widget/tb-led-indicator/tb-led-indicator.directive';
import { TbMultipleInputWidgetDirective } from '../../widget/tb-multiple-input-widget/tb-multiple-input-widget.directive';
import { TbRoundSwitchDirective } from '../../widget/tb-round-switch/tb-round-switch.directive';
import { TbSwitchDirective } from '../../widget/tb-switch/tb-switch.directive';
import { TbTimeseriesTableWidgetDirective } from '../../widget/tb-timeseries-table-widget/tb-timeseries-table-widget.directive';
import { TbWebCameraWidgetDirective } from '../../widget/tb-web-camera-widget/tb-web-camera-widget.directive';
import { TripAnimationDirective } from '../../widget/trip-animation/trip-animation.directive';

/**
 * The directives a widget type's HTML template may name (the system bundles'
 * `<tb-knob ctx="ctx">`, `<tb-entities-table-widget table-id="tableId" ctx="ctx">` …),
 * by element name, with the Angular component each was ported to. The widget runtime
 * renders these as components; any other markup in a template is plain HTML.
 */
export const WIDGET_DIRECTIVES: Record<string, Type<any>> = {
  'tb-alarms-table-widget': TbAlarmsTableWidgetDirective,
  'tb-entities-hierarchy-widget': TbEntitiesHierarchyWidgetDirective,
  'tb-entities-table-widget': TbEntitiesTableWidgetDirective,
  'tb-extensions-table-widget': TbExtensionsTableWidgetDirective,
  'tb-gateway-form': TbGatewayFormDirective,
  'tb-knob': TbKnobDirective,
  'tb-led-indicator': TbLedIndicatorDirective,
  'tb-multiple-input-widget': TbMultipleInputWidgetDirective,
  'tb-round-switch': TbRoundSwitchDirective,
  'tb-switch': TbSwitchDirective,
  'tb-timeseries-table-widget': TbTimeseriesTableWidgetDirective,
  'tb-web-camera-widget': TbWebCameraWidgetDirective,
  'date-range-navigator-widget': DateRangeNavigatorWidgetDirective,
  'trip-animation': TripAnimationDirective,
};

/** `table-id` → `tableId`: an attribute's name as the component's input name. */
export function attrToInputName(attr: string): string {
  return attr.replace(/^data-/, '').replace(/-([a-z])/g, (_m, c) => c.toUpperCase());
}
