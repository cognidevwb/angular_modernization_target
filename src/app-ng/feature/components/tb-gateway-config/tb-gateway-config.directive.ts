import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import gatewayConfigTemplate from '../../../../app/components/gateway/gateway-config.tpl.html?raw';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function GatewayConfigController(this: any, $scope?: any, $document?: any, $mdDialog?: any, $window?: any, types?: any) {
    let vm: any = this;
    vm.types = types;

    vm.removeConnector = (index?: any) => {
        if (index > -1) {
            vm.gatewayConfig.splice(index, 1);
        }
    };

    vm.addNewConnector = () => {
        vm.gatewayConfig.push({
            enabled: false,
            configType: '',
            config: {},
            name: ''
        });
    };

    vm.openConfigDialog = ($event?: any, index?: any, config?: any, typeName?: any, elementRef?: any) => {
        if ($event) {
            $event.stopPropagation();
        }
        $mdDialog.show({
            controller: GatewayDialogController,
            controllerAs: 'vm',
            templateUrl: gatewayConfigDialogTemplate,
            parent: elementRef ? $(elementRef.nativeElement) : $(document.body),
            locals: {
                config: config,
                typeName: typeName
            },
            targetEvent: $event,
            fullscreen: true,
            multiple: true,
        }).then(function (config?: any) {
            if (config && index > -1) {
                console.log(config); //eslint-disable-line
                if (!angular.equals(vm.gatewayConfig[index].config, config)) {
                    $scope.gatewayConfiguration.$setDirty();
                }
                vm.gatewayConfig[index].config = config;
            }
        });

    };

    vm.changeConnectorType = (connector?: any) => {
        for (let gatewayConfigTypeKey in types.gatewayConfigType) {
            if (types.gatewayConfigType[gatewayConfigTypeKey].value === connector.configType) {
                if (!connector.name) {
                    connector.name = generateConnectorName(types.gatewayConfigType[gatewayConfigTypeKey].name, 0);
                    break;
                }
            }
        }
    };

    vm.changeConnectorName = (connector?: any, currentConnectorIndex?: any) => {
        connector.name = validateConnectorName(connector.name, 0, currentConnectorIndex);
    };

    function generateConnectorName(name?: any, index?: any) {
        let newKeyName: any = index ? name + index : name;
        let indexRes: any = vm.gatewayConfig.findIndex((element?: any) => element.name === newKeyName);
        return indexRes === -1 ? newKeyName : generateConnectorName(name, ++index);
    }

    function validateConnectorName(name?: any, index?: any, currentConnectorIndex?: any) {
        for (let i: any = 0; i < vm.gatewayConfig.length; i++) {
            let nameEq: any = (index === 0) ? name : name + index;
            if (i !== currentConnectorIndex && vm.gatewayConfig[i].name === nameEq) {
                index++;
                validateConnectorName(name, index, currentConnectorIndex);
            }
        }
        return (index === 0) ? name : name + index;
    }

    vm.validateJSON = (config?: any) => {
        return angular.equals({}, config);
    };
}

function GatewayDialogController(this: any, $scope?: any, $mdDialog?: any, $document?: any, $window?: any, config?: any, typeName?: any) {
    let vm: any = this;
    vm.config = js_beautify(JSON.stringify(config), {indent_size: 4});
    vm.typeName = typeName;
    vm.configAreaOptions = {
        useWrapMode: true,
        mode: 'json',
        advanced: {
            enableSnippets: true,
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        },
        onLoad: function (_ace?: any) {
            _ace.$blockScrolling = 1;
        }
    };

    vm.validateConfig = (model?: any, editorName?: any) => {
        if (model && model.length) {
            try {
                angular.fromJson(model);
                $scope.theForm[editorName].$setValidity('config', true);
            } catch (e) {
                $scope.theForm[editorName].$setValidity('config', false);
            }
        }
    };

    vm.save = () => {
        $mdDialog.hide(angular.fromJson(vm.config));
    };

    vm.cancel = () => {
        $mdDialog.hide();
    };

    vm.beautifyJson = () => {
        vm.config = js_beautify(vm.config, {indent_size: 4});
    };
}

const js_beautify: any = (window as any).beautify.js;

/**
 * Ported from the AngularJS directive `tbGatewayConfig` (module `thingsboard.directives.gatewayConfig`) in src/app/components/gateway/gateway-config.directive.js:27.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-gateway-config',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatSlideToggleModule, MatSelectModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-gateway-config.directive.html',
})
export class TbGatewayConfigDirective {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly gatewayConfig = model<any>();
  readonly changeAlignment = model<any>();
  readonly theForm = model<any>();
  readonly isReadOnly = model<any>();

  // TODO(port): template: 1 × ng-form left in place
  // TODO(port): template: 2 × ng-message left in place
  // TODO(port): template: 2 × ng-messages left in place
  // TODO(port): template: 1 × ng-model-options left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            disabled: '=ngDisabled',
            gatewayConfig: '=',
            changeAlignment: '=',
            theForm: '=',
            isReadOnly: '='
        };
  controller: any = GatewayConfigController;
  controllerAs: any;
  templateUrl: any = gatewayConfigTemplate;
  connector: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
