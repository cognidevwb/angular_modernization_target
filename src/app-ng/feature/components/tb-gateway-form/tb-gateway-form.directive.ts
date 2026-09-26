import { Component, forwardRef, model, Inject, Injector } from '@angular/core';
import $ from 'jquery';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TbGatewayConfigSelectDirective } from '../tb-gateway-config-select/tb-gateway-config-select.directive';
import { TbGatewayConfigDirective } from '../tb-gateway-config/tb-gateway-config.directive';
declare const gatewayFormTemplate: string;
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
import { DOCUMENT } from '@angular/common';

function GatewayFormController(this: any, injector?: Injector, document?: Document, $mdExpansionPanel?: any, toast?: any, importExport?: any, attributeService?: any, deviceService?: any, userService?: any, types?: any, $window?: any, entityService?: any, utils?: any, $translate?: any, gatewayFormResizeService?: any) {
    let vm: any = this;
    const currentConfigurationAttribute: any = "current_configuration";
    const configurationDraftsAttribute: any = "configuration_drafts";
    const configurationAttribute: any = "configuration";
    const remoteLoggingLevelAttribute: any = "RemoteLoggingLevel";

    const templateLogsConfig: any = '[loggers]}}keys=root, service, connector, converter, tb_connection, storage, extension}}[handlers]}}keys=consoleHandler, serviceHandler, connectorHandler, converterHandler, tb_connectionHandler, storageHandler, extensionHandler}}[formatters]}}keys=LogFormatter}}[logger_root]}}level=ERROR}}handlers=consoleHandler}}[logger_connector]}}level={ERROR}}}handlers=connectorHandler}}formatter=LogFormatter}}qualname=connector}}[logger_storage]}}level={ERROR}}}handlers=storageHandler}}formatter=LogFormatter}}qualname=storage}}[logger_tb_connection]}}level={ERROR}}}handlers=tb_connectionHandler}}formatter=LogFormatter}}qualname=tb_connection}}[logger_service]}}level={ERROR}}}handlers=serviceHandler}}formatter=LogFormatter}}qualname=service}}[logger_converter]}}level={ERROR}}}handlers=converterHandler}}formatter=LogFormatter}}qualname=converter}}[logger_extension]}}level={ERROR}}}handlers=connectorHandler}}formatter=LogFormatter}}qualname=extension}}[handler_consoleHandler]}}class=StreamHandler}}level={ERROR}}}formatter=LogFormatter}}args=(sys.stdout,)}}[handler_connectorHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}connector.log", "d", 1, 7,)}}[handler_storageHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}storage.log", "d", 1, 7,)}}[handler_serviceHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}service.log", "d", 1, 7,)}}[handler_converterHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}converter.log", "d", 1, 3,)}}[handler_extensionHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}extension.log", "d", 1, 3,)}}[handler_tb_connectionHandler]}}level={ERROR}}}class=logging.handlers.TimedRotatingFileHandler}}formatter=LogFormatter}}args=("{./logs/}tb_connection.log", "d", 1, 3,)}}[formatter_LogFormatter]}}format="%(asctime)s - %(levelname)s - [%(filename)s] - %(module)s - %(lineno)d - %(message)s" }}datefmt="%Y-%m-%d %H:%M:%S"';

    vm.types = types;
    vm.deviceNameForm = (vm.deviceName) ? vm.deviceName : null;
    vm.idForm = Math.random().toString(36).replace(/^0\.[0-9]*/, '');
    vm.configurations = {
        gateway: '',
        host: document.domain,
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

    let archiveFileName: any = '';
    let gatewayNameExists: any = '';
    let successfulSaved: any = '';
    vm.securityTypes = [{
        name: 'gateway.security-types.access-token',
        value: 'accessToken'
    }, {
        name: 'gateway.security-types.tls',
        value: 'tls'
    }];

    vm.storageTypes = [{
        name: 'gateway.storage-types.memory-storage',
        value: 'memoryStorage'
    }, {
        name: 'gateway.storage-types.file-storage',
        value: 'fileStorage'
    }];

    vm.ngOnChanges = (changes: any) => {
        if (changes.ctx) {
            if (vm.ctx) {
                vm.isStateForm = vm.isStateForm;
                vm.settings = vm.ctx.settings;
                vm.widgetConfig = vm.ctx.widgetConfig;
                if (vm.ctx.datasources && vm.ctx.datasources.length) {
                    vm.deviceNameForm = vm.ctx.datasources[0].name;
                }
            }
            initializeConfig();
        }
    };


    vm.ngOnDestroySub = gatewayFormResizeService.gatewayFormResize$.subscribe((formId?: any) => {
        if (vm.formId == formId) {
            updateWidgetDisplaying();
        }
    });

    function updateWidgetDisplaying() {
        if (vm.ctx) {
            vm.changeAlignment = (vm.ctx.$container[0].offsetWidth <= 425);
        }
    }

    function initWidgetSettings() {
        let widgetTitle: any;
        if (vm.settings) {
            vm.isReadOnlyForm = (vm.settings.readOnly) ? vm.settings.readOnly : false;
            if (vm.settings.gatewayTitle && vm.settings.gatewayTitle.length) {
                widgetTitle = utils.customTranslation(vm.settings.gatewayTitle, vm.settings.gatewayTitle);
            }
        } else {
            vm.isReadOnlyForm = false;
            widgetTitle = $translate.instant('gateway.gateway');
        }
        if (vm.ctx) {
            vm.ctx.widgetTitle = widgetTitle;
        }

        archiveFileName = vm.settings && vm.settings.archiveFileName && vm.settings.archiveFileName.length ? vm.settings.archiveFileName : 'gatewayConfiguration';
        if (vm.settings) {
            gatewayNameExists = utils.customTranslation(vm.settings.deviceNameExist, vm.settings.deviceNameExist) || $translate.instant('gateway.gateway-exists');
            successfulSaved = utils.customTranslation(vm.settings.successfulSave, vm.settings.successfulSave) || $translate.instant('gateway.gateway-saved');
        } else {
            gatewayNameExists = $translate.instant('gateway.gateway-exists');
            successfulSaved = $translate.instant('gateway.gateway-saved');
        }
    }

    function initializeConfig() {
        updateWidgetDisplaying();
        initWidgetSettings();
        getGatewaysList(true);
    }


    vm.getAccessToken = (deviceId?: any) => {
        if (deviceId.id) {
            getDeviceCredentials(deviceId.id);
        }
    };

    vm.collapsePanel = function (panelId?: any) {
        $mdExpansionPanel(panelId).collapse();
    };

    function getDeviceCredentials(deviceId?: any) {
        return deviceService.getDeviceCredentials(deviceId).then(
            (deviceCredentials?: any) => {
                vm.configurations.accessToken = deviceCredentials.credentialsId;
                getAttributes();
            }
        );
    }

    vm.createDevice = (deviceObj?: any) => {
        deviceService.findByName(deviceObj.name, {ignoreErrors: true})
            .then(
                function () {
                    toast.showError(gatewayNameExists, $('.gateway-form'), 'top left');
                },
                function () {
                    if (vm.settings.gatewayType && vm.settings.gatewayType.length) {
                        deviceObj.type = vm.settings.gatewayType;
                    }
                    deviceService.saveDevice(deviceObj).then(
                        (device?: any) => {
                            getDeviceCredentials(device.id.id).then(() => {
                                getGatewaysList();
                            });
                        }
                    );
                });
    };

    vm.saveAttributeConfig = () => {
        Promise.all([
            saveAttribute(configurationAttribute, $window.btoa(JSON.stringify(getGatewayConfigJSON())), types.attributesScope.shared.value),
            saveAttribute(configurationDraftsAttribute, $window.btoa(JSON.stringify(getDraftConnectorJSON())), types.attributesScope.server.value),
            saveAttribute(remoteLoggingLevelAttribute, vm.configurations.remoteLoggingLevel.toUpperCase(), types.attributesScope.shared.value)
        ]).then(() => {
            toast.showSuccess(successfulSaved, 2000, $('.gateway-form'), 'top left');
        })
    };

    function getAttributes() {
        let promises: any = [];
        promises.push(getAttribute(currentConfigurationAttribute, types.attributesScope.client.value));
        promises.push(getAttribute(configurationDraftsAttribute, types.attributesScope.server.value));
        promises.push(getAttribute(remoteLoggingLevelAttribute, types.attributesScope.shared.value));
        Promise.all(promises).then((response?: any) => {
            processCurrentConfiguration(response[0]);
            processConfigurationDrafts(response[1]);
            processLoggingLevel(response[2]);
        });
    }

    function getAttribute(attributeName?: any, attributeScope?: any) {
        return attributeService.getEntityAttributesValues(vm.configurations.gateway.id.entityType, vm.configurations.gateway.id.id, attributeScope, attributeName);
    }

    function saveAttribute(attributeName?: any, attributeValue?: any, attributeScope?: any) {
        let attributes: any = [{
            key: attributeName,
            value: attributeValue
        }];
        return attributeService.saveEntityAttributes(vm.configurations.gateway.id.entityType, vm.configurations.gateway.id.id, attributeScope, attributes);
    }

    vm.exportConfig = () => {
        let filesZip: any = {};
        filesZip["tb_gateway.yaml"] = generateYAMLConfigurationFile();
        generateConfigConnectorFiles(filesZip);
        generateLogConfigFile(filesZip);
        importExport.exportJSZip(filesZip, archiveFileName);
        saveAttribute(remoteLoggingLevelAttribute, vm.configurations.remoteLoggingLevel.toUpperCase(), types.attributesScope.shared.value);
    };

    function generateYAMLConfigurationFile() {
        let config: any;
        config = 'thingsboard:\n';
        config += '  host: ' + vm.configurations.host + '\n';
        config += '  remoteConfiguration: ' + vm.configurations.remoteConfiguration + '\n';
        config += '  port: ' + vm.configurations.port + '\n';
        config += '  security:\n';
        if (vm.configurations.securityType === 'accessToken') {
            config += '    access-token: ' + vm.configurations.accessToken + '\n';
        } else if (vm.configurations.securityType === 'tls') {
            config += '    ca_cert: ' + vm.configurations.caCertPath + '\n';
            config += '    privateKey: ' + vm.configurations.privateKeyPath + '\n';
            config += '    cert: ' + vm.configurations.certPath + '\n';
        }
        config += 'storage:\n';
        if (vm.configurations.storageType === 'memoryStorage') {
            config += '  type: memory\n';
            config += '  read_records_count: ' + vm.configurations.readRecordsCount + '\n';
            config += '  max_records_count: ' + vm.configurations.maxRecordsCount + '\n';
        } else if (vm.configurations.storageType === 'fileStorage') {
            config += '  type: file\n';
            config += '  data_folder_path: ' + vm.configurations.dataFolderPath + '\n';
            config += '  max_file_count: ' + vm.configurations.maxFilesCount + '\n';
            config += '  max_read_records_count: ' + vm.configurations.readRecordsCount + '\n';
            config += '  max_records_per_file: ' + vm.configurations.maxRecordsCount + '\n';
        }
        config += 'connectors:\n';
        for (let i: any = 0; i < vm.configurations.connectors.length; i++) {
            if (vm.configurations.connectors[i].enabled) {
                config += '  -\n';
                config += '    name: ' + vm.configurations.connectors[i].name + '\n';
                config += '    type: ' + vm.configurations.connectors[i].configType + '\n';
                config += '    configuration: ' + generateFileName(vm.configurations.connectors[i].name) + '\n';
            }
        }
        return config;
    }

    function generateConfigConnectorFiles(fileZipAdd?: any) {
        for (let i: any = 0; i < vm.configurations.connectors.length; i++) {
            if (vm.configurations.connectors[i].enabled) {
                fileZipAdd[generateFileName(vm.configurations.connectors[i].name)] = JSON.stringify(vm.configurations.connectors[i].config);
            }
        }
    }

    function generateLogConfigFile(fileZipAdd?: any) {
        fileZipAdd["logs.conf"] = getLogsConfig();
    }

    function getLogsConfig() {
        return templateLogsConfig
            .replace(/{ERROR}/g, vm.configurations.remoteLoggingLevel)
            .replace(/{.\/logs\/}/g, vm.configurations.remoteLoggingPathToLogs);
    }

    function getGatewayConfigJSON() {
        let gatewayConfig: any = {};
        gatewayConfig["thingsboard"] = gatewayMainConfigJSON();
        gatewayConnectorConfigJSON(gatewayConfig);
        return gatewayConfig;
    }

    function gatewayMainConfigJSON() {
        let configuration: any = {};

        let thingsBoard: any = {};
        thingsBoard.host = vm.configurations.host;
        thingsBoard.remoteConfiguration = vm.configurations.remoteConfiguration;
        thingsBoard.port = vm.configurations.port;
        let security: any = {};
        if (vm.configurations.securityType === 'accessToken') {
            security.accessToken = (vm.configurations.accessToken) ? vm.configurations.accessToken : ""
        } else {
            security.caCert = vm.configurations.caCertPath;
            security.privateKey = vm.configurations.privateKeyPath;
            security.cert = vm.configurations.certPath;
        }
        thingsBoard.security = security;
        configuration.thingsboard = thingsBoard;

        let storage: any = {};
        if (vm.configurations.storageType === 'memoryStorage') {
            storage.type = "memory";
            storage.read_records_count = vm.configurations.readRecordsCount;
            storage.max_records_count = vm.configurations.maxRecordsCount;
        } else if (vm.configurations.storageType === 'fileStorage') {
            storage.type = "file";
            storage.data_folder_path = vm.configurations.dataFolderPath;
            storage.max_file_count = vm.configurations.maxFilesCount;
            storage.max_read_records_count = vm.configurations.readRecordsCount;
            storage.max_records_per_file = vm.configurations.maxRecordsCount;
        }
        configuration.storage = storage;

        let connectors: any = [];
        for (let i: any = 0; i < vm.configurations.connectors.length; i++) {
            if (vm.configurations.connectors[i].enabled) {
                let connector: any = {
                    configuration: generateFileName(vm.configurations.connectors[i].name),
                    name: vm.configurations.connectors[i].name,
                    type: vm.configurations.connectors[i].configType
                };
                connectors.push(connector);
            }
        }
        configuration.connectors = connectors;

        configuration.logs = $window.btoa(getLogsConfig());

        return configuration;
    }

    function gatewayConnectorConfigJSON(gatewayConfiguration?: any) {
        for (let i: any = 0; i < vm.configurations.connectors.length; i++) {
            if (vm.configurations.connectors[i].enabled) {
                let typeConnector: any = vm.configurations.connectors[i].configType;
                if (!Array.isArray(gatewayConfiguration[typeConnector])) {
                    gatewayConfiguration[typeConnector] = [];
                }

                let connectorConfig: any = {
                    name: vm.configurations.connectors[i].name,
                    config: vm.configurations.connectors[i].config
                };
                gatewayConfiguration[typeConnector].push(connectorConfig);
            }
        }
    }

    function getDraftConnectorJSON() {
        let draftConnector: any = {};
        for (let i: any = 0; i < vm.configurations.connectors.length; i++) {
            if (!vm.configurations.connectors[i].enabled) {
                let connector: any = {
                    connector: vm.configurations.connectors[i].configType,
                    config: vm.configurations.connectors[i].config
                };
                draftConnector[vm.configurations.connectors[i].name] = connector;
            }
        }
        return draftConnector;
    }

    function getGatewaysList(firstInit?: any) {
        vm.gateways = [];
        entityService.getEntitiesByNameFilter(types.entityType.device, "", -1).then((devices?: any) => {
            for (let i: any = 0; i < devices.length; i++) {
                const device: any = devices[i];
                if (device.additionalInfo !== null && device.additionalInfo.gateway === true) {
                    vm.gateways.push(device);
                    if (vm.deviceNameForm && firstInit && vm.gateways.length && device.name === vm.deviceNameForm) {
                        vm.configurations.gateway = device;
                        vm.getAccessToken(device.id);
                    } else if (firstInit && vm.gateways.length && device.name === vm.gateways[0].name) {
                        vm.configurations.gateway = device;
                        vm.getAccessToken(device.id);
                    }
                }
            }
        });
    }

    function processCurrentConfiguration(response?: any) {
        if (response.length > 0) {
            vm.configurations.connectors = [];
            let attribute: any = JSON.parse($window.atob(response[0].value));
            for (var attributeKey in attribute) {
                let keyValue: any = attribute[attributeKey];
                if (attributeKey === "thingsboard") {
                    if (keyValue !== null && Object.keys(keyValue).length > 0) {
                        setConfigGateway(keyValue);
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
                        vm.configurations.connectors.push(connector);
                    }
                }
            }
        }
    }

    function processConfigurationDrafts(response?: any) {
        if (response.length > 0) {
            let attribute: any = JSON.parse($window.atob(response[0].value));
            for (let key in attribute) {
                let connector: any = {
                    enabled: false,
                    configType: attribute[key].connector,
                    config: attribute[key].config,
                    name: key
                };
                vm.configurations.connectors.push(connector);
            }
        }
    }

    function processLoggingLevel(response?: any) {
        if (response.length > 0) {
            if (vm.types.gatewayLogLevel[response[0].value.toLowerCase()]) {
                vm.configurations.remoteLoggingLevel = response[0].value.toUpperCase();
            }
        } else {
            vm.configurations.remoteLoggingLevel = vm.types.gatewayLogLevel.debug;
        }
    }

    function setConfigGateway(keyValue?: any) {
        if (Object.prototype.hasOwnProperty.call(keyValue, 'thingsboard')) {
            vm.configurations.host = keyValue.thingsboard.host;
            vm.configurations.port = keyValue.thingsboard.port;
            vm.configurations.remoteConfiguration = keyValue.thingsboard.remoteConfiguration;
            if (Object.prototype.hasOwnProperty.call(keyValue.thingsboard.security, 'accessToken')) {
                vm.configurations.securityType = 'accessToken';
                vm.configurations.accessToken = keyValue.thingsboard.security.accessToken;
            } else {
                vm.configurations.securityType = 'tls';
                vm.configurations.caCertPath = keyValue.thingsboard.security.caCert;
                vm.configurations.privateKeyPath = keyValue.thingsboard.security.private_key;
                vm.configurations.certPath = keyValue.thingsboard.security.cert;
            }
        }

        if (Object.prototype.hasOwnProperty.call(keyValue, 'storage') && Object.prototype.hasOwnProperty.call(keyValue.storage, 'type')) {
            if (keyValue.storage.type === 'memory') {
                vm.configurations.storageType = 'memoryStorage';
                vm.configurations.readRecordsCount = keyValue.storage.read_records_count;
                vm.configurations.maxRecordsCount = keyValue.storage.max_records_count;
            } else if (keyValue.storage.type === 'file') {
                vm.configurations.storageType = 'fileStorage';
                vm.configurations.dataFolderPath = keyValue.storage.data_folder_path;
                vm.configurations.maxFilesCount = keyValue.storage.max_file_count;
                vm.configurations.readRecordsCount = keyValue.storage.read_records_count;
                vm.configurations.maxRecordsCount = keyValue.storage.max_records_count;
            }
        }
    }

    function generateFileName(fileName?: any) {
        return fileName.replace("_", "")
            .replace("-", "")
            .replace(/^\s+|\s+/g, '')
            .toLowerCase() + '.json';
    }
}

/**
 * Ported from the AngularJS directive `tbGatewayForm` (module `thingsboard.directives.gatewayForm`) in src/app/components/gateway/gateway-form.directive.js:23.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-gateway-form',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatSelectModule, MatInputModule, MatFormFieldModule, MatCheckboxModule, MatButtonModule, CommonModule, FormsModule, forwardRef(() => TbGatewayConfigSelectDirective), forwardRef(() => TbGatewayConfigDirective)],
  templateUrl: './tb-gateway-form.directive.html',
})
export class TbGatewayFormDirective {
  readonly formId = model<any>();
  readonly ctx = model<any>();
  readonly isStateForm = model<any>();
  readonly deviceName = model<any>();
  readonly isReadOnly = model<any>();
  readonly isState = model<any>();

  // TODO(port): elements not resolved to a component: md-expansion-panel-group, md-expansion-panel, md-expansion-panel-collapsed, md-expansion-panel-icon, md-expansion-panel-expanded, md-expansion-panel-header, md-expansion-panel-content
  // TODO(port): AngularJS built-in filters in the template: uppercase — use Angular pipes
  // TODO(port): template: 3 × md-expansion-panel left in place
  // TODO(port): template: 3 × md-expansion-panel-collapsed left in place
  // TODO(port): template: 3 × md-expansion-panel-content left in place
  // TODO(port): template: 3 × md-expansion-panel-expanded left in place
  // TODO(port): template: 1 × md-expansion-panel-group left in place
  // TODO(port): template: 3 × md-expansion-panel-header left in place
  // TODO(port): template: 6 × md-expansion-panel-icon left in place
  // TODO(port): template: 16 × ng-message left in place
  // TODO(port): template: 7 × ng-messages left in place

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            formId: '=',
            ctx: '=',
            isStateForm: '=',
            deviceName: '=',
            isReadOnly: '=',
            isState: '='
        };
  controller: any = GatewayFormController;
  controllerAs: any;
  templateUrl: any = gatewayFormTemplate;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
