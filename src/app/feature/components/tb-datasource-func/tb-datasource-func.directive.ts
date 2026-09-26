import { Component, DOCUMENT, inject, input, model, ChangeDetectionStrategy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { TranslatePipe } from '@ngx-translate/core';
import tinycolor from 'tinycolor2';
import { firstValueFrom } from 'rxjs';

import { GenerateDataKeyFn } from '../tb-datasource/datasource-callbacks';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { DatakeyConfigDialogComponent } from '../datakey-config-dialog/datakey-config-dialog.component';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { legacyCopy, legacyEquals } from '../widget/legacy-helpers';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbDatasourceFunc` (src/app/components/datasource-func.directive.js):
 * a function datasource of a widget — its name and its data keys (predefined functions, or alarm fields for
 * alarm widgets) as chips with a key autocomplete. `[(ngModel)]` is the datasource; like the legacy one it
 * edits the datasource object in place. The chip drag handle reorders the chips with the CDK drop list.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-datasource-func',
  standalone: true,
  imports: [
    FormsModule, CdkDropList, CdkDrag, CdkDragHandle, MatAutocompleteModule, MatButtonModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, MatInputModule, TranslatePipe, TruncatePipe,
  ],
  templateUrl: './tb-datasource-func.directive.html',
  providers: ngModelProviders(TbDatasourceFuncDirective),
})
export class TbDatasourceFuncDirective extends NgModelController {
  readonly widgetType = model<any>();
  readonly maxDataKeys = model<any>();
  readonly optDataKeys = model<any>();
  readonly generateDataKey = input<GenerateDataKeyFn | undefined>();
  readonly datakeySettingsSchema = model<any>();

  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);
  protected readonly utils = inject(UtilsService);

  readonly types: any = types;
  functionTypes: string[] = this.utils.getPredefinedFunctionsList();
  alarmFields: string[] = Object.keys(types.alarmFields);
  dataKeySearchText: any = null;
  alarmDataKeySearchText: any = null;
  funcDataKeys: any[] = [];
  alarmDataKeys: any[] = [];
  datasourceName: any;
  /** The autocomplete's current items (`md-items="item in dataKeysSearch(…)"`). */
  dataKeyItems: string[] = [];
  alarmDataKeyItems: string[] = [];

  override $render(): void {
    if (this.$viewValue) {
      const funcDataKeys: any[] = [];
      const alarmDataKeys: any[] = [];
      if (this.$viewValue.dataKeys) {
        for (const dataKey of this.$viewValue.dataKeys) {
          if (dataKey.type === types.dataKeyType.function) {
            funcDataKeys.push(dataKey);
          } else if (dataKey.type === types.dataKeyType.alarm) {
            alarmDataKeys.push(dataKey);
          }
        }
      }
      this.funcDataKeys = funcDataKeys;
      this.alarmDataKeys = alarmDataKeys;
      this.datasourceName = this.$viewValue.name;
      this.updateValidity();
    }
  }

  updateValidity(): void {
    if (this.$viewValue) {
      const value: any = this.$viewValue;
      const dataValid: any = value !== undefined && value != null;
      this.$setValidity('deviceData', dataValid);
      if (dataValid) {
        if (this.optDataKeys()) {
          this.$setValidity('datasourceKeys', true);
        } else {
          this.$setValidity('datasourceKeys', value.dataKeys !== undefined && value.dataKeys != null && value.dataKeys.length > 0);
        }
      }
    }
  }

  /** `scope.$watch('datasourceName', …)`: the name goes into the datasource. */
  onDatasourceNameChange(name: any): void {
    this.datasourceName = name;
    if (this.$viewValue) {
      this.$viewValue.name = this.datasourceName;
      this.updateValidity();
    }
  }

  /** `scope.$watch('funcDataKeys' / 'alarmDataKeys', …, true)`: the chips go into the datasource. */
  updateDataKeys(): void {
    if (this.$viewValue) {
      const dataKeys: any[] = [].concat(this.funcDataKeys as any, this.alarmDataKeys as any);
      if (!legacyEquals(this.$viewValue.dataKeys, dataKeys)) {
        this.$setDirty();
        this.$viewValue.dataKeys = dataKeys;
      }
      this.updateValidity();
    }
  }

  transformFuncDataKeyChip(chip?: any): any {
    if (this.maxDataKeys() > 0 && this.$viewValue.dataKeys.length >= this.maxDataKeys()) {
      return null;
    }
    return this.generateDataKey()?.(chip, types.dataKeyType.function);
  }

  transformAlarmDataKeyChip(chip?: any): any {
    return this.generateDataKey()?.(chip, types.dataKeyType.alarm);
  }

  /** md-chips' append: the transformed chip, or nothing when the transform returned null. */
  private appendChip(alarm: boolean, chip: any): void {
    const key = alarm ? this.transformAlarmDataKeyChip(chip) : this.transformFuncDataKeyChip(chip);
    if (key) {
      if (alarm) {
        this.alarmDataKeys = [...this.alarmDataKeys, key];
        this.alarmDataKeySearchText = '';
      } else {
        this.funcDataKeys = [...this.funcDataKeys, key];
        this.dataKeySearchText = '';
      }
      this.updateDataKeys();
    }
  }

  onDataKeySelected(event: MatAutocompleteSelectedEvent, alarm: boolean): void {
    if (event.option.value !== null && event.option.value !== undefined) {
      this.appendChip(alarm, event.option.value);
    }
  }

  /** Typed text + Enter: md-require-match="false" appends it as a key name. */
  onChipInputEnd(event: MatChipInputEvent, alarm: boolean): void {
    const text = (event.value || '').trim();
    if (text) {
      this.appendChip(alarm, text);
    }
    event.chipInput?.clear();
  }

  removeDataKey(dataKey: any, alarm: boolean): void {
    if (alarm) {
      this.alarmDataKeys = this.alarmDataKeys.filter((k) => k !== dataKey);
    } else {
      this.funcDataKeys = this.funcDataKeys.filter((k) => k !== dataKey);
    }
    this.updateDataKeys();
  }

  /** The chip drag handle (tb-chip-draggable): moves the key within its list. */
  dropDataKey(event: CdkDragDrop<any[]>, alarm: boolean): void {
    const list = alarm ? [...this.alarmDataKeys] : [...this.funcDataKeys];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    if (alarm) {
      this.alarmDataKeys = list;
    } else {
      this.funcDataKeys = list;
    }
    this.updateDataKeys();
  }

  /** `$mdColorPicker.show(…)`: the browser's color picker, starting at the key's color. */
  showColorPicker(event?: any, dataKey?: any): void {
    event?.stopPropagation();
    const colorInput = this.document.createElement('input');
    colorInput.type = 'color';
    colorInput.value = tinycolor(dataKey.color || '#fff').toHexString();
    colorInput.style.position = 'fixed';
    colorInput.style.opacity = '0';
    colorInput.style.pointerEvents = 'none';
    this.document.body.appendChild(colorInput);
    colorInput.addEventListener('change', () => {
      dataKey.color = colorInput.value;
      this.$setDirty();
      this.updateDataKeys();
      colorInput.remove();
    });
    colorInput.addEventListener('blur', () => colorInput.remove());
    colorInput.click();
  }

  editDataKey(event?: any, dataKey?: any): void {
    event?.stopPropagation();
    const ref = this.dialog.open(DatakeyConfigDialogComponent, {
      data: {
        dataKey: legacyCopy(dataKey),
        dataKeySettingsSchema: this.datakeySettingsSchema(),
        entityAlias: null,
        aliasController: null,
      },
      panelClass: ['tb-fullscreen-dialog'],
    });
    ref.afterOpened().subscribe(() => window.dispatchEvent(new Event('resize')));
    firstValueFrom(ref.afterClosed()).then((newDataKey?: any) => {
      if (!newDataKey) {
        return;
      }
      if (newDataKey.type === types.dataKeyType.function) {
        const index = this.funcDataKeys.indexOf(dataKey);
        this.funcDataKeys = this.funcDataKeys.map((k, i) => (i === index ? newDataKey : k));
      } else if (newDataKey.type === types.dataKeyType.alarm) {
        const index = this.alarmDataKeys.indexOf(dataKey);
        this.alarmDataKeys = this.alarmDataKeys.map((k, i) => (i === index ? newDataKey : k));
      }
      this.$setDirty();
      this.updateDataKeys();
    });
  }

  textIsNotEmpty(text?: any): boolean {
    return !!(text && text.length > 0);
  }

  /** The key autocomplete's items for the text typed so far (md-min-length="0": also on focus). */
  onSearchTextChange(text: any, alarm: boolean): void {
    const items = this.dataKeysSearch(typeof text === 'string' ? text : '');
    if (alarm) {
      this.alarmDataKeySearchText = text;
      this.alarmDataKeyItems = items;
    } else {
      this.dataKeySearchText = text;
      this.dataKeyItems = items;
    }
  }

  dataKeysSearch(dataKeySearchText?: any): string[] {
    const targetKeys: string[] = this.widgetType() == types.widgetType.alarm.value ? this.alarmFields : this.functionTypes;
    return dataKeySearchText ? targetKeys.filter(this.createFilterForDataKey(dataKeySearchText)) : targetKeys;
  }

  createFilterForDataKey(query?: any): (dataKey: any) => boolean {
    const lowercaseQuery: any = query.toLowerCase();
    return (dataKey: any) => dataKey.toLowerCase().indexOf(lowercaseQuery) === 0;
  }

  /** "Create new key": the typed text appended as a chip (md-chips' appendChip(chipBuffer)). */
  createKey(event: any, alarm: boolean): void {
    event.preventDefault();
    event.stopPropagation();
    const text = ((alarm ? this.alarmDataKeySearchText : this.dataKeySearchText) || '').trim();
    if (text) {
      this.appendChip(alarm, text);
    }
  }
}
