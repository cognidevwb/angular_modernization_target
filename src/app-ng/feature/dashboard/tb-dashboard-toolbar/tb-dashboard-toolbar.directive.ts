import { Component, model, output, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import $ from 'jquery';
import { isEqual } from 'lodash-es';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Resize listeners ported to the native ResizeObserver API (the legacy globals are not available).
const resizeObservers = new WeakMap<Element, ResizeObserver>();
function addResizeListener(el: Element, fn: () => void): void {
    const observer = new ResizeObserver(() => fn());
    observer.observe(el);
    resizeObservers.set(el, observer);
}
function removeResizeListener(el: Element, _fn: () => void): void {
    const observer = resizeObservers.get(el);
    if (observer) {
        observer.disconnect();
        resizeObservers.delete(el);
    }
}

// Helpers at the legacy file's top level, beside the registration (as written).
function DashboardToolbarController(this: any, $scope?: any, $element?: any, $timeout?: any, mdFabToolbarAnimation?: any) {

    let vm: any = this;

    vm.mdFabToolbarElement = $($element[0].querySelector('md-fab-toolbar'));

    function initElements() {
        $timeout(function() {
            vm.mdFabBackgroundElement = $(vm.mdFabToolbarElement[0].querySelector('.md-fab-toolbar-background'));
            vm.mdFabTriggerElement = $(vm.mdFabToolbarElement[0].querySelector('md-fab-trigger button'));
            if (!vm.mdFabBackgroundElement || !vm.mdFabBackgroundElement[0]) {
                initElements();
            } else {
                triggerFabResize();
            }
        });
    }

    addResizeListener(vm.mdFabToolbarElement[0], triggerFabResize); // eslint-disable-line no-undef

    $scope.$on("$destroy", function () {
        removeResizeListener(vm.mdFabToolbarElement[0], triggerFabResize); // eslint-disable-line no-undef
    });

    initElements();

    function triggerFabResize() {
        if (!vm.mdFabBackgroundElement || !vm.mdFabBackgroundElement[0]) {
            return;
        }
        var ctrl: any = vm.mdFabToolbarElement.controller('mdFabToolbar');
        if (ctrl.isOpen) {
            if (!vm.mdFabBackgroundElement[0].offsetWidth) {
                mdFabToolbarAnimation.addClass(vm.mdFabToolbarElement, 'md-is-open', function () {
                });
            } else {
                var color: any = window.getComputedStyle(vm.mdFabTriggerElement[0]).getPropertyValue('background-color'); //eslint-disable-line

                var width: any = vm.mdFabToolbarElement[0].offsetWidth;
                var scale: any = 2 * (width / vm.mdFabTriggerElement[0].offsetWidth);
                vm.mdFabBackgroundElement[0].style.backgroundColor = color;
                vm.mdFabBackgroundElement[0].style.borderRadius = width + 'px';

                var transform: any = vm.mdFabBackgroundElement[0].style.transform;
                var targetTransform: any = 'scale(' + scale + ')';
                if (!transform || !isEqual(transform, targetTransform)) {
                    vm.mdFabBackgroundElement[0].style.transform = targetTransform;
                }
            }
        }
    }
}

/**
 * Ported from the AngularJS directive `tbDashboardToolbar` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-dashboard-toolbar',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './tb-dashboard-toolbar.directive.html',
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TbDashboardToolbarDirective {
  readonly toolbarOpened = model<any>();
  readonly forceFullscreen = model<any>();
  readonly onTriggerClick = output<any>();

  // TODO(port): elements not resolved to a component: md-fab-toolbar, md-fab-trigger, md-fab-actions
  // TODO(port): template: 1 × md-fab-actions left in place
  // TODO(port): template: 1 × md-fab-trigger left in place

  restrict: any = "E";
  transclude: any = true;
  bindToController: any = {
            toolbarOpened: '=',
            forceFullscreen: '=',
            onTriggerClick: '&'
        };
  controller: any = DashboardToolbarController;
  controllerAs: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
