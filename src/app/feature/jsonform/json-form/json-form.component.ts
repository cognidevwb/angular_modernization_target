import { Component, forwardRef, viewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { UiAceDirective, UiAceOptions } from '../../components/ui-ace/ui-ace.directive';
import { TbJsonFormDirective } from '../../components/tb-json-form/tb-json-form.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

/**
 * Ported from the AngularJS controller `JsonFormController` (module `thingsboard.jsonform`) in src/app/jsonform/index.js:24.
 * With its template src/app/jsonform/jsonform.tpl.html: a playground for tb-json-form.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'json-form',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, CommonModule, FormsModule, UiAceDirective, forwardRef(() => TbJsonFormDirective)],
  templateUrl: './json-form.component.html',
})
export class JsonFormComponent {
  private readonly ngform = viewChild<NgForm>('ngform');
  readonly aceJsonOptions: UiAceOptions = { mode: 'json' };

  itParses: any = true;
  itParsesForm: any = true;
  private _formJson: any = "[   \n" +
        "    {\n" +
        "        \"key\": \"name\",\n" +
        "\t\"type\": \"text\"        \n" +
        "    },\n" +
        "    {\n" +
        "\t\"key\": \"name2\",\n" +
        "\t\"type\": \"color\"\n" +
        "    },\n" +
        "    {\n" +
        "\t\"key\": \"name3\",\n" +
        "\t\"type\": \"javascript\"\n" +
        "    },    \n" +
            "\t\"name4\"\n" +
        "]";
  private _schemaJson: any = "{\n" +
        "    \"type\": \"object\",\n" +
        "    \"title\": \"Comment\",\n" +
        "    \"properties\": {\n" +
        "        \"name\": {\n" +
        "            \"title\": \"Name 1\",\n" +
        "            \"type\": \"string\"\n" +
        "         },\n" +
        "        \"name2\": {\n" +
        "            \"title\": \"Name 2\",\n" +
        "            \"type\": \"string\"\n" +
        "         },\n" +
        "        \"name3\": {\n" +
        "            \"title\": \"Name 3\",\n" +
        "            \"type\": \"string\"\n" +
        "         },\n" +
        "        \"name4\": {\n" +
        "            \"title\": \"Name 4\",\n" +
        "            \"type\": \"number\"\n" +
        "         }\n" +
        "     },\n" +
        "     \"required\": [\n" +
        "         \"name1\", \"name2\", \"name3\", \"name4\"\n" +
        "     ]\n" +
        "}";
  schema: any;
  form: any;
  model: any = { name: '#ccc' };
  isFormReadonly: any = 'false';

  get formJson(): any {
    return this._formJson;
  }

  set formJson(val: any) {
    const old = this._formJson;
    this._formJson = val;
    if (val && val !== old) {
        try {
            this.form = JSON.parse(this._formJson);
            this.itParsesForm = true;
        } catch (e: any){
            this.itParsesForm = false;
        }
    }
  }

  get schemaJson(): any {
    return this._schemaJson;
  }

  set schemaJson(val: any) {
    const old = this._schemaJson;
    this._schemaJson = val;
    if (val && val !== old) {
        try {
            this.schema = JSON.parse(this._schemaJson);
            this.itParses = true;
        } catch (e: any){
            this.itParses = false;
        }
    }
  }

  constructor() {
    let vm = this;
    this.pretty = this.pretty;
    this.resetModel = this.resetModel;
    this.schema = JSON.parse(this.schemaJson);
    this.form = JSON.parse(this.formJson);
  }

  pretty = (...rest: any[]): any => {
    return (typeof this.model === 'string') ? this.model : JSON.stringify(this.model, null, 2);
  };

  resetModel = (...rest: any[]): any => {
    this.ngform()?.form.markAsPristine();
    this.model = { name: 'New hello world!' };
  };
}
