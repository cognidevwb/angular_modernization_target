import { Component, Type, input, ChangeDetectionStrategy } from '@angular/core';
import { NgComponentOutlet } from '@angular/common';

/**
 * Ported from the AngularJS directive `tbGridCardContent` (module `thingsboard.directives.grid`) in src/app/components/grid.directive.js:27.
 * The legacy directive compiled a raw card template against a card controller; here the card is a
 * component type, rendered with `item` and `parentCtl` as its inputs.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-grid-card-content',
  standalone: true,
  imports: [NgComponentOutlet],
  template: `@if (itemComponent(); as card) {
    <ng-container *ngComponentOutlet="card; inputs: { item: item(), parentCtl: parentCtl() }" />
  }`,
})
export class TbGridCardContentDirective {
  readonly itemComponent = input<Type<unknown> | null | undefined>();
  readonly parentCtl = input<any>();
  readonly gridCtl = input<any>();
  readonly item = input<any>();
}
