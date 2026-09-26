import { Component, effect, inject, model } from '@angular/core';
import { QueueService } from '../../api/services/queue.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { TranslatePipe } from '@ngx-translate/core';
import { $q } from '../../../core/q';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';

/**
 * Ported from the AngularJS directive `tbQueueTypeList` (module `thingsboard.queue`) in src/app/components/queue/index.js:19.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-queue-type-list',
  standalone: true,
  imports: [TranslatePipe, FormsModule, CommonModule, MatFormFieldModule, MatInputModule, MatAutocompleteModule],
  templateUrl: './tb-queue-type-list.directive.html',
  providers: ngModelProviders(TbQueueTypeListDirective),
})
export class TbQueueTypeListDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly queueType = model<any>();

  // TODO(port): elements not resolved to a component: md-autocomplete, md-item-template
  // TODO(port): template: 1 × md-autocomplete left in place
  // TODO(port): template: 1 × md-item-template left in place
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place
  protected readonly queueService = inject(QueueService);

  queues: any = null;
  queueSearchText: any = '';

  private _queue: any = null;
  get queue(): any {
    return this._queue;
  }
  set queue(value: any) {
    const prevValue = this._queue;
    this._queue = value;
    if (!isEqual(value, prevValue)) {
      this.updateView();
    }
  }

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    effect(() => {
      this.disabled();
      this.updateView();
    });
  }

  override $render(): void {
    this.queue = this.$viewValue;
  }

  fetchQueues(searchText?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.loadQueues().then(
        function success(queueArr?: any) {
            let result: any = queueArr ? queueArr.filter((item: any) => !searchText || String(item).toLowerCase().indexOf(String(searchText).toLowerCase()) !== -1) : [];
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
        this.$setViewValue(this.queue);
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
