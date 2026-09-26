import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import Raphael from 'raphael';
import tinycolor from 'tinycolor2';
import $ from 'jquery';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbLedLight` (module `thingsboard.directives.ledLight`) in src/app/components/led-light.directive.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-led-light',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbLedLightDirective {
  readonly size = model<any>();
  readonly colorOn = model<any>();
  readonly colorOff = model<any>();
  readonly offOpacity = model<any>();
  readonly tbEnabled = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly element = inject(ElementRef);

  glowColor: any;
  $watch: any;
  canvasSize: any;
  circleElement: any;
  glowSize: any;
  paper: any;
  radius: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.offOpacity.set(this.offOpacity() || "0.4");
    this.glowColor = tinycolor(this.colorOn()).lighten().toHexString();
    this.$watch('tbEnabled',() => {
            this.draw();
        });
    this.$watch('size',() => {
            this.update();
        });
    this.update();
  }

  draw(...rest: any[]): any {
    if (this.tbEnabled()) {
        this.circleElement.attr("fill", this.colorOn());
        this.circleElement.attr("stroke", this.colorOn());
        this.circleElement.attr("opacity", "1");

        if (this.circleElement.theGlow) {
            this.circleElement.theGlow.remove();
        }

        this.circleElement.theGlow = this.circleElement.glow(
            {
                color: this.glowColor,
                width: this.radius + this.glowSize,
                opacity: 0.8,
                fill: true
            });
    } else {
        if (this.circleElement.theGlow) {
            this.circleElement.theGlow.remove();
        }

        /*scope.circleElement.theGlow = scope.circleElement.glow(
         {
         color: scope.glowColor,
         width: scope.radius + scope.glowSize,
         opacity: 0.4,
         fill: true
         });*/

        this.circleElement.attr("fill", this.colorOff());
        this.circleElement.attr("stroke", this.colorOff());
        this.circleElement.attr("opacity", this.offOpacity());
    }
  }

  update(...rest: any[]): any {
    this.size.set(this.size() || 50);
    this.canvasSize = this.size();
    this.radius = this.canvasSize / 4;
    this.glowSize = this.radius / 5;

    var template: any = '<div id="canvas_container" style="width: ' + this.size() + 'px; height: ' + this.size() + 'px;"></div>';
    $(this.element.nativeElement).html(template);
    this.element.nativeElement.querySelector('#canvas_container');
    this.paper = new Raphael($('#canvas_container', $(this.element.nativeElement))[0], this.canvasSize, this.canvasSize);
    var center: any = this.canvasSize / 2;
    this.circleElement = this.paper.circle(center, center, this.radius);
    this.draw();
  }
}
