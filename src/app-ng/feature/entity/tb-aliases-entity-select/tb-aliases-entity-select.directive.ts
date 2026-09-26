import { Component, inject, model } from '@angular/core';
import { BreakpointObserver } from '@angular/cdk/layout';
import { DOCUMENT } from '@angular/common';
import { ElementRef } from '@angular/core';
import { Overlay } from '@angular/cdk/overlay';
import { TranslateService } from '@ngx-translate/core';
import { types } from '../../common/constants/types';
import { linkAttrs } from '../../../legacy-link';
import $ from 'jquery';
import aliasesEntitySelectButtonTemplate from '../../../../app/entity/alias/aliases-entity-select-button.tpl.html';
import aliasesEntitySelectPanelTemplate from '../../../../app/entity/alias/aliases-entity-select-panel.tpl.html';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslatePipe } from '@ngx-translate/core';

// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;
declare let element: any;

/**
 * Ported from the AngularJS directive `tbAliasesEntitySelect` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 1 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'tb-aliases-entity-select',
  standalone: true,
  imports: [TranslatePipe, MatTooltipModule, MatIconModule, MatButtonModule],
  templateUrl: './tb-aliases-entity-select.directive.html',
})
export class TbAliasesEntitySelectDirective {
  readonly aliasController = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly breakpoints = inject(BreakpointObserver);
  protected readonly overlay = inject(Overlay);
  protected readonly document = inject(DOCUMENT);
  protected readonly translate = inject(TranslateService);
  protected readonly element = inject(ElementRef);

  protected template: any = $templateCache.get(aliasesEntitySelectButtonTemplate);
  tooltipDirection: any;
  $on: any;
  disabled: any;
  displayValue: any;

  // TODO(port): link(scope, element, attrs) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    this.tooltipDirection = (this.attrs.tooltipDirection !== undefined) ? this.attrs.tooltipDirection : 'top';
    $(this.element.nativeElement).html(this.template);
    this.$on('entityAliasesChanged', () => {
            this.updateView();
        });
    this.$on('entityAliasResolved', () => {
            this.updateView();
        });
    $compile($(this.element.nativeElement).contents())(this);
  }

  openEditMode(event?: any, ...rest: any[]): any {
    let vm = this;
    if (this.disabled) {
        return;
    }
    var position: any;
    var panelHeight: any = this.breakpoints('min-height: 350px') ? 250 : 150;
    var panelWidth: any = 300;
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
        xPosition = this.overlay.xPosition.CENTER;
    } else {
        xPosition = this.overlay.xPosition.ALIGN_START;
    }
    position = this.overlay.newPanelPosition()
        .relativeTo($(this.element.nativeElement))
        .addPanelPosition(xPosition, yPosition);
    var config: any = {
        attachTo: $(this.document.body),
        controller: 'AliasesEntitySelectPanelController',
        controllerAs: 'vm',
        templateUrl: aliasesEntitySelectPanelTemplate,
        panelClass: 'tb-aliases-entity-select-panel',
        position: position,
        fullscreen: false,
        locals: {
            'aliasController': this.aliasController(),
            'onEntityAliasesUpdate': (...rest: any[]) => {
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
    this.updateDisplayValue();
  }

  updateDisplayValue(...rest: any[]): any {
    var displayValue: any;
    var singleValue: any = true;
    var currentAliasId: any;
    var entityAliases: any = this.aliasController().getEntityAliases();
    for (var aliasId in entityAliases) {
        var entityAlias: any = entityAliases[aliasId];
        if (!entityAlias.filter.resolveMultiple) {
            var resolvedAlias: any = this.aliasController().getInstantAliasInfo(aliasId);
            if (resolvedAlias && resolvedAlias.currentEntity) {
                if (!currentAliasId) {
                    currentAliasId = aliasId;
                } else {
                    singleValue = false;
                    break;
                }
            }
        }
    }
    if (singleValue && currentAliasId) {
        var aliasInfo: any = this.aliasController().getInstantAliasInfo(currentAliasId);
        displayValue = aliasInfo.currentEntity.name;
    } else {
        displayValue = this.translate.instant('entity.entities');
    }
    this.displayValue = displayValue;
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
