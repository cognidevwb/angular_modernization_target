import { Component, effect, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let types: any;

/**
 * Ported from the AngularJS directive `tbTableColumnsAssignment` (module `thingsboard.importexport`) in src/app/import-export/index.js:22.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-table-columns-assignment',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, MatDividerModule, MatTableModule, FormsModule],
  templateUrl: './tb-table-columns-assignment.directive.html',
})
export class TbTableColumnsAssignmentDirective {
  readonly theForm = model<any>();
  readonly columns = model<any>();
  readonly entityType = model<any>();

  protected readonly displayedColumns: string[] = ['index', 'sampleData', 'type', 'key'];
  protected columnTypesMap: any = {};

  constructor() {
    effect(() => {
      const entityType = this.entityType();
      const columnTypesMap: any = {};
      columnTypesMap.name = types.importEntityColumnType.name;
      columnTypesMap.type = types.importEntityColumnType.type;
      columnTypesMap.label = types.importEntityColumnType.label;
      columnTypesMap.description = types.importEntityColumnType.description;

      switch (entityType) {
        case types.entityType.device:
          columnTypesMap.sharedAttribute = types.importEntityColumnType.sharedAttribute;
          columnTypesMap.serverAttribute = types.importEntityColumnType.serverAttribute;
          columnTypesMap.timeseries = types.importEntityColumnType.timeseries;
          columnTypesMap.accessToken = types.importEntityColumnType.accessToken;
          columnTypesMap.gateway = types.importEntityColumnType.isGateway;
          break;
        case types.entityType.asset:
          columnTypesMap.serverAttribute = types.importEntityColumnType.serverAttribute;
          columnTypesMap.timeseries = types.importEntityColumnType.timeseries;
          break;
      }
      this.columnTypesMap = columnTypesMap;
    });

    effect(() => {
      const newVal = this.columns();
      if (newVal) {
        let isSelectName = false;
        let isSelectType = false;
        let isSelectLabel = false;
        let isSelectCredentials = false;
        let isSelectGateway = false;
        let isSelectDescription = false;
        for (let i = 0; i < newVal.length; i++) {
          switch (newVal[i].type) {
            case types.importEntityColumnType.name.value:
              isSelectName = true;
              break;
            case types.importEntityColumnType.type.value:
              isSelectType = true;
              break;
            case types.importEntityColumnType.label.value:
              isSelectLabel = true;
              break;
            case types.importEntityColumnType.accessToken.value:
              isSelectCredentials = true;
              break;
            case types.importEntityColumnType.isGateway.value:
              isSelectGateway = true;
              break;
            case types.importEntityColumnType.description.value:
              isSelectDescription = true;
          }
        }
        const theForm: any = this.theForm();
        if (isSelectName && isSelectType) {
          theForm?.form?.markAsDirty();
        } else {
          theForm?.form?.markAsPristine();
        }
        setTimeout(() => {
          this.columnTypesMap.name.disable = isSelectName;
          this.columnTypesMap.type.disable = isSelectType;
          this.columnTypesMap.label.disable = isSelectLabel;
          this.columnTypesMap.gateway.disable = isSelectGateway;
          this.columnTypesMap.description.disable = isSelectDescription;
          if (typeof this.columnTypesMap.accessToken !== 'undefined') {
            this.columnTypesMap.accessToken.disable = isSelectCredentials;
          }
        });
      }
    });
  }

  protected get columnTypes(): any[] {
    return Object.values(this.columnTypesMap ?? {});
  }

  protected isColumnTypeDiffers(columnType?: any): boolean {
    return columnType !== types.importEntityColumnType.name.value &&
      columnType !== types.importEntityColumnType.type.value &&
      columnType !== types.importEntityColumnType.label.value &&
      columnType !== types.importEntityColumnType.accessToken.value &&
      columnType !== types.importEntityColumnType.isGateway.value &&
      columnType !== types.importEntityColumnType.description.value;
  }
}
