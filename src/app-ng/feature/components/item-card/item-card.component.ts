import { Component, input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Ported from the AngularJS controller `ItemCardController` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * The grid's default card: the legacy default card template was an empty `<span></span>`.
 * Every card component takes the same two inputs: the `item` and the page's `parentCtl`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'item-card',
  standalone: true,
  template: '<span></span>',
})
export class ItemCardComponent {
  readonly item = input<any>();
  readonly parentCtl = input<any>();
}
