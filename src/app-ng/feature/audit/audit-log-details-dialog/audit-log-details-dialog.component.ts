import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import $ from 'jquery';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

/**
 * Ported from the AngularJS controller `AuditLogDetailsDialogController` (module `thingsboard.auditLog`) in src/app/audit/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'audit-log-details-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './audit-log-details-dialog.component.html',
})
export class AuditLogDetailsDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef);
  protected readonly typesRef: any = types;
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  types: any;
  auditLog: any;
  displayFailureDetails: any;
  actionData: any;
  actionFailureDetails: any;
  actionDataContentOptions: any;
  failureDetailsContentOptions: any;
  actionDataEditor: any;
  failureDetailsEditor: any;

  constructor() {
    this.dialogData.showingCallback.onShowing = function(_scope?: any, element?: any) {
        this.updateEditorSize(element, this.actionData, 'tb-audit-log-action-data');
        this.actionDataEditor.resize();
        if (this.displayFailureDetails) {
            this.updateEditorSize(element, this.actionFailureDetails, 'tb-audit-log-failure-details');
            this.failureDetailsEditor.resize();
        }
    };
    this.types = this.typesRef;
    this.auditLog = this.dialogData.auditLog;
    this.displayFailureDetails = this.dialogData.auditLog.actionStatus == this.typesRef.auditLogActionStatus.FAILURE.value;
    this.actionData = this.dialogData.auditLog.actionDataText;
    this.actionFailureDetails = this.dialogData.auditLog.actionFailureDetails;
    this.actionDataContentOptions = {
        useWrapMode: false,
        mode: 'java',
        showGutter: false,
        showPrintMargin: false,
        theme: 'github',
        advanced: {
            enableSnippets: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.actionDataEditor = _ace;
        }
    };
    this.failureDetailsContentOptions = {
        useWrapMode: false,
        mode: 'java',
        showGutter: false,
        showPrintMargin: false,
        theme: 'github',
        advanced: {
            enableSnippets: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.failureDetailsEditor = _ace;
        }
    };
    this.close = this.close;
  }

  updateEditorSize(element?: any, content?: any, editorId?: any, ...rest: any[]): any {
    var newHeight: any = 200;
    var newWidth: any = 600;
    if (content && content.length > 0) {
        var lines: any = content.split('\n');
        newHeight = 16 * lines.length + 16;
        var maxLineLength: any = 0;
        for (var i in lines) {
            var line: any = lines[i].replace(/\t/g, '    ').replace(/\n/g, '');
            var lineLength: any = line.length;
            maxLineLength = Math.max(maxLineLength, lineLength);
        }
        newWidth = 8 * maxLineLength + 16;
    }
    $('#'+editorId, element).height(newHeight.toString() + "px").css('min-height', newHeight.toString() + "px")
        .width(newWidth.toString() + "px");
  }

  close = (...rest: any[]): any => {
    this.dialogRef.close();
  };
}
