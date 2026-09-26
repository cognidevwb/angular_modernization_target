import { inject, Injectable } from '@angular/core';
import { RootState } from '../../../root-state';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../constants/types';
import { bindMethods } from '../../../bind-methods';
// @ts-ignore
import materialIconsCodepoints from 'raw-loader!material-design-icons/iconfont/codepoints';
import tinycolor from 'tinycolor2';
import jsonSchemaDefaults from 'json-schema-defaults';
import base64js from 'base64-js';
import {utf8Encode, utf8Decode} from '../../../../app/common/utf8-support';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $mdColorPalette: any;
declare let $q: any;
declare let $window: any;
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
const varsRegex: any = /\$\{([^}]*)\}/g;

/**
 * Ported from the AngularJS factory `utils` (module `thingsboard.utils`) in src/app/common/utils.service.js:29.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class UtilsService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$mdColorPalette' — the Material palette: a constant in the app
  // TODO(port): '$q' — use Promise, or an Observable
  private readonly rootScope = inject(RootState);
  private readonly translate = inject(TranslateService);
  // TODO(port): '$window' — use window directly, or inject(DOCUMENT).defaultView

  private predefinedFunctions: any = {};
  private predefinedFunctionsList: any = [];
  private materialColors: any = [];
  private materialIcons: any = [];
  private commonMaterialIcons: any = [ 'more_horiz', 'more_vert', 'open_in_new', 'visibility', 'play_arrow', 'arrow_back', 'arrow_downward',
        'arrow_forward', 'arrow_upwards', 'close', 'refresh', 'menu', 'show_chart', 'multiline_chart', 'pie_chart', 'insert_chart', 'people',
        'person', 'domain', 'devices_other', 'now_widgets', 'dashboards', 'map', 'pin_drop', 'my_location', 'extension', 'search',
        'settings', 'notifications', 'notifications_active', 'info', 'info_outline', 'warning', 'list', 'file_download', 'import_export',
        'share', 'add', 'edit', 'done' ];
  private colorPalettes: any = ['blue', 'green', 'red', 'amber', 'blue-grey', 'purple', 'light-green', 'indigo', 'pink', 'yellow', 'light-blue', 'orange', 'deep-purple', 'lime', 'teal', 'brown', 'cyan', 'deep-orange', 'grey'];
  private colorSpectrum: any = ['500', 'A700', '600', '700', '800', '900', '300', '400', 'A200', 'A400'];
  private defaultDataKey: any;
  private defaultDatasource: any;
  private defaultAlarmFields: any = [
        types.alarmFields.createdTime.keyName,
        types.alarmFields.originator.keyName,
        types.alarmFields.type.keyName,
        types.alarmFields.severity.keyName,
        types.alarmFields.status.keyName
    ];
  private defaultAlarmDataKeys: any = [];
  private imageAspectMap: any = {};

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.forEach — angular.forEach: for…of, or Object.entries()

  constructor() {
    this.predefinedFunctions['Sin'] = "return Math.round(1000*Math.sin(time/5000));";
    this.predefinedFunctions['Cos'] = "return Math.round(1000*Math.cos(time/5000));";
    this.predefinedFunctions['Random'] =
        "var value = prevValue + Math.random() * 100 - 50;\n" +
        "var multiplier = Math.pow(10, 2 || 0);\n" +
        "var value = Math.round(value * multiplier) / multiplier;\n" +
        "if (value < -1000) {\n" +
        "	value = -1000;\n" +
        "} else if (value > 1000) {\n" +
        "	value = 1000;\n" +
        "}\n" +
        "return value;";
    for (var func in this.predefinedFunctions) {
        this.predefinedFunctionsList.push(func);
    }
    for (const [key, value] of Object.entries(mdColorPalette)) {
        for (const [label, color] of Object.entries(value as any)) {
            if (this.colorSpectrum.indexOf(label) > -1) {
                var rgb: any = 'rgb(' + (color as any).value[0] + ',' + (color as any).value[1] + ',' + (color as any).value[2] + ')';
                var colorObj: any = tinycolor(rgb);
                var isDark: any = colorObj.isDark();
                var colorItem: any = {
                    value: colorObj.toHexString(),
                    group: key,
                    label: label,
                    isDark: isDark
                };
                this.materialColors.push(colorItem);
            }
        }
    }
    this.materialColors.sort((colorItem1?: any, colorItem2?: any) => {
        var spectrumIndex1: any = this.colorSpectrum.indexOf(colorItem1.label);
        var spectrumIndex2: any = this.colorSpectrum.indexOf(colorItem2.label);
        var result: any = spectrumIndex1 - spectrumIndex2;
        if (result === 0) {
            var paletteIndex1: any = this.colorPalettes.indexOf(colorItem1.group);
            var paletteIndex2: any = this.colorPalettes.indexOf(colorItem2.group);
            result = paletteIndex1 - paletteIndex2;
        }
        return result;
    });
    this.defaultDataKey = {
        name: 'f(x)',
        type: types.dataKeyType.function,
        label: 'Sin',
        color: this.getMaterialColor(0),
        funcBody: this.getPredefinedFunctionBody('Sin'),
        settings: {},
        _hash: Math.random()
    };
    this.defaultDatasource = {
        type: types.datasourceType.function,
        name: types.datasourceType.function,
        dataKeys: [structuredClone(this.defaultDataKey)]
    };
  }

  getPredefinedFunctionsList(...rest: any[]): any {
    return this.predefinedFunctionsList;
  }

  getPredefinedFunctionBody(func?: any, ...rest: any[]): any {
    return this.predefinedFunctions[func];
  }

  getMaterialColor(index?: any, ...rest: any[]): any {
    var colorIndex: any = index % this.materialColors.length;
    return this.materialColors[colorIndex].value;
  }

  getMaterialIcons(...rest: any[]): any {
    var deferred: any = $q.defer();
    if (this.materialIcons.length) {
        deferred.resolve(this.materialIcons);
    } else {
        setTimeout(() => {
            var codepointsArray: any = materialIconsCodepoints.split("\n");
            codepointsArray.forEach((codepoint?: any) => {
                if (codepoint && codepoint.length) {
                    var values: any = codepoint.split(' ');
                    if (values && values.length == 2) {
                        this.materialIcons.push(values[0]);
                    }
                }
            });
            deferred.resolve(this.materialIcons);
        });
    }
    return deferred.promise;
  }

  getCommonMaterialIcons(...rest: any[]): any {
    return this.commonMaterialIcons;
  }

  genMaterialColor(str?: any, ...rest: any[]): any {
    var hash: any = Math.abs(this.hashCode(str));
    return this.getMaterialColor(hash);
  }

  hashCode(str?: any, ...rest: any[]): any {
    var hash: any = 0;
    var i: any, char: any;
    if (str.length == 0) return hash;
    for (i = 0; i < str.length; i++) {
        char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return hash;
  }

  objectHashCode(obj?: any, ...rest: any[]): any {
    var hash: any = 0;
    if (obj) {
        var str: any = JSON.stringify(obj);
        hash = this.hashCode(str);
    }
    return hash;
  }

  parseException(exception?: any, lineOffset?: any, ...rest: any[]): any {
    var data: any = {};
    if (exception) {
        if ((typeof exception === 'string') || exception instanceof String) {
            data.message = exception;
        } else {
            if (exception.name) {
                data.name = exception.name;
            } else {
                data.name = 'UnknownError';
            }
            if (exception.message) {
                data.message = exception.message;
            }
            if (exception.lineNumber) {
                data.lineNumber = exception.lineNumber;
                if (exception.columnNumber) {
                    data.columnNumber = exception.columnNumber;
                }
            } else if (exception.stack) {
                var lineInfoRegexp: any = /(.*<anonymous>):(\d*)(:)?(\d*)?/g;
                var lineInfoGroups: any = lineInfoRegexp.exec(exception.stack);
                if (lineInfoGroups != null && lineInfoGroups.length >= 3) {
                    if ((lineOffset === undefined)) {
                        lineOffset = -2;
                    }
                    data.lineNumber = Number(lineInfoGroups[2]) + lineOffset;
                    if (lineInfoGroups.length >= 5) {
                        data.columnNumber = lineInfoGroups[4];
                    }
                }
            }
        }
    }
    return data;
  }

  processWidgetException(exception?: any, ...rest: any[]): any {
    var parentScope: any = window.parent.angular.element(window.frameElement).scope();
    var data: any = this.parseException(exception, -5);
    if (this.rootScope.widgetEditMode) {
        this.widgetException.emit(data);
        parentScope.$apply();
    }
    return data;
  }

  getDefaultDatasource(dataKeySchema?: any, ...rest: any[]): any {
    var datasource: any = structuredClone(this.defaultDatasource);
    if ((dataKeySchema !== undefined)) {
        datasource.dataKeys[0].settings = this.generateObjectFromJsonSchema(dataKeySchema);
    }
    return datasource;
  }

  generateObjectFromJsonSchema(schema?: any, ...rest: any[]): any {
    var obj: any = jsonSchemaDefaults(schema);
    this.deleteNullProperties(obj);
    return obj;
  }

  deleteNullProperties(obj?: any, ...rest: any[]): any {
    if ((obj === undefined) || obj == null) {
        return;
    }
    for (var propName in obj) {
        if (obj[propName] === null || (obj[propName] === undefined)) {
            delete obj[propName];
        } else if (obj[propName] !== null && typeof obj[propName] === 'object') {
            this.deleteNullProperties(obj[propName]);
        } else if (Array.isArray(obj[propName])) {
            for (var i: any=0;i<obj[propName].length;i++) {
                this.deleteNullProperties(obj[propName][i]);
            }
        }
    }
  }

  getDefaultDatasourceJson(dataKeySchema?: any, ...rest: any[]): any {
    return JSON.stringify(this.getDefaultDatasource(dataKeySchema));
  }

  initDefaultAlarmDataKeys(...rest: any[]): any {
    for (var i: any=0;i<this.defaultAlarmFields.length;i++) {
        var name: any = this.defaultAlarmFields[i];
        var dataKey: any = {
            name: name,
            type: types.dataKeyType.alarm,
            label: this.translate.instant(types.alarmFields[name].name)+'',
            color: this.getMaterialColor(i),
            settings: {},
            _hash: Math.random()
        };
        this.defaultAlarmDataKeys.push(dataKey);
    }
  }

  getDefaultAlarmDataKeys(...rest: any[]): any {
    if (!this.defaultAlarmDataKeys.length) {
        this.initDefaultAlarmDataKeys();
    }
    return structuredClone(this.defaultAlarmDataKeys);
  }

  isDescriptorSchemaNotEmpty(descriptor?: any, ...rest: any[]): any {
    if (descriptor && descriptor.schema && descriptor.schema.properties) {
        for(var prop in descriptor.schema.properties) {
            if (Object.prototype.hasOwnProperty.call(descriptor.schema.properties, prop)) {
                return true;
            }
        }
    }
    return false;
  }

  filterSearchTextEntities(entities?: any, searchTextField?: any, pageLink?: any, deferred?: any, ...rest: any[]): any {
    var response: any = {
        data: [],
        hasNext: false,
        nextPageLink: null
    };
    var limit: any = pageLink.limit;
    var textSearch: any = '';
    if (pageLink.textSearch) {
        textSearch = pageLink.textSearch.toLowerCase();
    }

    for (var i: any=0;i<entities.length;i++) {
        var entity: any = entities[i];
        var text: any = entity[searchTextField].toLowerCase();
        var createdTime: any = entity.createdTime;
        if (pageLink.textOffset && pageLink.textOffset.length > 0) {
            var comparison: any = text.localeCompare(pageLink.textOffset);
            if (comparison === 0
                && createdTime < pageLink.createdTimeOffset) {
                response.data.push(entity);
                if (response.data.length === limit) {
                    break;
                }
            } else if (comparison > 0 && text.startsWith(textSearch)) {
                response.data.push(entity);
                if (response.data.length === limit) {
                    break;
                }
            }
        } else if (textSearch.length > 0) {
            if (text.startsWith(textSearch)) {
                response.data.push(entity);
                if (response.data.length === limit) {
                    break;
                }
            }
        } else {
            response.data.push(entity);
            if (response.data.length === limit) {
                break;
            }
        }
    }
    if (response.data.length === limit) {
        var lastEntity: any = response.data[limit-1];
        response.nextPageLink = {
            limit: pageLink.limit,
            textSearch: textSearch,
            idOffset: lastEntity.id.id,
            createdTimeOffset: lastEntity.createdTime,
            textOffset: lastEntity[searchTextField].toLowerCase()
        };
        response.hasNext = true;
    }
    deferred.resolve(response);
  }

  guid(...rest: any[]): any {
    function s4(): any {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
        s4() + '-' + s4() + s4() + s4();
  }

  cleanCopy(object?: any, ...rest: any[]): any {
    var copy: any = angular.copy(object);
    for (var prop in copy) {
        if (prop && prop.startsWith('$$')) {
            delete copy[prop];
        }
    }
    return copy;
  }

  genNextColor(datasources?: any, initialIndex?: any, ...rest: any[]): any {
    var index: any = initialIndex || 0;
    if (datasources) {
        for (var i: any = 0; i < datasources.length; i++) {
            var datasource: any = datasources[i];
            index += datasource.dataKeys.length;
        }
    }
    return this.getMaterialColor(index);
  }

  isLocalUrl(url?: any, ...rest: any[]): any {
    var parser: any = document.createElement('a'); //eslint-disable-line
    parser.href = url;
    var host: any = parser.hostname;
    if (host === "localhost" || host === "127.0.0.1") {
        return true;
    } else {
        return false;
    }
    return undefined;
  }

  validateDatasources(datasources?: any, ...rest: any[]): any {
    datasources.forEach(function (datasource?: any) {
        if (datasource.type === 'device') {
            datasource.type = types.datasourceType.entity;
            datasource.entityType = types.entityType.device;
            if (datasource.deviceId) {
                datasource.entityId = datasource.deviceId;
            } else if (datasource.deviceAliasId) {
                datasource.entityAliasId = datasource.deviceAliasId;
            }
            if (datasource.deviceName) {
                datasource.entityName = datasource.deviceName;
            }
        }
        if (datasource.type === types.datasourceType.entity && datasource.entityId) {
            datasource.name = datasource.entityName;
        }
    });
    return datasources;
  }

  createKey(keyInfo?: any, type?: any, datasources?: any, ...rest: any[]): any {
    var label: any;
    if (type === types.dataKeyType.alarm && !keyInfo.label) {
        var alarmField: any = types.alarmFields[keyInfo.name];
        if (alarmField) {
            label = this.translate.instant(alarmField.name)+'';
        }
    }
    if (!label) {
        label = keyInfo.label || keyInfo.name;
    }
    var dataKey: any = {
        name: keyInfo.name,
        type: type,
        label: label,
        funcBody: keyInfo.funcBody,
        settings: {},
        _hash: Math.random()
    }
    if (keyInfo.units) {
        dataKey.units = keyInfo.units;
    }
    if ((keyInfo.decimals !== undefined)) {
        dataKey.decimals = keyInfo.decimals;
    }
    if (keyInfo.color) {
        dataKey.color = keyInfo.color;
    } else {
        dataKey.color = this.genNextColor(datasources);
    }
    if (keyInfo.postFuncBody && keyInfo.postFuncBody.length) {
        dataKey.usePostProcessing = true;
        dataKey.postFuncBody = keyInfo.postFuncBody;
    }
    return dataKey;
  }

  createAdditionalDataKey(dataKey?: any, datasource?: any, timeUnit?: any, datasources?: any, additionalKeysNumber?: any, ...rest: any[]): any {
    let additionalDataKey: any = structuredClone(dataKey);
    if (dataKey.settings.comparisonSettings.comparisonValuesLabel) {
        additionalDataKey.label = this.createLabelFromDatasource(datasource, dataKey.settings.comparisonSettings.comparisonValuesLabel);
    } else {
        additionalDataKey.label = dataKey.label + ' ' + this.translate.instant('legend.comparison-time-ago.'+timeUnit);
    }
    additionalDataKey.pattern = additionalDataKey.label;
    if (dataKey.settings.comparisonSettings.color) {
        additionalDataKey.color = dataKey.settings.comparisonSettings.color;
    } else {
        additionalDataKey.color = this.genNextColor(datasources, additionalKeysNumber);
    }
    additionalDataKey._hash = Math.random();
    return additionalDataKey;
  }

  createLabelFromDatasource(datasource?: any, pattern?: any, ...rest: any[]): any {
    var label: any = structuredClone(pattern);
    var match: any = varsRegex.exec(pattern);
    while (match !== null) {
        var variable: any = match[0];
        var variableName: any = match[1];
        if (variableName === 'dsName') {
            label = label.split(variable).join(datasource.name);
        } else if (variableName === 'entityName') {
            label = label.split(variable).join(datasource.entityName);
        } else if (variableName === 'deviceName') {
            label = label.split(variable).join(datasource.entityName);
        } else if (variableName === 'entityLabel') {
            label = label.split(variable).join(datasource.entityLabel || datasource.entityName);
        } else if (variableName === 'aliasName') {
            label = label.split(variable).join(datasource.aliasName);
        } else if (variableName === 'entityDescription') {
            label = label.split(variable).join(datasource.entityDescription);
        }
        match = varsRegex.exec(pattern);
    }
    return label;
  }

  insertVariable(pattern?: any, name?: any, value?: any, ...rest: any[]): any {
    var result: any = structuredClone(pattern);
    var match: any = varsRegex.exec(pattern);
    while (match !== null) {
        var variable: any = match[0];
        var variableName: any = match[1];
        if (variableName === name) {
            result = result.split(variable).join(value);
        }
        match = varsRegex.exec(pattern);
    }
    return result;
  }

  customTranslation(translationValue?: any, defaultValue?: any, ...rest: any[]): any {
    var result: any = '';
    var translationId: any = types.translate.customTranslationsPrefix + translationValue;
    var translation: any = this.translate.instant(translationId);
    if (translation != translationId) {
        result = translation + '';
    } else {
        result = defaultValue;
    }
    return result;
  }

  objToBase64(obj?: any, ...rest: any[]): any {
    var json: any = JSON.stringify(obj);
    var encoded: any = utf8Encode(json);
    var b64Encoded: any = base64js.fromByteArray(encoded);
    return b64Encoded;
  }

  base64toObj(b64Encoded?: any, ...rest: any[]): any {
    var encoded: any = base64js.toByteArray(b64Encoded);
    var json: any = utf8Decode(encoded);
    var obj: any = JSON.parse(json);
    return obj;
  }

  loadImageAspect(imageUrl?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    if (imageUrl && imageUrl.length) {
        var urlHashCode: any = this.hashCode(imageUrl);
        var aspect: any = this.imageAspectMap[urlHashCode];
        if ((aspect === undefined)) {
            var testImage: any = document.createElement('img'); // eslint-disable-line
            testImage.style.position = 'absolute';
            testImage.style.left = '-99999px';
            testImage.style.top = '-99999px';
            testImage.onload = () => {
                aspect = testImage.width / testImage.height;
                document.body.removeChild(testImage); //eslint-disable-line
                this.imageAspectMap[urlHashCode] = aspect;
                deferred.resolve(aspect);
            };
            testImage.onerror = () => {
                aspect = 0;
                this.imageAspectMap[urlHashCode] = aspect;
                deferred.resolve(aspect);
            };
            document.body.appendChild(testImage); //eslint-disable-line
            testImage.src = imageUrl;
        } else {
            deferred.resolve(aspect);
        }
    } else {
        deferred.resolve(0);
    }
    return deferred.promise;
  }

  sortObjectKeys(obj?: any, ...rest: any[]): any {
    var sortedObj: any = {};
    var keys: any = Object.keys(obj).sort();
    for (var i: any = 0; i < keys.length; i++) {
        var key: any = keys[i];
        sortedObj[key] = obj[key];
    }
    return sortedObj;
  }
}
