import { Component, OnInit, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import $ from 'jquery';
import { types } from '../../common/constants/types';
import { ParseToNullDirective } from '../parse-to-null/parse-to-null.directive';
import { UiAceDirective, UiAceOptions } from '../../components/ui-ace/ui-ace.directive';

/**
 * Ported from the AngularJS directive `tbExtensionFormHttp` (module `thingsboard.extension`) in
 * src/app/extension/extensions-forms/extension-form-http.directive.js.
 * The legacy `scope.$parent.theForm` is the enclosing extension dialog's form: here the enclosing NgForm.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-extension-form-http]',
  standalone: true,
  templateUrl: './tb-extension-form-http.directive.html',
  imports: [
    CommonModule,
    FormsModule,
    ParseToNullDirective,
    UiAceDirective,
    MatButtonModule,
    MatCardModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TranslatePipe,
  ],
})
export class TbExtensionFormHttpDirective implements OnInit {
  readonly config = model<any>();
  readonly isAdd = model<any>();

  protected readonly theForm = inject(NgForm, { optional: true });
  readonly types: any = types;
  extensionCustomTransformerOptions: UiAceOptions = {
            useWrapMode: false,
            mode: 'json',
            showGutter: true,
            showPrintMargin: true,
            theme: 'github',
            advanced: {
                enableSnippets: true,
                enableBasicAutocompletion: true,
                enableLiveAutocompletion: true
            },
            onLoad: (_ace: any) => {
                _ace.$blockScrolling = 1;
            }
        };
  converterConfigs: any[] = [];

  ngOnInit(): void {
    this.converterConfigs = this.config().converterConfigurations;
    if (this.isAdd()) {
      this.addConverterConfig();
    }
  }

  addConverterConfig(...rest: any[]): any {
    var newConverterConfig: any = {converterId:"", converters:[]};
    this.converterConfigs.push(newConverterConfig);

    this.converterConfigs[this.converterConfigs.length - 1].converters = [];
    this.addConverter(this.converterConfigs[this.converterConfigs.length - 1].converters);
  }

  removeConverterConfig(config?: any, ...rest: any[]): any {
    var index: any = this.converterConfigs.indexOf(config);
    if (index > -1) {
        this.converterConfigs.splice(index, 1);
    }
  }

  addConverter(converters?: any, ...rest: any[]): any {
    var newConverter: any = {
        deviceNameJsonExpression:"",
        deviceTypeJsonExpression:"",
        attributes:[],
        timeseries:[]
    };
    converters.push(newConverter);
  }

  removeConverter(converter?: any, converters?: any, ...rest: any[]): any {
    var index: any = converters.indexOf(converter);
    if (index > -1) {
        converters.splice(index, 1);
    }
  }

  addAttribute(attributes?: any, ...rest: any[]): any {
    var newAttribute: any = {type:"", key:"", value:""};
    attributes.push(newAttribute);
  }

  removeAttribute(attribute?: any, attributes?: any, ...rest: any[]): any {
    var index: any = attributes.indexOf(attribute);
    if (index > -1) {
        attributes.splice(index, 1);
    }
  }

  transformerTypeChange(attribute?: any, ...rest: any[]): any {
    attribute.transformer = "";
  }

  validateTransformer(model: any, editorName: string): void {
    const control = this.theForm?.controls[editorName];
    if (control && model && model.length) {
      let valid = true;
      try {
        JSON.parse(model);
      } catch (e: unknown) {
        valid = false;
      }
      const { transformerJSON: _prev, ...others } = control.errors ?? {};
      const errors = valid ? others : { ...others, transformerJSON: true };
      control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  collapseValidation(index?: any, id?: any, ...rest: any[]): any {
    var invalidState: any = $('#'+id+':has(.ng-invalid)');
    if(invalidState.length) {
        invalidState.addClass('inner-invalid');
    }
  }

  expandValidation(index?: any, id?: any, ...rest: any[]): any {
    var invalidState: any = $('#'+id);
    invalidState.removeClass('inner-invalid');
  }

  /** The keys of a `(k, v) in obj` repeat, in the object's own order. */
  protected __keys(obj: any): string[] {
    return obj ? Object.keys(obj) : [];
  }
}
