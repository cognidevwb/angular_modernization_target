import { Component, forwardRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbJsonFormDirective } from '../../components/tb-json-form/tb-json-form.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `JsonFormController` (module `thingsboard.jsonform`) in src/app/jsonform/index.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'json-form',
  standalone: true,
  imports: [MatCheckboxModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbJsonFormDirective)],
  templateUrl: './json-form.component.html',
})
export class JsonFormComponent {
  // TODO(port): '$scope' — component state: fields and signals on this class
  // TODO(port): template: 1 × ng-false-value left in place
  // TODO(port): template: 1 × ng-true-value left in place

  itParses: any = true;
  itParsesForm: any = true;
  formJson: any = "[   \n" +
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
  schemaJson: any = "{\n" +
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
  ngform: any;
  isFormReadonly: any = 'false';

  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    this.pretty = this.pretty;
    this.resetModel = this.resetModel;
    this.schema = JSON.parse(this.schemaJson);
    this.form = JSON.parse(this.formJson);
    $scope.$watch('vm.schemaJson',(val?: any,old?: any) =>{
        if (val && val !== old) {
            try {
                this.schema = JSON.parse(this.schemaJson);
                this.itParses = true;
            } catch (e: any){
                this.itParses = false;
            }
        }
    });
    $scope.$watch('vm.formJson',(val?: any,old?: any) =>{
        if (val && val !== old) {
            try {
                this.form = JSON.parse(this.formJson);
                this.itParsesForm = true;
            } catch (e: any){
                this.itParsesForm = false;
            }
        }
    });
  }

  pretty = (...rest: any[]): any => {
    return (typeof this.model === 'string') ? this.model : JSON.stringify(this.model, null, 2);
  };

  resetModel = (...rest: any[]): any => {
    this.ngform.$setPristine();
    this.model = { name: 'New hello world!' };
  };
}
