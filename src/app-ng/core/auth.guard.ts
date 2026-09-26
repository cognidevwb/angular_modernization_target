import { inject } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivateFn, Router } from '@angular/router';
import { LoginService } from '../feature/api/services/login.service';
import { UserService } from '../feature/api/services/user.service';
import { RootState } from '../root-state';
import { goState } from '../state-paths';

/**
 * The legacy `$stateChangeStart` handler (app.run), as the guard every route
 * passes: it waits for the user to load, sends an anonymous visitor of a
 * private screen to the login (remembering where they were going), a signed-in
 * one of a public screen to their default place, and one without the state's
 * authority to the forbidden dialog. The route's data carries what ui-router's
 * state did: `state`, `module`, `auth`.
 */
function params(route: ActivatedRouteSnapshot): Record<string, any> {
  const all: Record<string, any> = {};
  for (let r: ActivatedRouteSnapshot | null = route; r; r = r.parent) {
    Object.assign(all, r.queryParams, r.params);
  }
  return all;
}

function userLoaded(users: UserService, rootScope: RootState): Promise<void> {
  if (users.isUserLoaded() === true) {
    return Promise.resolve();
  }
  return new Promise((resolve) => {
    const off = rootScope.$on('userLoaded', () => {
      off();
      resolve();
    });
  });
}

export const authGuard: CanActivateFn = async (route) => {
  const users = inject(UserService);
  const login = inject(LoginService);
  const router = inject(Router);
  const rootScope = inject(RootState);
  const data = route.data ?? {};
  const to = { name: data['state'], module: data['module'], auth: data['auth'], data };
  const toParams = params(route);
  const publicId = route.queryParams['publicId'];
  const activateToken = route.queryParams['activateToken'];
  if (to.name === 'login.createPassword' && activateToken && activateToken.length) {
    users.setUserFromJwtToken(null, null, false);
  }
  await userLoaded(users, rootScope);
  const gotoPublic = async (name: string, p: Record<string, any>): Promise<boolean> => {
    if (name === 'login') {
      try {
        await login.loadOAuth2Clients();
      } catch {
        // the legacy app went to the login either way
      }
    }
    await goState(router, name, p);
    return false;
  };
  if (users.isAuthenticated()) {
    if (users.isPublic() && users.parsePublicId() !== publicId) {
      if (publicId && publicId.length > 0) {
        users.setUserFromJwtToken(null, null, false);
        users.reloadUser();
      } else {
        users.logout();
      }
      return false;
    }
    if (users.forceDefaultPlace(to, toParams)) {
      users.gotoDefaultPlace(toParams);
      return false;
    }
    if (to.module === 'public') {
      users.gotoDefaultPlace(toParams);
      return false;
    }
    if (Array.isArray(to.auth) && to.auth.indexOf(users.getAuthority()) === -1) {
      rootScope.$broadcast('forbidden');
      return false;
    }
    if (to.name === 'home.dashboards.dashboard' && rootScope['forceFullscreen']) {
      await goState(router, 'dashboard', toParams);
      return false;
    }
    return true;
  }
  if (publicId && publicId.length > 0) {
    users.setUserFromJwtToken(null, null, false);
    users.reloadUser();
    return false;
  }
  if (to.module === 'private') {
    users.setRedirectParams({ toName: to.name, params: toParams });
    return gotoPublic('login', toParams);
  }
  return true;
};
