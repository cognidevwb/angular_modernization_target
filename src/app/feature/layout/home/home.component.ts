import { PUBLIC_PATH } from '../../../app-globals';
import { mdMedia } from '../../../core/md-media';
import { Component, forwardRef, inject, signal, ChangeDetectionStrategy } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { FullscreenService } from '../../common/services/fullscreen.service';
import { LoginService } from '../../api/services/login.service';
import { RootState } from '../../../root-state';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TbBreadcrumbComponent } from '../tb-breadcrumb/tb-breadcrumb.component';
import { UserService } from '../../api/services/user.service';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbSideMenuDirective } from '../../components/tb-side-menu/tb-side-menu.directive';
import { TbNoAnimateDirective } from '../../components/tb-no-animate/tb-no-animate.directive';
import { TbEntitySubtypeSelectDirective } from '../../entity/tb-entity-subtype-select/tb-entity-subtype-select.directive';
import { TbUserMenuDirective } from '../tb-user-menu/tb-user-menu.directive';
import $ from 'jquery';
import { MatButtonModule } from '@angular/material/button';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import { filter } from 'rxjs';
import { isEqual } from 'lodash-es';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $animate: any;
declare let $scope: any;
declare let $window: any;

/**
 * Ported from the AngularJS controller `HomeController` (module `thingsboard.home`) in src/app/layout/index.js:67.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 4 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'home',
  standalone: true,
  imports: [RouterOutlet, TbBreadcrumbComponent, TranslatePipe, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatSidenavModule, CommonModule, FormsModule, forwardRef(() => TbSideMenuDirective), forwardRef(() => TbNoAnimateDirective), forwardRef(() => TbEntitySubtypeSelectDirective), forwardRef(() => TbUserMenuDirective)],
  templateUrl: './home.component.html',
})
export class HomeComponent {
  protected readonly loginService = inject(LoginService);
  protected readonly userService = inject(UserService);
  protected readonly deviceService = inject(DeviceService);
  protected readonly fullscreen = inject(FullscreenService);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly element = inject(ElementRef);
  protected readonly rootScope = inject(RootState);
  protected readonly document = inject(DOCUMENT);
  protected readonly router = inject(Router);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  protected readonly breakpoints = inject(BreakpointObserver);
  // TODO(port): '$animate' — @angular/animations

  Fullscreen: any;
  logoSvg: any = PUBLIC_PATH + 'svg/logo_title_white.svg';
  isShowSidenav: any = false;
  isLockSidenav: any = false;
  /** The screen in the content outlet (the `vm` its breadcrumb label reads). */
  readonly routedView = signal<any>(null);

  /** `forceFullscreen` in the legacy template: the `$rootScope` value. */
  get forceFullscreen(): any {
    return this.rootScope.forceFullscreen;
  }
  isGtSm: any;
  entitySubtypeWatch: any;
  private prevStateName: string | undefined;

  /** The legacy `$scope.searchConfig`: the object on `$rootScope`, read through the scope chain. */
  get searchConfig(): any {
    return this.rootScope.searchConfig;
  }

  // TODO(port): $scope.$broadcast — a scope event: call the service that listens
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    this.Fullscreen = this.fullscreen;
    if ((this.rootScope.searchConfig === undefined)) {
        this.rootScope.searchConfig = {
            searchEnabled: false,
            searchByEntitySubtype: false,
            searchEntityType: null,
            showSearch: false,
            searchText: "",
            searchEntitySubtype: ""
        };
    }
    this.displaySearchMode = this.displaySearchMode;
    this.displayEntitySubtypeSearch = this.displayEntitySubtypeSearch;
    this.openSidenav = this.openSidenav;
    this.goBack = this.goBack;
    this.searchTextUpdated = this.searchTextUpdated;
    this.sidenavClicked = this.sidenavClicked;
    this.toggleFullscreen = this.toggleFullscreen;
    this.openSearch = this.openSearch;
    this.closeSearch = this.closeSearch;
    this.router.events.pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd)).subscribe((event) => {
        this.watchEntitySubtype(false);
        let routeSnapshot: any = this.router.routerState.snapshot.root;
        while (routeSnapshot.firstChild) {
            routeSnapshot = routeSnapshot.firstChild;
        }
        const data: any = routeSnapshot.data;
        const stateName: string = data.state;
        if ((data.searchEnabled !== undefined)) {
            this.searchConfig.searchEnabled = data.searchEnabled;
            this.searchConfig.searchByEntitySubtype = data.searchByEntitySubtype;
            this.searchConfig.searchEntityType = data.searchEntityType;
            if (this.searchConfig.searchEnabled === false || stateName !== this.prevStateName) {
                this.searchConfig.showSearch = false;
                this.searchConfig.searchText = "";
                this.searchConfig.searchEntitySubtype = "";
            }
        } else {
            this.searchConfig.searchEnabled = false;
            this.searchConfig.searchByEntitySubtype = false;
            this.searchConfig.searchEntityType = null;
            this.searchConfig.showSearch = false;
            this.searchConfig.searchText = "";
            this.searchConfig.searchEntitySubtype = "";
        }
        this.watchEntitySubtype(this.searchConfig.searchByEntitySubtype);
        this.prevStateName = stateName;
    });
