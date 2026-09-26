import { Component, model } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

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

  // TODO(port): template: 2 × ng-message left in place
  // TODO(port): template: 2 × ng-messages left in place
  // TODO(port): template: 1 × ng-model-options left in place

  protected types: any;

  protected removeConnector(index?: any): void {
    if (index > -1) {
      const config = [...this.gatewayConfig()];
      config.splice(index, 1);
      this.gatewayConfig.set(config);
    }
  }

  protected addNewConnector(): void {
    this.gatewayConfig.set([...this.gatewayConfig(), {
      enabled: false,
      configType: '',
      config: {},
      name: ''
    }]);
  }

  // TODO(port): $mdDialog JSON config editor has no ported Angular Material dialog component yet
  protected openConfigDialog($event?: any, index?: any, config?: any, typeName?: any): void {
    if ($event) {
      $event.stopPropagation();
    }
  }

  protected changeConnectorType(connector?: any): void {
    for (const gatewayConfigTypeKey in this.types?.gatewayConfigType) {
      if (this.types.gatewayConfigType[gatewayConfigTypeKey].value === connector.configType) {
        if (!connector.name) {
          connector.name = this.generateConnectorName(this.types.gatewayConfigType[gatewayConfigTypeKey].name, 0);
          break;
        }
      }
    }
  }

  protected changeConnectorName(connector?: any, currentConnectorIndex?: any): void {
    connector.name = this.validateConnectorName(connector.name, 0, currentConnectorIndex);
  }

  private generateConnectorName(name?: any, index?: any): any {
    const newKeyName: any = index ? name + index : name;
    const indexRes: any = this.gatewayConfig().findIndex((element?: any) => element.name === newKeyName);
    return indexRes === -1 ? newKeyName : this.generateConnectorName(name, ++index);
  }

  private validateConnectorName(name?: any, index?: any, currentConnectorIndex?: any): any {
    for (let i = 0; i < this.gatewayConfig().length; i++) {
      const nameEq: any = (index === 0) ? name : name + index;
      if (i !== currentConnectorIndex && this.gatewayConfig()[i].name === nameEq) {
        index++;
        this.validateConnectorName(name, index, currentConnectorIndex);
      }
    }
    return (index === 0) ? name : name + index;
  }

  protected validateJSON(config?: any): boolean {
    return isEqual({}, config);
  }
}
