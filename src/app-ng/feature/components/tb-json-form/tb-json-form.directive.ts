import { Component, inject, model } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import tinycolor from 'tinycolor2';
import inspector from 'schema-inspector';
import { isEqual } from 'lodash-es';
import { firstValueFrom } from 'rxjs';
import { utils } from 'react-schema-form';
import { MaterialIconsDialogComponent } from '../material-icons-dialog/material-icons-dialog.component';

// Helpers at the legacy file's top level, beside the registration (as written).
function selectOrSet(this: any, projection?: any, obj?: any, valueToSet?: any) {
    var numRe: any = /^\d+$/;

    if (!obj) {
        obj = this;
    }

    if (!obj) {
        return false;
    }

    var parts: any = projection.split('.');

    if (parts.length === 1) {
        return setValue(obj, parts[0], valueToSet);
    }

    if (obj[parts[0]] === undefined) {
        obj[parts[0]] = parts.length > 2 && numRe.test(parts[1]) ? [] : {};
    }

    var value: any = obj[parts[0]];
    for (var i: any = 1; i < parts.length; i++) {
        if (parts[i] === '') {
            return false;
        }
        if (i === parts.length - 1) {
            return setValue(value, parts[i], valueToSet);
        } else {
            var tmp: any = value[parts[i]];
            if (tmp === undefined || tmp === null) {
                tmp = numRe.test(parts[i + 1]) ? [] : {};
                value[parts[i]] = tmp;
            }
            value = tmp;
        }
    }
    return value;
}

function setValue(obj?: any, key?: any, val?: any) {
    var changed: any = false;
    if (obj) {
        if (val === undefined) {
            if (obj[key] !== undefined) {
                delete obj[key];
                changed = true;
            }
        } else {
            changed = !isEqual(obj[key], val);
            obj[key] = val;
        }
    }
    return changed;
}

/**
 * Ported from the AngularJS directive `tbJsonForm` (module `thingsboard.directives.jsonForm`) in src/app/components/json-form.directive.js:28.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-json-form',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbJsonFormDirective {
  readonly schema = model<any>();
  readonly form = model<any>();
  readonly model = model<any>();
  readonly formControl = model<any>();
  readonly groupInfoes = model<any>();
  readonly readonly = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$mdColorPicker' — an AngularJS built-in with no Angular counterpart
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);

  protected childScope: any;
  isFullscreen: any = false;
  formProps: any;
  $new: any;
  $watch: any;
  icon: any;
  modelRefWatchHandle: any;
  modelWatchHandle: any;

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.formProps = {
            isFullscreen: false,
            option: {
                formDefaults: {
                    startEmpty: true
                }
            },
            onModelChange: (key?: any, val?: any, ...rest: any[]) => {
                if ((typeof val === 'string') && val === '') {
                    val = undefined;
                }
                selectOrSet(key, this.model(), val);
                this.formProps.model = this.model();
            },
            onColorClick: (event?: any, key?: any, val?: any, ...rest: any[]) => {
                this.showColorPicker(event, val);
            },
            onIconClick: (event?: any, ...rest: any[]) => {
                this.openIconDialog(event);
            },
            onToggleFullscreen: (...rest: any[]) => {
                this.isFullscreen = !this.isFullscreen;
                this.formProps.isFullscreen = this.isFullscreen;
            }
        };
    this.updateValues(true);
    this.$watch('readonly',() => {
            this.updateValues();
        });
    this.$watch('schema',(newValue?: any, prevValue?: any) => {
            if (newValue && newValue != prevValue) {
                this.updateValues();
                this.validate();
            }
        });
    this.$watch('form',(newValue?: any, prevValue?: any) => {
            if (newValue && newValue != prevValue) {
                this.updateValues();
            }
        });
    this.$watch('groupInfoes',(newValue?: any, prevValue?: any) => {
            if (newValue && newValue != prevValue) {
                this.updateValues();
            }
        });
    this.validate();
    this.recompile();
  }

  destroyModelChangeWatches(...rest: any[]): any {
    if (this.modelWatchHandle) {
        this.modelWatchHandle();
    }
    if (this.modelRefWatchHandle) {
        this.modelRefWatchHandle();
    }
  }

  initModelChangeWatches(...rest: any[]): any {
    this.modelWatchHandle = this.$watch('model',(newValue?: any, prevValue?: any) => {
        if (newValue && prevValue && !isEqual(newValue,prevValue)) {
            this.validate();
            if (this.formControl()) {
                this.formControl().$setDirty();
            }
        }
    }, true);
    this.modelRefWatchHandle = this.$watch('model',(newValue?: any, prevValue?: any) => {
        if (newValue && newValue != prevValue) {
            this.updateValues();
        }
    });
  }

  recompile(...rest: any[]): any {
    if (this.childScope) {
        this.childScope.$destroy();
    }
    this.childScope = this.$new();
  }

  showColorPicker(event?: any, color?: any, ...rest: any[]): any {
    (window as any).$mdColorPicker.show({
        value: tinycolor(color).toRgbString(),
        defaultValue: '#fff',
        random: tinycolor.random(),
        clickOutsideToClose: false,
        hasBackdrop: false,
        multiple: true,
        preserveScope: false,

        mdColorAlphaChannel: true,
        mdColorSpectrum: true,
        mdColorSliders: true,
        mdColorGenericPalette: false,
        mdColorMaterialPalette: true,
        mdColorHistory: false,
        mdColorDefaultTab: 2,

        $event: event

    }).then(function (color?: any) {
        if (event.data && event.data.onValueChanged) {
            event.data.onValueChanged(tinycolor(color).toRgb());
        }
    });
  }

  openIconDialog(event?: any, ...rest: any[]): any {
    firstValueFrom(this.dialog.open(MaterialIconsDialogComponent, {
        data: {icon: this.icon},
        panelClass: 'tb-dialog'
    }).afterClosed()).then((icon?: any) => {
        if (event.data && event.data.onValueChanged) {
            event.data.onValueChanged(icon);
        }
    });
  }

  onFullscreenChanged(...rest: any[]): any {}

  validate(...rest: any[]): any {
    if (this.schema() && this.model()) {
        var result: any = utils.validateBySchema(this.schema(), this.model());
        if (this.formControl()) {
            this.formControl().$setValidity('jsonForm', result.valid);
        }
    }
  }

  updateValues(skipRerender?: any, ...rest: any[]): any {
    this.destroyModelChangeWatches();
    var readonly: any = (this.readonly() && this.readonly() === true) ? true : false;
    var schema: any = this.schema() ? structuredClone(this.schema()) : {
            type: 'object'
        };
    schema.strict = true;
    var form: any = this.form() ? structuredClone(this.form()) : [ "*" ];
    var groupInfoes: any = this.groupInfoes() ? structuredClone(this.groupInfoes()) : [];
    var model: any = this.model() || {};
    this.model.set(inspector.sanitize(schema, model).data);
    this.formProps.option.formDefaults.readonly = readonly;
    this.formProps.schema = schema;
    this.formProps.form = form;
    this.formProps.groupInfoes = groupInfoes;
    this.formProps.model = structuredClone(this.model());
    if (!skipRerender) {
        this.recompile();
    }
    this.initModelChangeWatches();
  }
}
