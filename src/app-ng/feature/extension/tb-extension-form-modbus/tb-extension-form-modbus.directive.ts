import { Directive, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import extensionFormModbusTemplate from '../../../../app/extension/extensions-forms/extension-form-modbus.tpl.html?raw';
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
declare let vm: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbExtensionFormModbus` (module `thingsboard.extension`) in src/app/extension/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Directive({
  selector: '[tb-extension-form-modbus]',
  standalone: true,
})
@Component({
  selector: '[tb-extension-form-modbus]',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatCardModule, MatButtonModule],
})
export class TbExtensionFormModbusDirective {
  readonly configuration = model<any>();
  readonly isAdd = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly typesRef: any = types;
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: v-accordion, v-pane, v-pane-header, v-pane-content
  // TODO(port): template: 49 × ng-message left in place
  // TODO(port): template: 31 × ng-messages left in place

  protected TcpTransport: any = function TcpTransport(this: any, ...rest: any[]): any {
    this.type = "tcp",
    this.host = "localhost",
    this.port = 502,
    this.timeout = 5000,
    this.reconnect = true,
    this.rtuOverTcp = false
  };
  protected UdpTransport: any = function UdpTransport(this: any, ...rest: any[]): any {
    this.type = "udp",
    this.host = "localhost",
    this.port = 502,
    this.timeout = 5000
  };
  protected RtuTransport: any = function RtuTransport(this: any, ...rest: any[]): any {
    this.type = "rtu",
    this.portName = "COM1",
    this.encoding = "ascii",
    this.timeout = 5000,
    this.baudRate = 115200,
    this.dataBits = 7,
    this.stopBits = 1,
    this.parity ="even"
  };
  protected Server: any = function Server(this: any, ...rest: any[]): any {
    this.transport = new vm.TcpTransport();
    this.devices = []
  };
  protected Device: any = function Device(this: any, ...rest: any[]): any {
    this.unitId = 1;
    this.deviceName = "";
    this.attributesPollPeriod = 1000;
    this.timeseriesPollPeriod = 1000;
    this.attributes = [];
    this.timeseries = [];
  };
  protected Tag: any = function Tag(this: any, globalPollPeriod?: any, ...rest: any[]): any {
    this.tag = "";
    this.type = "long";
    this.pollPeriod = globalPollPeriod;
    this.functionCode = 3;
    this.address = 0;
    this.registerCount = 1;
    this.bit = 0;
    this.byteOrder = "BIG";
  };
  protected template: any = $templateCache.get(extensionFormModbusTemplate);
  types: any;
  theForm: any;
  $parent: any;
  address: any;
  attributes: any;
  attributesPollPeriod: any;
  baudRate: any;
  bit: any;
  byteOrder: any;
  dataBits: any;
  deviceName: any;
  devices: any;
  encoding: any;
  functionCode: any;
  host: any;
  parity: any;
  pollPeriod: any;
  port: any;
  portName: any;
  reconnect: any;
  registerCount: any;
  rtuOverTcp: any;
  stopBits: any;
  tag: any;
  timeout: any;
  timeseries: any;
  timeseriesPollPeriod: any;
  transport: any;
  type: any;
  unitId: any;
  server: any;
  device: any;
  attribute: any;
  timeserie: any;

  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.types = this.typesRef;
    this.theForm = this.$parent.theForm;
    if (!this.configuration().servers.length) {
            this.configuration().servers.push(new this.Server());
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  addServer(serversList?: any, ...rest: any[]): any {
    serversList.push(new this.Server());
    this.theForm.$setDirty();
  }

  addDevice(deviceList?: any, ...rest: any[]): any {
    deviceList.push(new this.Device());
    this.theForm.$setDirty();
  }

  addNewAttribute(device?: any, ...rest: any[]): any {
    device.attributes.push(new this.Tag(device.attributesPollPeriod));
    this.theForm.$setDirty();
  }

  addNewTimeseries(device?: any, ...rest: any[]): any {
    device.timeseries.push(new this.Tag(device.timeseriesPollPeriod));
    this.theForm.$setDirty();
  }

  removeItem(item?: any, itemList?: any, ...rest: any[]): any {
    var index: any = itemList.indexOf(item);
    if (index > -1) {
        itemList.splice(index, 1);
    }
    this.theForm.$setDirty();
  }

  onTransportChanged(server?: any, ...rest: any[]): any {
    var type: any = server.transport.type;

    if (type === "tcp") {
        server.transport = new this.TcpTransport();
    } else if (type === "udp") {
        server.transport = new this.UdpTransport();
    } else if (type === "rtu") {
        server.transport = new this.RtuTransport();
    }

    this.theForm.$setDirty();
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
