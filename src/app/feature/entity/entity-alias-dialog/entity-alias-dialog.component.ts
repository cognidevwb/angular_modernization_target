import { NgForm } from '@angular/forms';
import { attachLegacyForm, lateLegacyForm, LegacyForm } from '../../components/tb-grid/legacy-form';
import { Component, DoCheck, forwardRef, inject, ChangeDetectionStrategy, ViewChild } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog } from '@angular/material/dialog';
import { UtilsService } from '../../common/services/utils.service';
import { types } from '../../common/constants/types';
import { FormsModule } from '@angular/forms';
import { TbEntityFilterDirective } from '../tb-entity-filter/tb-entity-filter.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

import { $q } from '../../../core/q';

/**
 * Ported from the AngularJS controller `EntityAliasDialogController` (module `thingsboard.entity`) in src/app/entity/index.js:37.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 2 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  changeDetection: ChangeDetectionStrategy.Eager,
  selector: 'entity-alias-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatSlideToggleModule, MatProgressBarModule, MatInputModule, MatIconModule, MatFormFieldModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbEntityFilterDirective)],
  templateUrl: './entity-alias-dialog.component.html',
})
export class EntityAliasDialogComponent implements DoCheck {
  protected readonly rootScope = injectRoot(RootState);
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialog = inject(MatDialog);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$filter' — inject the pipe class and call transform()
  protected readonly utils = inject(UtilsService);
  protected readonly entityService = inject(EntityService);
  protected readonly typesRef: any = types;
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  // TODO(port): template: 3 × ng-message left in place
  // TODO(port): template: 2 × ng-messages left in place

  types: any;
  isAdd: any;
  allowedEntityTypes: any;
  alias: any;
  entityAliases: any;

  /** The legacy `theForm` (FormController), over the template's `#theFormRef` NgForm. */
  readonly theForm: LegacyForm = lateLegacyForm('theForm');

  @ViewChild('theFormRef')
  set theFormRef(form: NgForm | undefined) {
    attachLegacyForm(this.theForm, form);
  }

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $scope.$watch — a $watch: compute this from a signal or an effect()

  constructor() {
    let vm = this;
    this.types = this.typesRef;
    this.isAdd = this.dialogData.isAdd;
    this.allowedEntityTypes = this.dialogData.allowedEntityTypes;
    if (Array.isArray(this.dialogData.entityAliases)) {
        this.entityAliases = this.dialogData.entityAliases;
    } else {
        this.entityAliases = [];
        for (var aliasId in this.dialogData.entityAliases) {
            this.entityAliases.push(this.dialogData.entityAliases[aliasId]);
        }
    }
    if (this.isAdd && !this.dialogData.alias) {
        this.alias = {
            alias: '',
            filter: {
                resolveMultiple: false
            }
        };
    } else {
        this.alias = this.dialogData.alias;
    }
    this.cancel = this.cancel;
    this.save = this.save;
  }

  private prevAliasName: any;
  private prevFormPristine: any;

  ngDoCheck(): void {
    const currentAliasName = this.alias ? this.alias.alias : undefined;
    if (currentAliasName !== this.prevAliasName) {
        this.prevAliasName = currentAliasName;
        this.onAliasNameChange(currentAliasName);
    }
    const currentFormPristine = this.theForm ? this.theForm.$pristine : undefined;
    if (currentFormPristine !== this.prevFormPristine) {
        this.prevFormPristine = currentFormPristine;
        this.onFormPristineChange();
    }
  }

  private onAliasNameChange(newAlias?: any): void {
    if (newAlias) {
        var valid: any = true;
        var result: any = this.entityAliases.filter((item: any) => item.alias === newAlias);
        if (result && result.length) {
            if (this.isAdd || this.alias.id != result[0].id) {
                valid = false;
            }
        }
        this.theForm.aliasName.$setValidity('duplicateAliasName', valid);
    }
  }

  private onFormPristineChange(): void {
    if (this.theForm && !this.theForm.$pristine) {
        this.theForm.$setValidity('entityFilter', true);
    }
  }

  validate(...rest: any[]): any {
    var deferred: any = $q.defer();
    var validationResult: any = {
        entity: null,
        stateEntity: false
    }
    this.entityService.resolveAliasFilter(this.alias.filter, null, 1, true).then(
        function success(result?: any) {
            validationResult.stateEntity = result.stateEntity;
            var entities: any = result.entities;
            if (entities.length) {
                validationResult.entity = entities[0];
            }
            deferred.resolve(validationResult);
        },
        function fail() {
            deferred.reject();
        }
    );
    return deferred.promise;
  }

  cancel = (...rest: any[]): any => {
    (this.dialog as any).cancel();
  };

  save = (...rest: any[]): any => {
    this.theForm.$setPristine();
    this.validate().then(
        () => {
            if (this.isAdd) {
                this.alias.id = this.utils.guid();
            }
            (this.dialog as any).hide(this.alias);
        },
        () => {
            this.theForm.$setValidity('entityFilter', false);
        }
    )
  };
}
