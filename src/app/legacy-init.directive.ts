/**
 * AngularJS's `ng-init`: its statements run once, where the element is
 * created, in the element's own context (loop variables included). The port
 * writes `legacyInit (legacyInit)="<the statements>"`: the directive emits once
 * on init, and an event binding may assign as ng-init did. Written by the playbook.
 */
import { Directive, EventEmitter, OnInit, Output } from '@angular/core';

@Directive({ selector: '[legacyInit]', standalone: true })
export class LegacyInitDirective implements OnInit {
  @Output() readonly legacyInit = new EventEmitter<void>();

  ngOnInit(): void {
    this.legacyInit.emit();
  }
}
