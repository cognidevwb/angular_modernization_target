import { cloneDeep, isEqual } from 'lodash-es';

/** Where alias changes are announced (`entityAliasesChanged`, `entityAliasResolved`): a RootState or any `$broadcast` owner. */
export interface AliasEventTarget {
  $broadcast(name: string, ...args: any[]): unknown;
}

/** The dashboard state the aliases resolve against. */
export interface AliasStateController {
  getStateParams(): any;
  getEntityId?(entityParamName: string): any;
}

/**
 * Ported from src/app/api/alias-controller.js: resolves a dashboard's entity aliases into
 * datasources, caching each alias's resolution until the aliases or the state entity change.
 * The constructor keeps the legacy positional shape (`$scope, $q, $filter, utils, types,
 * entityService, stateController, entityAliases`); `$q`/`$filter` are no longer used — the
 * class works on native Promises — and are accepted only so existing call sites stay valid.
 */
export class AliasController {
  private entityAliases: any;
  private resolvedAliases: Record<string, any> = {};
  private resolvedAliasesPromise: Record<string, Promise<any> | undefined> = {};
  private resolvedAliasesToStateEntities: Record<string, any> = {};

  constructor(
    private readonly $scope: AliasEventTarget,
    _q: unknown,
    _filter: unknown,
    private readonly utils: any,
    private readonly types: any,
    private readonly entityService: any,
    private readonly stateController: AliasStateController,
    entityAliases: any,
  ) {
    this.entityAliases = cloneDeep(entityAliases);
  }

  updateEntityAliases(newEntityAliases: any): void {
    const changedAliasIds: string[] = [];
    for (const aliasId in newEntityAliases) {
      if (!isEqual(newEntityAliases[aliasId], this.entityAliases[aliasId])) {
        changedAliasIds.push(aliasId);
        this.setAliasUnresolved(aliasId);
      }
    }
    for (const aliasId in this.entityAliases) {
      if (!newEntityAliases[aliasId]) {
        changedAliasIds.push(aliasId);
        this.setAliasUnresolved(aliasId);
      }
    }
    this.entityAliases = cloneDeep(newEntityAliases);
    if (changedAliasIds.length) {
      this.$scope.$broadcast('entityAliasesChanged', changedAliasIds);
    }
  }

  dashboardStateChanged(): void {
    const changedAliasIds: string[] = [];
    for (const aliasId in this.resolvedAliasesToStateEntities) {
      const stateEntityInfo = this.resolvedAliasesToStateEntities[aliasId];
      const newEntityId = this.stateController.getEntityId?.(stateEntityInfo.entityParamName);
      if (!isEqual(newEntityId, stateEntityInfo.entityId)) {
        changedAliasIds.push(aliasId);
        this.setAliasUnresolved(aliasId);
      }
    }
    if (changedAliasIds.length) {
      this.$scope.$broadcast('entityAliasesChanged', changedAliasIds);
    }
  }

  setAliasUnresolved(aliasId: string): void {
    delete this.resolvedAliases[aliasId];
    delete this.resolvedAliasesPromise[aliasId];
    delete this.resolvedAliasesToStateEntities[aliasId];
  }

  getEntityAliases(): any {
    return this.entityAliases;
  }

  getEntityAliasId(aliasName: string): string | null {
    for (const aliasId in this.entityAliases) {
      if (this.entityAliases[aliasId].alias == aliasName) {
        return aliasId;
      }
    }
    return null;
  }

  getAliasInfo(aliasId: string): Promise<any> {
    const aliasInfo = this.resolvedAliases[aliasId];
    if (aliasInfo) {
      return Promise.resolve(aliasInfo);
    }
    const pending = this.resolvedAliasesPromise[aliasId];
    if (pending) {
      return pending;
    }
    const entityAlias = this.entityAliases[aliasId];
    if (!entityAlias) {
      return Promise.reject();
    }
    const promise = Promise.resolve(this.entityService.resolveAlias(entityAlias, this.stateController.getStateParams())).then(
      (resolved: any) => {
        this.resolvedAliases[aliasId] = resolved;
        delete this.resolvedAliasesPromise[aliasId];
        if (resolved.stateEntity) {
          this.resolvedAliasesToStateEntities[aliasId] = {
            entityParamName: resolved.entityParamName,
            entityId: this.stateController.getEntityId?.(resolved.entityParamName),
          };
        }
        this.$scope.$broadcast('entityAliasResolved', aliasId);
        return resolved;
      },
      (reason: unknown) => {
        delete this.resolvedAliasesPromise[aliasId];
        throw reason;
      },
    );
    this.resolvedAliasesPromise[aliasId] = promise;
    return promise;
  }

