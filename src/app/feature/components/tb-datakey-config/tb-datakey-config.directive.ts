import { Component, input, model, ChangeDetectionStrategy } from '@angular/core';
import { NgTemplateOutlet } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslatePipe } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
import { TbJsFuncDirective } from '../tb-js-func/tb-js-func.directive';
import { TbJsonFormDirective } from '../tb-json-form/tb-json-form.directive';

/** What the host looks keys up with (legacy `fetchEntityKeys` `&` callback, whose promise was read). */
export type FetchEntityKeys = (args: { entityAliasId: string; query: string; type: string }) => Promise<string[]>;

/**
 * Ported from the AngularJS directive `tbDatakeyConfig` (module `thingsboard.directives.datakeyConfig`)
 * in src/app/components/datakey-config.directive.js:28: edits a data key (name, label, color, units,
 * decimals, generation / post-processing functions, and the widget's key settings) bound through `[(ngModel)]`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-datakey-config',
  standalone: true,
  imports: [NgTemplateOutlet, FormsModule, MatAutocompleteModule, MatCheckboxModule, MatFormFieldModule, MatInputModule, MatTabsModule, TranslatePipe,
    TbJsFuncDirective, TbJsonFormDirective],
  template: `
@if (datakeySettingsSchema()?.schema) {
<mat-tab-group class="tb-datakey-config">
    <mat-tab [label]="'datakey.settings' | translate">
        <ng-container *ngTemplateOutlet="settings"></ng-container>
    </mat-tab>
    <mat-tab [label]="'datakey.advanced' | translate">
        <div class="md-padding" layout="column">
            <div style="overflow: auto;" layout="column" layout-padding>
                <tb-json-form [schema]="datakeySettingsSchema().schema" [form]="datakeySettingsSchema().form || ['*']"
                              [model]="model.settings"></tb-json-form>
            </div>
        </div>
    </mat-tab>
</mat-tab-group>
} @else {
<ng-container *ngTemplateOutlet="settings"></ng-container>
}
<ng-template #settings>
<div class="md-padding" layout="column">
    @if (model.type !== types.dataKeyType.function) {
    <mat-form-field style="padding-bottom: 8px;">
        <mat-label>{{ 'entity.key' | translate }}</mat-label>
        <input matInput id="key" required [placeholder]="'entity.key-name' | translate"
               [ngModel]="model.name" (ngModelChange)="onKeyTextChange($event)"
               (focus)="onKeyTextChange(model.name || '')" [matAutocomplete]="keyAuto">
        <mat-autocomplete #keyAuto="matAutocomplete" (optionSelected)="setField('name', $event.option.value)">
            @for (item of keys; track $index) {
            <mat-option [value]="item">{{ item }}</mat-option>
            }
        </mat-autocomplete>
    </mat-form-field>
    }
    <div layout="row" layout-align="start center">
        <mat-form-field flex class="md-block">
            <mat-label>{{ 'datakey.label' | translate }}</mat-label>
            <input matInput required name="label" [ngModel]="model.label" (ngModelChange)="setField('label', $event)">
        </mat-form-field>
        <mat-form-field flex>
            <mat-label>{{ 'datakey.color' | translate }}</mat-label>
            <input matInput type="color" required [ngModel]="model.color || '#999999'" (ngModelChange)="setField('color', $event)">
        </mat-form-field>
    </div>
    @if (model.type !== types.dataKeyType.alarm) {
    <div layout="row" layout-align="start center">
        <mat-form-field flex>
            <mat-label>{{ 'datakey.units' | translate }}</mat-label>
            <input matInput name="units" [ngModel]="model.units" (ngModelChange)="setField('units', $event)">
        </mat-form-field>
        <mat-form-field flex>
            <mat-label>{{ 'datakey.decimals' | translate }}</mat-label>
            <input matInput name="decimals" type="number" min="0" max="15" step="1" pattern="^\\d*$"
                   [ngModel]="model.decimals" (ngModelChange)="setField('decimals', $event)">
        </mat-form-field>
    </div>
    }
    @if (model.type === types.dataKeyType.function) {
    <section layout="column">
        <span>{{ 'datakey.data-generation-func' | translate }}</span>
        <br/>
        <tb-js-func [ngModel]="model.funcBody" (ngModelChange)="setField('funcBody', $event)"
                    [functionArgs]="['time', 'prevValue']"
                    [validationArgs]="[[1, 1],[1, '1']]"
                    result-type="any">
        </tb-js-func>
    </section>
    }
    @if (model.type === types.dataKeyType.timeseries || model.type === types.dataKeyType.attribute) {
    <section layout="column">
        <mat-checkbox [ngModel]="model.usePostProcessing" (ngModelChange)="setField('usePostProcessing', $event)"
                      [attr.aria-label]="'datakey.use-data-post-processing-func' | translate">
            {{ 'datakey.use-data-post-processing-func' | translate }}
        </mat-checkbox>
        @if (model.usePostProcessing) {
        <tb-js-func [ngModel]="model.postFuncBody" (ngModelChange)="setField('postFuncBody', $event)"
                    [functionArgs]="['time', 'value', 'prevValue', 'timePrev', 'prevOrigValue']"
                    [validationArgs]="[[1, 1, 1, 1, 1],[1, '1', '1', 1, '1']]"
                    result-type="any">
        </tb-js-func>
        <label class="tb-title" style="margin-left: 15px;">
            time - {{ 'datakey.time-description' | translate }}<br/>
            value - {{ 'datakey.value-description' | translate }}<br/>
            prevValue - {{ 'datakey.prev-value-description' | translate }}<br/>
            timePrev - {{ 'datakey.time-prev-description' | translate }}<br/>
            prevOrigValue - {{ 'datakey.prev-orig-value-description' | translate }}
        </label>
        }
    </section>
    }
</div>
</ng-template>
`,
  providers: ngModelProviders(TbDatakeyConfigDirective),
})
export class TbDatakeyConfigDirective extends NgModelController {
  readonly entityAlias = model<any>();
  readonly fetchEntityKeys = input<FetchEntityKeys>();
  readonly datakeySettingsSchema = model<any>();

  readonly types: any = types;
  alarmFields: string[] = Object.keys((types as any).alarmFields);
  model: any = {};
  keys: string[] = [];

  override $render(): void {
    this.model = {};
    const value = this.$viewValue;
    if (value) {
      this.model.type = value.type;
      this.model.name = value.name;
      this.model.label = value.label;
      this.model.color = value.color;
      this.model.units = value.units;
      this.model.decimals = value.decimals;
      this.model.funcBody = value.funcBody;
      this.model.postFuncBody = value.postFuncBody;
      this.model.usePostProcessing = this.model.postFuncBody ? true : false;
      this.model.settings = value.settings;
    }
  }

  /** One field of the model changed: the legacy deep `scope.$watch('model', …)`. */
  setField(field: string, value: any): void {
    const prevUsePostProcessing = this.model.usePostProcessing;
    this.model[field] = value;
    if (this.model.usePostProcessing != prevUsePostProcessing) {
      if (this.model.usePostProcessing && !this.model.postFuncBody) {
        this.model.postFuncBody = 'return value;';
      } else if (!this.model.usePostProcessing && this.model.postFuncBody) {
        delete this.model.postFuncBody;
      }
    }
    if (this.$viewValue) {
      const target = this.$viewValue;
      target.type = this.model.type;
      target.name = this.model.name;
      target.label = this.model.label;
      target.color = this.model.color;
      target.units = this.model.units;
      target.decimals = this.model.decimals;
      target.funcBody = this.model.funcBody;
      if (!this.model.postFuncBody) {
        delete target.postFuncBody;
      } else {
        target.postFuncBody = this.model.postFuncBody;
      }
      this.$setViewValue(target);
    }
  }

  onKeyTextChange(text: string): void {
    if (text !== this.model.name) {
      this.setField('name', text);
    }
    Promise.resolve(this.keysSearch(text)).then(
      (keys) => (this.keys = keys),
      () => (this.keys = []),
    );
  }

  keysSearch(searchText: string): Promise<string[]> | string[] {
    if (this.model.type === this.types.dataKeyType.alarm) {
      const dataKeys = searchText ? this.alarmFields.filter(this.createFilterForDataKey(searchText)) : [...this.alarmFields];
      dataKeys.push(searchText);
      return dataKeys;
    }
    const fetch = this.fetchEntityKeys();
    if (this.entityAlias() && fetch) {
      return fetch({ entityAliasId: this.entityAlias().id, query: searchText, type: this.model.type }).then((keys) => {
        keys.push(searchText);
        return keys;
      });
    }
    return Promise.resolve([]);
  }

  createFilterForDataKey(query: string): (dataKey: string) => boolean {
    const lowercaseQuery = query.toLowerCase();
    return (dataKey: string) => dataKey.toLowerCase().indexOf(lowercaseQuery) === 0;
  }
}
