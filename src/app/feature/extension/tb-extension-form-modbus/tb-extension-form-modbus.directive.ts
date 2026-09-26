import { Component, OnInit, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { types } from '../../common/constants/types';

import $ from 'jquery';
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

function TcpTransport(this: any): void {
    this.type = "tcp";
    this.host = "localhost";
    this.port = 502;
    this.timeout = 5000;
    this.reconnect = true;
    this.rtuOverTcp = false;
}

function UdpTransport(this: any): void {
    this.type = "udp";
    this.host = "localhost";
    this.port = 502;
    this.timeout = 5000;
}

function RtuTransport(this: any): void {
    this.type = "rtu";
    this.portName = "COM1";
    this.encoding = "ascii";
    this.timeout = 5000;
    this.baudRate = 115200;
    this.dataBits = 7;
    this.stopBits = 1;
    this.parity = "even";
}

function Server(this: any): void {
    this.transport = new (TcpTransport as any)();
    this.devices = [];
}

function Device(this: any): void {
    this.unitId = 1;
    this.deviceName = "";
    this.attributesPollPeriod = 1000;
    this.timeseriesPollPeriod = 1000;
    this.attributes = [];
    this.timeseries = [];
}

function Tag(this: any, globalPollPeriod?: any): void {
    this.tag = "";
    this.type = "long";
    this.pollPeriod = globalPollPeriod;
    this.functionCode = 3;
    this.address = 0;
    this.registerCount = 1;
    this.bit = 0;
    this.byteOrder = "BIG";
}

/**
 * Ported from the AngularJS directive `tbExtensionFormModbus` (module `thingsboard.extension`) in
 * src/app/extension/extensions-forms/extension-form-modbus.directive.js.
 * The legacy `scope.$parent.theForm` is the enclosing extension dialog's form: here the enclosing NgForm.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: '[tb-extension-form-modbus]',
  standalone: true,
  templateUrl: './tb-extension-form-modbus.directive.html',
  imports: [CommonModule, FormsModule, TranslatePipe, MatTooltipModule, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatCheckboxModule, MatCardModule, MatButtonModule, MatExpansionModule],
})
export class TbExtensionFormModbusDirective implements OnInit {
  readonly configuration = model<any>();
  readonly isAdd = model<any>();

  protected readonly types: any = types;
  protected readonly theForm = inject(NgForm, { optional: true });

  ngOnInit(): void {
    if (!this.configuration().servers.length) {
      this.configuration().servers.push(new (Server as any)());
    }
  }

  protected addServer(serversList?: any): void {
    serversList.push(new (Server as any)());
    this.setDirty();
  }

  protected addDevice(deviceList?: any): void {
    deviceList.push(new (Device as any)());
    this.setDirty();
  }

  protected addNewAttribute(device?: any): void {
    device.attributes.push(new (Tag as any)(device.attributesPollPeriod));
    this.setDirty();
  }

  protected addNewTimeseries(device?: any): void {
    device.timeseries.push(new (Tag as any)(device.timeseriesPollPeriod));
    this.setDirty();
  }

  protected removeItem(item?: any, itemList?: any): void {
    const index: any = itemList.indexOf(item);
    if (index > -1) {
      itemList.splice(index, 1);
    }
    this.setDirty();
  }

  protected onTransportChanged(server?: any): void {
    const type: any = server.transport.type;

    if (type === "tcp") {
      server.transport = new (TcpTransport as any)();
    } else if (type === "udp") {
      server.transport = new (UdpTransport as any)();
    } else if (type === "rtu") {
      server.transport = new (RtuTransport as any)();
    }

    this.setDirty();
  }

  protected collapseValidation(index?: any, id?: any): void {
    const invalidState: any = $('#' + id + ':has(.ng-invalid)');
    if (invalidState.length) {
      invalidState.addClass('inner-invalid');
    }
  }

  protected expandValidation(index?: any, id?: any): void {
    const invalidState: any = $('#' + id);
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
