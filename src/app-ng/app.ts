import { Component, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { UserService } from './feature/api/services/user.service';
import { RootState } from './root-state';
import { goState } from './state-paths';

/**
 * The root shell: the page (`<ui-view>` in the legacy index.html) and what
 * app.run kept watching — the page title after each navigation, the
 * `unauthenticated` / `authenticated` events (to the login, or the user's
 * default place) and `forbidden` (the access dialog).
 */
@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  private readonly router = inject(Router);
  private readonly title = inject(Title);
  private readonly translate = inject(TranslateService);
  private readonly users = inject(UserService);
  private readonly rootScope = inject(RootState);

  constructor() {
    this.rootScope['pageTitle'] = 'ThingsBoard';
    this.rootScope['iframeMode'] = window.self !== window.top;
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => this.updateTitle());
    this.rootScope.$on('unauthenticated', (_event: any, doLogout: boolean) => {
      if (doLogout) {
        goState(this.router, 'login');
      } else {
        this.gotoDefaultPlaceWhenLoaded();
      }
    });
    this.rootScope.$on('authenticated', () => this.gotoDefaultPlaceWhenLoaded());
    this.rootScope.$on('forbidden', () => this.showForbidden());
  }

  private updateTitle(): void {
    let snap: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (snap?.firstChild) {
      snap = snap.firstChild;
    }
    const key = snap?.data?.['pageTitle'];
    if (key) {
      this.translate.get(key).subscribe((t: any) => {
        this.rootScope['pageTitle'] = 'ThingsBoard | ' + t;
        this.title.setTitle(this.rootScope['pageTitle']);
      });
    }
  }

  /** The legacy UrlHandler: the default place once the user is loaded. */
  private gotoDefaultPlaceWhenLoaded(): void {
    if (this.users.isUserLoaded() === true) {
      this.users.gotoDefaultPlace();
    } else {
      const off = this.rootScope.$on('userLoaded', () => {
        off();
        this.gotoDefaultPlaceWhenLoaded();
      });
    }
  }

  private showForbidden(): void {
    const keys = ['access.access-forbidden', 'access.access-forbidden-text'];
    this.translate.get(keys).subscribe((t: any) => {
      if (window.confirm(`${t[keys[0]]}\n\n${String(t[keys[1]]).replace(/<[^>]+>/g, '')}`)) {
        this.users.logout();
      }
    });
  }
}
