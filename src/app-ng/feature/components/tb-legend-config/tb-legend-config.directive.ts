import { Component, inject, model } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { types } from '../../common/constants/types';
import $ from 'jquery';
// @ts-ignore
import legendConfigButtonTemplate from '../../../../app/components/legend-config-button.tpl.html';
// @ts-ignore
import legendConfigPanelTemplate from '../../../../app/components/legend-config-panel.tpl.html';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;
declare let ngModelCtrl: any;

/**
 * Ported from the AngularJS directive `tbLegendConfig` (module `thingsboard.directives.legendConfig`) in src/app/components/legend-config.directive.js:30.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-legend-config',
  standalone: true,
  template: '', // TODO(port): no template found
})
export class TbLegendConfigDirective {
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });

  // TODO(port): '$compile' — not in Angular: compose with components instead
  protected readonly document = inject(DOCUMENT);
  protected readonly overlay = inject(Overlay);
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly element = inject(ElementRef);

  protected template: any = legendConfigButtonTemplate;
  model: any;

  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    $(this.element.nativeElement).html(this.template);
    ngModelCtrl.$render = function () {
            if (ngModelCtrl.$viewValue) {
                var value: any = ngModelCtrl.$viewValue;
                if (!this.model) {
                    this.model = {};
                }
                var model: any = this.model;
                model.direction = value.direction || types.direction.column.value;
                model.position = value.position || types.position.bottom.value;
                model.showMin = (value.showMin !== undefined) ? value.showMin : false;
                model.showMax = (value.showMax !== undefined) ? value.showMax : false;
                model.showAvg = (value.showAvg !== undefined) ? value.showAvg : true;
                model.showTotal = (value.showTotal !== undefined) ? value.showTotal : false;
            } else {
                this.model = {
                    direction: types.direction.column.value,
                    position: types.position.bottom.value,
                    showMin: false,
                    showMax: false,
                    showAvg: true,
                    showTotal: false
                }
            }
        }
    $compile($(this.element.nativeElement).contents())(this);
  }

  openEditMode(event?: any, ...rest: any[]): any {
    let vm = this;
    if (this.disabled()) {
        return;
    }
    var position: any;
    var panelHeight: any = 220;
    var panelWidth: any = 220;
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
    var config: any = {
        attachTo: $(this.document.body),
        controller: 'LegendConfigPanelController',
        controllerAs: 'vm',
        templateUrl: legendConfigPanelTemplate,
        panelClass: 'tb-legend-config-panel',
        position: position,
        fullscreen: false,
        locals: {
            'legendConfig': structuredClone(this.model),
            'onLegendConfigUpdate': (legendConfig?: any, ...rest: any[]) => {
                this.model = legendConfig;
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
    value.direction = model.direction;
    value.position = model.position;
    value.showMin = model.showMin;
    value.showMax = model.showMax;
    value.showAvg = model.showAvg;
    value.showTotal = model.showTotal;
    ngModelCtrl.$setViewValue(value);
  }
}
