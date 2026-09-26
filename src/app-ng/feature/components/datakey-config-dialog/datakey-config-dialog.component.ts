import { Component, forwardRef, inject } from '@angular/core';
import { EntityService } from '../../api/services/entity.service';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormsModule } from '@angular/forms';
import { TbDatakeyConfigDirective } from '../tb-datakey-config/tb-datakey-config.directive';
import { inject as injectRoot } from '@angular/core';
import { RootState } from '../../../root-state';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatToolbarModule } from '@angular/material/toolbar';
import { TranslatePipe } from '@ngx-translate/core';

import { $q } from '../../../core/q';
// Globals the original relied on (loaded as scripts by the legacy page); type them, or import the package.
declare let $scope: any;

/**
 * Ported from the AngularJS controller `DatakeyConfigDialogController` (module `thingsboard.dialogs.datakeyConfigDialog`) in src/app/components/datakey-config-dialog.controller.js:18.
 * Scaffolded by the playbook: the shape and the body are ported by syntax tree; 3 thing(s) stay as written under a TODO(port) for a person or a model.
 */
@Component({
  selector: 'datakey-config-dialog',
  standalone: true,
  imports: [TranslatePipe, MatToolbarModule, MatProgressBarModule, MatIconModule, MatDialogModule, MatButtonModule, FormsModule, forwardRef(() => TbDatakeyConfigDirective)],
  templateUrl: './datakey-config-dialog.component.html',
})
export class DatakeyConfigDialogComponent {
  protected readonly rootScope = injectRoot(RootState);
  protected readonly dialog = inject(MatDialog);
  private readonly dialogRef = inject(MatDialogRef);
  // TODO(port): '$q' — use Promise, or an Observable
  // TODO(port): '$scope' — component state: fields and signals on this class
  protected readonly dialogData: any = inject(MAT_DIALOG_DATA, { optional: true }) ?? {};
  protected readonly entityService = inject(EntityService);

  dataKey: any;
  dataKeySettingsSchema: any;
  entityAlias: any;
  aliasController: any;
  theForm: any;

  // TODO(port): $q.defer — $q.defer: return new Promise((resolve, reject) => …) instead
  // TODO(port): $scope.$broadcast — a scope event: call the service that listens
  // TODO(port): `success` — a named function expression that calls itself; as an arrow it has no name: name it as a method

  constructor() {
    this.dataKey = this.dialogData.dataKey;
    this.dataKeySettingsSchema = this.dialogData.dataKeySettingsSchema;
    this.entityAlias = this.dialogData.entityAlias;
    this.aliasController = this.dialogData.aliasController;
  }

  hide(...rest: any[]): any {
    this.dialogRef.close();
  }

  cancel(...rest: any[]): any {
    this.dialogRef.close();
  }

  /** The key lookup tb-datakey-config calls (its legacy `fetch-entity-keys` callback). */
  readonly fetchKeys = (args: { entityAliasId: string; query: string; type: string }): Promise<string[]> =>
    this.fetchEntityKeys(args.entityAliasId, args.query, args.type);

  fetchEntityKeys(entityAliasId?: any, query?: any, type?: any, ...rest: any[]): any {
    var deferred: any = $q.defer();
    this.aliasController.getAliasInfo(entityAliasId).then(
        (aliasInfo?: any) => {
            var entity: any = aliasInfo.currentEntity;
            if (entity) {
                this.entityService.getEntityKeys(entity.entityType, entity.id, query, type, {ignoreLoading: true}).then(
                    function success(keys?: any) {
                        deferred.resolve(keys);
                    },
                    function fail() {
                        deferred.resolve([]);
                    }
                );
            } else {
                deferred.resolve([]);
            }
        },
        function fail() {
            deferred.resolve([]);
        }
    );
    return deferred.promise;
  }

  save(...rest: any[]): any {
    this.rootScope.$broadcast('form-submit');
    if (this.theForm.$valid) {
        this.theForm.$setPristine();
        this.dialogRef.close(this.dataKey);
    }
  }
}
