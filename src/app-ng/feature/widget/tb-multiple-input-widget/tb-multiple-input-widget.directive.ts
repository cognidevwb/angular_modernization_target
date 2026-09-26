import { Component, DestroyRef, effect, inject, model, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import $ from 'jquery';
import moment from 'moment';
import { onWidgetEvent } from '../../components/widget/widget-scope';
import { AttributeService } from '../../api/services/attribute.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { ToastService } from '../../services/toast.service';

/**
 * Ported from the AngularJS directive `tbMultipleInputWidget` (module `thingsboard.widgets.multipleInputWidget`) in src/app/widget/lib/multiple-input-widget.js:24.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-multiple-input-widget',
  standalone: true,
  imports: [TranslatePipe, MatSlideToggleModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, MatDatepickerModule, CommonModule, FormsModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './tb-multiple-input-widget.directive.html',
})
export class TbMultipleInputWidgetDirective {
  readonly formId = model<any>();
  readonly ctx = model<any>();

  private readonly translate = inject(TranslateService);
  private readonly attributeService = inject(AttributeService);
  private readonly toast = inject(ToastService);
  private readonly utils = inject(UtilsService);
  private readonly destroyRef = inject(DestroyRef);

  /** The legacy `name="multipleInputForm"` form controller. */
  protected readonly multipleInputForm = viewChild<NgForm>('multipleInputForm');

  protected entityDetected = false;
  protected isAllParametersValid = true;
  protected sources: any[] = [];
  protected settings: any;
  protected isVerticalAlignment = false;
  protected changeAlignment = false;
  protected inputWidthSettings: any;
  protected smallWidthContainer = false;
  protected isFocused = false;
  protected widgetTitle: any;

  private datasources: any = null;
  private widgetConfig: any;
  private subscription: any;

  constructor() {
    effect(() => {
      const ctx = this.ctx();
      if (ctx && ctx.defaultSubscription) {
        this.settings = ctx.settings;
        this.widgetConfig = ctx.widgetConfig;
        this.subscription = ctx.defaultSubscription;
        this.datasources = this.subscription.datasources;
        this.initializeConfig();
        this.updateDatasources();
        this.listenForWidgetEvents(ctx);
      }
    });
    this.destroyRef.onDestroy(() => this.offWidgetEvents.forEach((off) => off?.()));
  }

  private offWidgetEvents: ((() => void) | null)[] = [];

  /** The widget type's script broadcasts on its widget scope (`ctx.$scope`) when data arrived or the widget resized. */
  private listenForWidgetEvents(ctx: any): void {
    this.offWidgetEvents.forEach((off) => off?.());
    this.offWidgetEvents = [
      onWidgetEvent(ctx, 'multiple-input-data-updated', (_event: any, formId: any) => {
        if (this.formId() == formId) {
          this.updateWidgetData(this.subscription.data);
        }
      }),
      onWidgetEvent(ctx, 'multiple-input-resize', (_event: any, formId: any) => {
        if (this.formId() == formId) {
          this.updateWidgetDisplaying();
        }
      }),
    ];
  }

  protected discardAll(): void {
    for (let i = 0; i < this.sources.length; i++) {
      for (let j = 0; j < this.sources[i].keys.length; j++) {
        this.sources[i].keys[j].data.currentValue = this.sources[i].keys[j].data.originalValue;
      }
    }
    this.multipleInputForm()?.form.markAsPristine();
  }

  protected inputChanged(source?: any, key?: any): void {
    if (!this.settings.showActionButtons) {
      if (!key.settings.required || (key.settings.required && key.data && key.data.currentValue !== undefined)) {
        const dataToSave: any = {
          datasource: source.datasource,
          keys: [key]
        };
        this.save(dataToSave);
      }
    }
  }

  /** `md-select-on-focus`: the input's text is selected when it takes focus. */
  protected selectOnFocus(event: FocusEvent): void {
    const target = event.target as HTMLInputElement | null;
    target?.select();
  }

  /** The date part picked for a `date`/`dateTime` key; a `dateTime` key keeps its time of day. */
  protected onDatePicked(source: any, key: any, date: Date | null): void {
    if (date) {
      const current: Date | undefined = key.data.currentValue instanceof Date ? key.data.currentValue : undefined;
      const value = new Date(date.getTime());
      if (current && key.settings.dataKeyValueType === 'dateTime') {
        value.setHours(current.getHours(), current.getMinutes(), current.getSeconds(), current.getMilliseconds());
      }
      key.data.currentValue = value;
    } else {
      key.data.currentValue = date;
    }
    this.multipleInputForm()?.form.markAsDirty();
    this.inputChanged(source, key);
  }

  /** The `HH:mm` shown by a time input for a key's value. */
  protected timeText(value: any): string {
    return value instanceof Date ? moment(value).format('HH:mm') : '';
  }

  /** The time of day picked for a `time`/`dateTime` key; the date part stays (today when there is none). */
  protected onTimePicked(source: any, key: any, text: string): void {
    if (text) {
      const [hours, minutes] = text.split(':').map((part) => parseInt(part, 10));
      const value = key.data.currentValue instanceof Date ? new Date(key.data.currentValue.getTime()) : moment().startOf('day').toDate();
      value.setHours(hours, minutes, 0, 0);
      key.data.currentValue = value;
    } else {
      key.data.currentValue = undefined;
    }
    this.multipleInputForm()?.form.markAsDirty();
    this.inputChanged(source, key);
  }

  protected save(dataToSave?: any): void {
    const tasks: any[] = [];
    const config: any = {
      ignoreLoading: !this.settings.showActionButtons
    };
    let data: any;
    if (dataToSave) {
      data = [dataToSave];
    } else {
      data = this.sources;
    }
    for (let i = 0; i < data.length; i++) {
      const serverAttributes: any[] = [], sharedAttributes: any[] = [], telemetry: any[] = [];
      for (let j = 0; j < data[i].keys.length; j++) {
        const key: any = data[i].keys[j];
        if ((key.data.currentValue !== key.data.originalValue) || this.settings.updateAllValues) {
          const attribute: any = {
            key: key.name
          };
          if (key.data.currentValue) {
            switch (key.settings.dataKeyValueType) {
              case 'dateTime':
              case 'date':
                attribute.value = key.data.currentValue.getTime();
                break;
              case 'time':
                attribute.value = key.data.currentValue.getTime() - moment().startOf('day').valueOf();
                break;
              default:
                attribute.value = key.data.currentValue;
            }
          } else {
            if (key.data.currentValue === '') {
              attribute.value = null;
            } else {
              attribute.value = key.data.currentValue;
            }
          }

          switch (key.settings.dataKeyType) {
            case 'shared':
              sharedAttributes.push(attribute);
              break;
            case 'timeseries':
              telemetry.push(attribute);
              break;
            default:
              serverAttributes.push(attribute);
          }
        }
      }
      if (serverAttributes.length) {
        tasks.push(this.attributeService.saveEntityAttributes(
          data[i].datasource.entityType,
          data[i].datasource.entityId,
          types.attributesScope.server.value,
          serverAttributes,
          config));
      }
      if (sharedAttributes.length) {
        tasks.push(this.attributeService.saveEntityAttributes(
          data[i].datasource.entityType,
          data[i].datasource.entityId,
          types.attributesScope.shared.value,
          sharedAttributes,
          config));
      }
      if (telemetry.length) {
        tasks.push(this.attributeService.saveEntityTimeseries(
          data[i].datasource.entityType,
          data[i].datasource.entityId,
          types.latestTelemetry.value,
          telemetry,
          config));
      }
    }

    if (tasks.length) {
      Promise.all(tasks).then(
        () => {
          this.multipleInputForm()?.form.markAsPristine();
          if (this.settings.showResultMessage) {
            this.toast.showSuccess(this.translate.instant('widgets.input-widgets.update-successful'), 1000, $(this.ctx().$container), 'bottom left');
          }
        },
        () => {
          if (this.settings.showResultMessage) {
            this.toast.showError(this.translate.instant('widgets.input-widgets.update-failed'), $(this.ctx().$container), 'bottom left');
          }
        }
      );
    } else {
      this.multipleInputForm()?.form.markAsPristine();
    }
  }

  private initializeConfig(): void {
    const ctx: any = this.ctx();

    if (this.settings.widgetTitle && this.settings.widgetTitle.length) {
      this.widgetTitle = this.utils.customTranslation(this.settings.widgetTitle, this.settings.widgetTitle);
    } else {
      this.widgetTitle = ctx.widgetConfig.title;
    }

    ctx.widgetTitle = this.widgetTitle;

    this.settings.groupTitle = this.settings.groupTitle || "${entityName}";

    //For backward compatibility
    if (this.settings.showActionButtons === undefined) {
      this.settings.showActionButtons = true;
    }
    if (this.settings.fieldsAlignment === undefined) {
      this.settings.fieldsAlignment = 'row';
    }
    if (this.settings.fieldsInRow === undefined) {
      this.settings.fieldsInRow = 2;
    }
    //For backward compatibility

    this.isVerticalAlignment = !(this.settings.fieldsAlignment === 'row');

    if (!this.isVerticalAlignment && this.settings.fieldsInRow) {
      this.inputWidthSettings = 100 / this.settings.fieldsInRow + '%';
    }
    this.updateWidgetDisplaying();
  }

  private updateDatasources(): void {
    if (this.datasources && this.datasources.length) {
      this.entityDetected = true;
      for (let i = 0; i < this.datasources.length; i++) {
        const datasource: any = this.datasources[i];
        const source: any = {
          datasource: datasource,
          keys: []
        };
        if (datasource.type === types.datasourceType.entity) {
          for (let j = 0; j < datasource.dataKeys.length; j++) {
            if ((datasource.entityType !== types.entityType.device) && (datasource.dataKeys[j].settings.dataKeyType == 'shared')) {
              this.isAllParametersValid = false;
            }
            source.keys.push(datasource.dataKeys[j]);
            if (source.keys[j].units) {
              source.keys[j].label += ' (' + source.keys[j].units + ')';
            }
            source.keys[j].data = {};

            //For backward compatibility
            if (source.keys[j].settings.dataKeyType === undefined) {
              if (this.settings.attributesShared) {
                source.keys[j].settings.dataKeyType = 'shared';
              } else {
                source.keys[j].settings.dataKeyType = 'server';
              }
            }

            if (source.keys[j].settings.dataKeyValueType === undefined) {
              if (source.keys[j].settings.inputTypeNumber) {
                source.keys[j].settings.dataKeyValueType = 'double';
              } else {
                source.keys[j].settings.dataKeyValueType = 'string';
              }
            }

            if (source.keys[j].settings.isEditable === undefined) {
              if (source.keys[j].settings.readOnly) {
                source.keys[j].settings.isEditable = 'readonly';
              } else {
                source.keys[j].settings.isEditable = 'editable';
              }
            }
            //For backward compatibility

          }
        } else {
          this.entityDetected = false;
        }
        this.sources.push(source);
      }
    }
  }

  private updateWidgetData(data?: any): void {
    let dataIndex = 0;
    for (let i = 0; i < this.sources.length; i++) {
      const source: any = this.sources[i];
      for (let j = 0; j < source.keys.length; j++) {
        const keyData: any = data[dataIndex].data;
        const key: any = source.keys[j];
        if (keyData && keyData.length) {
          let value: any;
          switch (key.settings.dataKeyValueType) {
            case 'dateTime':
            case 'date':
              value = moment(keyData[0][1]).toDate();
              break;
            case 'time':
              value = moment().startOf('day').add(keyData[0][1], 'ms').toDate();
              break;
            case 'booleanCheckbox':
            case 'booleanSwitch':
              value = (keyData[0][1] === 'true');
              break;
            default:
              value = keyData[0][1];
          }

          key.data = {
            currentValue: value,
            originalValue: value
          };
        }

        if (key.settings.isEditable === 'editable' && key.settings.disabledOnDataKey) {
          const conditions: any = data.filter((item?: any) => {
            return item.dataKey.name === key.settings.disabledOnDataKey;
          });
          if (conditions && conditions.length) {
            if (conditions[0].data.length) {
              if (conditions[0].data[0][1] === 'false') {
                key.settings.disabledOnCondition = true;
              } else {
                key.settings.disabledOnCondition = !conditions[0].data[0][1];
              }
            }
          }
        }
        dataIndex++;
      }
    }
  }

  private updateWidgetDisplaying(): void {
    const ctx: any = this.ctx();
    this.changeAlignment = (ctx.$container[0].offsetWidth < 620);
    this.smallWidthContainer = (ctx.$container[0].offsetWidth < 420);
  }

  protected getGroupTitle(datasource?: any): any {
    return this.utils.createLabelFromDatasource(datasource, this.settings.groupTitle);
  }
}
