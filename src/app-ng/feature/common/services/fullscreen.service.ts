import { inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { RootState } from '../../../root-state';

import $ from 'jquery';
import { bindMethods } from '../../../bind-methods';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let angular: any;

/**
 * Ported from the AngularJS factory `Fullscreen` (module `thingsboard.thirdpartyFix`) in src/app/common/thirdparty-fix.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; nothing is left for a model.
 */
@Injectable({ providedIn: 'root' })
export class FullscreenService {
  private readonly __bound = bindMethods(this);
  private readonly documentRef = inject(DOCUMENT);

  private document: any;
  private isKeyboardAvailbleOnFullScreen: any = (typeof Element !== 'undefined' && 'ALLOW_KEYBOARD_INPUT' in Element) && Element.ALLOW_KEYBOARD_INPUT;
  private emitter: any;
  $on: any;

  constructor() {
    this.document = this.documentRef;
    // The legacy factory emitted on a private child of $rootScope; its own event bus keeps the same isolation.
    this.emitter = new RootState();
    $(this.documentRef).on('fullscreenchange webkitfullscreenchange mozfullscreenchange MSFullscreenChange', () =>{
        this.emitter.$emit('FBFullscreen.change', this.isEnabled());
    });
    this.$on = this.emitter.$on.bind(this.emitter);
  }

  all(...rest: any[]): any {
    this.enable( this.document.documentElement );
  }

  enable(element?: any, ...rest: any[]): any {
    if(element.requestFullScreen) {
        element.requestFullScreen();
    } else if(element.mozRequestFullScreen) {
        element.mozRequestFullScreen();
    } else if(element.webkitRequestFullscreen) {
        // Safari temporary fix
        //if (/Version\/[\d]{1,2}(\.[\d]{1,2}){1}(\.(\d){1,2}){0,1} Safari/.test(navigator.userAgent)) {
        if (/Safari/.test(navigator.userAgent)) {
            element.webkitRequestFullscreen();
        } else {
            element.webkitRequestFullscreen(this.isKeyboardAvailbleOnFullScreen);
        }
    } else if (element.msRequestFullscreen) {
        element.msRequestFullscreen();
    }
  }

  cancel(...rest: any[]): any {
    if(this.document.cancelFullScreen) {
        this.document.cancelFullScreen();
    } else if(this.document.mozCancelFullScreen) {
        this.document.mozCancelFullScreen();
    } else if(this.document.webkitExitFullscreen) {
        this.document.webkitExitFullscreen();
    } else if (this.document.msExitFullscreen) {
        this.document.msExitFullscreen();
    }
  }

  isEnabled(...rest: any[]): any {
    var fullscreenElement: any = this.document.fullscreenElement || this.document.mozFullScreenElement || this.document.webkitFullscreenElement || this.document.msFullscreenElement;
    return fullscreenElement ? true : false;
  }

  toggleAll(...rest: any[]): any {
    this.isEnabled() ? this.cancel() : this.all();
  }

  isSupported(...rest: any[]): any {
    var docElm: any = this.document.documentElement;
    var requestFullscreen: any = docElm.requestFullScreen || docElm.mozRequestFullScreen || docElm.webkitRequestFullscreen || docElm.msRequestFullscreen;
    return requestFullscreen ? true : false;
  }
}
