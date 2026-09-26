import { Component, forwardRef, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ParseToNullDirective } from '../parse-to-null/parse-to-null.directive';

import $ from 'jquery';
import { LegacyInitDirective } from '../../../legacy-init.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
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
 * Ported from the AngularJS directive `tbExtensionFormMqtt` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: '[tb-extension-form-mqtt]',
  standalone: true,
  templateUrl: './tb-extension-form-mqtt.directive.html',
  imports: [
    CommonModule,
    FormsModule,
    ParseToNullDirective,
    LegacyInitDirective,
    MatButtonModule,
    MatCardModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatTooltipModule,
    TranslatePipe,
  ],
})
export class TbExtensionFormMqttDirective {
  readonly config = model<any>();
  readonly isAdd = model<any>();

  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: v-accordion, v-pane, v-pane-header, v-pane-content
  // TODO(port): template: 52 × ng-message left in place
  // TODO(port): template: 49 × ng-messages left in place

  types: any;
  theForm: any;
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
  extensionCustomConverterOptions: any = {
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
  $watch: any;
  brokers: any;
  broker: any;
  map: any;
  attribute: any;
  timeseries: any;
  connectRequest: any;
  disconnectRequest: any;
  attributeRequest: any;
  attributeUpdate: any;
  rpc: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.types = this.typesRef;
    this.theForm = this.$parent.theForm;
    this.$watch('brokers', () => {
            this.updateValidity();
        }, true);
    if(this.isAdd()) {
            this.brokers = [];
            this.config().brokers = this.brokers;
            this.addBroker();
        } else {
            this.brokers = this.config().brokers;
        }
  }

  updateValidity(...rest: any[]): any {
    if(this.brokers.length) {
        for(let i: any=0;i<this.brokers.length;i++) {
            if(this.brokers[i].credentials.type == this.types.mqttCredentialTypes.pem.value) {
                if(!(this.brokers[i].credentials.caCert && this.brokers[i].credentials.privateKey && this.brokers[i].credentials.cert)) {
                    this.theForm.$setValidity('cert.PEM', false);
                    break;
                } else {
                    this.theForm.$setValidity('cert.PEM', true);
                }
            }
        }
    }
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

  changeNameExpression(element?: any, type?: any, ...rest: any[]): any {
    if(element.nameExp == "deviceNameJsonExpression") {
        if(element.deviceNameTopicExpression) {
            delete element.deviceNameTopicExpression;
        }
        if(type) {
            element.deviceNameJsonExpression = "${$.serialNumber}";
        }
    }
    if(element.nameExp == "deviceNameTopicExpression") {
        if(element.deviceNameJsonExpression) {
            delete element.deviceNameJsonExpression;
        }
        if(type && type == "connect") {
            element.deviceNameTopicExpression = "(?<=sensor\\/)(.*?)(?=\\/connect)";
        }
        if(type && type == "disconnect") {
            element.deviceNameTopicExpression = "(?<=sensor\\/)(.*?)(?=\\/disconnect)";
        }
        if(type && type == "attribute") {
            element.deviceNameTopicExpression = "(?<=sensors\\/)(.*?)(?=\\/attributes)";
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

  validateCustomConverter(model?: any, editorName?: any, ...rest: any[]): any {
    if(model && model.length) {
        try {
            JSON.parse(model);
            this.theForm[editorName].$setValidity('converterJSON', true);
        } catch(e: any) {
            this.theForm[editorName].$setValidity('converterJSON', false);
        }
    }
  }

  fileAdded($file?: any, broker?: any, fileType?: any, ...rest: any[]): any {
    var reader: any = new FileReader();
    reader.onload = (event?: any) => {
        (() => {
            if(event.target.result) {
                this.theForm.$setDirty();
                var addedFile: any = event.target.result;
                if (addedFile && addedFile.length > 0) {
                    if(fileType == "caCert") {
                        broker.credentials.caCertFileName = $file.name;
                        broker.credentials.caCert = addedFile.replace(/^data.*base64,/, "");
                    }
                    if(fileType == "privateKey") {
                        broker.credentials.privateKeyFileName = $file.name;
                        broker.credentials.privateKey = addedFile.replace(/^data.*base64,/, "");
                    }
                    if(fileType == "Cert") {
                        broker.credentials.certFileName = $file.name;
                        broker.credentials.cert = addedFile.replace(/^data.*base64,/, "");
                    }
                }
            }
        })();
    };
    reader.readAsDataURL($file.file);
  }

  clearFile(broker?: any, fileType?: any, ...rest: any[]): any {
    this.theForm.$setDirty();
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
}
