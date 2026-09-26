import { Directive, OnInit, input, output } from '@angular/core';

/**
 * Ported from the AngularJS directive `tbOnFinishRender` (module `thingsboard.directives.finishRender`) in src/app/components/finish-render.directive.js:16.
 *
 * Put on the element repeated by an `@for`: bind `[tbLast]="$last"`; once the last
 * item has rendered, `finishRender` emits the event name given as the attribute value
 * (legacy: `scope.$emit(attr.tbOnFinishRender)` after a `$timeout`).
 */
@Directive({
  selector: '[tb-on-finish-render]',
  standalone: true,
})
export class TbOnFinishRenderDirective implements OnInit {
  /** The event name (the attribute value). */
  readonly eventName = input<string>('', { alias: 'tb-on-finish-render' });
  /** The `@for` block's `$last` (legacy `scope.$last` of the ng-repeat). */
  readonly tbLast = input<boolean>(false);
  /** Emits the event name once the last repeated item has rendered. */
  readonly finishRender = output<string>();

  ngOnInit(): void {
    if (this.tbLast() === true) {
      setTimeout(() => {
        this.finishRender.emit(this.eventName());
      });
    }
  }
}
