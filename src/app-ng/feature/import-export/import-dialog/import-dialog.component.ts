import { NgForm } from '@angular/forms';
import { attachLegacyForm, lateLegacyForm, LegacyForm } from '../../components/tb-grid/legacy-form';
import { Component, inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { FormsModule } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `ImportDialogController` (module `thingsboard.importexport`) in src/app/import-export/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'import-dialog',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule],
  templateUrl: './import-dialog.component.html',
})
export class ImportDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly toast = inject(ToastService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  importTitle: any;
  importFileLabel: any;
  fileName: any;
  importData: any;

  /** The legacy `theForm` (FormController), over the template's `#theFormRef` NgForm. */
  readonly theForm: LegacyForm = lateLegacyForm('theForm');

  @ViewChild('theFormRef')
  set theFormRef(form: NgForm | undefined) {
    attachLegacyForm(this.theForm, form);
  }

  // TODO(port): $scope.$apply — $apply is not needed: Angular detects the change

  constructor() {
    this.cancel = this.cancel;
    this.importFromJson = this.importFromJson;
    this.fileAdded = this.fileAdded;
    this.clearFile = this.clearFile;
    this.importTitle = this.dialogData.importTitle;
    this.importFileLabel = this.dialogData.importFileLabel;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  fileAdded = ($file?: any, ...rest: any[]): any => {
    if ($file.getExtension() === 'json') {
        var reader: any = new FileReader();
        reader.onload = (event?: any) => {
            (() => {
                if (event.target.result) {
                    this.theForm.$setDirty();
                    var importJson: any = event.target.result;
                    if (importJson && importJson.length > 0) {
                        try {
                            this.importData = JSON.parse(importJson);
                            this.fileName = $file.name;
                        } catch (err: any) {
                            this.fileName = null;
                            this.toast.showError(err.message);
                        }
                    }
                }
            })();
        };
        reader.readAsText($file.file);
    }
  };

  clearFile = (...rest: any[]): any => {
    this.theForm.$setDirty();
    this.fileName = null;
    this.importData = null;
  };

  importFromJson = (...rest: any[]): any => {
    this.theForm.$setPristine();
    (this.dialog as any).hide(this.importData);
  };
}
