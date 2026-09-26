import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { bindMethods } from '../../../bind-methods';
import { store } from '../../../core/app-store';
import tinycolor from 'tinycolor2';

/**
 * Ported from the AngularJS factory `$mdColorPicker` (module `thingsboard.thirdpartyFix`) in src/app/common/thirdparty-fix.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class $mdColorPickerService {
  private readonly __bound = bindMethods(this);
  private readonly dialogRef = inject(MatDialog);
  private readonly mdColorPickerHistory = {
    colors: (store.get('mdColorPickerHistory') as string[]) || [],
    add(color: any): void {
      const hex = color && typeof color.toHexString === 'function' ? color.toHexString() : String(color);
      if (!this.colors.includes(hex)) {
        this.colors.unshift(hex);
      }
      store.set('mdColorPickerHistory', this.colors);
    }
  };

  private dialog: any;

  show(options?: any, ...rest: any[]): any {
    if ( options === undefined ) {
        options = {};
    }
    //console.log( 'DIALOG OPTIONS', options );
    // Defaults
    // Dialog Properties
    options.hasBackdrop = options.hasBackdrop === undefined ? true : options.hasBackdrop;
    options.clickOutsideToClose = options.clickOutsideToClose === undefined ? true : options.clickOutsideToClose;
    options.defaultValue = options.defaultValue === undefined ? '#FFFFFF' : options.defaultValue;
    options.focusOnOpen = options.focusOnOpen === undefined ? false : options.focusOnOpen;
    options.preserveScope = options.preserveScope === undefined ? true : options.preserveScope;
    if (options.skipHide !== undefined) {
        options.multiple = options.skipHide;
    }
    if (options.multiple === undefined) {
        options.multiple = true;
    }

    // mdColorPicker Properties
    options.mdColorAlphaChannel = options.mdColorAlphaChannel === undefined ? false : options.mdColorAlphaChannel;
    options.mdColorSpectrum = options.mdColorSpectrum === undefined ? true : options.mdColorSpectrum;
    options.mdColorSliders = options.mdColorSliders === undefined ? true : options.mdColorSliders;
    options.mdColorGenericPalette = options.mdColorGenericPalette === undefined ? true : options.mdColorGenericPalette;
    options.mdColorMaterialPalette = options.mdColorMaterialPalette === undefined ? true : options.mdColorMaterialPalette;
    options.mdColorHistory = options.mdColorHistory === undefined ? true : options.mdColorHistory;


    this.dialog = (this.dialogRef as any).show({
        templateUrl: 'mdColorPickerDialog.tpl.html',
        hasBackdrop: options.hasBackdrop,
        clickOutsideToClose: options.clickOutsideToClose,

        controller: ['scope', 'options', ( scope?: any, options?: any ) => {
            //console.log( "DIALOG CONTROLLER OPEN", Date.now() - dateClick );
            scope.close = () =>
            {
                (this.dialogRef as any).cancel();
            };
            scope.ok = () =>
            {
                (this.dialogRef as any).hide( scope.value );
            };
            scope.hide = scope.ok;



            scope.value = options.value;
            scope.default = options.defaultValue;
            scope.random = options.random;

            scope.mdColorAlphaChannel = options.mdColorAlphaChannel;
            scope.mdColorSpectrum = options.mdColorSpectrum;
            scope.mdColorSliders = options.mdColorSliders;
            scope.mdColorGenericPalette = options.mdColorGenericPalette;
            scope.mdColorMaterialPalette = options.mdColorMaterialPalette;
            scope.mdColorHistory = options.mdColorHistory;
            scope.mdColorDefaultTab = options.mdColorDefaultTab;

        }],

        locals: {
            options: options,
        },
        preserveScope: options.preserveScope,
        multiple: options.multiple,

        targetEvent: options.$event,
        focusOnOpen: options.focusOnOpen,
        autoWrap: false,
        onShowing: function(...rest: any[]) {
            //		console.log( "DIALOG OPEN START", Date.now() - dateClick );
        },
        onComplete: function(...rest: any[]) {
            //		console.log( "DIALOG OPEN COMPLETE", Date.now() - dateClick );
        }
    });

    this.dialog.then((value?: any) => {
        this.mdColorPickerHistory.add(new tinycolor(value));
    }, function () { });

    return this.dialog;
  }

  hide(...rest: any[]): any {
    return this.dialog.hide();
  }

  cancel(...rest: any[]): any {
    return this.dialog.cancel();
  }
}
