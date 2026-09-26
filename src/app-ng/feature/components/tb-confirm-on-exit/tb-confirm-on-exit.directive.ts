import { DestroyRef, Directive, ElementRef, HostListener, Injectable, inject, input, output } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, CanDeactivateFn } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../api/services/user.service';
import { showConfirm } from '../../rulechain/confirm-dialog/confirm-dialog.component';

/** Every live `tb-confirm-on-exit`, so one route guard can ask them all. */
@Injectable({ providedIn: 'root' })
export class ConfirmOnExitRegistry {
  private readonly active = new Set<TbConfirmOnExitDirective>();

  add(directive: TbConfirmOnExitDirective): void {
    this.active.add(directive);
  }

  remove(directive: TbConfirmOnExitDirective): void {
    this.active.delete(directive);
  }

  /** The first registered page with unsaved changes, if any. */
  dirtyOne(): TbConfirmOnExitDirective | undefined {
    for (const directive of this.active) {
      if (directive.hasUnsavedChanges()) {
        return directive;
      }
    }
    return undefined;
  }
}

/**
 * The legacy `$stateChangeStart` check as a route guard: leaving a page whose
 * `tb-confirm-on-exit` form (or `isDirty`) has changes asks first; on OK the
 * changes are dropped (form set pristine / `isDirtyChange(false)`) and the navigation goes on.
 */
export const confirmOnExitGuard: CanDeactivateFn<unknown> = () => {
  const dirty = inject(ConfirmOnExitRegistry).dirtyOne();
  if (!dirty) {
    return true;
  }
  return dirty.confirmExit();
};

/**
 * Ported from the AngularJS directive `tbConfirmOnExit` (module `thingsboard.directives.confirmOnExit`)
 * in src/app/components/confirm-on-exit.directive.js:16 — an attribute directive: warns before the
 * page unloads (beforeunload) or the route changes (confirmOnExitGuard) while there are unsaved changes.
 * The changes are the host form's dirty state (the `<form>` it sits on, or `[confirmForm]`), or `[isDirty]`.
 */
@Directive({
  selector: '[tb-confirm-on-exit]',
  standalone: true,
})
export class TbConfirmOnExitDirective {
  /** A form to watch instead of the host `<form>` (an NgForm, or anything with `dirty`). */
  readonly confirmForm = input<any>(undefined);
  readonly isDirty = input<boolean | undefined>(undefined);
  readonly isDirtyChange = output<boolean>();

  private readonly hostForm = inject(NgForm, { optional: true, self: true });
  private readonly element = inject(ElementRef);
  private readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);
  private readonly userService = inject(UserService);
  private readonly registry = inject(ConfirmOnExitRegistry);

  constructor() {
    this.registry.add(this);
    inject(DestroyRef).onDestroy(() => this.registry.remove(this));
    this.guardRoute();
  }

  /** The legacy `$window.onbeforeunload`: the browser's own leave-page prompt. */
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent): string | undefined {
    if (this.hasUnsavedChanges()) {
      const message = this.translate.instant('confirm-on-exit.message');
      event.preventDefault();
      event.returnValue = message;
      return message;
    }
    return undefined;
  }

  hasUnsavedChanges(): boolean {
    if (!this.userService.isAuthenticated()) {
      return false;
    }
    const form = this.form();
    return !!(form && (form.dirty || form.$dirty)) || this.dirtyFlag();
  }

  /** Asks to leave; on OK drops the changes. Resolves whether the navigation may go on. */
  confirmExit(): Promise<boolean> {
    return showConfirm(this.dialog, {
      title: this.translate.instant('confirm-on-exit.title'),
      htmlContent: this.translate.instant('confirm-on-exit.html-message'),
      cancel: this.translate.instant('action.cancel'),
      ok: this.translate.instant('action.ok'),
    }).then(
      () => {
        const form = this.form();
        if (form) {
          form.form ? form.form.markAsPristine() : form.markAsPristine?.();
        } else {
          this.isDirtyChange.emit(false);
          this.element.nativeElement.setAttribute('is-dirty', 'false');
        }
        return true;
      },
      () => false,
    );
  }

  private form(): any {
    return this.confirmForm() ?? this.hostForm;
  }

  /** `[isDirty]`, or the host's `is-dirty` attribute (`[attr.is-dirty]`) when that is how it is bound. */
  private dirtyFlag(): boolean {
    const bound = this.isDirty();
    if (bound !== undefined) {
      return !!bound;
    }
    return this.element.nativeElement.getAttribute('is-dirty') === 'true';
  }

  /** Adds the leave check to the route this page is on (once), as the legacy `$stateChangeStart` hook did. */
  private guardRoute(): void {
    const config = inject(ActivatedRoute, { optional: true })?.routeConfig;
    if (config && !config.canDeactivate?.includes(confirmOnExitGuard)) {
      config.canDeactivate = [...(config.canDeactivate ?? []), confirmOnExitGuard];
    }
  }
}
