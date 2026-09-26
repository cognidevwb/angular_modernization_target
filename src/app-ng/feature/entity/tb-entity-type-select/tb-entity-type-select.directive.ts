import { Component, inject, model, ChangeDetectionStrategy } from '@angular/core';
import { ElementRef } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { UserService } from '../../api/services/user.service';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';

import $ from 'jquery';
import { linkAttrs } from '../../../legacy-link';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { TranslatePipe } from '@ngx-translate/core';
import { isEqual } from 'lodash-es';
import { NgModelController, ngModelProviders } from '../../../core/ng-model-controller';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $compile: any;
declare let $templateCache: any;

/**
 * Ported from the AngularJS directive `tbEntityTypeSelect` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'tb-entity-type-select',
  standalone: true,
  imports: [TranslatePipe, MatSelectModule, MatInputModule, MatFormFieldModule, FormsModule],
  templateUrl: './tb-entity-type-select.directive.html',
  providers: ngModelProviders(TbEntityTypeSelectDirective),
})
export class TbEntityTypeSelectDirective extends NgModelController {
  readonly theForm = model<any>();
  readonly tbRequired = model<any>();
  readonly disabled = model<any>(undefined, { alias: 'ngDisabled' });
  readonly allowedEntityTypes = model<any>();
  readonly useAliasEntityTypes = model<any>();

  // TODO(port): '$compile' — not in Angular: compose with components instead
  // TODO(port): '$templateCache' — templateUrl on the component
  protected readonly utils = inject(UtilsService);
  protected readonly entityService = inject(EntityService);
  protected readonly userService = inject(UserService);
  protected readonly element = inject(ElementRef);
  // TODO(port): template: 1 × ng-message left in place
  // TODO(port): template: 1 × ng-messages left in place

  entityTypes: any;
  showLabel: any;
  private _entityType: any;

  get entityType(): any {
    return this._entityType;
  }

  set entityType(value: any) {
    if (!isEqual(value, this._entityType)) {
      this._entityType = value;
      this.updateView();
    }
  }

  // TODO(port): angular.equals — angular.equals: a deep comparison; write one or use a library
  // TODO(port): link(scope, element, attrs, ngModelCtrl) — `element` is the element (ElementRef.nativeElement) and `attrs` the attributes (inputs); a link function's DOM work moves to ngAfterViewInit

  constructor() {
    super();
    this.tbRequired.set((this.tbRequired !== undefined) ? this.tbRequired() : false);
    if ((this.attrs.hideLabel !== undefined)) {
            this.showLabel = false;
        } else {
            this.showLabel = true;
        }
  }

  ngOnInit(): void {
    // Reads its inputs: they are set after the constructor (the legacy link ran with the scope bound), so this runs in ngOnInit.
    this.entityTypes = this.entityService.prepareAllowedEntityTypesList(this.allowedEntityTypes(), this.useAliasEntityTypes());
  }


  override $render(): void {
    if (this.$viewValue) {
      this.entityType = this.$viewValue;
    }
  }

  typeName(type?: any, ...rest: any[]): any {
    return type ? types.entityTypeTranslations[type].type : '';
  }

  updateValidity(...rest: any[]): any {
    var value: any = this.$viewValue;
    var valid: any = (value !== undefined) && value != null;
    this.$setValidity('entityType', valid);
  }

  updateView(...rest: any[]): any {
    this.$setViewValue(this.entityType);
    this.updateValidity();
  }

  /** The link's `attrs`: the host element's attributes, read live. */
  protected get attrs(): any {
    return linkAttrs(this.element.nativeElement);
  }
}
