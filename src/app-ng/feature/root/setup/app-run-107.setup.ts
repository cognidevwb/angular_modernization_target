import { inject } from '@angular/core';
import { LoginService } from '../../api/services/login.service';
import { MatDialog } from '@angular/material/dialog';
import { RootState } from '../../../root-state';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';

/**
 * Ported from the AngularJS run block `app-run-107` (module `thingsboard`) in src/app/app.js:107.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function appRun107(): void {
  const rootScope = inject(RootState);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView
  // TODO(port): '$injector' — inject() at the use site
  const router = inject(Router);
  // TODO(port): '$log' — console
  const dialog = inject(MatDialog);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  // TODO(port): '$q' — use Promise, or an Observable
  const loginService = inject(LoginService);
  const userService = inject(UserService);
  const translate = inject(TranslateService);

  // TODO(port): the AngularJS code this class replaces, from src/app/app.js:107. Port it, then delete this block.
  /* ORIGINAL
function AppRun($rootScope, $window, $injector, $location, $log, $state, $mdDialog, $filter, $q, loginService, userService, $translate) {

    $window.Flow = Flow;
    var frame = null;
    try {
        frame = $window.frameElement;
    } catch(e) {
        // ie11 fix
    }

    var forbiddenDialog = null;

    $rootScope.iframeMode = false;

    if (frame) {
        $rootScope.iframeMode = true;
        var dataWidgetAttr = angular.element(frame).attr('data-widget');
        if (dataWidgetAttr) {
            $rootScope.editWidgetInfo = angular.fromJson(dataWidgetAttr);
            $rootScope.widgetEditMode = true;
        }
    }

    initWatchers();

    var skipStateChange = false;

    function initWatchers() {
        $rootScope.unauthenticatedHandle = $rootScope.$on('unauthenticated', function (event, doLogout) {
            if (doLogout) {
                gotoPublicModule('login');
            } else {
                UrlHandler($injector, $location);
            }
        });

        $rootScope.authenticatedHandle = $rootScope.$on('authenticated', function () {
            UrlHandler($injector, $location);
        });

        $rootScope.forbiddenHandle = $rootScope.$on('forbidden', function () {
            showForbiddenDialog();
        });

        $rootScope.stateChangeStartHandle = $rootScope.$on('$stateChangeStart', function (evt, to, params) {

            if (skipStateChange) {
                skipStateChange = false;
                return;
            }

            function waitForUserLoaded() {
                if ($rootScope.userLoadedHandle) {
                    $rootScope.userLoadedHandle();
                }
                $rootScope.userLoadedHandle = $rootScope.$on('userLoaded', function () {
                    $rootScope.userLoadedHandle();
                    $state.go(to.name, params);
                });
            }

            function reloadUserFromPublicId() {
                userService.setUserFromJwtToken(null, null, false);
                waitForUserLoaded();
                userService.reloadUser();
            }

            var locationSearch = $location.search();
            var publicId = locationSearch.publicId;
            var activateToken = locationSearch.activateToken;

            if (to.url === '/createPassword?activateToken' && activateToken && activateToken.length) {
                userService.setUserFromJwtToken(null, null, false);
            }

            if (userService.isUserLoaded() === true) {
                if (userService.isAuthenticated()) {
                    if (userService.isPublic()) {
                        if (userService.parsePublicId() !== publicId) {
                            evt.preventDefault();
                            if (publicId && publicId.length > 0) {
                                reloadUserFromPublicId();
                            } else {
                                userService.logout();
                            }
                            return;
                        }
                    }
                    if (userService.forceDefaultPlace(to, params)) {
                        evt.preventDefault();
                        gotoDefaultPlace(params);
                    } else {
                        var authority = userService.getAuthority();
                        if (to.module === 'public') {
                            evt.preventDefault();
                            gotoDefaultPlace(params);
                        } else if (angular.isDefined(to.auth) &&
                            to.auth.indexOf(authority) === -1) {
                            evt.preventDefault();
                            showForbiddenDialog();
                        } else if (to.redirectTo) {
                            evt.preventDefault();
                            $state.go(to.redirectTo, params);
                        } else if (to.name === 'home.dashboards.dashboard' && $rootScope.forceFullscreen) {
                            evt.preventDefault();
                            $state.go('dashboard', params);
                        }
                    }
                } else {
                    if (publicId && publicId.length > 0) {
                        evt.preventDefault();
                        reloadUserFromPublicId();
                    } else if (to.module === 'private') {
                        evt.preventDefault();
                        var redirectParams = {};
                        redirectParams.toName = to.name;
                        redirectParams.params = params;
                        userService.setRedirectParams(redirectParams);
                        gotoPublicModule('login', params);
                    } else {
                        evt.preventDefault();
                        gotoPublicModule(to.name, params);
                    }
                }
            } else {
                evt.preventDefault();
                waitForUserLoaded();
            }
        })

        $rootScope.pageTitle = 'ThingsBoard';

        $rootScope.stateChangeSuccessHandle = $rootScope.$on('$stateChangeSuccess', function (evt, to, params) {
            if (userService.isPublic() && to.name === 'dashboard') {
                $location.search('publicId', userService.getPublicId());
                userService.updateLastPublicDashboardId(params.dashboardId);
            }
            if (angular.isDefined(to.data.pageTitle)) {
                $translate(to.data.pageTitle).then(function (translation) {
                    $rootScope.pageTitle = 'ThingsBoard | ' + translation;
                }, function (translationId) {
                    $rootScope.pageTitle = 'ThingsBoard | ' + translationId;
                });
            }
        })
    }

    function gotoDefaultPlace(params) {
        userService.gotoDefaultPlace(params);
    }

    function gotoPublicModule(name, params) {
        let tasks = [];
        if (name === "login") {
            tasks.push(loginService.loadOAuth2Clients());
        }
        $q.all(tasks).then(
            () => {
                skipStateChange = true;
                $state.go(name, params);
            },
            () => {
                skipStateChange = true;
                $state.go(name, params);
            }
        );
    }

    function showForbiddenDialog() {
        if (forbiddenDialog === null) {
            $translate(['access.access-forbidden',
                'access.access-forbidden-text',
                'action.cancel',
                'action.sign-in']).then(function (translations) {
                if (forbiddenDialog === null) {
                    forbiddenDialog = $mdDialog.confirm()
                        .title(translations['access.access-forbidden'])
                        .htmlContent(translations['access.access-forbidden-text'])
                        .cancel(translations['action.cancel'])
                        .ok(translations['action.sign-in']);
                    $mdDialog.show(forbiddenDialog).then(function () {
                        forbiddenDialog = null;
                        userService.logout();
                    }, function () {
                        forbiddenDialog = null;
                    });
                }
            });
        }
    }
}
  */
}
