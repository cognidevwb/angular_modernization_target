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

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;
declare let $mdColorPalette: any;
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
    const MD_COLOR_PALETTE: Record<string, Record<string, string>> = {
        red: {'50': '#FFEBEE', '100': '#FFCDD2', '200': '#EF9A9A', '300': '#E57373', '400': '#EF5350', '500': '#F44336', '600': '#E53935', '700': '#D32F2F', '800': '#C62828', '900': '#B71C1C', A100: '#FF8A80', A200: '#FF5252', A400: '#FF1744', A700: '#D50000'},
        pink: {'50': '#FCE4EC', '100': '#F8BBD0', '200': '#F48FB1', '300': '#F06292', '400': '#EC407A', '500': '#E91E63', '600': '#D81B60', '700': '#C2185B', '800': '#AD1457', '900': '#880E4F', A100: '#FF80AB', A200: '#FF4081', A400: '#F50057', A700: '#C51162'},
        purple: {'50': '#F3E5F5', '100': '#E1BEE7', '200': '#CE93D8', '300': '#BA68C8', '400': '#AB47BC', '500': '#9C27B0', '600': '#8E24AA', '700': '#7B1FA2', '800': '#6A1B9A', '900': '#4A148C', A100: '#EA80FC', A200: '#E040FB', A400: '#D500F9', A700: '#AA00FF'},
        deepPurple: {'50': '#EDE7F6', '100': '#D1C4E9', '200': '#B39DDB', '300': '#9575CD', '400': '#7E57C2', '500': '#673AB7', '600': '#5E35B1', '700': '#512DA8', '800': '#4527A0', '900': '#311B92', A100: '#B388FF', A200: '#7C4DFF', A400: '#651FFF', A700: '#6200EA'},
        indigo: {'50': '#E8EAF6', '100': '#C5CAE9', '200': '#9FA8DA', '300': '#7986CB', '400': '#5C6BC0', '500': '#3F51B5', '600': '#3949AB', '700': '#303F9F', '800': '#283593', '900': '#1A237E', A100: '#8C9EFF', A200: '#536DFE', A400: '#3D5AFE', A700: '#304FFE'},
        blue: {'50': '#E3F2FD', '100': '#BBDEFB', '200': '#90CAF9', '300': '#64B5F6', '400': '#42A5F5', '500': '#2196F3', '600': '#1E88E5', '700': '#1976D2', '800': '#1565C0', '900': '#0D47A1', A100: '#82B1FF', A200: '#448AFF', A400: '#2979FF', A700: '#2962FF'},
        lightBlue: {'50': '#E1F5FE', '100': '#B3E5FC', '200': '#81D4FA', '300': '#4FC3F7', '400': '#29B6F6', '500': '#03A9F4', '600': '#039BE5', '700': '#0288D1', '800': '#0277BD', '900': '#01579B', A100: '#80D8FF', A200: '#40C4FF', A400: '#00B0FF', A700: '#0091EA'},
        cyan: {'50': '#E0F7FA', '100': '#B2EBF2', '200': '#80DEEA', '300': '#4DD0E1', '400': '#26C6DA', '500': '#00BCD4', '600': '#00ACC1', '700': '#0097A7', '800': '#00838F', '900': '#006064', A100: '#84FFFF', A200: '#18FFFF', A400: '#00E5FF', A700: '#00B8D4'},
        teal: {'50': '#E0F2F1', '100': '#B2DFDB', '200': '#80CBC4', '300': '#4DB6AC', '400': '#26A69A', '500': '#009688', '600': '#00897B', '700': '#00796B', '800': '#00695C', '900': '#004D40', A100: '#A7FFEB', A200: '#64FFDA', A400: '#1DE9B6', A700: '#00BFA5'},
        green: {'50': '#E8F5E9', '100': '#C8E6C9', '200': '#A5D6A7', '300': '#81C784', '400': '#66BB6A', '500': '#4CAF50', '600': '#43A047', '700': '#388E3C', '800': '#2E7D32', '900': '#1B5E20', A100: '#B9F6CA', A200: '#69F0AE', A400: '#00E676', A700: '#00C853'},
        lightGreen: {'50': '#F1F8E9', '100': '#DCEDC8', '200': '#C5E1A5', '300': '#AED581', '400': '#9CCC65', '500': '#8BC34A', '600': '#7CB342', '700': '#689F38', '800': '#558B2F', '900': '#33691E', A100: '#CCFF90', A200: '#B2FF59', A400: '#76FF03', A700: '#64DD17'},
        lime: {'50': '#F9FBE7', '100': '#F0F4C3', '200': '#E6EE9C', '300': '#DCE775', '400': '#D4E157', '500': '#CDDC39', '600': '#C0CA33', '700': '#AFB42B', '800': '#9E9D24', '900': '#827717', A100: '#F4FF81', A200: '#EEFF41', A400: '#C6FF00', A700: '#AEEA00'},
        yellow: {'50': '#FFFDE7', '100': '#FFF9C4', '200': '#FFF59D', '300': '#FFF176', '400': '#FFEE58', '500': '#FFEB3B', '600': '#FDD835', '700': '#FBC02D', '800': '#F9A825', '900': '#F57F17', A100: '#FFFF8D', A200: '#FFFF00', A400: '#FFEA00', A700: '#FFD600'},
        amber: {'50': '#FFF8E1', '100': '#FFECB3', '200': '#FFE082', '300': '#FFD54F', '400': '#FFCA28', '500': '#FFC107', '600': '#FFB300', '700': '#FFA000', '800': '#FF8F00', '900': '#FF6F00', A100: '#FFE57F', A200: '#FFD740', A400: '#FFC400', A700: '#FFAB00'},
        orange: {'50': '#FFF3E0', '100': '#FFE0B2', '200': '#FFCC80', '300': '#FFB74D', '400': '#FFA726', '500': '#FF9800', '600': '#FB8C00', '700': '#F57C00', '800': '#EF6C00', '900': '#E65100', A100: '#FFD180', A200: '#FFAB40', A400: '#FF9100', A700: '#FF6D00'},
        deepOrange: {'50': '#FBE9E7', '100': '#FFCCBC', '200': '#FFAB91', '300': '#FF8A65', '400': '#FF7043', '500': '#FF5722', '600': '#F4511E', '700': '#E64A19', '800': '#D84315', '900': '#BF360C', A100: '#FF9E80', A200: '#FF6E40', A400: '#FF3D00', A700: '#DD2C00'},
        brown: {'50': '#EFEBE9', '100': '#D7CCC8', '200': '#BCAAA4', '300': '#A1887F', '400': '#8D6E63', '500': '#795548', '600': '#6D4C41', '700': '#5D4037', '800': '#4E342E', '900': '#3E2723'},
        grey: {'50': '#FAFAFA', '100': '#F5F5F5', '200': '#EEEEEE', '300': '#E0E0E0', '400': '#BDBDBD', '500': '#9E9E9E', '600': '#757575', '700': '#616161', '800': '#424242', '900': '#212121'},
        blueGrey: {'50': '#ECEFF1', '100': '#CFD8DC', '200': '#B0BEC5', '300': '#90A4AE', '400': '#78909C', '500': '#607D8B', '600': '#546E7A', '700': '#455A64', '800': '#37474F', '900': '#263238'}
    };
    for (const [key, value] of Object.entries(MD_COLOR_PALETTE)) {
        for (const [label, hex] of Object.entries(value)) {
            if (this.colorSpectrum.indexOf(label) > -1) {
                var colorObj: any = tinycolor(hex);
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
    var parentScope: any = (window.parent as any).angular.element(window.frameElement).scope();
    var data: any = this.parseException(exception, -5);
    if (this.rootScope.widgetEditMode) {
        this.rootScope.broadcast('widgetException', data);
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
    var copy: any = structuredClone(object);
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
