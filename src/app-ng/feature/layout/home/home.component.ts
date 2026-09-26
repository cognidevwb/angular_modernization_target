import { Component, forwardRef, inject } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { DeviceService } from '../../api/services/device.service';
import { ElementRef } from '@angular/core';
import { FullscreenService } from '../../common/services/fullscreen.service';
import { LoginService } from '../../api/services/login.service';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
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
  selector: 'home',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, MatSidenavModule, CommonModule, FormsModule, forwardRef(() => TbSideMenuDirective), forwardRef(() => TbNoAnimateDirective), forwardRef(() => TbEntitySubtypeSelectDirective), forwardRef(() => TbUserMenuDirective)],
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
  // TODO(port): elements not resolved to a component: md-sidenav
  // TODO(port): template: 1 × md-sidenav left in place
  // TODO(port): template: 2 × ng-cloak left in place

  protected siteSideNav: any;
  Fullscreen: any;
  logoSvg: any = '/assets/svg/logo_title_white.svg';
  isShowSidenav: any = false;
  isLockSidenav: any = false;
  forceFullscreen: any = false;
  isGtSm: any;
  entitySubtypeWatch: any;
  searchConfig: any;

  // TODO(port): $scope.$broadcast — a scope event: call the service that listens
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library

  constructor() {
    this.siteSideNav = $('.tb-site-sidenav', $(this.element.nativeElement));
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
    $scope.$on('$stateChangeSuccess', (evt?: any, to?: any, toParams?: any, from?: any) => {
        this.watchEntitySubtype(false);
        if ((to.data.searchEnabled !== undefined)) {
            this.searchConfig.searchEnabled = to.data.searchEnabled;
            this.searchConfig.searchByEntitySubtype = to.data.searchByEntitySubtype;
            this.searchConfig.searchEntityType = to.data.searchEntityType;
            if (this.searchConfig.searchEnabled === false || to.name !== from.name) {
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
    });
this.isGtSm = this.breakpoints.isMatched('gt-sm');
    if (this.isGtSm) {
        this.isLockSidenav = true;
        $animate.enabled(this.siteSideNav, false);
    }
$scope.$watch(() => { return this.breakpoints.isMatched('gt-sm'); }, (isGtSm?: any) => {
    this.isGtSm = isGtSm;
    this.isLockSidenav = isGtSm;
    this.isShowSidenav = isGtSm;
    if (!isGtSm) {
        setTimeout(() => {
            $animate.enabled(this.siteSideNav, true);
        }, 0, false);
    } else {
        $animate.enabled(this.siteSideNav, false);
    }
});
  }

  watchEntitySubtype(enableWatch?: any, ...rest: any[]): any {
    if (this.entitySubtypeWatch) {
        this.entitySubtypeWatch();
    }
    if (enableWatch) {
        this.entitySubtypeWatch = $scope.$watch('searchConfig.searchEntitySubtype', (newVal?: any, prevVal?: any) => {
            if (!angular.equals(newVal, prevVal)) {
                $scope.$broadcast('searchEntitySubtypeUpdated');
            }
        });
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
    $scope.$broadcast('searchTextUpdated');
  };

  openSidenav = (...rest: any[]): any => {
    this.isShowSidenav = true;
  };

  goBack = (...rest: any[]): any => {
    $window.history.back();
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
