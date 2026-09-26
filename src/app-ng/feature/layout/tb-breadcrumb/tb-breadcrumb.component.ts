import { Component, inject, input, ChangeDetectionStrategy } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { TranslateService } from '@ngx-translate/core';
import { BreadcrumbIconPipe } from '../pipes/breadcrumb-icon.pipe';
import { BreadcrumbLabelPipe } from '../pipes/breadcrumb-label.pipe';
import { currentStateName, stateHref } from '../../../state-paths';

interface Step {
  name: string;
  label: string;
  link: string;
}

/**
 * The `ncy-breadcrumb` of the home toolbar (angular-breadcrumb with src/app/layout/breadcrumb.tpl.html):
 * one step per state from `home` (skipped, the `prefixStateName`) down to the current one, each state's
 * parent by its dotted name. A step's label is the state's `breadcrumb` JSON with its `{{ }}` interpolated
 * against the routed screen (`vm` in the legacy view scope); every step but the last links to its state.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-breadcrumb',
  standalone: true,
  imports: [RouterLink, MatIconModule, BreadcrumbIconPipe, BreadcrumbLabelPipe],
  template: `
    @let all = steps();
    <div flex layout="row" layout-align="start center" class="tb-breadcrumb">
      @if (all.length) {
        <h1 flex hide-gt-sm>{{ all[all.length - 1].label | breadcrumbLabel }}</h1>
      }
      @for (step of all; track step.name; let last = $last) {
        <span hide-xs hide-sm>
          @if (!last) {
            <a [routerLink]="step.link">
              @if (step.label | breadcrumbIcon; as icon) {
                <mat-icon class="material-icons" [attr.aria-label]="icon">{{ icon }}</mat-icon>
              }
              {{ step.label | breadcrumbLabel }}
            </a>
          } @else {
            <span>
              @if (step.label | breadcrumbIcon; as icon) {
                <mat-icon class="material-icons" [attr.aria-label]="icon">{{ icon }}</mat-icon>
              }
              {{ step.label | breadcrumbLabel }}</span>
          }
          @if (!last) {
            <span class="divider"> > </span>
          }
        </span>
      }
    </div>
  `,
})
export class TbBreadcrumbComponent {
  /** The routed screen's instance: the `vm` a label's `{{ }}` reads. */
  readonly view = input<any>();

  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  steps(): Step[] {
    const current = currentStateName(this.router);
    if (!current) {
      return [];
    }
    const labels = this.stateLabels();
    const parts = current.split('.');
    const steps: Step[] = [];
    for (let i = 1; i <= parts.length; i++) {
      const name = parts.slice(0, i).join('.');
      if (name === 'home' || !labels[name]) {
        continue;
      }
      steps.push({ name, label: this.interpolate(labels[name]), link: stateHref(this.router, name) });
    }
    return steps;
  }

  /** Each state's breadcrumb label, from the route table. */
  private stateLabels(): Record<string, string> {
    const out: Record<string, string> = {};
    const walk = (routes: any[] | undefined) => {
      for (const r of routes ?? []) {
        if (r.data?.state && r.data?.breadcrumb) {
          out[r.data.state] = r.data.breadcrumb;
        }
        walk(r.children);
      }
    };
    walk(this.router.config);
    return out;
  }

  /** `{{ expr }}` in the label JSON, evaluated with `vm` = the routed screen and the `translate` filter. */
  private interpolate(label: string): string {
    if (label.indexOf('{{') === -1) {
      return label;
    }
    const obj = JSON.parse(label);
    obj.label = String(obj.label).replace(/\{\{([\s\S]*?)\}\}/g, (_m, expr: string) => {
      const value = this.evaluate(expr);
      return value === undefined || value === null ? '' : String(value);
    });
    return JSON.stringify(obj);
  }

  private evaluate(expr: string): any {
    const vm = this.view();
    if (!vm) {
      return '';
    }
    // `'key' | translate` is the only filter the state labels use.
    const js = expr.replace(/('(?:[^'\\]|\\.)*')\s*\|\s*translate/g, 'tr($1)');
    try {
      // The labels are the app's own route data (static strings), not user input.
      return new Function('vm', 'tr', `try { return (${js}); } catch (e) { return ''; }`)(vm, (key: string) => this.translate.instant(key));
    } catch {
      return '';
    }
  }
}
