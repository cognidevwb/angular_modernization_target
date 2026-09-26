/**
 * Ported from the AngularJS config block `index-config-29` (module `thingsboard.login`) in src/app/login/index.js:29.
 * Scaffolded by the playbook. TODO(port): a config block becomes provider configuration; a run block becomes an APP_INITIALIZER or a root service constructor. inject() below only works inside an injection context (an APP_INITIALIZER factory, a constructor).
 */
export function indexConfig29(): void {
  // TODO(port): '$stateProvider' — an AngularJS built-in with no Angular counterpart

  // TODO(port): the AngularJS code this class replaces, from src/app/login/index.js:29. Port it, then delete this block.
  /* ORIGINAL
function LoginRoutes($stateProvider) {
    $stateProvider.state('login', {
        url: '/login',
        module: 'public',
        views: {
            "@": {
                controller: 'LoginController',
                controllerAs: 'vm',
                templateUrl: loginTemplate
            }
        },
        data: {
            pageTitle: 'login.login'
        }
    }).state('login.resetPasswordRequest', {
        url: '/resetPasswordRequest',
        module: 'public',
        views: {
            "@": {
                controller: 'ResetPasswordRequestController',
                controllerAs: 'vm',
                templateUrl: resetPasswordRequestTemplate
            }
        },
        data: {
            pageTitle: 'login.request-password-reset'
        }
    }).state('login.resetPassword', {
        url: '/resetPassword?resetToken',
        module: 'public',
        views: {
            "@": {
                controller: 'ResetPasswordController',
                controllerAs: 'vm',
                templateUrl: resetPasswordTemplate
            }
        },
        data: {
            pageTitle: 'login.reset-password'
        }
    }).state('login.resetExpiredPassword', {
        url: '/resetExpiredPassword?resetToken',
        module: 'public',
        views: {
            "@": {
                controller: 'ResetPasswordController',
                controllerAs: 'vm',
                templateUrl: resetPasswordTemplate
            }
        },
        data: {
            expiredPassword: true,
            pageTitle: 'login.reset-password'
        }
    }).state('login.createPassword', {
        url: '/createPassword?activateToken',
        module: 'public',
        views: {
            "@": {
                controller: 'CreatePasswordController',
                controllerAs: 'vm',
                templateUrl: createPasswordTemplate
            }
        },
        data: {
            pageTitle: 'login.create-password'
        }
    });
}
  */
}
