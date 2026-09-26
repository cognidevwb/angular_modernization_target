import { Component, OnInit, inject, model } from '@angular/core';
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
import { LegacyInitDirective } from '../../../legacy-init.directive';

/** Which keystore fields a picked file fills: its name and its base64 content. */
interface FileFields {
  location: string;
  fileContent: string;
}

/**
 * Ported from the AngularJS directive `tbExtensionFormOpc` (module `thingsboard.extension`) in
 * src/app/extension/extensions-forms/extension-form-opc.directive.js.
 * The legacy `scope.$parent.theForm` is the enclosing extension dialog's form: here the enclosing NgForm.
 */
@Component({
  selector: '[tb-extension-form-opc]',
  standalone: true,
  templateUrl: './tb-extension-form-opc.directive.html',
  imports: [
    CommonModule,
    FormsModule,
    LegacyInitDirective,
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
export class TbExtensionFormOpcDirective implements OnInit {
  readonly configuration = model<any>();
  readonly isAdd = model<any>();

  protected readonly theForm = inject(NgForm, { optional: true });
  readonly types: any = types;

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
  ngOnInit(): void {
    if (!this.configuration().servers.length) {
      this.configuration().servers.push(new this.Server());
    }
  }

  addServer(serversList?: any, ...rest: any[]): any {
    serversList.push(new this.Server());
    // scope.addMap(serversList[serversList.length-1].mapping);

    this.setDirty();
  }

  addMap(mappingList?: any, ...rest: any[]): any {
    mappingList.push(new this.Map());
    this.setDirty();
  }

  addNewAttribute(attributesList?: any, ...rest: any[]): any {
    attributesList.push(new this.Attribute());
    this.setDirty();
  }

  addNewTimeseries(timeseriesList?: any, ...rest: any[]): any {
    timeseriesList.push(new this.Timeseries());
    this.setDirty();
  }

  removeItem(item?: any, itemList?: any, ...rest: any[]): any {
    var index: any = itemList.indexOf(item);
    if (index > -1) {
        itemList.splice(index, 1);
    }
    this.setDirty();
  }

  fileAdded(file: File, model: any, options: FileFields): void {
    const reader = new FileReader();
    reader.onload = (event: ProgressEvent<FileReader>) => {
        const addedFile: any = event.target?.result;
        if (addedFile) {
            this.setDirty();
            if (addedFile.length > 0) {
                model[options.location] = file.name;
                model[options.fileContent] = addedFile.replace(/^data.*base64,/, "");
            }
        }
    };
    reader.readAsDataURL(file);
  }

  /** The legacy ng-flow `flow-file-added`, from the file input. */
  onFileInput(event: Event, model: any, options: FileFields): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) {
      this.fileAdded(file, model, options);
    }
    input.value = '';
  }

  /** The legacy ng-flow `flow-drop` area. */
  onFileDrop(event: DragEvent, model: any, options: FileFields): void {
    event.preventDefault();
    const file = event.dataTransfer?.files?.[0];
    if (file) {
      this.fileAdded(file, model, options);
    }
  }

  clearFile(model?: any, options?: any, ...rest: any[]): any {
    this.setDirty();

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

  private setDirty(): void {
    this.theForm?.form.markAsDirty();
  }
}
