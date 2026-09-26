import { Directive, inject } from '@angular/core';
import { ElementRef } from '@angular/core';

import $ from 'jquery';
import { MatMenuTrigger } from '@angular/material/menu';
import { linkAttrs } from '../../../legacy-link';

/**
 * Ported from the AngularJS directive `tbMousepointMenu` (module `thingsboard.directives.mousepointMenu`) in src/app/components/mousepoint-menu.directive.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-mousepoint-menu]',
  standalone: true,
})
export class TbMousepointMenuDirective {
  protected readonly element = inject(ElementRef);
  protected readonly RightClickContextMenu = inject(MatMenuTrigger, { optional: true }) as any;

  // TODO(port): $attrs — $attrs: an input() on the component
  // TODO(port): link($scope, $element, $attrs, RightClickContextMenu) — `$element` is the element (ElementRef.nativeElement) and `$attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  $mdOpenMousepointMenu($event?: any, ...rest: any[]): any {
    this.RightClickContextMenu.offsets = () => {
        var offset: any = $(this.element.nativeElement).offset();
        var x: any = $event.pageX - offset.left;
        var y: any = $event.pageY - offset.top;
        if (this.attrs.tbOffsetX) {
            x += Number(this.attrs.tbOffsetX);
        }
        if (this.attrs.tbOffsetY) {
            y += Number(this.attrs.tbOffsetY);
        }
        var offsets: any = {
            left: x,
            top: y
        }
        return offsets;
    }
    this.RightClickContextMenu.open($event);
  }

  $mdCloseMousepointMenu(...rest: any[]): any {
    this.RightClickContextMenu.close();
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
