import { Component, inject, model, output } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { TimeService } from '../../api/services/time.service';
import { TranslateService } from '@ngx-translate/core';
import { linkAttrs } from '../../../legacy-link';
import $ from 'jquery';
import timewindowButtonTemplate from '../../../../app/components/timewindow-button.tpl.html' with { loader: 'text' };
import timewindowTemplate from '../../../../app/components/timewindow.tpl.html' with { loader: 'text' };
import timewindowPanelTemplate from '../../../../app/components/timewindow-panel.tpl.html' with { loader: 'text' };

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $filter: any;
declare let $templateCache: any;
declare let angular: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbTimewindow` (module `thingsboard.directives.timewindow`) in src/app/components/timewindow.directive.js:32.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-timewindow',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbTimewindowDirective {
  readonly asButton = model<any>(undefined, { alias: 'asButton' });
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly isEdit = output<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly translate = inject(TranslateService);
  protected readonly timeService = inject(TimeService);
  protected readonly element = inject(ElementRef);

  historyOnly: any;
  aggregation: any;
  isToolbar: any;
  protected translationPending: any = false;
  protected template: any;
  $eval: any;
  $watchGroup: any;
  direction: any;
  model: any;
  timewindowDisabled: any;
  tooltipDirection: any;

  // TODO(port): `scope.isEdit` was an optional callback; an output is always there, so its check reads `true`
  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.historyOnly = (this.attrs.historyOnly !== undefined);
    // TODO(port): `isEdit` is an input; a value assigned here belongs in the template or a computed()
  this.isEdit = (this.attrs.isEdit === 'true') as any;
    this.aggregation = this.$eval(this.attrs.aggregation);
    this.isToolbar = (this.attrs.isToolbar !== undefined);
    (this.translate as any).onReady(() => {
            if (this.translationPending) {
                this.updateDisplayValue();
                this.translationPending = false;
            }
        });
    if (this.asButton()) {
            this.template = $templateCache.get(timewindowButtonTemplate);
        } else {
            this.direction = (this.attrs.direction !== undefined) ? this.attrs.direction : 'left';
            this.tooltipDirection = (this.attrs.tooltipDirection !== undefined) ? this.attrs.tooltipDirection : 'top';
            this.template = $templateCache.get(timewindowTemplate);
        }
    $(this.element.nativeElement).html(this.template);
    ngModelCtrl.$render = function () {
            this.model = this.timeService.defaultTimewindow();
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                var model: any = this.model;
                if ((value.realtime !== undefined)) {
                    model.selectedTab = 0;
                    model.realtime.interval = value.realtime.interval;
                    model.realtime.timewindowMs = value.realtime.timewindowMs;
                } else {
                    model.selectedTab = 1;
                    model.history.interval = value.history.interval;
                    if ((value.history.timewindowMs !== undefined)) {
                        model.history.historyType = 0;
                        model.history.timewindowMs = value.history.timewindowMs;
                    } else {
                        model.history.historyType = 1;
                        model.history.fixedTimewindow.startTimeMs = value.history.fixedTimewindow.startTimeMs;
                        model.history.fixedTimewindow.endTimeMs = value.history.fixedTimewindow.endTimeMs;
                    }
                }
                if ((value.aggregation !== undefined)) {
                    if ((value.aggregation.type !== undefined) && value.aggregation.type.length > 0) {
                        model.aggregation.type = value.aggregation.type;
                    }
                    model.aggregation.limit = value.aggregation.limit || Math.floor(this.timeService.getMaxDatapointsLimit() / 2);
                }
                model.hideInterval = value.hideInterval;
                model.hideAggregation = value.hideAggregation;
                model.hideAggInterval = value.hideAggInterval;
            }
            this.timewindowDisabled = this.isTimewindowDisabled();
            this.updateDisplayValue();
        };
    this.$watchGroup(['disabled', 'isEdit'], (newValue?: any, oldValue?: any) => {
            if (!angular.equals(newValue, oldValue)) {
                this.timewindowDisabled = this.isTimewindowDisabled();
            }
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  hideLabel(...rest: any[]): any {
    return this.isToolbar && !(this.breakpoints as any)('gt-md');
  }

  openEditMode(event?: any, ...rest: any[]): any {
    let vm = this;
    if (this.timewindowDisabled) {
        return;
    }
    var position: any;
    var isGtSm: any = this.breakpoints('gt-sm');
    if (isGtSm) {
        var panelHeight: any = 375;
        var panelWidth: any = 417;
        var offset: any = this.element.nativeElement.getBoundingClientRect();
        var bottomY: any = offset.bottom - $(window).scrollTop(); //eslint-disable-line
        var leftX: any = offset.left - $(window).scrollLeft(); //eslint-disable-line
        var yPosition: any;
        var xPosition: any;
        if (bottomY + panelHeight > $( window ).height()) { //eslint-disable-line
            yPosition = this.overlay.yPosition.ABOVE;
        } else {
            yPosition = this.overlay.yPosition.BELOW;
        }
        if (leftX + panelWidth > $( window ).width()) { //eslint-disable-line
            xPosition = this.overlay.xPosition.ALIGN_END;
        } else {
            xPosition = this.overlay.xPosition.ALIGN_START;
        }
        position = this.overlay.newPanelPosition()
            .relativeTo($(this.element.nativeElement))
            .addPanelPosition(xPosition, yPosition);
    } else {
        position = this.overlay.newPanelPosition()
            .absolute()
            .top('0%')
            .left('0%');
    }
    var config: any = {
        attachTo: $(this.document.body),
        controller: 'TimewindowPanelController',
        controllerAs: 'vm',
        templateUrl: timewindowPanelTemplate,
        panelClass: 'tb-timewindow-panel',
        position: position,
        fullscreen: !isGtSm,
        locals: {
            'timewindow': structuredClone(this.model),
            'historyOnly': this.historyOnly,
            'aggregation': this.aggregation,                    
            'isEdit': this.isEdit,
            'onTimewindowUpdate': (timewindow?: any, ...rest: any[]) => {
                this.model = timewindow;
                this.updateView();
            }
        },
        openFrom: event,
        clickOutsideToClose: true,
        escapeToClose: true,
        focusOnOpen: false
    };
    this.overlay.open(config);
  }

  updateView(...rest: any[]): any {
    var value: any = {};
    var model: any = this.model;
    if (model.selectedTab === 0) {
        value.realtime = {
            interval: model.realtime.interval,
            timewindowMs: model.realtime.timewindowMs
        };
    } else {
        if (model.history.historyType === 0) {
            value.history = {
                interval: model.history.interval,
                timewindowMs: model.history.timewindowMs
            };
        } else {
            value.history = {
                interval: model.history.interval,
                fixedTimewindow: {
                    startTimeMs: model.history.fixedTimewindow.startTimeMs,
                    endTimeMs: model.history.fixedTimewindow.endTimeMs
                }
            };
        }
    }
    value.aggregation = {
        type: model.aggregation.type,
        limit: model.aggregation.limit
    };            
    value.hideInterval = model.hideInterval;
    value.hideAggregation = model.hideAggregation;
    value.hideAggInterval = model.hideAggInterval;
    ngModelCtrl.$setViewValue(value);
    this.updateDisplayValue();
  }

  updateDisplayValue(...rest: any[]): any {
    if ((this.translate as any).isReady()) {
        if (this.model.selectedTab === 0 && !this.historyOnly) {
            this.model.displayValue = this.translate.instant('timewindow.realtime') + ' - ' +
                this.translate.instant('timewindow.last-prefix') + ' ' +
                $filter('milliSecondsToTimeString')(this.model.realtime.timewindowMs);
        } else {
            this.model.displayValue = !this.historyOnly ? (this.translate.instant('timewindow.history') + ' - ') : '';
            if (this.model.history.historyType === 0) {
                this.model.displayValue += this.translate.instant('timewindow.last-prefix') + ' ' +
                    $filter('milliSecondsToTimeString')(this.model.history.timewindowMs);
            } else {
                var startString: any = $filter('date')(this.model.history.fixedTimewindow.startTimeMs, 'yyyy-MM-dd HH:mm:ss');
                var endString: any = $filter('date')(this.model.history.fixedTimewindow.endTimeMs, 'yyyy-MM-dd HH:mm:ss');
                this.model.displayValue += this.translate.instant('timewindow.period', {startTime: startString, endTime: endString});
            }
        }
    } else {
        this.translationPending = true;
    }
  }

  isTimewindowDisabled(...rest: any[]): any {
    return this.disabled() || (!this.isEdit && this.model.hideInterval && this.model.hideAggregation && this.model.hideAggInterval);
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
