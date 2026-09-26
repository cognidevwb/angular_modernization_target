# Tasks — slice `home.ruleChains.ruleChain`

Units in S3 order; tasks in the order they run.

## 35. `home.ruleChains.ruleChain` (route ui-router) — 3 tasks

`src/app/rulechain/rulechain.routes.js`

**T35.1** · change — Change route `home.ruleChains.ruleChain` from a ui-router state to an Angular Router route.

- Source: `src/app/rulechain/rulechain.routes.js` L49
- Target: `the Angular route table`
- Now: ui-router state `home.ruleChains.ruleChain` is defined at src/app/rulechain/rulechain.routes.js:49.
- After: An Angular `Routes` entry for `home.ruleChains.ruleChain` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.ruleChains.ruleChain` page renders; `.state('home.ruleChains.ruleChain'` is absent

**T35.2** · remove_bridge — Remove the bridge for `RuleChainComponent`: `home.ruleChains.ruleChain` was its last AngularJS user.

- Target: ``
- Now: AngularJS name `RuleChainController` is bridged to `RuleChainComponent`.
- After: No bridge registration for `RuleChainController` remains.
- Done by: code · Checked by: no registration of `RuleChainController` in ``; the project compiles

**T35.3** · check — Check route `home.ruleChains.ruleChain`: it compiles and behaves as before.

- Target: `src/app/rulechain/rulechain.routes.ts`
- Now: `home.ruleChains.ruleChain` still runs as AngularJS.
- After: route `home.ruleChains.ruleChain` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

