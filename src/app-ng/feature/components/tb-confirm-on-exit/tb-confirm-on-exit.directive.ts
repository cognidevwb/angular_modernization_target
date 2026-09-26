import { Component, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../api/services/user.service';
import { linkAttrs } from '../../../legacy-link';
import { goState } from '../../../state-paths';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $filter: any;
declare let $parse: any;
declare let $window: any;
declare let $scope: any;

/**
 * Ported from the AngularJS directive `tbConfirmOnExit` (module `thingsboard.directives.confirmOnExit`) in src/app/components/confirm-on-exit.directive.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-confirm-on-exit, [tb-confirm-on-exit]',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbConfirmOnExitDirective {
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$parse' — not in Angular: bind in the template
  protected readonly router = inject(Router);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);

  confirmForm: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): link($scope, $element, $attributes) — `$element` is the element (ElementRef.nativeElement) and `$attributes` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.confirmForm = $scope.$eval(this.attrs.confirmForm);
    $window.onbeforeunload = function () {
                if (this.userService.isAuthenticated() && ((this.confirmForm && this.confirmForm.$dirty) || $scope.$eval(this.attrs.isDirty))) {
                    return $filter('translate')('confirm-on-exit.message');
                }
                return undefined;
            }
    $scope.$on('$stateChangeStart', (event?: any, next?: any, current?: any, params?: any) => {
                if (this.userService.isAuthenticated() && ((this.confirmForm && this.confirmForm.$dirty) || $scope.$eval(this.attrs.isDirty))) {
                    event.preventDefault();
                    if (window.confirm($filter('translate')('confirm-on-exit.html-message'))) {
                        if (this.confirmForm) {
                            this.confirmForm.$setPristine();
                        } else {
                            var remoteSetter: any = $parse(this.attrs.isDirty).assign;
                            remoteSetter(this, false);
                            //$scope.isDirty = false;
                        }
                        goState(this.router, next.name, params);
                    }
                }
            });
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
