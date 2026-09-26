import { Component, inject, model, output } from '@angular/core';
import { DestroyRef } from '@angular/core';
import { ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { $timeout } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let addResizeListener: any;
declare let angular: any;
declare let removeResizeListener: any;
declare let $scope: any;
declare let mdFabToolbarAnimation: any;

/**
 * Ported from the AngularJS directive `tbDashboardToolbar` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-dashboard-toolbar',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './tb-dashboard-toolbar.directive.html',
})
export class TbDashboardToolbarDirective {
  readonly toolbarOpened = model<any>();
  readonly forceFullscreen = model<any>();
  readonly onTriggerClick = output<any>();

  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly element = inject(ElementRef);
  // TODO(port): '$timeout' — use setTimeout, or an rxjs timer
  // TODO(port): 'mdFabToolbarAnimation' — no Angular counterpart found: not a built-in, not downgraded, not a legacy registration
  protected readonly destroyRef = inject(DestroyRef);
  // TODO(port): elements not resolved to a component: md-fab-toolbar, md-fab-trigger, md-fab-actions
  // TODO(port): template: 1 × md-fab-actions left in place
  // TODO(port): template: 1 × md-fab-trigger left in place

  mdFabToolbarElement: any;
  mdFabBackgroundElement: any;
  mdFabTriggerElement: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    this.mdFabToolbarElement = $(this.element.nativeElement.querySelector('md-fab-toolbar'));
    addResizeListener(this.mdFabToolbarElement[0], this.triggerFabResize);
    this.destroyRef.onDestroy(() => {
        removeResizeListener(this.mdFabToolbarElement[0], this.triggerFabResize); // eslint-disable-line no-undef
    });
    this.initElements();
  }

  initElements(...rest: any[]): any {
    setTimeout(() => {
        this.mdFabBackgroundElement = $(this.mdFabToolbarElement[0].querySelector('.md-fab-toolbar-background'));
        this.mdFabTriggerElement = $(this.mdFabToolbarElement[0].querySelector('md-fab-trigger button'));
        if (!this.mdFabBackgroundElement || !this.mdFabBackgroundElement[0]) {
            this.initElements();
        } else {
            this.triggerFabResize();
        }
    });
  }

  triggerFabResize = (...rest: any[]): any => {
    if (!this.mdFabBackgroundElement || !this.mdFabBackgroundElement[0]) {
        return;
    }
    var ctrl: any = this.mdFabToolbarElement.controller('mdFabToolbar');
    if (ctrl.isOpen) {
        if (!this.mdFabBackgroundElement[0].offsetWidth) {
            mdFabToolbarAnimation.addClass(this.mdFabToolbarElement, 'md-is-open', function () {
            });
        } else {
            var color: any = window.getComputedStyle(this.mdFabTriggerElement[0]).getPropertyValue('background-color'); //eslint-disable-line

            var width: any = this.mdFabToolbarElement[0].offsetWidth;
            var scale: any = 2 * (width / this.mdFabTriggerElement[0].offsetWidth);
            this.mdFabBackgroundElement[0].style.backgroundColor = color;
            this.mdFabBackgroundElement[0].style.borderRadius = width + 'px';

            var transform: any = this.mdFabBackgroundElement[0].style.transform;
            var targetTransform: any = 'scale(' + scale + ')';
            if (!transform || !angular.equals(transform, targetTransform)) {
                this.mdFabBackgroundElement[0].style.transform = targetTransform;
            }
        }
    }
  };
}
