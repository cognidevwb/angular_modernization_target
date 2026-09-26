import { Directive, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import { LegacyInitDirective } from '../../../legacy-init.directive';
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
 * Ported from the AngularJS directive `tbExtensionFormOpc` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-extension-form-opc]',
  standalone: true,
})
export class TbExtensionFormOpcDirective {
  readonly configuration = model<any>();
  readonly isAdd = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: v-accordion, v-pane, v-pane-header, v-pane-content
  // TODO(port): template: 23 × ng-message left in place
  // TODO(port): template: 21 × ng-messages left in place

  protected Server: any = function Server(this: any, ...rest: any[]): any {
    this.applicationName = "Thingsboard OPC-UA client";
    this.applicationUri = "";
    this.host = "localhost";
    this.port = 49320;
    this.scanPeriodInSeconds = 10;
    this.timeoutInMillis = 5000;
    this.security = "Basic128Rsa15";
    this.identity = {
        "type": "anonymous"
    };
    this.keystore = {
        "type": "PKCS12",
        "location": "example.pfx",
        "password": "secret",
        "alias": "gateway",
        "keyPassword": "secret"
    };
    this.mapping = []
  };
  protected Map: any = function Map(this: any, ...rest: any[]): any {
    this.deviceNodePattern = "Channel1\\.Device\\d+$";
    this.deviceNamePattern = "Device ${_System._DeviceId}";
    this.attributes = [];
    this.timeseries = [];
  };
  protected Attribute: any = function Attribute(this: any, ...rest: any[]): any {
    this.key = "Tag1";
    this.type = "string";
    this.value = "${Tag1}";
  };
  protected Timeseries: any = function Timeseries(this: any, ...rest: any[]): any {
    this.key = "Tag2";
    this.type = "long";
    this.value = "${Tag2}";
  };
  types: any;
  theForm: any;
  $parent: any;
  applicationName: any;
  applicationUri: any;
  attributes: any;
  deviceNamePattern: any;
  deviceNodePattern: any;
  host: any;
  identity: any;
  key: any;
  keystore: any;
  mapping: any;
  port: any;
  scanPeriodInSeconds: any;
  security: any;
  timeoutInMillis: any;
  timeseries: any;
  type: any;
  value: any;
  server: any;
  map: any;
  attribute: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.types = this.typesRef;
    this.theForm = this.$parent.theForm;
    if (!this.configuration().servers.length) {
            this.configuration().servers.push(new this.Server());
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  addServer(serversList?: any, ...rest: any[]): any {
    serversList.push(new this.Server());
    // scope.addMap(serversList[serversList.length-1].mapping);

    this.theForm.$setDirty();
  }

  addMap(mappingList?: any, ...rest: any[]): any {
    mappingList.push(new this.Map());
    this.theForm.$setDirty();
  }

  addNewAttribute(attributesList?: any, ...rest: any[]): any {
    attributesList.push(new this.Attribute());
    this.theForm.$setDirty();
  }

  addNewTimeseries(timeseriesList?: any, ...rest: any[]): any {
    timeseriesList.push(new this.Timeseries());
    this.theForm.$setDirty();
  }

  removeItem(item?: any, itemList?: any, ...rest: any[]): any {
    var index: any = itemList.indexOf(item);
    if (index > -1) {
        itemList.splice(index, 1);
    }
    this.theForm.$setDirty();
  }

  fileAdded($file?: any, model?: any, options?: any, ...rest: any[]): any {
    let reader: any = new FileReader();
    reader.onload = (event?: any) => {
        (() => {
            if(event.target.result) {
                this.theForm.$setDirty();
                let addedFile: any = event.target.result;

                if (addedFile && addedFile.length > 0) {
                    model[options.location] = $file.name;
                    model[options.fileContent] = addedFile.replace(/^data.*base64,/, "");

                }
            }
        })();
    };
    reader.readAsDataURL($file.file);

  }

  clearFile(model?: any, options?: any, ...rest: any[]): any {
    this.theForm.$setDirty();

    model[options.location] = null;
    model[options.fileContent] = null;

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
