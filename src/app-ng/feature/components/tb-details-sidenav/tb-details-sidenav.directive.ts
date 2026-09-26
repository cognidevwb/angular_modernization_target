import { Component, inject, input, model, output } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $animate: any;
declare let $mdUtil: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbDetailsSidenav` (module `thingsboard.directives.detailsSidenav`) in src/app/components/details-sidenav.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-details-sidenav',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './tb-details-sidenav.directive.html',
})
export class TbDetailsSidenavDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly headerTitle = input<any>();
  readonly headerSubtitle = input<any>();
  readonly headerHeightPx = model<any>();
  readonly isReadOnly = model<any>();
  readonly isOpen = model<any>();
  readonly isEdit = model<any>();
  readonly isAlwaysEdit = model<any>();
  readonly theForm = model<any>();
  readonly onCloseDetails = output<any>();
  readonly onToggleDetailsEditMode = output<any>();
  readonly onApplyDetails = output<any>();

  // TODO(port): '$animate' — @angular/animations
  // TODO(port): '$mdUtil' — AngularJS Material's internals: debounce/throttle → rxjs; nextTick → queueMicrotask
  protected readonly element = inject(ElementRef);
  protected readonly destroyRef = inject(DestroyRef);
  // TODO(port): elements not resolved to a component: md-sidenav
  // TODO(port): template: 1 × md-sidenav left in place
  // TODO(port): template: 2 × ng-transclude left in place

  protected backdrop: any;
  protected previousContainerStyles: any;
  $watch: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    if ((this.attrs.isReadOnly === undefined)) {
            this.attrs.isReadOnly = false;
        }
    if ((this.headerHeightPx === undefined)) {
            this.headerHeightPx.set(100);
        }
    if ((this.attrs.isAlwaysEdit !== undefined) && this.attrs.isAlwaysEdit) {
            this.isEdit.set(true);
        }
    if (Object.prototype.hasOwnProperty.call(this.attrs,'tbEnableBackdrop')) {
            this.backdrop = $mdUtil.createBackdrop(this, "md-sidenav-backdrop md-opaque ng-enter");
            $(this.element.nativeElement).on('$destroy', () => {
                this.backdrop && this.backdrop.remove();
            });
            this.destroyRef.onDestroy(() =>{
                this.backdrop && this.backdrop.remove();
            });
            this.$watch('isOpen', this.updateIsOpen);
        }
  }

  updateIsOpen = (isOpen?: any, ...rest: any[]): any => {
    this.backdrop[isOpen ? 'on' : 'off']('click', (ev?: any)=>{
        ev.preventDefault();
        this.isOpen.set(false);

    });
    var parent: any = $(this.element.nativeElement).parent();
    var restorePositioning: any = this.updateContainerPositions(parent, isOpen);

    return Promise.all([
        isOpen && this.backdrop ? $animate.enter(this.backdrop, parent) : this.backdrop ?
            $animate.leave(this.backdrop) : Promise.resolve(true)
    ]).then(function() {
        restorePositioning && restorePositioning();
    });
  };

  updateContainerPositions(parent?: any, willOpen?: any, ...rest: any[]): any {
    var drawerEl: any = this.element.nativeElement;
    var scrollTop: any = parent[0].scrollTop;
    if (willOpen && scrollTop) {
        this.previousContainerStyles = {
            top: drawerEl.style.top,
            bottom: drawerEl.style.bottom,
            height: drawerEl.style.height
        };
        var positionStyle: any = {
            top: scrollTop + 'px',
            bottom: 'auto',
            height: parent[0].clientHeight + 'px'
        };
        this.backdrop.css(positionStyle);
    }
    if (!willOpen && this.previousContainerStyles) {
        return () => {
            this.backdrop[0].style.top = null;
            this.backdrop[0].style.bottom = null;
            this.backdrop[0].style.height = null;
            this.previousContainerStyles = null;
        };
    }
    return undefined;
  }

  toggleDetailsEditMode(...rest: any[]): any {
    if (!this.isAlwaysEdit()) {
        if (!this.isEdit()) {
            this.isEdit.set(true);
        } else {
            this.isEdit.set(false);
        }
    }
    setTimeout(() => {
        this.onToggleDetailsEditMode.emit(undefined);
    });
  }

  detailsApply(...rest: any[]): any {
    setTimeout(() => {
        this.onApplyDetails.emit(undefined);
    });
  }

  closeDetails(...rest: any[]): any {
    this.isOpen.set(false);
    setTimeout(() => {
        this.onCloseDetails.emit(undefined);
    });
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
