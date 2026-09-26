import { Directive, inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
// @ts-ignore
import auditLogDetailsDialogTemplate from '../../../../app/audit/audit-log-details-dialog.tpl.html';
// @ts-ignore
import auditLogRowTemplate from '../../../../app/audit/audit-log-row.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let scope: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAuditLogRow` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-audit-log-row]',
  standalone: true,
})
export class TbAuditLogRowDirective {
  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly typesRef: any = types;
  protected readonly dialog = inject(MatDialog);
  protected readonly document = inject(DOCUMENT);
  protected readonly element = inject(ElementRef);
  // TODO(port): AngularJS built-in filters in the template: date — use Angular pipes

  protected template: any = $templateCache.get(auditLogRowTemplate);
  auditLog: any;
  auditLogMode: any;
  types: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.auditLog = this.attrs.auditLog;
    this.auditLogMode = this.attrs.auditLogMode;
    this.types = this.typesRef;
    $compile($(this.element.nativeElement).contents())(this);
  }

  showAuditLogDetails($event?: any, ...rest: any[]): any {
    let vm = this;
    var onShowingCallback: any = {
        onShowing: function(...rest: any[]){}
    };
    (this.dialog as any).show({
        controller: 'AuditLogDetailsDialogController',
        controllerAs: 'vm',
        templateUrl: auditLogDetailsDialogTemplate,
        locals: {
            auditLog: this.auditLog,
            showingCallback: onShowingCallback
        },
        parent: $(this.document.body),
        targetEvent: $event,
        fullscreen: true,
        multiple: true,
        onShowing: (scope?: any, element?: any, ...rest: any[]) => {
            onShowingCallback.onShowing(scope, element);
        }
    });
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
