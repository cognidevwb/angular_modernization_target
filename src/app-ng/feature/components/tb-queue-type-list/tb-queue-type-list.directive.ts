import { Component, inject, model } from '@angular/core';
import { ElementRef } from '@angular/core';
import { QueueService } from '../../api/services/queue.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import $ from 'jquery';
// @ts-ignore
import queueTypeListTemplate from '../../../../app/components/queue/queue-type-list.tpl.html';
import { TranslatePipe } from '@ngx-translate/core';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $q: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbQueueTypeList` (module `thingsboard.queue`) in src/app/components/queue/index.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-queue-type-list',
  standalone: true,
  imports: [TranslatePipe, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './tb-queue-type-list.directive.html',
})
export class TbQueueTypeListDirective {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly queueType = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly queueService = inject(QueueService);
  protected readonly element = inject(ElementRef);
  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  protected template: any = $templateCache.get(queueTypeListTemplate);
  queues: any = null;
  queue: any = null;
  queueSearchText: any = '';
  $watch: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    ngModelCtrl.$render = function () {
            this.queue = ngModelCtrl.$viewValue;
        };
    this.$watch('queue', (newValue?: any, prevValue?: any) => {
            if (!angular.equals(newValue, prevValue)) {
                this.updateView();
            }
        });
    this.$watch('disabled', () => {
            this.updateView();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  fetchQueues(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadQueues().then(
        function success(queueArr?: any) {
            let result: any = $filter('filter')(queueArr, {'$': searchText});
            if (result && result.length) {
                if (searchText && searchText.length && result.indexOf(searchText) === -1) {
                    result.push(searchText);
                }
                result.sort();
                deferred.resolve(result);
            } else {
                deferred.resolve([searchText]);
            }
        },
        function fail() {
            deferred.reject();
        }
    );

    return deferred.promise;
  }

  updateView(...rest: any[]): any {
    if (!this.disabled()) {
        ngModelCtrl.$setViewValue(this.queue);
    }
  }

  loadQueues(...rest: any[]): any {
    var deferred: any = $q.defer();
    if (!this.queues) {
        this.queueService.getTenantQueuesByServiceType(this.queueType()).then(
        (queueArr?: any) => {
            this.queues = queueArr.data;
            deferred.resolve(this.queues);
        },
        function fail() {
            deferred.reject();
        }
        );
    } else {
        deferred.resolve(this.queues);
    }
    return deferred.promise;
  }
}
