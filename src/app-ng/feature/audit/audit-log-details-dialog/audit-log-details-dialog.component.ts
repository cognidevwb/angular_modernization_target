import { AfterViewInit, Component, ElementRef, inject, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';
import 'brace/mode/java';
import { types } from '../../common/constants/types';
import { RootState } from '../../../root-state';
import { UiAceDirective, UiAceOptions } from '../../components/ui-ace/ui-ace.directive';

/**
 * Ported from the AngularJS controller `AuditLogDetailsDialogController` (src/app/audit/audit-log-details-dialog.controller.js)
 * with its template. Shows the audit log's action data (and failure details for a failed action) in read-only ace editors,
 * sized to their content once the dialog is shown (the legacy `onShowing`).
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'audit-log-details-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, UiAceDirective],
  templateUrl: './audit-log-details-dialog.component.html',
})
export class AuditLogDetailsDialogComponent implements AfterViewInit {
  protected readonly rootScope = inject(RootState);
  private readonly dialogRef = inject(MatDialogRef<AuditLogDetailsDialogComponent>);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  private readonly actionDataElement = viewChild<ElementRef<HTMLElement>>('actionDataEditorElement');
  private readonly failureDetailsElement = viewChild<ElementRef<HTMLElement>>('failureDetailsEditorElement');

  readonly types: any = types;
  auditLog: any = this.dialogData.auditLog;
  displayFailureDetails: boolean = this.auditLog.actionStatus == types.auditLogActionStatus.FAILURE.value;
  actionData: any = this.auditLog.actionDataText;
  actionFailureDetails: any = this.auditLog.actionFailureDetails;
  actionDataEditor: any;
  failureDetailsEditor: any;

  readonly actionDataContentOptions: UiAceOptions = {
    useWrapMode: false,
    mode: 'java',
    showGutter: false,
    showPrintMargin: false,
    theme: 'github',
    advanced: {
      enableSnippets: false,
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
    },
    onLoad: (editor: any) => {
      this.actionDataEditor = editor;
    },
  };

  readonly failureDetailsContentOptions: UiAceOptions = {
    useWrapMode: false,
    mode: 'java',
    showGutter: false,
    showPrintMargin: false,
    theme: 'github',
    advanced: {
      enableSnippets: false,
      enableBasicAutocompletion: false,
      enableLiveAutocompletion: false,
    },
    onLoad: (editor: any) => {
      this.failureDetailsEditor = editor;
    },
  };

  /** The legacy `$mdDialog` `onShowing`: size the editors to their content. */
  ngAfterViewInit(): void {
    setTimeout(() => {
      this.updateEditorSize(this.actionDataElement()?.nativeElement, this.actionData);
      this.actionDataEditor?.resize();
      if (this.displayFailureDetails) {
        this.updateEditorSize(this.failureDetailsElement()?.nativeElement, this.actionFailureDetails);
        this.failureDetailsEditor?.resize();
      }
    });
  }

  updateEditorSize(editorElement: HTMLElement | undefined, content?: any): void {
    if (!editorElement) {
      return;
    }
    let newHeight = 200;
    let newWidth = 600;
    if (content && content.length > 0) {
      const lines: string[] = content.split('\n');
      newHeight = 16 * lines.length + 16;
      let maxLineLength = 0;
      for (const line of lines) {
        maxLineLength = Math.max(maxLineLength, line.replace(/\t/g, '    ').replace(/\n/g, '').length);
      }
      newWidth = 8 * maxLineLength + 16;
    }
    editorElement.style.height = newHeight + 'px';
    editorElement.style.minHeight = newHeight + 'px';
    editorElement.style.width = newWidth + 'px';
  }

  close(): void {
    this.dialogRef.close();
  }
}
