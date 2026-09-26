# Tasks — slice `home.ruleChains`

Units in S3 order; tasks in the order they run.

## 31. `RuleChainController` (angularjs controller) — 3 tasks

`src/app/rulechain/index.js`

**T31.1** · create — Create Angular component `RuleChainComponent` for the screen that AngularJS controller `RuleChainController` drives.

- Source: `src/app/rulechain/index.js` L28
- Target: `src/app/rulechain/index.ts`
- Now: `RuleChainController` is registered at src/app/rulechain/index.js:28 with `angular.module('thingsboard.ruleChain').controller(…)`.
- After: `src/app/rulechain/index.ts` exports `RuleChainComponent`; no AngularJS registration of `RuleChainController` remains.
- Done by: code · Checked by: `RuleChainComponent` is exported from `src/app/rulechain/index.ts`; `.controller('RuleChainController'` is absent; the project compiles

**T31.2** · add_bridge — Add a bridge so AngularJS `home.ruleChains.importRuleChain`, `home.ruleChains.ruleChain` can keep using `RuleChainComponent` until they are migrated.

- Target: ``
- Now: `home.ruleChains.importRuleChain`, `home.ruleChains.ruleChain` use AngularJS `RuleChainController`; no bridge to `RuleChainComponent` exists.
- After: AngularJS name `RuleChainController` is registered as `downgradeComponent(RuleChainComponent)`; `home.ruleChains.importRuleChain`, `home.ruleChains.ruleChain` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.ruleChains.importRuleChain`, `home.ruleChains.ruleChain` still render

**T31.3** · check — Check `RuleChainComponent`: it compiles and behaves as before.

- Target: `src/app/rulechain/index.ts`
- Now: `RuleChainController` still runs as AngularJS.
- After: `RuleChainComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.ruleChains.importRuleChain` page renders


## 32. `RuleChainsController` (angularjs controller) — 3 tasks

`src/app/rulechain/index.js`

**T32.1** · create — Create Angular component `RuleChainsComponent` for the screen that AngularJS controller `RuleChainsController` drives.

- Source: `src/app/rulechain/index.js` L28
- Target: `src/app/rulechain/index.ts`
- Now: `RuleChainsController` is registered at src/app/rulechain/index.js:28 with `angular.module('thingsboard.ruleChain').controller(…)`.
- After: `src/app/rulechain/index.ts` exports `RuleChainsComponent`; no AngularJS registration of `RuleChainsController` remains.
- Done by: code · Checked by: `RuleChainsComponent` is exported from `src/app/rulechain/index.ts`; `.controller('RuleChainsController'` is absent; the project compiles

**T32.2** · add_bridge — Add a bridge so AngularJS `home.ruleChains` can keep using `RuleChainsComponent` until they are migrated.

- Target: ``
- Now: `home.ruleChains` use AngularJS `RuleChainsController`; no bridge to `RuleChainsComponent` exists.
- After: AngularJS name `RuleChainsController` is registered as `downgradeComponent(RuleChainsComponent)`; `home.ruleChains` still work.
- Done by: code · Checked by: the registration is present; the screens of `home.ruleChains` still render

**T32.3** · check — Check `RuleChainsComponent`: it compiles and behaves as before.

- Target: `src/app/rulechain/index.ts`
- Now: `RuleChainsController` still runs as AngularJS.
- After: `RuleChainsComponent` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches; the `home.ruleChains` page renders


## 33. `home.ruleChains` (route ui-router) — 3 tasks

`src/app/rulechain/rulechain.routes.js`

**T33.1** · change — Change route `home.ruleChains` from a ui-router state to an Angular Router route.

- Source: `src/app/rulechain/rulechain.routes.js` L30
- Target: `the Angular route table`
- Now: ui-router state `home.ruleChains` is defined at src/app/rulechain/rulechain.routes.js:30.
- After: An Angular `Routes` entry for `home.ruleChains` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.ruleChains` page renders; `.state('home.ruleChains'` is absent

**T33.2** · remove_bridge — Remove the bridge for `RuleChainsComponent`: `home.ruleChains` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `RuleChainsController` is bridged to `RuleChainsComponent`.
- After: No bridge registration for `RuleChainsController` remains.
- Done by: code · Checked by: no registration of `RuleChainsController` in ``; the project compiles

**T33.3** · check — Check route `home.ruleChains`: it compiles and behaves as before.

- Target: `src/app/rulechain/rulechain.routes.ts`
- Now: `home.ruleChains` still runs as AngularJS.
- After: route `home.ruleChains` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

