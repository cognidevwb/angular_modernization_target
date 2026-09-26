import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Title } from '@angular/platform-browser';
import { ActivatedRouteSnapshot, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';
import { UserService } from './feature/api/services/user.service';
import { RootState } from './root-state';
import { showConfirm } from './feature/rulechain/confirm-dialog/confirm-dialog.component';
import { goState } from './state-paths';

/**
 * The root shell: the page (`<ui-view>` in the legacy index.html) and what
 * app.run kept watching — the page title after each navigation, the
 * `unauthenticated` / `authenticated` events (to the login, or the user's
 * default place) and `forbidden` (the access dialog) — and its iframe setup
 * (iframeMode, and the widget editor preview's editWidgetInfo / widgetEditMode).
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
  private readonly dialog = inject(MatDialog);
  private forbiddenDialogOpen = false;

  constructor() {
    this.rootScope['pageTitle'] = 'ThingsBoard';
    this.initIframeMode();
    this.router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => {
      this.trackPublicDashboard();
      this.updateTitle();
    });
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

  /**
   * app.run's iframe setup: a page running in a frame is in iframe mode; in the widget editor's preview frame
   * (its `data-widget` attribute holds the edited widget) it is also in widget edit mode.
   */
  private initIframeMode(): void {
    let frame: Element | null = null;
    try {
      frame = window.frameElement;
    } catch {
      // a cross-origin parent: not framed by this app
    }
    this.rootScope['iframeMode'] = false;
    if (frame) {
      this.rootScope['iframeMode'] = true;
      const dataWidgetAttr = frame.getAttribute('data-widget');
      if (dataWidgetAttr) {
        this.rootScope['editWidgetInfo'] = JSON.parse(dataWidgetAttr);
        this.rootScope['widgetEditMode'] = true;
      }
    }
  }

  private updateTitle(): void {
    const snap = this.deepestSnapshot();
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

  /** app.run's `$stateChangeSuccess`: a public user on a dashboard keeps `publicId` in the URL and remembers the dashboard. */
  private trackPublicDashboard(): void {
    const snap = this.deepestSnapshot();
    if (this.users.isPublic() && snap?.data?.['state'] === 'dashboard') {
      const publicId = this.users.getPublicId();
      if (snap.queryParams['publicId'] !== publicId) {
        this.router.navigate([], { queryParams: { publicId }, queryParamsHandling: 'merge', replaceUrl: true });
      }
      this.users.updateLastPublicDashboardId(snap.params['dashboardId']);
    }
  }

  private deepestSnapshot(): ActivatedRouteSnapshot | null {
    let snap: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    while (snap?.firstChild) {
      snap = snap.firstChild;
    }
    return snap;
  }

  /** app.run's forbidden dialog (one at a time): Sign in logs the user out to the login page. */
  private showForbidden(): void {
    if (this.forbiddenDialogOpen) {
      return;
    }
    this.forbiddenDialogOpen = true;
    const keys = ['access.access-forbidden', 'access.access-forbidden-text', 'action.cancel', 'action.sign-in'];
    this.translate.get(keys).subscribe((t: any) => {
      showConfirm(this.dialog, { title: t[keys[0]], htmlContent: t[keys[1]], cancel: t[keys[2]], ok: t[keys[3]] }).then(
        () => {
          this.forbiddenDialogOpen = false;
          this.users.logout();
        },
        () => {
          this.forbiddenDialogOpen = false;
        },
      );
    });
  }
}
