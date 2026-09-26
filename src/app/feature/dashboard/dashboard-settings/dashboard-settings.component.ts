import { MdColorPickerComponent } from './md-color-picker.component';
import { attachLegacyForm, lateLegacyForm, LegacyForm } from '../../components/tb-grid/legacy-form';
import { Component, inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { StatesControllerService } from '../services/states-controller.service';
import { FormsModule, NgForm } from '@angular/forms';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

/**
 * Ported from the AngularJS controller `DashboardSettingsController` (module `thingsboard.dashboard`) in src/app/dashboard/index.js:50.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'dashboard-settings',
  standalone: true,
  imports: [MdColorPickerComponent, TranslatePipe, MatTooltipModule, MatToolbarModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule],
  templateUrl: './dashboard-settings.component.html',
})
export class DashboardSettingsComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly statesControllerService = inject(StatesControllerService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};

  settings: any;
  gridSettings: any;
  stateControllers: any;
  hMargin: any;
  /** The legacy `theForm` FormController, over the template's `<form name="theForm">`. */
  readonly theForm: LegacyForm = lateLegacyForm('theForm');
  @ViewChild('theFormRef') set theFormRef(form: NgForm | undefined) {
    attachLegacyForm(this.theForm, form);
  }
  vMargin: any;

  // TODO(port): $scope.$apply — $apply is not needed: Angular detects the change

  constructor() {
    this.cancel = this.cancel;
    this.save = this.save;
    this.imageAdded = this.imageAdded;
    this.clearImage = this.clearImage;
    this.stateControllerIdChanged = this.stateControllerIdChanged;
    this.settings = this.dialogData.settings;
    this.gridSettings = this.dialogData.gridSettings;
    this.stateControllers = this.statesControllerService.getStateControllers();
    if (this.settings) {
        if ((this.settings.stateControllerId === undefined)) {
            this.settings.stateControllerId = 'entity';
        }

        if ((this.settings.showTitle === undefined)) {
            this.settings.showTitle = false;
        }

        if ((this.settings.titleColor === undefined)) {
            this.settings.titleColor = 'rgba(0,0,0,0.870588)';
        }

        if ((this.settings.showDashboardsSelect === undefined)) {
            this.settings.showDashboardsSelect = true;
        }

        if ((this.settings.showEntitiesSelect === undefined)) {
            this.settings.showEntitiesSelect = true;
        }

        if ((this.settings.showDashboardTimewindow === undefined)) {
            this.settings.showDashboardTimewindow = true;
        }

        if ((this.settings.showDashboardExport === undefined)) {
            this.settings.showDashboardExport = true;
        }

        if ((this.settings.toolbarAlwaysOpen === undefined)) {
            this.settings.toolbarAlwaysOpen = true;
        }
    }
    if (this.gridSettings) {
        this.gridSettings.backgroundColor = this.gridSettings.backgroundColor || 'rgba(0,0,0,0)';
        this.gridSettings.color = this.gridSettings.color || 'rgba(0,0,0,0.870588)';
        this.gridSettings.columns = this.gridSettings.columns || 24;
        this.gridSettings.margins = this.gridSettings.margins || [10, 10];
        this.gridSettings.autoFillHeight = (this.gridSettings.autoFillHeight !== undefined) ? this.gridSettings.autoFillHeight : false;
        this.gridSettings.mobileAutoFillHeight = (this.gridSettings.mobileAutoFillHeight !== undefined) ? this.gridSettings.mobileAutoFillHeight : false;
        this.gridSettings.mobileRowHeight = (this.gridSettings.mobileRowHeight !== undefined) ? this.gridSettings.mobileRowHeight : 70;
        this.hMargin = this.gridSettings.margins[0];
        this.vMargin = this.gridSettings.margins[1];
        this.gridSettings.backgroundSizeMode = this.gridSettings.backgroundSizeMode || '100%';
    }
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  imageAdded = ($file?: any, ...rest: any[]): any => {
    var reader: any = new FileReader();
    reader.onload = (event?: any) => {
        (() => {
            if (event.target.result && event.target.result.startsWith('data:image/')) {
                this.theForm.$setDirty();
                this.gridSettings.backgroundImageUrl = event.target.result;
            }
        })();
    };
    reader.readAsDataURL($file.file);
  };

  /** ng-flow's `flow-btn` (single file, images): the chosen file goes to `imageAdded` as flow's `$file` did. */
  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.imageAdded({ file });
    }
    input.value = '';
  }

  /** ng-flow's `flow-drop`: the dropped image goes to `imageAdded`. */
  onImageDropped(event: DragEvent): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.imageAdded({ file });
    }
  }

  clearImage = (...rest: any[]): any => {
    this.theForm.$setDirty();
    this.gridSettings.backgroundImageUrl = null;
  };

  stateControllerIdChanged = (...rest: any[]): any => {
    if (this.settings.stateControllerId != 'default') {
        this.settings.toolbarAlwaysOpen = true;
    }
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
    if (this.gridSettings) {
        this.gridSettings.margins = [this.hMargin, this.vMargin];
    }
    (this.dialog as any).hide(
        {
            settings: this.settings,
            gridSettings: this.gridSettings
        }
    );
  };

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