this.isGtSm = this.breakpoints.isMatched(mdMedia('gt-sm'));
    if (this.isGtSm) {
        this.isLockSidenav = true;
        this.setSidenavAnimationEnabled(false);
    }
this.breakpoints.observe(mdMedia('gt-sm')).subscribe((state) => {
    const isGtSm = state.matches;
    this.isGtSm = isGtSm;
    this.isLockSidenav = isGtSm;
    this.isShowSidenav = isGtSm;
    if (!isGtSm) {
        setTimeout(() => {
            this.setSidenavAnimationEnabled(true);
        }, 0, false);
    } else {
        this.setSidenavAnimationEnabled(false);
    }
});
  }

  private setSidenavAnimationEnabled(enabled: boolean): void {
    // Queried when used: the constructor runs before the template's elements exist.
    $('.tb-site-sidenav', $(this.element.nativeElement)).toggleClass('tb-no-animate', !enabled);
  }

  watchEntitySubtype(enableWatch?: any, ...rest: any[]): any {
    if (this.entitySubtypeWatch) {
        this.entitySubtypeWatch();
    }
    if (enableWatch) {
        const config: any = this.searchConfig;
        let currentVal = config.searchEntitySubtype;
        Object.defineProperty(config, 'searchEntitySubtype', {
            configurable: true,
            enumerable: true,
            get: () => currentVal,
            set: (newVal: any) => {
                const prevVal = currentVal;
                currentVal = newVal;
                if (!isEqual(newVal, prevVal)) {
                    this.rootScope.$broadcast('searchEntitySubtypeUpdated');
                }
            }
        });
        this.entitySubtypeWatch = () => {
            Object.defineProperty(config, 'searchEntitySubtype', {
                configurable: true,
                enumerable: true,
                writable: true,
                value: currentVal
            });
        };
    }
  }

  displaySearchMode = (...rest: any[]): any => {
    return this.searchConfig.searchEnabled &&
        this.searchConfig.showSearch;
  };

  displayEntitySubtypeSearch = (...rest: any[]): any => {
    return this.searchConfig.searchByEntitySubtype && this.isGtSm;
  };

  toggleFullscreen = (...rest: any[]): any => {
    if (this.fullscreen.isEnabled()) {
        this.fullscreen.cancel();
    } else {
        this.fullscreen.all();
    }
  };

  openSearch = (...rest: any[]): any => {
    if (this.searchConfig.searchEnabled) {
        this.searchConfig.showSearch = true;
        setTimeout(() => {
            $('#tb-search-text-input', $(this.element.nativeElement)).focus();
        });
    }
  };

  closeSearch = (...rest: any[]): any => {
    if (this.searchConfig.searchEnabled) {
        this.searchConfig.showSearch = false;
        if (this.searchConfig.searchText.length) {
            this.searchConfig.searchText = '';
            this.searchTextUpdated();
        }
    }
  };

  searchTextUpdated = (...rest: any[]): any => {
    this.rootScope.$broadcast('searchTextUpdated');
  };

  openSidenav = (...rest: any[]): any => {
    this.isShowSidenav = true;
  };

  goBack = (...rest: any[]): any => {
    window.history.back();
  };

  closeSidenav(...rest: any[]): any {
    this.isShowSidenav = false;
  }

  sidenavClicked = (...rest: any[]): any => {
    if (!this.isLockSidenav) {
        this.closeSidenav();
    }
  };
}
