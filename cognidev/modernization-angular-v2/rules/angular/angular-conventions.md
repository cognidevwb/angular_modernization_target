# Modern Angular conventions (what migrated code looks like in 2026)

Every file the migration produces follows this shape, so the deterministic
scaffold + the develop step stay consistent. This is the TARGET; legacy patterns
on the left migrate to the idioms on the right.

## File naming (Angular 20+)
The CLI dropped the `.component`/`.service` suffix for the root and generates
`app.ts` / `app.html` / `app.css` / `app.config.ts` / `app.routes.ts`. Keep type
suffixes for non-root where they aid clarity (`user.service.ts`,
`user-list.ts`). One component = one folder for non-trivial features.

## Standalone component (the unit of UI)
```ts
import { ChangeDetectionStrategy, Component, computed, inject, input, signal } from '@angular/core';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-card',
  changeDetection: ChangeDetectionStrategy.OnPush,   // default in v22; keep explicit
  template: `
    @if (user(); as u) {
      <h2>{{ u.name }}</h2>
      <ul>
        @for (role of u.roles; track role) { <li>{{ role }}</li> }
        @empty { <li>no roles</li> }
      </ul>
    } @else {
      <p>loading…</p>
    }
  `,
})
export class UserCard {
  // signal input (replaces @Input); .required() when mandatory
  readonly userId = input.required<string>();
  private readonly users = inject(UserService);     // inject() over constructor DI
  readonly user = signal<User | null>(null);
  readonly initial = computed(() => this.user()?.name?.[0] ?? '?');
}
```
- **No `NgModule`.** No `standalone: true` needed (it's the default).
- **Control flow** `@if/@for/@switch` in templates — `@for` MUST have `track`.
- **Inputs/outputs** are signal-based: `input()`, `input.required()`, `output()`,
  two-way `model()`. Queries are signals: `viewChild()`, `contentChild()`.
- **State** is signals (`signal`/`computed`/`effect`); reach for RxJS only for
  streams/async orchestration. `toSignal()`/`toObservable()` bridge the two.

## Service (injectable, signal-backed where it holds state)
```ts
import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly _users = signal<User[]>([]);
  readonly users = this._users.asReadonly();
  readonly count = computed(() => this._users().length);
  load() { /* http.get(...).subscribe → this._users.set(...) (or toSignal) */ }
}
```
- `providedIn: 'root'` (tree-shakable) — avoid NgModule providers.
- `provideHttpClient(withFetch())` in `app.config.ts`; never `HttpClientModule`.

## Bootstrap & config (no NgModule)
```ts
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app';
import { appConfig } from './app/app.config';
bootstrapApplication(App, appConfig);

// app.config.ts
import { ApplicationConfig, provideZonelessChangeDetection } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch } from '@angular/common/http';
import { routes } from './app.routes';
export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),               // zoneless; OnPush is default
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch()),
  ],
};
```

## Routing (lazy, standalone)
```ts
// app.routes.ts
import { Routes } from '@angular/router';
export const routes: Routes = [
  { path: '', loadComponent: () => import('./home/home').then(m => m.Home) },
  { path: 'users', loadChildren: () => import('./users/users.routes').then(m => m.USERS_ROUTES) },
];
```
- Route params → component inputs via `withComponentInputBinding()` (no manual
  `ActivatedRoute` plumbing for simple cases).

## Forms
- New forms: **Signal Forms** (stable v22) or typed Reactive Forms
  (`FormGroup`/`FormControl` with generics). Template-driven `ngModel` from
  AngularJS migrates to `model()` or reactive forms.

## Testing (Vitest)
- Unit/component tests run on **Vitest** via `@angular/build:unit-test`
  (`*.spec.ts`, `TestBed` still applies). Karma/Jasmine is gone. Playwright for e2e.

## What NOT to produce
- ❌ `NgModule`, `*ngIf`/`*ngFor`, constructor DI for new code, `HttpClientModule`,
  `zone.js` reliance, Karma config, `any`-typed templates. These are exactly the
  legacy patterns the migration removes.
