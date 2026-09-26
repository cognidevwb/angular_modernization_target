import { Component, input, model, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import kvMapTemplate from '../../../../app/components/kv-map.tpl.html?raw';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let scope: any;

// Helpers at the legacy file's top level, beside the registration (as written).
function KeyValMapController(this: any) {

    let vm: any = this;

    vm.kvList = [];

    vm.removeKeyVal = removeKeyVal;
    vm.addKeyVal = addKeyVal;

    vm.ngOnChanges = () => {
        stopWatchKvList();
        vm.kvList.length = 0;
        if (vm.keyValMap) {
            for (var property in vm.keyValMap) {
                if (Object.prototype.hasOwnProperty.call(vm.keyValMap, property)) {
                    vm.kvList.push(
                        {
                            key: property + '',
                            value: vm.keyValMap[property]
                        }
                    );
                }
            }
        }
        watchKvList();
    };

    let kvListEffectRef: any = null;

    function watchKvList() {
        kvListEffectRef = effect(() => {
            const list = vm.kvList;
            if (!vm.keyValMap) {
                return;
            }
            for (var property in vm.keyValMap) {
                if (Object.prototype.hasOwnProperty.call(vm.keyValMap, property)) {
                    delete vm.keyValMap[property];
                }
            }
            for (var i: any = 0; i < list.length; i++) {
                var entry: any = list[i];
                vm.keyValMap[entry.key] = entry.value;
            }
        });
    }

    function stopWatchKvList() {
        if (kvListEffectRef) {
            kvListEffectRef.destroy();
            kvListEffectRef = null;
        }
    }


    function removeKeyVal(index?: any) {
        if (index > -1) {
            vm.kvList.splice(index, 1);
        }
    }

    function addKeyVal() {
        if (!vm.kvList) {
            vm.kvList = [];
        }
        vm.kvList.push(
            {
                key: '',
                value: ''
            }
        );
    }
}

/**
 * Ported from the AngularJS directive `tbKeyValMap` (module `thingsboard.directives.keyValMap`) in src/app/components/kv-map.directive.js:24.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Component({
  selector: 'tb-key-val-map',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatInputModule, MatIconModule, MatFormFieldModule, MatButtonModule, CommonModule, FormsModule],
  templateUrl: './tb-key-val-map.directive.html',
})
export class TbKeyValMapDirective {
  protected readonly rootScope = injectRoot(RootState);
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly titleText = input<any>();
  readonly keyPlaceholderText = input<any>();
  readonly valuePlaceholderText = input<any>();
  readonly noDataText = input<any>();
  readonly keyValMap = model<any>();

  restrict: any = "E";
  scope: any = true;
  bindToController: any = {
            disabled:'=ngDisabled',
            titleText: '@?',
            keyPlaceholderText: '@?',
            valuePlaceholderText: '@?',
            noDataText: '@?',
            keyValMap: '='
        };
  controller: any = KeyValMapController;
  controllerAs: any;
  templateUrl: any = kvMapTemplate;
  keyVal: any;

  constructor() {
    let vm = this;
    this.controllerAs = 'vm';
  }
}
