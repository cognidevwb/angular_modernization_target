# Tasks — slice `home.ruleChains.importRuleChain`

Units in S3 order; tasks in the order they run.

## 34. `home.ruleChains.importRuleChain` (route ui-router) — 2 tasks

`src/app/rulechain/rulechain.routes.js`

**T34.1** · change — Change route `home.ruleChains.importRuleChain` from a ui-router state to an Angular Router route.

- Source: `src/app/rulechain/rulechain.routes.js` L86
- Target: `the Angular route table`
- Now: ui-router state `home.ruleChains.importRuleChain` is defined at src/app/rulechain/rulechain.routes.js:86.
- After: An Angular `Routes` entry for `home.ruleChains.importRuleChain` shows the same view; the ui-router state is gone.
- Done by: code · Checked by: the `home.ruleChains.importRuleChain` page renders; `.state('home.ruleChains.importRuleChain'` is absent

**T34.2** · check — Check route `home.ruleChains.importRuleChain`: it compiles and behaves as before.

- Target: `src/app/rulechain/rulechain.routes.ts`
- Now: `home.ruleChains.importRuleChain` still runs as AngularJS.
- After: route `home.ruleChains.importRuleChain` runs as Angular with the same behaviour.
- Done by: code · Checked by: the project compiles; before/after compare matches

