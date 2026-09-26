import { Component, inject } from '@angular/core';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { UserService } from '../../api/services/user.service';
import { linkAttrs } from '../../../legacy-link';
import { goState } from '../../../state-paths';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';

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
  protected readonly dialog = inject(MatDialog);
  protected readonly translate = inject(TranslateService);
  protected readonly router = inject(Router);
  protected readonly rootScope = inject(RootState);
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);

  confirmForm: any;

  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $state.go — $state.go: this.router.navigate([...])
  // TODO(port): link($scope, $element, $attributes) — `$element` is the element (ElementRef.nativeElement) and `$attributes` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.confirmForm = this.evalAttr(this.attrs.confirmForm);
    window.onbeforeunload = () => {
                if (this.userService.isAuthenticated() && ((this.confirmForm && this.confirmForm.$dirty) || this.evalAttr(this.attrs.isDirty))) {
                    return this.translate.instant('confirm-on-exit.message');
                }
                return undefined;
            };
    this.rootScope.on('$stateChangeStart', (event?: any, next?: any, current?: any, params?: any) => {
                if (this.userService.isAuthenticated() && ((this.confirmForm && this.confirmForm.$dirty) || this.evalAttr(this.attrs.isDirty))) {
                    event.preventDefault();
                    if (window.confirm(this.translate.instant('confirm-on-exit.html-message'))) {
                        if (this.confirmForm) {
                            this.confirmForm.$setPristine();
                        } else {
                            this.assignAttr(this.attrs.isDirty, false);
                            //$scope.isDirty = false;
                        }
                        goState(this.router, next.name, params);
                    }
                }
            });
  }

  private evalAttr(expr: string | undefined): any {
    if (!expr) {
      return undefined;
    }
    try {
      return new Function('with(this) { return (' + expr + '); }').call(this);
    } catch {
      return undefined;
    }
  }

  private assignAttr(expr: string | undefined, value: any): void {
    if (!expr) {
      return;
    }
    try {
      new Function('value', 'with(this) { ' + expr + ' = value; }').call(this, value);
    } catch {
      // ignore assignment errors
    }
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
