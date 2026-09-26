import { Component, DestroyRef, OnChanges, OnInit, SimpleChanges, forwardRef, inject, model, ChangeDetectionStrategy } from '@angular/core';
import $ from 'jquery';
import { CommonModule, DOCUMENT } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbGatewayConfigSelectDirective } from '../tb-gateway-config-select/tb-gateway-config-select.directive';
import { TbGatewayConfigDirective } from '../tb-gateway-config/tb-gateway-config.directive';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { ToastService } from '../../services/toast.service';
import { ImportExportService } from '../../import-export/services/import-export.service';
import { AttributeService } from '../../api/services/attribute.service';
import { DeviceService } from '../../api/services/device.service';
import { EntityService } from '../../api/services/entity.service';
import { UtilsService } from '../../common/services/utils.service';
import { RootState } from '../../../root-state';

const currentConfigurationAttribute = "current_configuration";
const configurationDraftsAttribute = "configuration_drafts";
const configurationAttribute = "configuration";
const remoteLoggingLevelAttribute = "RemoteLoggingLevel";

const templateLogsConfig = '[loggers]}}keys=root, service, connector, converter, tb_connection, storage, extension}}[handlers]}}keys=consoleHandler, serviceHandler, connectorHandler, converterHandler, tb_connectionHandler, storageHandler, extensionHandler}}[formatters]}}keys=LogFormatter}}[logger_root]}}level=ERROR}}handlers=consoleHandler}}[logger_connector]}}level={ERROR}}}handlers=connectorHandler}}formatter=LogFormatter}}qualname=connector}}[logger_storage]}}level={ERROR}}}handlers=storageHandler}}formatter=LogFormatter}}qualname=storage}}[logger_tb_connection]}}level={ERROR}}}handlers=tb_connectionHandler}}formatter=LogFormatter}}qualname=tb_connection}}[logger_service]}}level={ERROR}}}handlers=serviceHandler}}formatter=LogFormatter}}qualname=service}}[logger_converter]}}level={ERROR}}}handlers=converterHandler}}formatter=LogFormatter}}qualname=converter}}[logger_extension]}}level={ERROR}}}handlers=connectorHandler}}formatter=LogFormatter}}qualname=extension}}[handler_consoleHandler]}}class=StreamHandler}}level={ERROR}}}formatter=LogFormatter}}args=(sys.stdout,)}}[handler_connectorHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}connector.log", "d", 1, 7,)}}[handler_storageHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}storage.log", "d", 1, 7,)}}[handler_serviceHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}service.log", "d", 1, 7,)}}[handler_converterHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}converter.log", "d", 1, 3,)}}[handler_extensionHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}extension.log", "d", 1, 3,)}}[handler_tb_connectionHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}tb_connection.log", "d", 1, 3,)}}[formatter_LogFormatter]}}format="%(asctime)s - %(levelname)s - [%(filename)s] - %(module)s - %(lineno)d - %(message)s" }}datefmt="%Y-%m-%d %H:%M:%S"';

