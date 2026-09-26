import { Directive, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { ParseToNullDirective } from '../parse-to-null/parse-to-null.directive';

import $ from 'jquery';
import extensionFormHttpTemplate from '../../../../app/extension/extensions-forms/extension-form-http.tpl.html?raw';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbExtensionFormHttp` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-extension-form-http]',
  standalone: true,
  hostDirectives: [ParseToNullDirective],
})
export class TbExtensionFormHttpDirective {
  readonly config = model<any>();
  readonly isAdd = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: v-accordion, v-pane, v-pane-header, v-pane-content
  // TODO(port): template: 13 × ng-message left in place
  // TODO(port): template: 11 × ng-messages left in place

  protected template: any = $templateCache.get(extensionFormHttpTemplate);
  types: any;
  theForm: any;
  extensionCustomTransformerOptions: any = {
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
            onLoad: function(_ace?: any, ...rest: any[]) {
                _ace.$blockScrolling = 1;
            }
        };
  $parent: any;
  converterConfigs: any;
  converter: any;
  attribute: any;
  timeseries: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.theForm = this.$parent.theForm;
    if(this.isAdd()) {
            this.converterConfigs = this.config().converterConfigurations;
            this.addConverterConfig();
        } else {
            this.converterConfigs = this.config().converterConfigurations;
        }
    $compile($(this.element.nativeElement).contents())(this);
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

  validateTransformer(model?: any, editorName?: any, ...rest: any[]): any {
    if(model && model.length) {
        try {
            JSON.parse(model);
            this.theForm[editorName].$setValidity('transformerJSON', true);
        } catch(e: any) {
            this.theForm[editorName].$setValidity('transformerJSON', false);
        }
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
