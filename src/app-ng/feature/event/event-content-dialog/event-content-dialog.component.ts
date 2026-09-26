import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
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

import beautify from 'js-beautify';
import { UiAceDirective } from '../../components/ui-ace/ui-ace.directive';

// Helpers at the legacy file's top level, beside the registration (as written).
const js_beautify: any = beautify.js;

/**
 * Ported from the AngularJS controller `EventContentDialogController` (module `thingsboard.event`) in src/app/event/index.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'event-content-dialog',
  standalone: true,
  imports: [UiAceDirective, TranslatePipe, MatToolbarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './event-content-dialog.component.html',
})
export class EventContentDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  content: any;
  title: any;
  protected mode: any;
  contentOptions: any;
  editor: any;

  constructor() {
    this.dialogData.showingCallback.onShowing = (scope?: any, element?: any) => {
        this.updateEditorSize(element);
    };
    this.content = this.dialogData.content;
    this.title = this.dialogData.title;
    if (this.dialogData.contentType) {
        this.mode = types.contentType[this.dialogData.contentType].code;
        if (this.dialogData.contentType == types.contentType.JSON.value && this.content) {
            this.content = js_beautify(this.content, {indent_size: 4});
        }
    } else {
        this.mode = 'java';
    }
    this.contentOptions = {
        useWrapMode: false,
        mode: this.mode,
        showGutter: false,
        showPrintMargin: false,
        theme: 'github',
        advanced: {
            enableSnippets: false,
            enableBasicAutocompletion: false,
            enableLiveAutocompletion: false
        },
        onLoad: (_ace?: any, ...rest: any[]) => {
            this.editor = _ace;
        }
    };
    this.close = this.close;
  }

  updateEditorSize(element?: any, ...rest: any[]): any {
    var newHeight: any = 400;
    var newWidth: any = 600;
    if (this.content && this.content.length > 0) {
        var lines: any = this.content.split('\n');
        newHeight = 16 * lines.length + 16;
        var maxLineLength: any = 0;
        for (var i: any = 0; i < lines.length; i++) {
            var line: any = lines[i].replace(/\t/g, '    ').replace(/\n/g, '');
            var lineLength: any = line.length;
            maxLineLength = Math.max(maxLineLength, lineLength);
        }
        newWidth = 8 * maxLineLength + 16;
    }
    $('#tb-event-content', element).height(newHeight.toString() + "px")
        .width(newWidth.toString() + "px");
    this.editor.resize();
  }

  close = (...rest: any[]): any => {
(this.dialog as any).hide();
  };
}