/**
 * Ported from the AngularJS directive `tbGatewayForm` (module `thingsboard.directives.gatewayForm`) in src/app/components/gateway/gateway-form.directive.js:23.
 * The `$scope.$watch('vm.ctx')` becomes ngOnInit + ngOnChanges; the `gateway-form-resize` scope event is heard on RootState.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-gateway-form',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, MatExpansionModule, CommonModule, FormsModule, forwardRef(() => TbGatewayConfigSelectDirective), forwardRef(() => TbGatewayConfigDirective)],
  templateUrl: './tb-gateway-form.directive.html',
})
export class TbGatewayFormDirective implements OnInit, OnChanges {
  readonly formId = model<any>();
  readonly ctx = model<any>();
  readonly isStateForm = model<any>();
  readonly deviceName = model<any>();
  readonly isReadOnly = model<any>();
  readonly isState = model<any>();

  private readonly document = inject(DOCUMENT);
  private readonly translate = inject(TranslateService);
  private readonly toast = inject(ToastService);
  private readonly importExport = inject(ImportExportService);
  private readonly attributeService = inject(AttributeService);
  private readonly deviceService = inject(DeviceService);
  private readonly entityService = inject(EntityService);
  private readonly utils = inject(UtilsService);
  private readonly rootScope = inject(RootState);

  protected readonly types: any = types;
  protected deviceNameForm: any = null;
  protected readonly idForm: any = Math.random().toString(36).replace(/^0\.[0-9]*/, '');
  protected configurations: any = {
    gateway: '',
    host: this.document.domain,
    port: 1883,
    remoteConfiguration: true,
    accessToken: '',
    storageType: "memoryStorage",
    readRecordsCount: 100,
    maxRecordsCount: 10000,
    dataFolderPath: './data/',
    maxFilesCount: 5,
    securityType: "accessToken",
    caCertPath: '/etc/thingsboard-gateway/ca.pem',
    privateKeyPath: '/etc/thingsboard-gateway/privateKey.pem',
    certPath: '/etc/thingsboard-gateway/certificate.pem',
    connectors: [],
    remoteLoggingLevel: "DEBUG",
    remoteLoggingPathToLogs: './logs/'
  };
  protected readonly securityTypes: any = [{
    name: 'gateway.security-types.access-token',
    value: 'accessToken'
  }, {
    name: 'gateway.security-types.tls',
    value: 'tls'
  }];
  protected readonly storageTypes: any = [{
    name: 'gateway.storage-types.memory-storage',
    value: 'memoryStorage'
  }, {
    name: 'gateway.storage-types.file-storage',
    value: 'fileStorage'
  }];
  protected gateways: any = [];
  protected changeAlignment: any;
  protected isReadOnlyForm: any = false;
  protected settings: any;
  protected widgetConfig: any;

  /** Handed to tb-gateway-config-select, which calls them as the legacy `get-access-token` / `create-device` callbacks. */
  protected readonly getAccessTokenFn = (deviceId?: any) => this.getAccessToken(deviceId);
  protected readonly createDeviceFn = (deviceObj?: any) => this.createDevice(deviceObj);

  private archiveFileName: any = '';
  private gatewayNameExists: any = '';
  private successfulSaved: any = '';

  constructor() {
    const off = this.rootScope.$on('gateway-form-resize', (_event?: any, formId?: any) => {
      if (this.formId() == formId) {
        this.updateWidgetDisplaying();
      }
    });
    inject(DestroyRef).onDestroy(off);
  }

  ngOnInit(): void {
    this.deviceNameForm = this.deviceName() ? this.deviceName() : null;
    this.onCtxChanged();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['ctx'] && !changes['ctx'].firstChange) {
      this.onCtxChanged();
    }
  }

  private onCtxChanged(): void {
    const ctx = this.ctx();
    if (ctx) {
      this.settings = ctx.settings;
      this.widgetConfig = ctx.widgetConfig;
      if (ctx.datasources && ctx.datasources.length) {
        this.deviceNameForm = ctx.datasources[0].name;
      }
    }
    this.initializeConfig();
  }

  /** The values of an object repeated as `x in obj` in the legacy template. */
  protected __values(obj: any): any[] {
    return obj ? Object.values(obj) : [];
  }

  private updateWidgetDisplaying(): void {
    if (this.ctx()) {
      this.changeAlignment = (this.ctx().$container[0].offsetWidth <= 425);
    }
  }

  private initWidgetSettings(): void {
    let widgetTitle: any;
    if (this.settings) {
      this.isReadOnlyForm = (this.settings.readOnly) ? this.settings.readOnly : false;
      if (this.settings.gatewayTitle && this.settings.gatewayTitle.length) {
        widgetTitle = this.utils.customTranslation(this.settings.gatewayTitle, this.settings.gatewayTitle);
      }
    } else {
      this.isReadOnlyForm = false;
      widgetTitle = this.translate.instant('gateway.gateway');
    }
    if (this.ctx()) {
      this.ctx().widgetTitle = widgetTitle;
    }

    this.archiveFileName = this.settings && this.settings.archiveFileName && this.settings.archiveFileName.length ? this.settings.archiveFileName : 'gatewayConfiguration';
    if (this.settings) {
      this.gatewayNameExists = this.utils.customTranslation(this.settings.deviceNameExist, this.settings.deviceNameExist) || this.translate.instant('gateway.gateway-exists');
      this.successfulSaved = this.utils.customTranslation(this.settings.successfulSave, this.settings.successfulSave) || this.translate.instant('gateway.gateway-saved');
    } else {
      this.gatewayNameExists = this.translate.instant('gateway.gateway-exists');
      this.successfulSaved = this.translate.instant('gateway.gateway-saved');
    }
  }

  private initializeConfig(): void {
    this.updateWidgetDisplaying();
    this.initWidgetSettings();
    this.getGatewaysList(true);
  }

  protected getAccessToken(deviceId?: any): any {
    if (deviceId.id) {
        this.getDeviceCredentials(deviceId.id);
    }
  }

  private getDeviceCredentials(deviceId?: any): any {
    return this.deviceService.getDeviceCredentials(deviceId).then(
        (deviceCredentials?: any) => {
            this.configurations.accessToken = deviceCredentials.credentialsId;
            this.getAttributes();
        }
    );
  }

  protected createDevice(deviceObj?: any): any {
    this.deviceService.findByName(deviceObj.name, {ignoreErrors: true})
        .then(
            () => {
                this.toast.showError(this.gatewayNameExists, $('.gateway-form'), 'top left');
            },
            () => {
                if (this.settings.gatewayType && this.settings.gatewayType.length) {
                    deviceObj.type = this.settings.gatewayType;
                }
                this.deviceService.saveDevice(deviceObj).then(
                    (device?: any) => {
                        this.getDeviceCredentials(device.id.id).then(() => {
                            this.getGatewaysList();
                        });
                    }
                );
            });
  }

  protected saveAttributeConfig(): any {
    Promise.all([
        this.saveAttribute(configurationAttribute, window.btoa(JSON.stringify(this.getGatewayConfigJSON())), types.attributesScope.shared.value),
        this.saveAttribute(configurationDraftsAttribute, window.btoa(JSON.stringify(this.getDraftConnectorJSON())), types.attributesScope.server.value),
        this.saveAttribute(remoteLoggingLevelAttribute, this.configurations.remoteLoggingLevel.toUpperCase(), types.attributesScope.shared.value)
    ]).then(() => {
        this.toast.showSuccess(this.successfulSaved, 2000, $('.gateway-form'), 'top left');
    })
  }

  private getAttributes(): any {
    let promises: any = [];
    promises.push(this.getAttribute(currentConfigurationAttribute, types.attributesScope.client.value));
    promises.push(this.getAttribute(configurationDraftsAttribute, types.attributesScope.server.value));
    promises.push(this.getAttribute(remoteLoggingLevelAttribute, types.attributesScope.shared.value));
    Promise.all(promises).then((response?: any) => {
        this.processCurrentConfiguration(response[0]);
        this.processConfigurationDrafts(response[1]);
        this.processLoggingLevel(response[2]);
    });
  }

  private getAttribute(attributeName?: any, attributeScope?: any): any {
    return this.attributeService.getEntityAttributesValues(this.configurations.gateway.id.entityType, this.configurations.gateway.id.id, attributeScope, attributeName);
  }

  private saveAttribute(attributeName?: any, attributeValue?: any, attributeScope?: any): any {
    let attributes: any = [{
        key: attributeName,
        value: attributeValue
    }];
    return this.attributeService.saveEntityAttributes(this.configurations.gateway.id.entityType, this.configurations.gateway.id.id, attributeScope, attributes);
  }

  protected exportConfig(): any {
    let filesZip: any = {};
    filesZip["tb_gateway.yaml"] = this.generateYAMLConfigurationFile();
    this.generateConfigConnectorFiles(filesZip);
    this.generateLogConfigFile(filesZip);
    this.importExport.exportJSZip(filesZip, this.archiveFileName);
    this.saveAttribute(remoteLoggingLevelAttribute, this.configurations.remoteLoggingLevel.toUpperCase(), types.attributesScope.shared.value);
  }

  private generateYAMLConfigurationFile(): any {
    let config: any;
    config = 'thingsboard:\n';
    config += '  host: ' + this.configurations.host + '\n';
    config += '  remoteConfiguration: ' + this.configurations.remoteConfiguration + '\n';
    config += '  port: ' + this.configurations.port + '\n';
    config += '  security:\n';
    if (this.configurations.securityType === 'accessToken') {
        config += '    access-token: ' + this.configurations.accessToken + '\n';
    } else if (this.configurations.securityType === 'tls') {
        config += '    ca_cert: ' + this.configurations.caCertPath + '\n';
        config += '    privateKey: ' + this.configurations.privateKeyPath + '\n';
        config += '    cert: ' + this.configurations.certPath + '\n';
    }
    config += 'storage:\n';
    if (this.configurations.storageType === 'memoryStorage') {
        config += '  type: memory\n';
        config += '  read_records_count: ' + this.configurations.readRecordsCount + '\n';
        config += '  max_records_count: ' + this.configurations.maxRecordsCount + '\n';
    } else if (this.configurations.storageType === 'fileStorage') {
        config += '  type: file\n';
        config += '  data_folder_path: ' + this.configurations.dataFolderPath + '\n';
        config += '  max_file_count: ' + this.configurations.maxFilesCount + '\n';
        config += '  max_read_records_count: ' + this.configurations.readRecordsCount + '\n';
        config += '  max_records_per_file: ' + this.configurations.maxRecordsCount + '\n';
    }
    config += 'connectors:\n';
    for (let i: any = 0; i < this.configurations.connectors.length; i++) {
        if (this.configurations.connectors[i].enabled) {
            config += '  -\n';
            config += '    name: ' + this.configurations.connectors[i].name + '\n';
            config += '    type: ' + this.configurations.connectors[i].configType + '\n';
            config += '    configuration: ' + this.generateFileName(this.configurations.connectors[i].name) + '\n';
        }
    }
    return config;
  }

  private generateConfigConnectorFiles(fileZipAdd?: any): any {
    for (let i: any = 0; i < this.configurations.connectors.length; i++) {
        if (this.configurations.connectors[i].enabled) {
            fileZipAdd[this.generateFileName(this.configurations.connectors[i].name)] = JSON.stringify(this.configurations.connectors[i].config);
        }
    }
  }

  private generateLogConfigFile(fileZipAdd?: any): any {
    fileZipAdd["logs.conf"] = this.getLogsConfig();
  }

  private getLogsConfig(): any {
    return templateLogsConfig
        .replace(/{ERROR}/g, this.configurations.remoteLoggingLevel)
        .replace(/{.\/logs\/}/g, this.configurations.remoteLoggingPathToLogs);
  }

  private getGatewayConfigJSON(): any {
    let gatewayConfig: any = {};
    gatewayConfig["thingsboard"] = this.gatewayMainConfigJSON();
    this.gatewayConnectorConfigJSON(gatewayConfig);
    return gatewayConfig;
  }

  private gatewayMainConfigJSON(): any {
    let configuration: any = {};

    let thingsBoard: any = {};
    thingsBoard.host = this.configurations.host;
    thingsBoard.remoteConfiguration = this.configurations.remoteConfiguration;
    thingsBoard.port = this.configurations.port;
    let security: any = {};
    if (this.configurations.securityType === 'accessToken') {
        security.accessToken = (this.configurations.accessToken) ? this.configurations.accessToken : ""
    } else {
        security.caCert = this.configurations.caCertPath;
        security.privateKey = this.configurations.privateKeyPath;
        security.cert = this.configurations.certPath;
    }
    thingsBoard.security = security;
    configuration.thingsboard = thingsBoard;

    let storage: any = {};
    if (this.configurations.storageType === 'memoryStorage') {
        storage.type = "memory";
        storage.read_records_count = this.configurations.readRecordsCount;
        storage.max_records_count = this.configurations.maxRecordsCount;
    } else if (this.configurations.storageType === 'fileStorage') {
        storage.type = "file";
        storage.data_folder_path = this.configurations.dataFolderPath;
        storage.max_file_count = this.configurations.maxFilesCount;
        storage.max_read_records_count = this.configurations.readRecordsCount;
        storage.max_records_per_file = this.configurations.maxRecordsCount;
    }
    configuration.storage = storage;

    let connectors: any = [];
    for (let i: any = 0; i < this.configurations.connectors.length; i++) {
        if (this.configurations.connectors[i].enabled) {
            let connector: any = {
                configuration: this.generateFileName(this.configurations.connectors[i].name),
                name: this.configurations.connectors[i].name,
                type: this.configurations.connectors[i].configType
            };
            connectors.push(connector);
        }
    }
    configuration.connectors = connectors;

    configuration.logs = window.btoa(this.getLogsConfig());

    return configuration;
  }

  private gatewayConnectorConfigJSON(gatewayConfiguration?: any): any {
    for (let i: any = 0; i < this.configurations.connectors.length; i++) {
        if (this.configurations.connectors[i].enabled) {
            let typeConnector: any = this.configurations.connectors[i].configType;
            if (!Array.isArray(gatewayConfiguration[typeConnector])) {
                gatewayConfiguration[typeConnector] = [];
            }

            let connectorConfig: any = {
                name: this.configurations.connectors[i].name,
                config: this.configurations.connectors[i].config
            };
            gatewayConfiguration[typeConnector].push(connectorConfig);
        }
    }
  }

  private getDraftConnectorJSON(): any {
    let draftConnector: any = {};
    for (let i: any = 0; i < this.configurations.connectors.length; i++) {
        if (!this.configurations.connectors[i].enabled) {
            let connector: any = {
                connector: this.configurations.connectors[i].configType,
                config: this.configurations.connectors[i].config
            };
            draftConnector[this.configurations.connectors[i].name] = connector;
        }
    }
    return draftConnector;
  }

  private getGatewaysList(firstInit?: any): any {
    this.gateways = [];
    this.entityService.getEntitiesByNameFilter(types.entityType.device, "", -1).then((devices?: any) => {
        for (let i: any = 0; i < devices.length; i++) {
            const device: any = devices[i];
            if (device.additionalInfo !== null && device.additionalInfo.gateway === true) {
                this.gateways.push(device);
                if (this.deviceNameForm && firstInit && this.gateways.length && device.name === this.deviceNameForm) {
                    this.configurations.gateway = device;
                    this.getAccessToken(device.id);
                } else if (firstInit && this.gateways.length && device.name === this.gateways[0].name) {
                    this.configurations.gateway = device;
                    this.getAccessToken(device.id);
                }
            }
        }
    });
  }

  private processCurrentConfiguration(response?: any): any {
    if (response.length > 0) {
        this.configurations.connectors = [];
        let attribute: any = JSON.parse(window.atob(response[0].value));
        for (var attributeKey in attribute) {
            let keyValue: any = attribute[attributeKey];
            if (attributeKey === "thingsboard") {
                if (keyValue !== null && Object.keys(keyValue).length > 0) {
                    this.setConfigGateway(keyValue);
                }
            } else {
                for (let connectorType in keyValue) {
                    let name: any = "No name";
                    if (Object.prototype.hasOwnProperty.call(keyValue[connectorType], 'name')) {
                        name = keyValue[connectorType].name;
                    }
                    let connector: any = {
                        enabled: true,
                        configType: attributeKey,
                        config: keyValue[connectorType].config,
                        name: name
                    };
                    this.configurations.connectors.push(connector);
                }
            }
        }
    }
  }

  private processConfigurationDrafts(response?: any): any {
    if (response.length > 0) {
        let attribute: any = JSON.parse(window.atob(response[0].value));
        for (let key in attribute) {
            let connector: any = {
                enabled: false,
                configType: attribute[key].connector,
                config: attribute[key].config,
                name: key
            };
            this.configurations.connectors.push(connector);
        }
    }
  }

  private processLoggingLevel(response?: any): any {
    if (response.length > 0) {
        if (types.gatewayLogLevel[response[0].value.toLowerCase()]) {
            this.configurations.remoteLoggingLevel = response[0].value.toUpperCase();
        }
    } else {
        this.configurations.remoteLoggingLevel = types.gatewayLogLevel.debug;
    }
  }

  private setConfigGateway(keyValue?: any): any {
    if (Object.prototype.hasOwnProperty.call(keyValue, 'thingsboard')) {
        this.configurations.host = keyValue.thingsboard.host;
        this.configurations.port = keyValue.thingsboard.port;
        this.configurations.remoteConfiguration = keyValue.thingsboard.remoteConfiguration;
        if (Object.prototype.hasOwnProperty.call(keyValue.thingsboard.security, 'accessToken')) {
            this.configurations.securityType = 'accessToken';
            this.configurations.accessToken = keyValue.thingsboard.security.accessToken;
        } else {
            this.configurations.securityType = 'tls';
            this.configurations.caCertPath = keyValue.thingsboard.security.caCert;
            this.configurations.privateKeyPath = keyValue.thingsboard.security.private_key;
            this.configurations.certPath = keyValue.thingsboard.security.cert;
        }
    }

    if (Object.prototype.hasOwnProperty.call(keyValue, 'storage') && Object.prototype.hasOwnProperty.call(keyValue.storage, 'type')) {
        if (keyValue.storage.type === 'memory') {
            this.configurations.storageType = 'memoryStorage';
            this.configurations.readRecordsCount = keyValue.storage.read_records_count;
            this.configurations.maxRecordsCount = keyValue.storage.max_records_count;
        } else if (keyValue.storage.type === 'file') {
            this.configurations.storageType = 'fileStorage';
            this.configurations.dataFolderPath = keyValue.storage.data_folder_path;
            this.configurations.maxFilesCount = keyValue.storage.max_file_count;
            this.configurations.readRecordsCount = keyValue.storage.read_records_count;
            this.configurations.maxRecordsCount = keyValue.storage.max_records_count;
        }
    }
  }

  private generateFileName(fileName?: any): any {
    return fileName.replace("_", "")
        .replace("-", "")
        .replace(/^\s+|\s+/g, '')
        .toLowerCase() + '.json';
  }
}
