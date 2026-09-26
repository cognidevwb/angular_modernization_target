import { Component, model, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS directive `tbDashboardToolbar` (src/app/dashboard/dashboard-toolbar.directive.js).
 *
 * The legacy one was an AngularJS Material `md-fab-toolbar`: a small trigger fab that, when
 * `toolbarOpened`, grows into a toolbar holding the projected dashboard actions. The fab-grow
 * animation (mdFabToolbarAnimation and its resize re-scaling) has no Angular Material
 * counterpart: the toolbar opens and closes in place, with the same sizes as the legacy styles.
 */
@Component({
  selector: 'tb-dashboard-toolbar',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './tb-dashboard-toolbar.directive.html',
  styles: [`
    :host { display: block; }
    .tb-fab-toolbar-wrapper { position: relative; height: 84px; overflow: hidden; }
    .tb-fab-toolbar-content {
      height: 80px; min-height: 80px; background-color: #305680; color: #fff;
      transition: opacity .3s cubic-bezier(.55, 0, .55, .2);
    }
    .tb-fab-toolbar-content.tb-closed { opacity: 0; pointer-events: none; }
    .tb-fab-actions { width: 100%; height: 100%; padding: 0; font-size: 16px; }
    .md-fab-action-item { width: 100%; height: 80px; }
    .tb-fab-trigger { position: absolute; top: 0; right: 0; }
    .tb-fab-trigger button { margin: 4px 4px 0 0; opacity: .5; transition: opacity .3s cubic-bezier(.55, 0, .55, .2) .2s; }
    .tb-fab-trigger button:hover { opacity: 1; }
    :host ::ng-deep .tb-dashboard-action-panels { flex-direction: column-reverse; height: 80px; }
    :host ::ng-deep .tb-dashboard-action-panel { flex-direction: row-reverse; min-width: 0; height: 40px; }
    :host ::ng-deep .tb-dashboard-action-panel div { height: 40px; }
    :host ::ng-deep .tb-dashboard-action-panel tb-states-component { pointer-events: all; }
    @media (min-width: 960px) {
      :host ::ng-deep .tb-dashboard-action-panels { flex-direction: row-reverse; height: 46px; }
      :host ::ng-deep .tb-dashboard-action-panel,
      :host ::ng-deep .tb-dashboard-action-panel div { height: 46px; }
      .tb-fab-toolbar-wrapper { height: 50px; }
      .tb-fab-toolbar-content { height: 50px; min-height: 50px; }
      .md-fab-action-item { height: 46px; }
      .is-fullscreen .tb-fab-toolbar-wrapper,
      .is-fullscreen .tb-fab-toolbar-content { height: 64px; min-height: 64px; }
    }
  `],
})
export class TbDashboardToolbarDirective {
  readonly toolbarOpened = model<any>();
  readonly forceFullscreen = model<any>();
  readonly onTriggerClick = output<any>();
}
