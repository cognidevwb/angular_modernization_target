import { Component, effect, ElementRef, input, untracked, viewChild } from '@angular/core';
import Raphael from 'raphael';
import tinycolor from 'tinycolor2';

/**
 * Ported from the AngularJS directive `tbLedLight` (src/app/components/led-light.directive.js):
 * a Raphael-drawn LED of `size` px that glows in `colorOn` while `tbEnabled`, and shows `colorOff`
 * at `offOpacity` otherwise. The canvas is redrawn when `size` changes, the light when `tbEnabled` does.
 */
@Component({
  selector: 'tb-led-light',
  standalone: true,
  template: `<div #canvasContainer id="canvas_container" [style.width.px]="canvasSize()" [style.height.px]="canvasSize()"></div>`,
})
export class TbLedLightDirective {
  readonly size = input<any>();
  readonly colorOn = input<any>();
  readonly colorOff = input<any>();
  readonly offOpacity = input<any>();
  readonly tbEnabled = input<any>();

  private readonly canvasContainer = viewChild<ElementRef<HTMLElement>>('canvasContainer');

  private paper: any;
  private circleElement: any;
  private radius = 0;
  private glowSize = 0;

  constructor() {
    /** `scope.$watch('size', update)`. */
    effect(() => {
      const container = this.canvasContainer();
      const size = this.canvasSize();
      if (container) {
        untracked(() => this.update(container.nativeElement, size));
      }
    });
    /** `scope.$watch('tbEnabled', draw)`. */
    effect(() => {
      this.tbEnabled();
      this.colorOn();
      this.colorOff();
      this.offOpacity();
      untracked(() => this.draw());
    });
  }

  canvasSize(): number {
    return this.size() || 50;
  }

  draw(): void {
    if (!this.circleElement) {
      return;
    }
    if (this.circleElement.theGlow) {
      this.circleElement.theGlow.remove();
      this.circleElement.theGlow = null;
    }
    if (this.tbEnabled()) {
      this.circleElement.attr('fill', this.colorOn());
      this.circleElement.attr('stroke', this.colorOn());
      this.circleElement.attr('opacity', '1');
      this.circleElement.theGlow = this.circleElement.glow({
        color: tinycolor(this.colorOn()).lighten().toHexString(),
        width: this.radius + this.glowSize,
        opacity: 0.8,
        fill: true,
      });
    } else {
      this.circleElement.attr('fill', this.colorOff());
      this.circleElement.attr('stroke', this.colorOff());
      this.circleElement.attr('opacity', this.offOpacity() || '0.4');
    }
  }

  update(container: HTMLElement, canvasSize: number): void {
    this.radius = canvasSize / 4;
    this.glowSize = this.radius / 5;
    if (this.paper) {
      this.paper.remove();
    }
    container.innerHTML = '';
    this.paper = new (Raphael as any)(container, canvasSize, canvasSize);
    const center = canvasSize / 2;
    this.circleElement = this.paper.circle(center, center, this.radius);
    this.draw();
  }
}
