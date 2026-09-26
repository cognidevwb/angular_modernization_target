import { Component, inject, ViewChild } from '@angular/core';
import { ImportExportService } from '../services/import-export.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { ToastService } from '../../services/toast.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbHelpDirective } from '../../help/tb-help/tb-help.directive';
import { TbTableColumnsAssignmentDirective } from '../tb-table-columns-assignment/tb-table-columns-assignment.directive';
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
import { MatStepperModule, MatStepper } from '@angular/material/stepper';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $mdStepper: any;
declare let $scope: any;

/**
 * Ported from the AngularJS controller `ImportDialogCSVController` (module `thingsboard.importexport`) in src/app/import-export/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'import-dialog-csv',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatToolbarModule, MatStepperModule, MatSelectModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatCheckboxModule, MatButtonModule, FormsModule, TbHelpDirective, TbTableColumnsAssignmentDirective],
  templateUrl: './import-dialog-csv.component.html',
})
export class ImportDialogCsvComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  protected readonly toast = inject(ToastService);
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  protected readonly importExport = inject(ImportExportService);
  @ViewChild(MatStepper) private stepper!: MatStepper;
  // TODO(port): elements not resolved to a component: md-stepper, md-step, md-step-body, md-step-actions
  // TODO(port): template: 5 × md-step left in place
  // TODO(port): template: 4 × md-step-actions left in place
  // TODO(port): template: 5 × md-step-body left in place

  importParameters: any = {
        delim: ',',
        isUpdate: true,
        isHeader: true
    };
  importTitle: any;
  importFileLabel: any;
  entityType: any;
  isVertical: any = true;
  isLinear: any = true;
  isAlternative: any = false;
  isMobileStepText: any = true;
  isImportData: any = false;
  parseData: any = [];
  delimiters: any = [{
        key: ',',
        value: ','
    }, {
        key: ';',
        value: ';'
    }, {
        key: '|',
        value: '|'
    }, {
        key: '\t',
        value: 'Tab'
    }];
  progressCreate: any = 0;
  protected parseData_local: any = {};
  columnsParam: any;
  fileName: any;
  importData: any;
  statistical: any;
  theFormStep1: any;
  theFormStep3: any;

  // TODO(port): $scope.$apply — $apply is not needed: Angular detects the change
  // TODO(port): $scope.$on — a scope event: subscribe to the service that raises it
  // TODO(port): `parseData` was both a local and a member the class exposes; the local is `parseData_local`, the member stays `parseData`

  constructor() {
    this.cancel = this.cancel;
    this.fileAdded = this.fileAdded;
    this.clearFile = this.clearFile;
    this.nextStep = this.nextStep;
    this.previousStep = this.previousStep;
    this.importTitle = this.dialogData.importTitle;
    this.importFileLabel = this.dialogData.importFileLabel;
    this.entityType = this.dialogData.entityType;
  }

  fileAdded = ($file?: any, ...rest: any[]): any => {
    if ($file.getExtension() === 'csv') {
        var reader: any = new FileReader();
        reader.onload = (event?: any) => {
            (() => {
                if (event.target.result) {
                    this.theFormStep1.$setDirty();
                    var importCSV: any = event.target.result;
                    if (importCSV && importCSV.length > 0) {
                        try {
                            this.importData = importCSV;
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

  parseCSV(importData?: any, ...rest: any[]): any {
    var config: any = {
        delim: this.importParameters.delim,
        header: this.importParameters.isHeader
    };
    return this.importExport.convertCSVToJson(importData, config);
  }

  createColumnsData(parseData?: any, ...rest: any[]): any {
    this.columnsParam = [];
    var columnParam: any = {};
    for (var i: any = 0; i < parseData.headers.length; i++) {
        if (this.importParameters.isHeader && parseData.headers[i].search(/^(name|type|label)$/im) === 0) {
            columnParam = {
                type: types.importEntityColumnType[parseData.headers[i].toLowerCase()].value,
                key: parseData.headers[i].toLowerCase(),
                sampleData: parseData.rows[0][i]
            };
        } else {
            columnParam = {
                type: types.importEntityColumnType.serverAttribute.value,
                key: this.importParameters.isHeader ? parseData.headers[i] : "",
                sampleData: parseData.rows[0][i]
            };
        }
        this.columnsParam.push(columnParam);
    }
  }

  addEntities(importData?: any, parameterColumns?: any, ...rest: any[]): any {
    var entitiesData: any = [];
    var sentDataLength: any = 0;
    var config: any = {
        ignoreErrors: true,
        resendRequest: true
    };

    for (var i: any = 0; i < importData.rows.length; i++) {
        var entityData: any = {
            name: "",
            type: "",
            description: "",
            gateway: null,
            label: "",
            accessToken: "",
            attributes: {
                server: [],
                shared: []
            },
            timeseries: []
        };
        for (var j: any = 0; j < parameterColumns.length; j++) {
            switch (parameterColumns[j].type) {
                case types.importEntityColumnType.serverAttribute.value:
                    entityData.attributes.server.push({
                        key: parameterColumns[j].key,
                        value: importData.rows[i][j]
                    });
                    break;
                case types.importEntityColumnType.timeseries.value:
                    entityData.timeseries.push({
                        key: parameterColumns[j].key,
                        value: importData.rows[i][j]
                    });
                    break;
                case types.importEntityColumnType.sharedAttribute.value:
                    entityData.attributes.shared.push({
                        key: parameterColumns[j].key,
                        value: importData.rows[i][j]
                    });
                    break;
                case types.importEntityColumnType.accessToken.value:
                    entityData.accessToken = importData.rows[i][j];
                    break;
                case types.importEntityColumnType.name.value:
                    entityData.name = importData.rows[i][j];
                    break;
                case types.importEntityColumnType.type.value:
                    entityData.type = importData.rows[i][j];
                    break;
                case types.importEntityColumnType.label.value:
                    entityData.label = importData.rows[i][j];
                    break;
                case types.importEntityColumnType.isGateway.value:
                    entityData.gateway = importData.rows[i][j];
                    break;
                case types.importEntityColumnType.description.value:
                    entityData.description = importData.rows[i][j];
                    break;
            }
        }
        entitiesData.push(entityData);
    }
    this.rootScope.$on('createImportEntityCompleted', () => {
        sentDataLength++;
        this.progressCreate = Math.round((sentDataLength / importData.rows.length) * 100);
    });
    this.importExport.createMultiEntity(entitiesData, this.entityType, this.importParameters.isUpdate, config).then((response?: any) => {
        this.statistical = response;
        this.isImportData = false;
        this.stepper.next();
    });
  }

  clearFile = (...rest: any[]): any => {
    this.theFormStep1.$setDirty();
    this.fileName = null;
    this.importData = null;
  };

  previousStep = (step?: any, ...rest: any[]): any => {
    let steppers: any = this.stepper;
    switch (step) {
        case 1:
            steppers.previous();
            setTimeout(() => {
                this.theFormStep1.$setDirty();
            });
            break;
        default:
            steppers.previous();
            break;
    }
  };

  nextStep = (step?: any, ...rest: any[]): any => {
    let steppers: any = this.stepper;
    switch (step) {
        case 2:
            steppers.next();
            break;
        case 3:
            this.parseData_local = this.parseCSV(this.importData);
            if (this.parseData_local === -1) {
                steppers.previous();
                setTimeout(() => {
                    this.clearFile();
                });
            } else {
                this.createColumnsData(this.parseData_local);
                steppers.next();
            }
            break;
        case 4:
            steppers.next();
            this.isImportData = true;
            this.addEntities(this.parseData_local, this.columnsParam);
            break;
        case 6:
(this.dialog as any).hide();
            break;
    }

  };

  cancel = (...rest: any[]): any => {
    if((this.stepper.selectedIndex + 1) > 2){
(this.dialog as any).hide();
    } else {
(this.dialog as any).cancel();
    }
  };
}
