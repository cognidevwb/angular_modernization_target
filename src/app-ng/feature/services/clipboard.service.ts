import { Injectable } from '@angular/core';
import { bindMethods } from '../../legacy-injector';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $q: any;

/**
 * Ported from the AngularJS factory `clipboardService` (module `thingsboard.clipboard`) in src/app/services/clipboard.service.js:16.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Injectable({ providedIn: 'root' })
export class ClipboardService {
  private readonly __bound = bindMethods(this);
  // TODO(port): '$q' — use Promise, or an Observable

  private fakeHandler: any;
  private fakeHandlerCallback: any;
  private fakeElem: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead

  copyToClipboard(trigger?: any, text?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    const isRTL: any = document.documentElement.getAttribute('dir') == 'rtl';
    this.removeFake();
    this.fakeHandlerCallback = () => this.removeFake();
    this.fakeHandler = (document.body.addEventListener('click', this.fakeHandlerCallback), true);
    this.fakeElem = document.createElement('textarea');
    this.fakeElem.style.fontSize = '12pt';
    this.fakeElem.style.border = '0';
    this.fakeElem.style.padding = '0';
    this.fakeElem.style.margin = '0';
    this.fakeElem.style.position = 'absolute';
    this.fakeElem.style[ isRTL ? 'right' : 'left' ] = '-9999px';
    let yPosition: any = window.pageYOffset || document.documentElement.scrollTop;
    this.fakeElem.style.top = `${yPosition}px`;
    this.fakeElem.setAttribute('readonly', '');
    this.fakeElem.value = text;
    document.body.appendChild(this.fakeElem);
    var selectedText: any = this.select(this.fakeElem);

    let succeeded: any;
    try {
        succeeded = document.execCommand('copy');
    }
    catch (err: any) {
        succeeded = false;
    }
    if (trigger) {
        trigger.focus();
    }
    window.getSelection().removeAllRanges();
    this.removeFake();
    if (succeeded) {
        deferred.resolve(selectedText);
    } else {
        deferred.reject();
    }
    return deferred.promise;
  }

  removeFake(...rest: any[]): any {
    if (this.fakeHandler) {
        document.body.removeEventListener('click', this.fakeHandlerCallback);
        this.fakeHandler = null;
        this.fakeHandlerCallback = null;
    }
    if (this.fakeElem) {
        document.body.removeChild(this.fakeElem);
        this.fakeElem = null;
    }
  }

  select(element?: any, ...rest: any[]): any {
    var selectedText: any;

    if (element.nodeName === 'SELECT') {
        element.focus();

        selectedText = element.value;
    }
    else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
        var isReadOnly: any = element.hasAttribute('readonly');

        if (!isReadOnly) {
            element.setAttribute('readonly', '');
        }

        element.select();
        element.setSelectionRange(0, element.value.length);

        if (!isReadOnly) {
            element.removeAttribute('readonly');
        }

        selectedText = element.value;
    }
    else {
        if (element.hasAttribute('contenteditable')) {
            element.focus();
        }

        var selection: any = window.getSelection();
        var range: any = document.createRange();

        range.selectNodeContents(element);
        selection.removeAllRanges();
        selection.addRange(range);

        selectedText = selection.toString();
    }

    return selectedText;
  }
}
