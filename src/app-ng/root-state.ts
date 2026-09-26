import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/**
 * What the AngularJS app kept on `$rootScope`: values any screen reads
 * (`$root.loading` in a template, `$rootScope.x = …` in a service) and the
 * application-wide events (`$broadcast` / `$emit` / `$on`).
 *
 * A rewrite has no AngularJS scope tree, so both live here, in one
 * root-provided service: a value is a plain property, and an event goes to
 * every listener registered for its name, in the order they registered.
 * Written by the playbook (scaffold-units) for a pure AngularJS app.
 */
@Injectable({ providedIn: 'root' })
export class RootState {
  [key: string]: any;

  private readonly events = new Subject<{ name: string; args: any[] }>();

  /** Sends `name` to every `$on(name)` listener, with an AngularJS-shaped event first. */
  $broadcast(name: string, ...args: any[]): { name: string; defaultPrevented: boolean } {
    const event = { name, defaultPrevented: false, preventDefault() { this.defaultPrevented = true; } };
    this.events.next({ name, args: [event, ...args] });
    return event;
  }

  /** The same as `$broadcast`: the root has no parent to emit to. */
  $emit(name: string, ...args: any[]): { name: string; defaultPrevented: boolean } {
    return this.$broadcast(name, ...args);
  }

  /** Listens for `name`; the returned function stops listening (as AngularJS's deregistration did). */
  $on(name: string, listener: (...args: any[]) => void): () => void {
    const sub = this.events.subscribe((e) => {
      if (e.name === name) {
        listener(...e.args);
      }
    });
    return () => sub.unsubscribe();
  }

  /** AngularJS ran the digest here; Angular's change detection runs on its own. */
  $applyAsync(fn?: () => void): void {
    if (fn) {
      queueMicrotask(fn);
    }
  }

  /** As `$applyAsync`: the function runs, change detection follows. */
  $evalAsync(fn?: () => void): void {
    this.$applyAsync(fn);
  }

  /** No digest to trigger: runs `fn` now. */
  $apply(fn?: () => void): void {
    fn?.();
  }
}