  resolveDatasource(datasource: any, isSingle?: boolean): Promise<any[]> {
    if (datasource.type !== this.types.datasourceType.entity) {
      return Promise.resolve([datasource]);
    }
    if (!datasource.entityAliasId) {
      datasource.aliasName = datasource.entityName;
      datasource.name = datasource.entityName;
      return Promise.resolve([datasource]);
    }
    return this.getAliasInfo(datasource.entityAliasId).then((aliasInfo: any) => {
      datasource.aliasName = aliasInfo.alias;
      if (aliasInfo.resolveMultiple && !isSingle) {
        return this.resolveMultiple(datasource, aliasInfo);
      }
      const entity = aliasInfo.currentEntity;
      if (entity) {
        datasource.entity = entity.origEntity ? cloneDeep(entity.origEntity) : {};
        datasource.entityId = entity.id;
        datasource.entityType = entity.entityType;
        datasource.entityName = entity.name;
        datasource.entityLabel = entity.label;
        datasource.name = entity.name;
        datasource.entityDescription = entity.entityDescription;
        return [datasource];
      }
      if (aliasInfo.stateEntity) {
        datasource.unresolvedStateEntity = true;
        return [datasource];
      }
      throw undefined;
    });
  }

  private resolveMultiple(datasource: any, aliasInfo: any): any[] {
    const resolvedEntities = aliasInfo.resolvedEntities;
    if (resolvedEntities && resolvedEntities.length) {
      return resolvedEntities.map((resolvedEntity: any, i: number) => {
        const newDatasource = cloneDeep(datasource);
        newDatasource.entity = resolvedEntity.origEntity ? cloneDeep(resolvedEntity.origEntity) : {};
        newDatasource.entityId = resolvedEntity.id;
        newDatasource.entityType = resolvedEntity.entityType;
        newDatasource.entityName = resolvedEntity.name;
        newDatasource.entityLabel = resolvedEntity.label;
        newDatasource.entityDescription = resolvedEntity.entityDescription;
        newDatasource.name = resolvedEntity.name;
        newDatasource.generated = i > 0;
        return newDatasource;
      });
    }
    if (aliasInfo.stateEntity) {
      const newDatasource = cloneDeep(datasource);
      newDatasource.unresolvedStateEntity = true;
      return [newDatasource];
    }
    throw undefined;
  }

  resolveAlarmSource(alarmSource: any): Promise<any> {
    return this.resolveDatasource(alarmSource, true).then((datasources) => {
      const datasource = datasources[0];
      if (datasource.type === this.types.datasourceType.function) {
        const name = datasource.name && datasource.name.length ? datasource.name : this.types.datasourceType.function;
        datasource.name = name;
        datasource.aliasName = name;
        datasource.entityName = name;
      } else if (datasource.unresolvedStateEntity) {
        datasource.name = 'Unresolved';
        datasource.entityName = 'Unresolved';
      }
      return datasource;
    });
  }

  resolveDatasources(datasources: any[]): Promise<any[]> {
    const newDatasources = cloneDeep(datasources);
    return Promise.all(newDatasources.map((datasource: any) => this.resolveDatasource(datasource))).then((arrays) => {
      const flat: any[] = ([] as any[]).concat(...arrays);
      // `$filter('orderBy')(datasources, '+generated')`: a stable sort, originals first
      const ordered = flat
        .map((d, i) => ({ d, i }))
        .sort((a, b) => Number(!!a.d.generated) - Number(!!b.d.generated) || a.i - b.i)
        .map((x) => x.d);
      let index = 0;
      let functionIndex = 0;
      ordered.forEach((datasource: any) => {
        if (datasource.type === this.types.datasourceType.function) {
          let name: string;
          if (datasource.name && datasource.name.length) {
            name = datasource.name;
          } else {
            functionIndex++;
            name = this.types.datasourceType.function;
            if (functionIndex > 1) {
              name += ' ' + functionIndex;
            }
          }
          datasource.name = name;
          datasource.aliasName = name;
          datasource.entityName = name;
        } else if (datasource.unresolvedStateEntity) {
          datasource.name = 'Unresolved';
          datasource.entityName = 'Unresolved';
        }
        datasource.dataKeys.forEach((dataKey: any) => {
          if (datasource.generated) {
            dataKey._hash = Math.random();
            dataKey.color = this.utils.getMaterialColor(index);
          }
          index++;
        });
        this.updateDatasourceKeyLabels(datasource);
      });
      return ordered;
    });
  }

  getInstantAliasInfo(aliasId: string): any {
    return this.resolvedAliases[aliasId];
  }

  updateCurrentAliasEntity(aliasId: string, currentEntity: any): void {
    const aliasInfo = this.resolvedAliases[aliasId];
    if (aliasInfo && !isEqual(currentEntity, aliasInfo.currentEntity)) {
      aliasInfo.currentEntity = currentEntity;
      this.$scope.$broadcast('entityAliasesChanged', [aliasId]);
    }
  }

  private updateDatasourceKeyLabels(datasource: any): void {
    for (const dataKey of datasource.dataKeys) {
      if (!dataKey.pattern) {
        dataKey.pattern = cloneDeep(dataKey.label);
      }
      dataKey.label = this.utils.createLabelFromDatasource(datasource, dataKey.pattern);
    }
  }
}
