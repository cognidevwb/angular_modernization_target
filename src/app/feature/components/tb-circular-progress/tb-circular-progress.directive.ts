import { Directive, effect, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import $ from 'jquery';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;

/**
 * Ported from the AngularJS directive `tbCircularProgress` (module `thingsboard.directives.circularProgress`) in src/app/components/circular-progress.directive.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-circular-progress]',
  standalone: true,
})
export class TbCircularProgressDirective {
  readonly circularProgress = model<any>(undefined, { alias: 'tbCircularProgress' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly element = inject(ElementRef);

  protected circularProgressElement: any = $('<md-progress-circular style="margin: auto;" md-mode="indeterminate" md-diameter="20"></md-progress-circular>');
  protected children: any = null;
  protected cssWidth: any;
  protected width: any = null;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.cssWidth = $(this.element.nativeElement).prop('style')['width'];
    if (!this.cssWidth) {
            $($(this.element.nativeElement)).css('width', this.width + 'px');
        }
    let prevCircularProgress: any;
    effect(() => {
            const newCircularProgress = this.circularProgress();
            if (newCircularProgress != prevCircularProgress) {
                if (newCircularProgress) {
                    if (!this.cssWidth) {
                        $($(this.element.nativeElement)).css('width', '');
                        this.width = $(this.element.nativeElement).prop('offsetWidth');
                        $($(this.element.nativeElement)).css('width', this.width + 'px');
                    }
                    this.children = $($(this.element.nativeElement)).children();
                    $($(this.element.nativeElement)).empty();
                    $($(this.element.nativeElement)).append($(this.circularProgressElement));
                } else {
                    $($(this.element.nativeElement)).empty();
                    $($(this.element.nativeElement)).append(this.children);
                    if (this.cssWidth) {
                        $($(this.element.nativeElement)).css('width', this.cssWidth);
                    } else {
                        $($(this.element.nativeElement)).css('width', '');
                    }
                }
            }
            prevCircularProgress = newCircularProgress;
        });
  }
}
