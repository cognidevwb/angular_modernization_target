import { Component, OnInit, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
import { LegacyInitDirective } from '../../../legacy-init.directive';
import { UiAceDirective, UiAceOptions } from '../../components/ui-ace/ui-ace.directive';

/**
 * Ported from the AngularJS directive `tbExtensionFormMqtt` (module `thingsboard.extension`) in
 * src/app/extension/extensions-forms/extension-form-mqtt.directive.js.
 * The legacy `scope.$parent.theForm` is the enclosing extension dialog's form: here the enclosing NgForm.
 * The deep `$watch('brokers')` that set the form's `cert.PEM` validity is a hidden required control
 * in the template bound to `pemCredentialsValid()`.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-extension-form-mqtt]',
  standalone: true,
  templateUrl: './tb-extension-form-mqtt.directive.html',
  imports: [
    CommonModule,
    FormsModule,
    ParseToNullDirective,
    LegacyInitDirective,
    UiAceDirective,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TranslatePipe,
  ],
})
export class TbExtensionFormMqttDirective implements OnInit {
  readonly config = model<any>();
  readonly isAdd = model<any>();

  protected readonly theForm = inject(NgForm, { optional: true });
  readonly types: any = types;

  deviceNameExpressions: any = {
            deviceNameJsonExpression: "extension.converter-json",
            deviceNameTopicExpression: "extension.topic"
        };
  deviceTypeExpressions: any = {
            deviceTypeJsonExpression: "extension.converter-json",
            deviceTypeTopicExpression: "extension.topic"
        };
  attributeKeyExpressions: any = {
            attributeKeyJsonExpression: "extension.converter-json",
            attributeKeyTopicExpression: "extension.topic"
        };
  requestIdExpressions: any = {
            requestIdJsonExpression: "extension.converter-json",
            requestIdTopicExpression: "extension.topic"
        };
  extensionCustomConverterOptions: UiAceOptions = {
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
  brokers: any[] = [];

  ngOnInit(): void {
    if (this.isAdd()) {
      this.brokers = [];
      this.config().brokers = this.brokers;
      this.addBroker();
    } else {
      this.brokers = this.config().brokers;
    }
  }

  /** The legacy `updateValidity`: every PEM-credentialled broker has its three files. */
  pemCredentialsValid(): boolean {
    return (this.brokers || []).every((broker: any) =>
      broker.credentials.type != this.types.mqttCredentialTypes.pem.value ||
      !!(broker.credentials.caCert && broker.credentials.privateKey && broker.credentials.cert));
  }

  addBroker(...rest: any[]): any {
    var newBroker: any = {
        host: "localhost",
        port: 1882,
        ssl: false,
        retryInterval: 3000,
        credentials: {type:"anonymous"},
        mapping: [],
        connectRequests: [],
        disconnectRequests: [],
        attributeRequests: [],
        attributeUpdates: [],
        serverSideRpc: []
    };
    this.brokers.push(newBroker);
  }

  removeBroker(broker?: any, ...rest: any[]): any {
    var index: any = this.brokers.indexOf(broker);
    if (index > -1) {
        this.brokers.splice(index, 1);
    }
  }

  addMap(mapping?: any, ...rest: any[]): any {
    var newMap: any = {topicFilter:"sensors", converter:{attributes:[],timeseries:[]}};

    mapping.push(newMap);
  }

  removeMap(map?: any, mapping?: any, ...rest: any[]): any {
    var index: any = mapping.indexOf(map);
    if (index > -1) {
        mapping.splice(index, 1);
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

  addConnectRequest(requests?: any, type?: any, ...rest: any[]): any {
    var newRequest: any = {};
    if(type == "connect") {
        newRequest.topicFilter = "sensors/connect";
    } else {
        newRequest.topicFilter = "sensors/disconnect";
    }
    requests.push(newRequest);
  }

  addAttributeRequest(requests?: any, ...rest: any[]): any {
    var newRequest: any = {
        topicFilter: "sensors/attributes",
        clientScope: false,
        responseTopicExpression: "sensors/${deviceName}/attributes/${responseId}",
        valueExpression: "${attributeValue}"
    };
    requests.push(newRequest);
  }

  addAttributeUpdate(updates?: any, ...rest: any[]): any {
    var newUpdate: any = {
        deviceNameFilter: ".*",
        attributeFilter: ".*",
        topicExpression: "sensor/${deviceName}/${attributeKey}",
        valueExpression: "{\"${attributeKey}\":\"${attributeValue}\"}"
    }
    updates.push(newUpdate);
  }

  addServerSideRpc(rpcRequests?: any, ...rest: any[]): any {
    var newRpc: any = {
        deviceNameFilter: ".*",
        methodFilter: "echo",
        requestTopicExpression: "sensor/${deviceName}/request/${methodName}/${requestId}",
        responseTopicExpression: "sensor/${deviceName}/response/${methodName}/${requestId}",
        responseTimeout: 10000,
        valueExpression: "${params}"
    };
    rpcRequests.push(newRpc);
  }

  changeCredentials(broker?: any, ...rest: any[]): any {
    var type: any = broker.credentials.type;
    broker.credentials = {};
    broker.credentials.type = type;
  }

  changeConverterType(map?: any, ...rest: any[]): any {
    if(map.converterType == "custom"){
        map.converter = "";
    }
    if(map.converterType == "json") {
        map.converter = {attributes:[],timeseries:[]};
    }
  }

  changeNameExpression(target?: any, type?: any, ...rest: any[]): any {
    if(target.nameExp == "deviceNameJsonExpression") {
        if(target.deviceNameTopicExpression) {
            delete target.deviceNameTopicExpression;
        }
        if(type) {
            target.deviceNameJsonExpression = "${$.serialNumber}";
        }
    }
    if(target.nameExp == "deviceNameTopicExpression") {
        if(target.deviceNameJsonExpression) {
            delete target.deviceNameJsonExpression;
        }
        if(type && type == "connect") {
            target.deviceNameTopicExpression = "(?<=sensor\\/)(.*?)(?=\\/connect)";
        }
        if(type && type == "disconnect") {
            target.deviceNameTopicExpression = "(?<=sensor\\/)(.*?)(?=\\/disconnect)";
        }
        if(type && type == "attribute") {
            target.deviceNameTopicExpression = "(?<=sensors\\/)(.*?)(?=\\/attributes)";
        }
    }
  }

  changeTypeExpression(converter?: any, ...rest: any[]): any {
    if(converter.typeExp == "deviceTypeJsonExpression") {
        if(converter.deviceTypeTopicExpression) {
            delete converter.deviceTypeTopicExpression;
        }
    }
    if(converter.typeExp == "deviceTypeTopicExpression") {
        if(converter.deviceTypeJsonExpression) {
            delete converter.deviceTypeJsonExpression;
        }
    }
  }

  changeAttrKeyExpression(request?: any, ...rest: any[]): any {
    if(request.attrKey == "attributeKeyJsonExpression") {
        if(request.attributeKeyTopicExpression) {
            delete request.attributeKeyTopicExpression;
        }
        request.attributeKeyJsonExpression = "${$.key}";
    }
    if(request.attrKey == "attributeKeyTopicExpression") {
        if(request.attributeKeyJsonExpression) {
            delete request.attributeKeyJsonExpression;
        }
        request.attributeKeyTopicExpression = "(?<=attributes\\/)(.*?)(?=\\/request)";
    }
  }

  changeRequestIdExpression(request?: any, ...rest: any[]): any {
    if(request.requestId == "requestIdJsonExpression") {
        if(request.requestIdTopicExpression) {
            delete request.requestIdTopicExpression;
        }
        request.requestIdJsonExpression = "${$.requestId}";
    }
    if(request.requestId == "requestIdTopicExpression") {
        if(request.requestIdJsonExpression) {
            delete request.requestIdJsonExpression;
        }
        request.requestIdTopicExpression = "(?<=request\\/)(.*?)($)";
    }
  }

  validateCustomConverter(model: any, editorName: string): void {
    const control = this.theForm?.controls[editorName];
    if (control && model && model.length) {
      let valid = true;
      try {
        JSON.parse(model);
      } catch (e: unknown) {
        valid = false;
      }
      const { converterJSON: _prev, ...others } = control.errors ?? {};
      const errors = valid ? others : { ...others, converterJSON: true };
      control.setErrors(Object.keys(errors).length ? errors : null);
    }
  }

  /** The legacy ng-flow `flow-file-added`, from the file input. */
  onFileInput(event: Event, broker: any, fileType: string): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileAdded(file, broker, fileType);
    }
    input.value = '';
  }

  /** The legacy ng-flow `flow-drop` area. */
  onFileDrop(event: DragEvent, broker: any, fileType: string): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fileAdded(file, broker, fileType);
    }
  }

  fileAdded(file: File, broker: any, fileType: string): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
        const addedFile: any = event.target?.result;
        if (addedFile) {
            this.setDirty();
            if (addedFile.length > 0) {
                if(fileType == "caCert") {
                    broker.credentials.caCertFileName = file.name;
                    broker.credentials.caCert = addedFile.replace(/^data.*base64,/, "");
                }
                if(fileType == "privateKey") {
                    broker.credentials.privateKeyFileName = file.name;
                    broker.credentials.privateKey = addedFile.replace(/^data.*base64,/, "");
                }
                if(fileType == "Cert") {
                    broker.credentials.certFileName = file.name;
                    broker.credentials.cert = addedFile.replace(/^data.*base64,/, "");
                }
            }
        }
    };
    reader.readAsDataURL(file);
  }

  clearFile(broker?: any, fileType?: any, ...rest: any[]): any {
    this.setDirty();
    if(fileType == "caCert") {
        broker.credentials.caCertFileName = null;
        broker.credentials.caCert = null;
    }
    if(fileType == "privateKey") {
        broker.credentials.privateKeyFileName = null;
        broker.credentials.privateKey = null;
    }
    if(fileType == "Cert") {
        broker.credentials.certFileName = null;
        broker.credentials.cert = null;
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

  private setDirty(): void {
    this.theForm?.form.markAsDirty();
  }
}
