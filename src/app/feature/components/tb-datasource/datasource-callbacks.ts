/**
 * The legacy `&` callbacks of the widget-config → datasource chain whose results the
 * directives read; they are function inputs, called with the legacy locals in order.
 */

/** `generateDataKey({chip, type})`: builds a data key for a typed chip. */
export type GenerateDataKeyFn = (chip: any, type: string) => any;

/** `fetchEntityKeys({entityAliasId, query, type})`: the key names the alias's entities have. */
export type FetchEntityKeysFn = (entityAliasId: string, query: string, type: string) => Promise<any>;

/** `onCreateEntityAlias({event, alias, allowedEntityTypes})`: opens alias creation; resolves with the new alias. */
export type CreateEntityAliasFn = (event: Event | undefined, alias: string, allowedEntityTypes?: any) => Promise<any> | undefined;

/** `fetchDashboardStates({query})`: the dashboard state ids matching the query. */
export type FetchDashboardStatesFn = (query: string) => any;
