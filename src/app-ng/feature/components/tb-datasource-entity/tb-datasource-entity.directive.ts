import { Component, DOCUMENT, inject, input, model } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CdkDrag, CdkDragDrop, CdkDragHandle, CdkDropList, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatAutocompleteModule, MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import tinycolor from 'tinycolor2';
import { firstValueFrom } from 'rxjs';

import { CreateEntityAliasFn, FetchEntityKeysFn, GenerateDataKeyFn } from '../tb-datasource/datasource-callbacks';
import { types } from '../../common/constants/types';
import { DatakeyConfigDialogComponent } from '../datakey-config-dialog/datakey-config-dialog.component';
import { TbEntityAliasSelectDirective } from '../tb-entity-alias-select/tb-entity-alias-select.directive';
import { TruncatePipe } from '../pipes/truncate.pipe';
import { legacyCopy, legacyEquals } from '../widget/legacy-helpers';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbDatasourceEntity` (src/app/components/datasource-entity.directive.js):
 * an entity datasource of a widget — its entity alias and its data keys (timeseries / attributes /
 * entity fields, or alarm fields for alarm widgets) as chips with a key autocomplete.
 * `[(ngModel)]` is the datasource; like the legacy one it edits the datasource object in place.
 * The md-chips drag handle (tb-chip-draggable) reorders the chips with the CDK drop list.
 */
@Component({
  selector: 'tb-datasource-entity',
  standalone: true,
  imports: [
    FormsModule, CdkDropList, CdkDrag, CdkDragHandle, MatAutocompleteModule, MatButtonModule, MatChipsModule,
    MatFormFieldModule, MatIconModule, MatTooltipModule, TranslatePipe, TruncatePipe, TbEntityAliasSelectDirective,
  ],
  templateUrl: './tb-datasource-entity.directive.html',
  providers: ngModelProviders(TbDatasourceEntityDirective),
})
export class TbDatasourceEntityDirective extends NgModelController {
  readonly widgetType = model<any>();
  readonly maxDataKeys = model<any>();
  readonly optDataKeys = model<any>();
  readonly aliasController = model<any>();
  readonly datakeySettingsSchema = model<any>();
  readonly generateDataKey = input<GenerateDataKeyFn | undefined>();
  readonly fetchEntityKeys = input<FetchEntityKeysFn | undefined>();
  readonly onCreateEntityAlias = input<CreateEntityAliasFn | undefined>();

  protected readonly document = inject(DOCUMENT);
  protected readonly dialog = inject(MatDialog);

  readonly types: any = types;
  alarmFields: string[] = Object.keys(types.alarmFields);
  dataKeySearchText: any = null;
  alarmDataKeySearchText: any = null;
  dataKeys: any[] = [];
  alarmDataKeys: any[] = [];
  entityAlias: any = null;
  /** The autocomplete's current items (`md-items="item in dataKeysSearch(…)"`). */
  dataKeyItems: any[] = [];
  alarmDataKeyItems: any[] = [];
  private searchSeq = 0;

  override $render(): void {
    if (this.$viewValue) {
      const entityAliasId: any = this.$viewValue.entityAliasId;
      const entityAliases: any = this.aliasController().getEntityAliases();
      this.entityAlias = entityAliases[entityAliasId] ? entityAliases[entityAliasId] : null;
      const dataKeys: any[] = [];
      const alarmDataKeys: any[] = [];
      for (const d in this.$viewValue.dataKeys) {
        const dataKey: any = this.$viewValue.dataKeys[d];
        if (dataKey.type === types.dataKeyType.timeseries || dataKey.type === types.dataKeyType.attribute || dataKey.type === types.dataKeyType.entityField) {
          dataKeys.push(dataKey);
        } else if (dataKey.type === types.dataKeyType.alarm) {
          alarmDataKeys.push(dataKey);
        }
      }
      this.dataKeys = dataKeys;
      this.alarmDataKeys = alarmDataKeys;
      this.updateValidity();
    }
  }

  updateValidity(): void {
    if (this.$viewValue) {
      const value: any = this.$viewValue;
      const dataValid: any = value !== undefined && value != null;
      this.$setValidity('entityData', dataValid);
      if (dataValid) {
        this.$setValidity('entityAlias', value.entityAliasId !== undefined && value.entityAliasId != null);
        if (this.optDataKeys()) {
          this.$setValidity('entityKeys', true);
        } else {
          this.$setValidity('entityKeys', value.dataKeys !== undefined && value.dataKeys != null && value.dataKeys.length > 0);
        }
      }
    }
  }

  /** `scope.$watch('entityAlias', …)`: the chosen alias goes into the datasource. */
  onEntityAliasChange(entityAlias: any): void {
    this.entityAlias = entityAlias;
    if (this.$viewValue) {
      this.$viewValue.entityAliasId = this.entityAlias ? this.entityAlias.id : null;
      this.updateValidity();
      this.selectedEntityAliasChange();
    }
  }

  /** `scope.$watch('dataKeys' / 'alarmDataKeys', …, true)`: the chips go into the datasource. */
  updateDataKeys(): void {
    if (this.$viewValue) {
      const dataKeys: any[] = [].concat(this.dataKeys as any, this.alarmDataKeys as any);
      if (!legacyEquals(this.$viewValue.dataKeys, dataKeys)) {
        this.$setDirty();
        this.$viewValue.dataKeys = dataKeys;
      }
      this.updateValidity();
    }
  }

  textIsNotEmpty(text?: any): boolean {
    return !!(text && text.length > 0);
  }

  selectedEntityAliasChange(): void {
    if (!this.dataKeySearchText || this.dataKeySearchText === '') {
      this.dataKeySearchText = this.dataKeySearchText === '' ? null : '';
    }
    if (!this.alarmDataKeySearchText || this.alarmDataKeySearchText === '') {
      this.alarmDataKeySearchText = this.alarmDataKeySearchText === '' ? null : '';
    }
    this.dataKeyItems = [];
  }

  transformDataKeyChip(chip?: any): any {
    if (this.maxDataKeys() > 0 && this.$viewValue.dataKeys.length >= this.maxDataKeys()) {
      return null;
    }
    if (chip.type) {
      return this.generateDataKey()?.(chip.name, chip.type);
    }
    if (this.widgetType() != types.widgetType.latest.value) {
      return this.generateDataKey()?.(chip, types.dataKeyType.timeseries);
    }
    return null;
  }

  transformAlarmDataKeyChip(chip?: any): any {
    if (chip.type) {
      return this.generateDataKey()?.(chip.name, chip.type);
    }
    return this.generateDataKey()?.(chip, types.dataKeyType.alarm);
  }

  /** md-chips' append: the transformed chip, or nothing when the transform returned null. */
  private appendChip(alarm: boolean, chip: any): void {
    const key = alarm ? this.transformAlarmDataKeyChip(chip) : this.transformDataKeyChip(chip);
    if (key) {
      if (alarm) {
        this.alarmDataKeys = [...this.alarmDataKeys, key];
        this.alarmDataKeySearchText = '';
      } else {
        this.dataKeys = [...this.dataKeys, key];
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
      this.dataKeys = this.dataKeys.filter((k) => k !== dataKey);
    }
    this.updateDataKeys();
  }

  /** The chip drag handle: moves the key within its list. */
  dropDataKey(event: CdkDragDrop<any[]>, alarm: boolean): void {
    const list = alarm ? [...this.alarmDataKeys] : [...this.dataKeys];
    moveItemInArray(list, event.previousIndex, event.currentIndex);
    if (alarm) {
      this.alarmDataKeys = list;
    } else {
      this.dataKeys = list;
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
        entityAlias: this.entityAlias,
        aliasController: this.aliasController(),
      },
      panelClass: ['tb-fullscreen-dialog'],
    });
    ref.afterOpened().subscribe(() => window.dispatchEvent(new Event('resize')));
    firstValueFrom(ref.afterClosed()).then((newDataKey?: any) => {
      if (!newDataKey) {
        return;
      }
      if (newDataKey.type === types.dataKeyType.timeseries || newDataKey.type === types.dataKeyType.attribute || newDataKey.type === types.dataKeyType.entityField) {
        const index = this.dataKeys.indexOf(dataKey);
        this.dataKeys = this.dataKeys.map((k, i) => (i === index ? newDataKey : k));
      } else if (newDataKey.type === types.dataKeyType.alarm) {
        const index = this.alarmDataKeys.indexOf(dataKey);
        this.alarmDataKeys = this.alarmDataKeys.map((k, i) => (i === index ? newDataKey : k));
      }
      this.$setDirty();
      this.updateDataKeys();
    });
  }

  /** The key autocomplete's items for the text typed so far (md-min-length="0": also on focus). */
  onSearchTextChange(text: any, alarm: boolean): void {
    if (alarm) {
      this.alarmDataKeySearchText = text;
    } else {
      this.dataKeySearchText = text;
    }
    const seq = ++this.searchSeq;
    Promise.resolve(this.dataKeysSearch(typeof text === 'string' ? text : '')).then(
      (items: any[]) => {
        if (seq === this.searchSeq) {
          if (alarm) {
            this.alarmDataKeyItems = items || [];
          } else {
            this.dataKeyItems = items || [];
          }
        }
      },
      () => {
        if (seq === this.searchSeq) {
          this.dataKeyItems = [];
        }
      },
    );
  }

  dataKeysSearch(searchText?: any): any {
    if (this.widgetType() == types.widgetType.alarm.value) {
      return searchText ? this.alarmFields.filter(this.createFilterForDataKey(searchText)) : this.alarmFields;
    }
    const fetchEntityKeys = this.fetchEntityKeys();
    if (!this.entityAlias || !fetchEntityKeys) {
      return Promise.resolve([]);
    }
    const entityAliasId = this.entityAlias.id;
    return fetchEntityKeys(entityAliasId, searchText, types.dataKeyType.timeseries).then((dataKeys: any[]) => {
      const items: any[] = dataKeys.map((name: any) => ({ name, type: types.dataKeyType.timeseries }));
      if (this.widgetType() != types.widgetType.latest.value) {
        return items;
      }
      const keysType = [types.dataKeyType.attribute, types.dataKeyType.entityField];
      return Promise.all(keysType.map((type) => fetchEntityKeys(entityAliasId, searchText, type))).then((typedKeys: any[][]) => {
        typedKeys.forEach((keys, i) => keys.forEach((name: any) => items.push({ name, type: keysType[i] })));
        return items;
      });
    });
  }

  createFilterForDataKey(query?: any): (dataKey: any) => boolean {
    const lowercaseQuery: any = query.toLowerCase();
    return (dataKey: any) => dataKey.toLowerCase().indexOf(lowercaseQuery) === 0;
  }

  /** "Create new key": the typed text as a key of the chosen type. */
  createKey(event: any, type: any, alarm: boolean): void {
    event.preventDefault();
    event.stopPropagation();
    const text = ((alarm ? this.alarmDataKeySearchText : this.dataKeySearchText) || '').trim();
    if (text) {
      this.appendChip(alarm, { name: text, type: type });
    }
  }

  /** The input shows the typed text; a selected item is shown by its name. */
  readonly displayKey = (item: any): string => (item && typeof item === 'object' ? item.name : item ?? '');
}
