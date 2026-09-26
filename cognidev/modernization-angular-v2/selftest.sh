#!/usr/bin/env bash
# selftest.sh — deterministic self-test for the modernization-angular-v2 playbook.
# Exercises the two LLM-free tools (detect-version, scaffold-app) across the real
# spread of starting points, plus manifest/questionnaire validity. Exit 0 only if
# every check passes. No network, no Node required.
set -u
PB="$(CDPATH= cd -- "$(dirname -- "$0")" && pwd)"
REPO="$(CDPATH= cd -- "$PB/../.." && pwd)"
T="$(mktemp -d)"
trap 'rm -rf "$T"' EXIT
pass=0; fail=0
ok()  { pass=$((pass+1)); printf '  \033[32m✓\033[0m %s\n' "$1"; }
no()  { fail=$((fail+1)); printf '  \033[31m✗ %s\033[0m\n' "$1"; }
check(){ if eval "$2"; then ok "$1"; else no "$1"; fi; }

echo "── detect-version: classify each generation ──────────────────────"
mkdir -p "$T/ajs"; echo '{"dependencies":{"angular":"~1.5.11"}}' > "$T/ajs/bower.json"; echo '{}' > "$T/ajs/package.json"
mkdir -p "$T/n7";  echo '{"dependencies":{"@angular/core":"^7.2.0"}}' > "$T/n7/package.json"; echo '{}' > "$T/n7/angular.json"
mkdir -p "$T/n12"; echo '{"dependencies":{"@angular/core":"~12.2.0"}}' > "$T/n12/package.json"; echo '{}' > "$T/n12/angular.json"
mkdir -p "$T/n18"; echo '{"dependencies":{"@angular/core":"^18.0.0"}}' > "$T/n18/package.json"; echo '{}' > "$T/n18/angular.json"
mkdir -p "$T/n22"; echo '{"dependencies":{"@angular/core":"^22.0.0"}}' > "$T/n22/package.json"; echo '{}' > "$T/n22/angular.json"
mkdir -p "$T/hyb"; echo '{"dependencies":{"angular":"~1.8.3","@angular/core":"19.0.0","@angular/upgrade":"19.0.0"}}' > "$T/hyb/package.json"; echo '{}' > "$T/hyb/angular.json"
for d in ajs n7 n12 n18 n22 hyb; do python3 "$PB/scripts/detect-version.py" "$T/$d" >/dev/null; done
band(){ python3 -c "import json;print(json.load(open('$T/$1/.cognidev/angular/generation.json'))['$2'])"; }
check "AngularJS → band angularjs-1x"        "[ \"$(band ajs band)\" = angularjs-1x ]"
check "AngularJS → strategy hybrid"          "[ \"$(band ajs recommended_strategy)\" = hybrid ]"
check "Angular 7 → band angular-2-8"         "[ \"$(band n7 band)\" = angular-2-8 ]"
check "Angular 7 → strategy stepwise"        "[ \"$(band n7 recommended_strategy)\" = stepwise ]"
check "Angular 7 → flags the rxjs cliff"     "python3 -c \"import json;c=json.load(open('$T/n7/.cognidev/angular/generation.json'))['cliffs'];import sys;sys.exit(0 if any('rxjs' in x for x in c) else 1)\""
check "Angular 12 → band angular-9-15"       "[ \"$(band n12 band)\" = angular-9-15 ]"
check "Angular 18 → band angular-16-21"      "[ \"$(band n18 band)\" = angular-16-21 ]"
check "Angular 22 → strategy current"        "[ \"$(band n22 recommended_strategy)\" = current ]"
check "AngularJS beside Angular → band hybrid"  "[ \"$(band hyb band)\" = hybrid ]"
check "hybrid → strategy strangle-then-stepwise" "[ \"$(band hyb recommended_strategy)\" = strangle-then-stepwise ]"
check "hybrid → names the angularjs-removal cliff first" "python3 -c \"import json;c=json.load(open('$T/hyb/.cognidev/angular/generation.json'))['cliffs'];import sys;sys.exit(0 if c and c[0].startswith('angularjs-removal') else 1)\""
# A crash before the first write would also leave src/app absent, so the check
# demands the exit code and the sentence, not the absence of a file.
HYB_OUT="$(CW_WORKDIR="$T/hyb" CW_PLAYBOOK_ROOT="$PB" python3 "$PB/scripts/scaffold-app.py" 2>&1)"; HYB_RC=$?
check "scaffold-app leaves an existing app alone (hybrid)" "[ $HYB_RC -eq 0 ] && echo \"$HYB_OUT\" | grep -q 'nothing scaffolded' && ! [ -e '$T/hyb/src/app/app.ts' ]"

echo "── scaffold-app: zone-based + zoneless target skeletons ──────────"
mkdir -p "$T/zone/.cognidev"; printf 'answers:\n  target_version: "22"\n  styling: scss\n' > "$T/zone/.cognidev/intent.yml"
CW_WORKDIR="$T/zone" CW_PLAYBOOK_ROOT="$PB" python3 "$PB/scripts/scaffold-app.py" >/dev/null
mkdir -p "$T/zl/.cognidev"; printf 'answers:\n  target_version: "22"\n  adopt_idioms: [standalone, zoneless]\n  styling: css\n' > "$T/zl/.cognidev/intent.yml"
CW_WORKDIR="$T/zl" CW_PLAYBOOK_ROOT="$PB" python3 "$PB/scripts/scaffold-app.py" >/dev/null
check "package.json is valid JSON"           "python3 -c \"import json;json.load(open('$T/zone/package.json'))\""
check "angular.json is valid JSON"           "python3 -c \"import json;json.load(open('$T/zone/angular.json'))\""
check "pins @angular/core ^22"               "grep -q '\"@angular/core\": \"\\^22' '$T/zone/package.json'"
check "pins TypeScript ~6"                   "grep -q '\"typescript\": \"~6' '$T/zone/package.json'"
check "uses the application builder"         "grep -q '@angular/build:application' '$T/zone/angular.json'"
check "standalone bootstrapApplication"      "grep -q 'bootstrapApplication' '$T/zone/src/main.ts'"
check "zone-based default has zone.js dep"   "grep -q '\"zone.js\"' '$T/zone/package.json'"
check "zoneless variant: provideZoneless"    "grep -q 'provideZonelessChangeDetection()' '$T/zl/src/app/app.config.ts'"
check "zoneless variant: NO zone.js dep"     "! grep -q '\"zone.js\"' '$T/zl/package.json'"
check "css styling → styles.css emitted"     "[ -f '$T/zl/src/styles.css' ]"
check "no unsubstituted {{snake_vars}}"      "! grep -rEl '\\{\\{[a-z_]+\\}\\}' '$T/zone' | grep -q ."
CW_WORKDIR="$T/zone" CW_PLAYBOOK_ROOT="$PB" python3 "$PB/scripts/scaffold-app.py" 2>/dev/null | grep -q '0 file(s) written'
check "idempotent re-run (no-clobber)"       "true"

SJS="$REPO/playbooks-v2/tools/structural-js/target/release/structural-js"
if [ -x "$SJS" ]; then
  echo "── structural-js angular.json (Angular-aware shard) ──────────────"
  mkdir -p "$T/ng/src"
  printf "import { Component, Input } from '@angular/core';\n@Component({ selector: 'app-x', standalone: true, template: '<b *ngFor=\"let i of xs\">{{i}}</b>' })\nexport class X { @Input() t=''; constructor(private s: any){} }\n" > "$T/ng/src/x.ts"
  "$SJS" "$T/ng" >/dev/null 2>&1
  flav(){ python3 -c "import json;print(json.load(open('$T/$1/.cognidev/understand/angular.json'))['$2'])"; }
  check "modern Angular → flavor angular"     "[ \"$(flav ng flavor)\" = angular ]"
  check "detects the @Component"              "python3 -c \"import json,sys;sys.exit(0 if json.load(open('$T/ng/.cognidev/understand/angular.json'))['components'] else 1)\""
  check "flags constructor-DI + legacy *ngFor" "python3 -c \"import json,sys;f=json.load(open('$T/ng/.cognidev/understand/angular.json'))['modernizationFlags'];sys.exit(0 if f['constructorDiComponents']>=1 and f['legacyControlFlow']>=1 else 1)\""
  # Legacy: a component with NO explicit standalone flag, DECLARED in an NgModule,
  # must resolve standalone=false (the regression that defaulted absent→true).
  mkdir -p "$T/leg/src"
  printf "import { Component, NgModule } from '@angular/core';\n@Component({ selector: 'app-l', template: '<i></i>' })\nexport class LegacyCmp {}\n@NgModule({ declarations: [LegacyCmp] })\nexport class LegacyMod {}\n" > "$T/leg/src/l.ts"
  "$SJS" "$T/leg" >/dev/null 2>&1
  check "NgModule-declared comp → standalone=false" "python3 -c \"import json,sys;a=json.load(open('$T/leg/.cognidev/understand/angular.json'));c=[x for x in a['components'] if x['name']=='LegacyCmp'][0];sys.exit(0 if c['standalone']==False and a['modernizationFlags']['nonStandaloneComponents']>=1 else 1)\""
  mkdir -p "$T/ajs2"
  cat > "$T/ajs2/a.js" <<'AJS'
angular.module('a', []).controller('C', function($scope) { $scope.x = 1; });
AJS
  "$SJS" "$T/ajs2" >/dev/null 2>&1
  check "AngularJS → flavor angularjs"        "[ \"$(flav ajs2 flavor)\" = angularjs ]"
else
  echo "── structural-js not built — skipping angular.json checks (build it to include) ──"
fi

echo "── setup-environment gate: one pinned version, hard-stop when unbuildable ──"
mkdir -p "$T/env/.cognidev"; printf 'target_version: "22"\n' > "$T/env/.cognidev/intent.yml"
CW_WORKDIR="$T/env" CW_PLAYBOOK_ROOT="$PB" CW_SETUP_NO_INSTALL=1 sh "$PB/scripts/setup-environment.sh" >/dev/null 2>&1
check "env gate writes env.json"            "[ -f '$T/env/.cognidev/env.json' ]"
check "env.json pins a node version"        "python3 -c \"import json,sys;e=json.load(open('$T/env/.cognidev/env.json'));sys.exit(0 if e.get('node') else 1)\""
check "scaffold reads node from env.json"   "CW_WORKDIR='$T/env' CW_PLAYBOOK_ROOT='$PB' python3 '$PB/scripts/scaffold-app.py' '$T/env' >/dev/null 2>&1 && python3 -c \"import json,sys;e=json.load(open('$T/env/.cognidev/env.json'));p=json.load(open('$T/env/package.json'));sys.exit(0 if str(e['node']) in p['engines']['node'] else 1)\""
# Hard-stop: with neither docker nor an adequate node, the gate must EXIT 1.
mkdir -p "$T/eb"; printf 'target_version: "22"\n' > "$T/eb/intent_unused"; mkdir -p "$T/eb/.cognidev"; printf 'target_version: "22"\n' > "$T/eb/.cognidev/intent.yml"
fakebin="$T/fakebin"; mkdir -p "$fakebin"
for u in grep sed tail head awk cat sh dirname mkdir printf; do command -v "$u" >/dev/null && ln -sf "$(command -v "$u")" "$fakebin/$u" 2>/dev/null; done
if CW_WORKDIR="$T/eb" CW_PLAYBOOK_ROOT="$PB" CW_SETUP_NO_INSTALL=1 PATH="$fakebin" sh "$PB/scripts/setup-environment.sh" >/dev/null 2>&1; then envrc=0; else envrc=1; fi
check "env gate HARD-STOPS (exit 1) with no toolchain" "[ $envrc -eq 1 ]"

if [ -x "$PB/tools/develop/target/release/ng-develop" ]; then
  echo "── ng-develop: flat file-by-file plan → grouped batches, gate per batch ──"
  mkdir -p "$T/dev/.cognidev/modernization-angular-v2/plan"
  cat > "$T/dev/.cognidev/modernization-angular-v2/plan/tasks.json" <<'JSON'
{ "feature":"m","tasks":[
  {"id":"a","kind":"edit","title":"m","files":["src/app/users/user.model.ts"]},
  {"id":"b","kind":"edit","title":"s","files":["src/app/users/user.service.ts"]},
  {"id":"c","kind":"edit","title":"c1","files":["src/app/users/a.component.ts"]},
  {"id":"d","kind":"edit","title":"c2","files":["src/app/users/b.component.ts"]},
  {"id":"e","kind":"edit","title":"sql","files":["src/app/users/V1__x.sql"]} ]}
JSON
  CW_WORKDIR="$T/dev" CW_PLAYBOOK_ROOT="$PB" CW_DRY_PLAN=1 "$PB/tools/develop/target/release/ng-develop" >"$T/dp.txt" 2>/dev/null
  check "groups 5 flat files into fewer batches" "[ \$(grep -c 'gate:' '$T/dp.txt') -lt 5 ] && [ \$(grep -c 'gate:' '$T/dp.txt') -gt 0 ]"
  check "SQL batch skips the compile gate"       "grep -q 'SKIP (non-source)' '$T/dp.txt'"
  check "data/model batch ordered first"         "grep -q 'users — models' '$T/dp.txt'"
fi

echo "── validation pipeline: static analysis, not just compilation ──────"
# Scaffold ships a published lint ruleset + the final pipeline runs step-by-step.
mkdir -p "$T/val/.cognidev"; printf 'target_version: "22"\n' > "$T/val/.cognidev/intent.yml"
CW_WORKDIR="$T/val" CW_PLAYBOOK_ROOT="$PB" python3 "$PB/scripts/scaffold-app.py" "$T/val" >/dev/null 2>&1
check "scaffold ships eslint.config.js (published ruleset)" "[ -f '$T/val/eslint.config.js' ]"
check "scaffold pins angular-eslint + eslint deps" "python3 -c \"import json,sys;d=json.load(open('$T/val/package.json'))['devDependencies'];sys.exit(0 if 'angular-eslint' in d and 'eslint' in d else 1)\""
VP=$(CW_WORKDIR="$T/val" sh "$PB/scripts/validate.sh" "$T/val" 2>&1)
check "final pipeline has a BUILD step"     "printf '%s' \"$VP\" | grep -q '① BUILD'"
check "final pipeline has a LINT step"      "printf '%s' \"$VP\" | grep -q '② LINT'"
check "final pipeline has a SECURITY step"  "printf '%s' \"$VP\" | grep -q '③ SECURITY'"
check "per-batch gate runs lint after compile" "grep -q 'LINT the files THIS batch changed' '$PB/scripts/typecheck.sh'"
check "per-batch gate fails closed without a compiler" "grep -q 'ENVIRONMENT NOT READY' '$PB/scripts/typecheck.sh' && ! grep -q 'batch not gated' '$PB/scripts/typecheck.sh'"
mkdir -p "$T/nogate"; echo '{}' > "$T/nogate/package.json"
check "gate refuses a workspace with no compiler installed (exit 2)" "! CW_WORKDIR='$T/nogate' bash '$PB/scripts/typecheck.sh' >/dev/null 2>&1"
# The final pipeline has the same shape: no Angular CLI is NOT READY, never a green skip.
VAL_OUT="$(CW_WORKDIR="$T/nogate" sh "$PB/scripts/validate.sh" 2>&1)"; VAL_RC=$?
check "an environment block is declared unrepairable" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));sys.exit(0 if 'ENVIRONMENT NOT READY' in (p.get('repair_stop_signatures') or []) else 1)\""
check "final validation fails closed when the project has no build (exit 2)" "[ $VAL_RC -eq 2 ] && echo \"$VAL_OUT\" | grep -q 'ENVIRONMENT NOT READY' && ! grep -q 'degrades to SKIP' '$PB/scripts/validate.sh'"
echo "── build-command: the project's own build, never a guess ───────"
mkdir -p "$T/bc-awb/src" "$T/bc-cli/src" "$T/bc-tsc" "$T/bc-none"
# The AWB shape: a CLI workspace left by `ng new` whose entry is gone, and webpack scripts.
echo '{"projects":{"q-app":{"architect":{"build":{"options":{"browser":"src/main.ts"}}}}}}' > "$T/bc-awb/angular.json"
echo '{"scripts":{"build-dev":"webpack --mode development","build-prod":"webpack --mode production"}}' > "$T/bc-awb/package.json"
check "build-command: dead CLI workspace → the package.json dev script"  "[ \"\$(CW_WORKDIR='$T/bc-awb' python3 '$PB/scripts/build-command.py' dev)\" = 'npm run build-dev' ]"
check "build-command: dead CLI workspace → the package.json prod script" "[ \"\$(CW_WORKDIR='$T/bc-awb' python3 '$PB/scripts/build-command.py' prod)\" = 'npm run build-prod' ]"
cp "$T/bc-awb/angular.json" "$T/bc-cli/angular.json"; echo '{}' > "$T/bc-cli/package.json"; echo '' > "$T/bc-cli/src/main.ts"
check "build-command: live CLI workspace → ng build"                    "[ \"\$(CW_WORKDIR='$T/bc-cli' python3 '$PB/scripts/build-command.py' dev)\" = 'node_modules/.bin/ng build --configuration development' ]"
echo '{}' > "$T/bc-tsc/package.json"; echo '{}' > "$T/bc-tsc/tsconfig.json"
check "build-command: no script, a tsconfig → tsc"                      "[ \"\$(CW_WORKDIR='$T/bc-tsc' python3 '$PB/scripts/build-command.py' dev)\" = 'node_modules/.bin/tsc --noEmit -p tsconfig.json' ]"
echo '{}' > "$T/bc-none/package.json"
check "build-command: nothing to build → exit 2 with the reason"        "! CW_WORKDIR='$T/bc-none' python3 '$PB/scripts/build-command.py' dev >/dev/null 2>'$T/bc-none/err' && grep -q 'no build command' '$T/bc-none/err'"
check "the batch gate runs build-command, not a hard-coded ng build"    "grep -q 'build-command.py' '$PB/scripts/typecheck.sh' && ! grep -q 'ng build --configuration development' '$PB/scripts/typecheck.sh'"
check "the final validation runs build-command too"                     "grep -q 'build-command.py' '$PB/scripts/validate.sh'"

echo "── wire-router: the hand-over as a syntax-tree edit ───────────"
check "wire-router runs after plan-tasks and before develop" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('plan-tasks')<ids.index('wire-router')<ids.index('develop') else 1)\""
WR="$PB/tools/wire-router/target/release/wire-router"
if [ -x "$WR" ]; then
  mkdir -p "$T/wr/src/client/q-app/core" "$T/wr/.cognidev/understand"
  printf '%s\n' "import { NgModule } from '@angular/core';" "@NgModule({ imports: [BrowserModule, UpgradeModule], providers: [] })" "export class AppModule { ngDoBootstrap() { } }" > "$T/wr/src/client/q-app/app.module.ts"
  printf '%s\n' "import { UpgradeModule } from '@angular/upgrade/static';" "platformBrowserDynamic().bootstrapModule(AppModule).then(ref => {" "  const upgrade = ref.injector.get(UpgradeModule) as UpgradeModule;" "  upgrade.bootstrap(document.body, ['aq']);" "});" > "$T/wr/main.ts"
  echo "export const routes = [];" > "$T/wr/src/client/q-app/app.routes.ts"
  echo '{"briefing":{"conformance":{"modern_root":"src/client/q-app"}},"plan":{"handover":{"modern_routes_file":"src/client/q-app/app.routes.ts","root_module_files":["src/client/q-app/app.module.ts"],"bootstraps":[{"file":"main.ts","line":4}]}}}' > "$T/wr/.cognidev/understand/angular-assessment.json"
  check "wire-router edits the root module and the bootstrap, writes the strategy" "CW_WORKDIR='$T/wr' '$WR' >/dev/null && grep -q 'RouterModule.forRoot(routes)' '$T/wr/src/client/q-app/app.module.ts' && grep -q 'setUpLocationSync(upgrade);' '$T/wr/main.ts' && [ -f '$T/wr/src/client/q-app/core/legacy-url-handling.strategy.ts' ]"
  check "wire-router edits each file once" "CW_WORKDIR='$T/wr' '$WR' | grep -q 'already wired' && [ \$(grep -c 'setUpLocationSync(upgrade);' '$T/wr/main.ts') -eq 1 ]"
  echo '{"briefing":{},"plan":{"handover":null}}' > "$T/wr/.cognidev/understand/angular-assessment.json"
  check "wire-router does nothing when no hand-over is pending" "CW_WORKDIR='$T/wr' '$WR' | grep -q 'nothing to do'"
fi

echo "── scaffold-units: the static half of the port ────────────────"
check "scaffold-units runs after wire-router and before develop" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('wire-router')<ids.index('scaffold-units')<ids.index('develop') else 1)\""
SU="$PB/tools/scaffold-units/target/release/scaffold-units"
if [ -x "$SU" ]; then
  mkdir -p "$T/su/src/client/app/common/components/chip" "$T/su/src/client/q-app/core" "$T/su/.cognidev/understand"
  printf '%s\n' "angular.module('aq').component('chip', { templateUrl: 'app/common/components/chip/chip.html', controllerAs: 'vm', bindings: { label: '@' }, controller: function () {} });" > "$T/su/src/client/app/common/components/chip/chip.js"
  printf '%s\n' '<div ng-if="vm.label" ng-click="vm.go()">{{vm.label}}</div>' > "$T/su/src/client/app/common/components/chip/chip.html"
  echo '{"angularjs":[{"kind":"component","name":"chip","module":"aq","file":"src/client/app/common/components/chip/chip.js","line":1,"injections":["$http"],"templateUrl":"app/common/components/chip/chip.html"}],"components":[]}' > "$T/su/.cognidev/understand/angular.json"
  echo '{"briefing":{"conformance":{"modern_root":"src/client/q-app"}}}' > "$T/su/.cognidev/understand/angular-assessment.json"
  check "scaffold-units writes the component, converts its template, and the ledger" "CW_WORKDIR='$T/su' '$SU' >/dev/null && grep -q \"selector: 'chip'\" '$T/su/src/client/q-app/feature/common/chip/chip.component.ts' && grep -q 'inject(HttpClient)' '$T/su/src/client/q-app/feature/common/chip/chip.component.ts' && grep -q '@if (label) {' '$T/su/src/client/q-app/feature/common/chip/chip.component.html' && grep -q '(click)=\"go()\"' '$T/su/src/client/q-app/feature/common/chip/chip.component.html' && [ -f '$T/su/PORT-LEDGER.md' ]"
fi

echo "── flip-route: a ported batch moves to the Angular Router ────"
check "compare-units runs after develop and flip-route requires it; NOT EQUIVALENT and NOT COMPARED stop the repair loop" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];fr=[x for x in p['lifecycle'] if x['id']=='flip-route'][0];s=p['repair_stop_signatures'];sys.exit(0 if ids.index('develop')<ids.index('compare-units')<ids.index('flip-route') and fr['requires']==['compare-units'] and 'NOT EQUIVALENT' in s and 'NOT COMPARED' in s else 1)\""
check "flip-route runs after develop and before validate" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('develop')<ids.index('flip-route')<ids.index('validate') else 1)\""
check "NOT PORTED and HAND-OVER PENDING stop the repair loop" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));s=p['repair_stop_signatures'];sys.exit(0 if 'NOT PORTED' in s and 'HAND-OVER PENDING' in s else 1)\""
FR="$PB/tools/flip-route/target/release/flip-route"
if [ ! -x "$FR" ]; then no "flip-route binary missing — build it: (cd $PB/tools/flip-route && cargo build --release --target-dir target)"; else
  mkdir -p "$T/fr/web/app/res" "$T/fr/web/q-app/feature/res/res-grid" "$T/fr/web/q-app/shared" "$T/fr/.cognidev/understand" "$T/fr/.cognidev/modernization-angular-v2/port"
  printf '%s\n' "(function () {" "    let baseURL = \`/project/:projectPid\`;" "    aqRouteHelper.configureStates([" "        { name: 'Home', url: '/home', views: { \"content\": { templateUrl: 'app/home.html' } } }," "        { name: 'Home.Res', url: \`\${baseURL}/res\`, views: { \"content-pinnedtab\": { template: '<res-grid></res-grid>' } } }" "    ]);" "})();" > "$T/fr/web/app/routes.js"
  echo "angular.module('aq').component('resGrid', { templateUrl: 'app/res/res-grid.html' });" > "$T/fr/web/app/res/res-grid.js"; echo "<div></div>" > "$T/fr/web/app/res/res-grid.html"
  printf 'import { Routes } from '"'"'@angular/router'"'"';\n\nexport const routes: Routes = [];\n' > "$T/fr/web/q-app/app.routes.ts"
  printf 'import * as angular from '"'"'angular'"'"';\nimport { downgradeComponent } from '"'"'@angular/upgrade/static'"'"';\nimport { X } from '"'"'./x'"'"';\n\nangular.module('"'"'aq.common'"'"').directive('"'"'x'"'"', downgradeComponent({ component: X }));\n' > "$T/fr/web/q-app/shared/downgraded.ts"
  printf '// Scaffolded by the playbook\nexport class ResGridComponent {\n  /* ORIGINAL\n  x\n  */\n}\n' > "$T/fr/web/q-app/feature/res/res-grid/res-grid.component.ts"
  cat > "$T/fr/.cognidev/understand/angular.json" <<'JSON'
{"routes":[{"family":"angularjs","router":"ui-router-object","name":"Home","url":"/home","file":"web/app/routes.js","line":4,"views":[{"name":"content","templateUrl":"app/home.html"}]},
           {"family":"angularjs","router":"ui-router-object","name":"Home.Res","url":"${baseURL}/res","file":"web/app/routes.js","line":5,"views":[{"name":"content-pinnedtab","template":"<res-grid></res-grid>"}]}],
 "routeClosures":[{"route":"Home.Res","seeds":["angularjs:aq:component:resGrid@web/app/res/res-grid.js:1"],"files":["web/app/res/res-grid.js"]}],
 "components":[],"bridges":[{"kind":"downgrade-component","direction":"angular-to-angularjs","symbol":"X","file":"web/q-app/shared/downgraded.ts","line":5}],
 "angularjs":[{"kind":"component","name":"resGrid","file":"web/app/res/res-grid.js","line":1,"templateUrl":"app/res/res-grid.html"}]}
JSON
  cat > "$T/fr/.cognidev/understand/angular-assessment.json" <<'JSON'
{"briefing":{"conformance":{"modern_root":"web/q-app","fix_forward":[]},"router":{"modern_routes_file":"web/q-app/app.routes.ts"}},
 "plan":{"handover":null,"batch_size":1,"tasks":[{"order":1,"route":"Home.Res","files":["web/app/res/res-grid.js"]}]}}
JSON
  cat > "$T/fr/.cognidev/modernization-angular-v2/port/units.json" <<'JSON'
{"legacyRoot":"web/app","units":[{"kind":"component","name":"resGrid","file":"web/app/res/res-grid.js","target":"web/q-app/feature/res/res-grid/res-grid.component.ts","status":"written"}]}
JSON
  FR_OUT="$(CW_WORKDIR="$T/fr" "$FR" 2>&1)"; FR_RC=$?
  check "flip-route refuses an unported batch as NOT PORTED, names the file, moves nothing" "[ $FR_RC -eq 2 ] && echo \"$FR_OUT\" | grep -q 'NOT PORTED' && echo \"$FR_OUT\" | grep -q 'res-grid.component.ts' && [ -f '$T/fr/web/app/res/res-grid.js' ] && ! grep -q 'path:' '$T/fr/web/q-app/app.routes.ts'"
  printf '// Scaffolded by the playbook\nimport { Component } from '"'"'@angular/core'"'"';\n@Component({ selector: '"'"'res-grid'"'"', standalone: true, templateUrl: '"'"'./res-grid.component.html'"'"' })\nexport class ResGridComponent {}\n' > "$T/fr/web/q-app/feature/res/res-grid/res-grid.component.ts"
  SI="$PB/tools/scan-idioms/target/release/scan-idioms"
  if [ ! -x "$SI" ]; then no "scan-idioms binary missing — build it: (cd $PB/tools/scan-idioms && cargo build --release --target-dir target)"; else
    mkdir -p "$T/si/web/app"
    printf "angular.module('a').controller('C', ['\$scope', '\$q', '\$uibModal', function (\$scope, \$q, \$uibModal) { \$q.defer(); \$scope.\$watch('x', function () {}); \$uibModal.open(); }]);\n" > "$T/si/web/app/c.js"
    printf '<div ng-repeat="x in xs track by x.id" uib-tooltip="t">{{ x.d | date }} {{ x.y | myFilter }}</div>\n' > "$T/si/web/app/c.html"
    SI_OUT="$(CW_WORKDIR="$T/si" "$SI" 2>&1)"; SI_RC=$?
    check "scan-idioms names what is not in the catalog (\$uibModal, uib-tooltip, myFilter) and what is (\$q.defer, \$watch, ng-repeat, track by, date)" "[ $SI_RC -eq 0 ] && grep -q '\`\$uibModal\`' '$T/si/IDIOM-COVERAGE.md' && grep -q '\`uib-tooltip\`' '$T/si/IDIOM-COVERAGE.md' && grep -q '\`myFilter\`' '$T/si/IDIOM-COVERAGE.md' && grep -q 'member.\$q.defer' '$T/si/IDIOM-COVERAGE.md' && grep -q 'scope.\$watch' '$T/si/IDIOM-COVERAGE.md' && grep -q 'attribute.ng-repeat' '$T/si/IDIOM-COVERAGE.md' && grep -q 'expression.track-by' '$T/si/IDIOM-COVERAGE.md' && grep -q 'filter.date' '$T/si/IDIOM-COVERAGE.md' && [ -s '$T/si/.cognidev/modernization-angular-v2/idioms.json' ]"
    check "the idioms step runs after understand and writes IDIOM-COVERAGE.md" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));s={x['id']:x for x in p['lifecycle']};i=s['idioms'];sys.exit(0 if i['requires']==['understand'] and any(o['path']=='IDIOM-COVERAGE.md' for o in i['outputs']) and i['tool'].endswith('scan-idioms') else 1)\""
  fi
  SU="$PB/tools/scaffold-units/target/release/scaffold-units"
  if [ -x "$SI" ] && [ -x "$SU" ]; then
    mkdir -p "$T/gate/web/app" "$T/gate/web/q-app" "$T/gate/.cognidev/understand"
    printf '{ "dependencies": { "@angular/core": "19.0.0", "angular": "1.8.3" } }\n' > "$T/gate/package.json"
    printf "angular.module('a').controller('GateCtrl', ['\$scope', '\$uibModal', function (\$scope, \$uibModal) { \$scope.open = function () { \$uibModal.open({}); }; }]);\n" > "$T/gate/web/app/gate.js"
    printf '{"angularjs":[{"kind":"controller","name":"GateCtrl","module":"a","file":"web/app/gate.js","line":1,"injections":["$scope","$uibModal"]}]}' > "$T/gate/.cognidev/understand/angular.json"
    printf '{"briefing":{"conformance":{"modern_root":"web/q-app"}}}' > "$T/gate/.cognidev/understand/angular-assessment.json"
    CW_WORKDIR="$T/gate" "$SI" > "$T/gate.si.out" 2>&1
    CW_WORKDIR="$T/gate" "$SU" > "$T/gate.su.out" 2>&1; SU_RC=$?
    # A name the catalog does not know is DEFAULTED by the scan, not held: an
    # undecided entry is a review record, not an input to the port, so holding
    # the run on one bought a stopped run and nothing else.
    check "a name outside the catalog is defaulted by the scan, written to idioms.local.yaml as defaulted, and does not stop the port" "[ $SU_RC -eq 0 ] && grep -q '1 defaulted by the scan' '$T/gate.si.out' && grep -q 'defaulted: true' '$T/gate/.cognidev/modernization-angular-v2/idioms.local.yaml' && grep -q 'uibModal' '$T/gate/.cognidev/modernization-angular-v2/idioms.local.yaml' && ls '$T/gate/web/q-app'/*/*/*/*.ts >/dev/null 2>&1"
    # `pending: true` is the reviewer's own stop, and it still stops the port.
    sed -i.bak 's/class: note, target: "[^"]*", defaulted: true,/class: decision, target: "", pending: true,/' "$T/gate/.cognidev/modernization-angular-v2/idioms.local.yaml"
    CW_WORKDIR="$T/gate" "$SI" > "$T/gate.si2.out" 2>&1
    CW_WORKDIR="$T/gate" "$SU" > "$T/gate.su2.out" 2>&1; SU_RC2=$?
    check "a reviewer who marks a name pending stops scaffold-units as NOT CATALOGUED, naming it" "[ $SU_RC2 -ne 0 ] && grep -q '1 held pending' '$T/gate.si2.out' && grep -q 'NOT CATALOGUED' '$T/gate.su2.out' && grep -q 'uibModal' '$T/gate.su2.out'"
  fi
  CU="$PB/tools/compare-units/target/release/compare-units"
  if [ ! -x "$CU" ]; then no "compare-units binary missing — build it: (cd $PB/tools/compare-units && cargo build --release --target-dir target)"; else
    check "flip-route refuses as NOT COMPARED until compare-units has run" "CW_WORKDIR='$T/fr' '$FR' > '$T/fr.nc.out' 2>&1; grep -q 'NOT COMPARED' '$T/fr.nc.out' && [ -f '$T/fr/web/app/res/res-grid.js' ]"
    printf '// Scaffolded by the playbook\nimport { Component } from '"'"'@angular/core'"'"';\n@Component({ selector: '"'"'res-grid'"'"', standalone: true, template: '"'"''"'"' })\nexport class ResGridComponent {}\n' > "$T/fr/web/q-app/feature/res/res-grid/res-grid.component.ts"
    check "compare-units names a ported file that lost its template as mismatched, and flip-route refuses it as NOT EQUIVALENT" "CW_WORKDIR='$T/fr' '$CU' > '$T/fr.cu.out' 2>&1 && grep -q '1 mismatched' '$T/fr.cu.out' && grep -q 'resGrid' '$T/fr/UNIT-COMPARE.md' && CW_WORKDIR='$T/fr' '$FR' > '$T/fr.ne.out' 2>&1; grep -q 'NOT EQUIVALENT' '$T/fr.ne.out' && grep -q 'template' '$T/fr.ne.out' && [ -f '$T/fr/web/app/res/res-grid.js' ]"
    printf '// Scaffolded by the playbook\nimport { Component } from '"'"'@angular/core'"'"';\n@Component({ selector: '"'"'res-grid'"'"', standalone: true, templateUrl: '"'"'./res-grid.component.html'"'"' })\nexport class ResGridComponent {}\n' > "$T/fr/web/q-app/feature/res/res-grid/res-grid.component.ts"
    check "compare-units marks the ported file matched once its structure is whole" "CW_WORKDIR='$T/fr' '$CU' > '$T/fr.cu2.out' 2>&1 && grep -q '1 matched' '$T/fr.cu2.out' && python3 -c \"import json,sys;d=json.load(open('$T/fr/.cognidev/modernization-angular-v2/unit-compare.json'));sys.exit(0 if d['counts']['mismatched']==0 else 1)\""
    check "the validation report is the inventory checklist: old and new in one row, grouped by folder" "grep -q 'validation report</title>' '$T/fr/VALIDATION-REPORT.html' && grep -q '<tr class=\"group\"><td colspan=\"10\"><code>web/app/res</code>' '$T/fr/VALIDATION-REPORT.html' && grep -o '<tr data-s=\"matched\".*</tr>' '$T/fr/VALIDATION-REPORT.html' | head -1 | grep -q 'resGrid.*res-grid.js:[0-9]*.*ResGridComponent.*res-grid.component.ts'"
    check "the sign-off page is docs/SIGNOFF-REPORT.html and the inventory step follows the sign-off" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];so=[x for x in p['lifecycle'] if x['id']=='signoff'][0];sys.exit(0 if so.get('args')==['--out','docs/SIGNOFF-REPORT.html'] and ids.index('signoff')<ids.index('inventory')<ids.index('finalize') else 1)\""
  fi
  check "flip-route moves the ported route: entry, shim in the state, bridge registration, original deleted" "CW_WORKDIR='$T/fr' '$FR' >/dev/null && grep -q \"path: 'home/project/:projectPid/res'\" '$T/fr/web/q-app/app.routes.ts' && grep -q 'm.ResGridComponent' '$T/fr/web/q-app/app.routes.ts' && grep -q \"template: '<aq-router-outlet></aq-router-outlet>'\" '$T/fr/web/app/routes.js' && grep -q 'url: \`\${baseURL}/res\`' '$T/fr/web/app/routes.js' && grep -q 'RouterOutletShimComponent' '$T/fr/web/q-app/shared/downgraded.ts' && [ -f '$T/fr/web/q-app/core/router-outlet-shim.component.ts' ] && ! [ -f '$T/fr/web/app/res/res-grid.js' ] && ! [ -f '$T/fr/web/app/res/res-grid.html' ] && [ -f '$T/fr/.cognidev/modernization-angular-v2/moves.json' ]"
  check "flip-route run twice doubles nothing" "CW_WORKDIR='$T/fr' '$FR' >/dev/null && [ \$(grep -c 'home/project/:projectPid/res' '$T/fr/web/q-app/app.routes.ts') -eq 1 ] && [ \$(grep -c 'aqRouterOutlet' '$T/fr/web/q-app/shared/downgraded.ts') -eq 1 ]"
fi

echo "── after the run: counted again, held to the request ─────────"
check "understand-after, ledger-after and check-request follow flip-route, before validate" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('flip-route')<ids.index('understand-after')<ids.index('ledger-after')<ids.index('check-request')<ids.index('validate') else 1)\""
check "ledger-after runs assess-angular with --ledger-only" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));s=[x for x in p['lifecycle'] if x['id']=='ledger-after'][0];sys.exit(0 if s.get('args',[])[:1]==['--ledger-only'] else 1)\""
check "sign-off compares the two ledgers and reads the request verdict" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/signoff.yaml'));ids=[c['id'] for s in p['groups'] for c in s['checks']];sys.exit(0 if {'legacy-routes-not-increased','modern-routes-not-decreased','request-fulfilled'}<=set(ids) else 1)\""
CR="$PB/tools/check-request/target/release/check-request"
if [ ! -x "$CR" ]; then no "check-request binary missing — build it: (cd $PB/tools/check-request && cargo build --release --target-dir target)"; else
  mkdir -p "$T/cr/.cognidev/feature" "$T/cr/.cognidev/modernization-angular-v2"
  echo '{"kind":"batch","routes":["A"],"files":[]}' > "$T/cr/.cognidev/feature/request.json"
  check "check-request says NOT DONE while the batch's route is not on the move record" "CW_WORKDIR='$T/cr' '$CR' | grep -q 'NOT DONE' && python3 -c \"import json,sys;r=json.load(open('$T/cr/.cognidev/modernization-angular-v2/request-result.json'));sys.exit(0 if r['done'] is False and r['missing'][0].startswith('A: not moved') else 1)\""
  echo '[{"route":"A"}]' > "$T/cr/.cognidev/modernization-angular-v2/moves.json"
  check "check-request says DONE once it is" "CW_WORKDIR='$T/cr' '$CR' | grep -q 'batch — DONE'"
fi

echo "── remove-angularjs: the runtime leaves once nothing renders on it ─"
check "remove-angularjs runs after understand-after and before check-request" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('understand-after')<ids.index('remove-angularjs')<ids.index('check-request') else 1)\""
RA="$PB/tools/remove-angularjs/target/release/remove-angularjs"
if [ ! -x "$RA" ]; then no "remove-angularjs binary missing — build it: (cd $PB/tools/remove-angularjs && cargo build --release --target-dir target)"; else
  check "remove-angularjs refuses while a legacy route still renders an AngularJS view, on record" "CW_WORKDIR='$T/fr' '$RA' > '$T/fr.ra.out' 2>&1; grep -q 'NOT REMOVABLE' '$T/fr.ra.out' && python3 -c \"import json,sys;r=json.load(open('$T/fr/.cognidev/modernization-angular-v2/removed.json'));sys.exit(0 if r['done'] is False and 'Home' in r['why'] else 1)\" && [ -f '$T/fr/web/app/routes.js' ]"
  mkdir -p "$T/ra/web/q-app/core" "$T/ra/web/app/routes" "$T/ra/.cognidev/understand" "$T/ra/.cognidev/modernization-angular-v2/port"
  printf 'import { platformBrowserDynamic } from '"'"'@angular/platform-browser-dynamic'"'"';\nimport { UpgradeModule } from '"'"'@angular/upgrade/static'"'"';\nimport { AppModule } from '"'"'./web/q-app/app.module'"'"';\n\nplatformBrowserDynamic().bootstrapModule(AppModule).then(ref => { ref.injector.get(UpgradeModule).bootstrap(document.body, ['"'"'aq'"'"']); });\n' > "$T/ra/main.ts"
  printf 'import { NgModule } from '"'"'@angular/core'"'"';\nimport { UpgradeModule } from '"'"'@angular/upgrade/static'"'"';\n\n@NgModule({ imports: [UpgradeModule, RouterModule.forRoot(routes)] })\nexport class AppModule {}\n' > "$T/ra/web/q-app/app.module.ts"
  echo "angular.module('aq', []);" > "$T/ra/web/app/AppModule.js"; echo "angular.module('aq').run(function () {});" > "$T/ra/web/app/routes/routes.js"
  echo '{"dependencies":{"angular":"1.8.3","@angular/core":"22.1.5","@angular/upgrade":"22.1.5"}}' > "$T/ra/package.json"
  cat > "$T/ra/.cognidev/understand/angular.json" <<'JSON'
{"routes":[{"family":"angularjs","name":"Home","url":"/home","file":"web/app/routes/routes.js","line":1,"views":[{"name":"content","template":"<aq-router-outlet></aq-router-outlet>"}]}],
 "angularjs":[{"kind":"run","name":"run@1","file":"web/app/routes/routes.js","line":1}],
 "angularjsModules":[{"name":"aq","file":"web/app/AppModule.js","line":1}],
 "bridges":[{"kind":"upgrade-bootstrap","symbol":"UpgradeModule","file":"main.ts","line":5}],
 "bootstraps":[{"family":"angular","kind":"bootstrap-module","root":"AppModule","file":"main.ts","line":5},{"family":"hybrid","kind":"upgrade-bootstrap","root":"aq","file":"main.ts","line":5}],
 "modules":[{"name":"AppModule","file":"web/q-app/app.module.ts","line":4}]}
JSON
  echo '{"briefing":{"conformance":{"modern_root":"web/q-app"}}}' > "$T/ra/.cognidev/understand/angular-assessment.json"
  echo '{"legacyRoot":"web/app","units":[]}' > "$T/ra/.cognidev/modernization-angular-v2/port/units.json"
  check "remove-angularjs collapses the bootstrap, clears the module, deletes the legacy root and drops the packages" "CW_WORKDIR='$T/ra' '$RA' >/dev/null && grep -q 'bootstrapModule(AppModule);' '$T/ra/main.ts' && ! grep -q 'UpgradeModule' '$T/ra/main.ts' && grep -q 'imports: \[RouterModule.forRoot(routes)\]' '$T/ra/web/q-app/app.module.ts' && ! [ -d '$T/ra/web/app' ] && ! grep -q '\"angular\"' '$T/ra/package.json' && grep -q '@angular/core' '$T/ra/package.json' && python3 -c \"import json,sys;sys.exit(0 if json.load(open('$T/ra/.cognidev/modernization-angular-v2/removed.json'))['done'] else 1)\""
fi

echo "── private registries: checked before anything is installed ────"
mkdir -p "$T/reg1" "$T/reg2" "$T/reghome"; echo '{"dependencies":{"@angular/core":"19.0.0"}}' > "$T/reg1/package.json"; cp "$T/reg1/package.json" "$T/reg2/"
printf '@acme:registry=https://npm.pkg.github.com/\n' > "$T/reg1/.npmrc"
R1="$(cd "$T/reg1" && HOME="$T/reghome" CW_SETUP_NO_INSTALL=1 CW_WORKDIR="$T/reg1" sh "$PB/scripts/setup-environment.sh" 2>&1)"; R1_RC=$?
check "a scoped registry without a token line stops as ENVIRONMENT NOT READY, naming the scope and the line to add" "[ $R1_RC -eq 2 ] && echo \"$R1\" | grep -q 'ENVIRONMENT NOT READY' && echo \"$R1\" | grep -q '@acme' && echo \"$R1\" | grep -q '_authToken'"
printf '@acme:registry=https://npm.pkg.github.com/\n//npm.pkg.github.com/:_authToken=${ACME_TOKEN}\n' > "$T/reg2/.npmrc"
# The outputs go to files: they carry a literal `$ACME_TOKEN`, which an eval'd `echo "$VAR"` would expand.
(cd "$T/reg2" && HOME="$T/reghome" CW_SETUP_NO_INSTALL=1 CW_WORKDIR="$T/reg2" env -u ACME_TOKEN sh "$PB/scripts/setup-environment.sh" > "$T/reg2.unset.out" 2>&1); R2_RC=$?
check "a token read from an unset variable stops as ENVIRONMENT NOT READY, naming the variable" "[ $R2_RC -eq 2 ] && grep -q 'ACME_TOKEN, which is not set' '$T/reg2.unset.out'"
(cd "$T/reg2" && HOME="$T/reghome" CW_SETUP_NO_INSTALL=1 CW_WORKDIR="$T/reg2" ACME_TOKEN=x sh "$PB/scripts/setup-environment.sh" > "$T/reg2.set.out" 2>&1)
check "with the variable set the registry passes and the value is never printed" "grep -q 'token from .ACME_TOKEN (set)' '$T/reg2.set.out' && ! grep -q 'ACME_TOKEN=x' '$T/reg2.set.out'"

echo "── repair-workspace + upgrade-major: stepwise, one major at a time ──"
mkdir -p "$T/up/src" "$T/up/.cognidev/angular" "$T/up/node_modules/typescript"
echo '{"dependencies":{"@angular/core":"19.0.0","@angular/cli":"19.0.0"}}' > "$T/up/package.json"
echo '{"version":"5.4.5"}' > "$T/up/node_modules/typescript/package.json"
echo '{"target_version":22,"hybrid":false}' > "$T/up/.cognidev/angular/generation.json"
echo '{"projects":{"app":{"sourceRoot":"src","architect":{"build":{"builder":"@angular-devkit/build-angular:application","options":{"browser":"src/main.ts","tsConfig":"tsconfig.app.json","index":"src/index.html","styles":["src/styles.scss","src/real.css"],"assets":[{"glob":"**/*","input":"public"}],"scripts":["node_modules/x/x.js"]}}}}}}' > "$T/up/angular.json"
echo 'console.log(1);' > "$T/up/main.ts"; echo '{}' > "$T/up/tsconfig.app.json"; echo '/* real */' > "$T/up/src/real.css"
check "repair-workspace points a missing browser entry at the main.ts that exists and keeps what exists" "CW_WORKDIR='$T/up' sh '$PB/scripts/repair-workspace.sh' | grep -q 'browser src/main.ts → main.ts' && python3 -c \"import json,sys;a=json.load(open('$T/up/angular.json'))['projects']['app'];o=a['architect']['build']['options'];sys.exit(0 if o['browser']=='main.ts' and o['tsConfig']=='tsconfig.app.json' and a['sourceRoot']=='src' else 1)\" && grep -q 'index src/index.html is missing' '$T/up/.cognidev/modernization-angular-v2/workspace-repair.json'"
check "repair-workspace drops a stylesheet and an assets folder that are not in the repository, keeps the ones that are, and leaves a node_modules path alone" "python3 -c \"import json,sys;o=json.load(open('$T/up/angular.json'))['projects']['app']['architect']['build']['options'];sys.exit(0 if o['styles']==['src/real.css'] and o['assets']==[] and o['scripts']==['node_modules/x/x.js'] else 1)\" && grep -q 'styles dropped src/styles.scss' '$T/up/.cognidev/modernization-angular-v2/workspace-repair.json'"
check "upgrade-major 21 waits its turn at 19" "CW_WORKDIR='$T/up' sh '$PB/scripts/upgrade-major.sh' 21 | grep -q 'the next major is 20'"
check "upgrade-major 20 (dry run) bumps TypeScript into range, runs ng update 20, then the build; on record" "CW_DRY_RUN=1 CW_WORKDIR='$T/up' sh '$PB/scripts/upgrade-major.sh' 20 > '$T/up.dry.out' 2>&1 && grep -q 'update @angular/core@20' '$T/up.dry.out' && python3 -c \"import json,sys;r=json.load(open('$T/up/.cognidev/modernization-angular-v2/upgrade-20.json'));c=r['commands'];sys.exit(0 if r['dry_run'] and r['from']==19 and r['to']==20 and 'typescript@>=5.8 <6.0' in c[0] and '@angular/cli@20 update @angular/core@20 @angular/cli@20' in c[1] and 'typecheck.sh' in c[2] else 1)\""
echo '{"target_version":22,"hybrid":true}' > "$T/up/.cognidev/angular/generation.json"
check "upgrade-major waits while the AngularJS runtime is still in the tree" "CW_DRY_RUN=1 CW_WORKDIR='$T/up' sh '$PB/scripts/upgrade-major.sh' 20 | grep -q 'waits until remove-angularjs'"
echo '{"target_version":22,"hybrid":false}' > "$T/up/.cognidev/angular/generation.json"; rm "$T/up/angular.json"
check "upgrade-major stops as ENVIRONMENT NOT READY without a CLI workspace" "CW_DRY_RUN=1 CW_WORKDIR='$T/up' sh '$PB/scripts/upgrade-major.sh' 20; [ \$? -eq 2 ]"
check "the upgrade steps follow repair-workspace in order, before check-request, and repair-workspace requires the removal step" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];rw=[x for x in p['lifecycle'] if x['id']=='repair-workspace'][0];sys.exit(0 if ids.index('remove-angularjs')<ids.index('repair-workspace')<ids.index('upgrade-20')<ids.index('upgrade-21')<ids.index('upgrade-22')<ids.index('check-request')<ids.index('validate') and rw.get('requires')==['remove-angularjs'] else 1)\""

echo "── check-routes: every route with a URL, opened in a browser ────"
check "check-routes follows validate and the sign-off reads its record" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];s=yaml.safe_load(open('$PB/signoff.yaml'));c=[x['id'] for g in s['groups'] for x in g['checks']];sys.exit(0 if ids.index('validate')<ids.index('check-routes') and 'routes-answer' in c else 1)\""
check "the generated spec holds the moved route on the Angular Router and the legacy route still on AngularJS" "python3 '$PB/scripts/check-routes.py' '$T/fr' | grep -q '2 route(s) with a URL' && grep -q '\"url\": \"/home/project/:projectPid/res\"' '$T/fr/e2e/cognidev/routes.spec.ts' && grep -q '\"owner\": \"angular\"' '$T/fr/e2e/cognidev/routes.spec.ts' && grep -q '\"url\": \"/home\"' '$T/fr/e2e/cognidev/routes.spec.ts' && grep -q 'CW_ROUTE_PARAMS' '$T/fr/e2e/cognidev/routes.spec.ts' && [ -f '$T/fr/e2e/cognidev/playwright.config.ts' ]"
check "the runner stops as ENVIRONMENT NOT READY without the app URL, saying what to set" "CW_WORKDIR='$T/fr' env -u CW_APP_URL sh '$PB/scripts/check-routes.sh' | grep -q 'ENVIRONMENT NOT READY — CW_APP_URL'; [ \${PIPESTATUS:-0} -eq 0 ] || true; CW_WORKDIR='$T/fr' env -u CW_APP_URL sh '$PB/scripts/check-routes.sh' >/dev/null 2>&1; [ \$? -eq 2 ]"

echo "── report: the tree on the left, the diff on the right ────────"
check "report runs after validate and before signoff" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('validate')<ids.index('report')<ids.index('signoff') else 1)\""
RM="$PB/tools/report-migration/target/release/report-migration"
if [ -x "$RM" ] && command -v git >/dev/null 2>&1; then
  mkdir -p "$T/rm/src/client/q-app"; ( cd "$T/rm" && git init -q -b main && git config user.email t@t && git config user.name t && echo 'export class A {}' > src/client/q-app/app.module.ts && git add -A && git commit -q -m base && git branch source && git checkout -q -b feat/x && echo 'import { RouterModule } from "@angular/router";' >> src/client/q-app/app.module.ts )
  check "report-migration writes the page with the change linked to its diff" "CW_WORKDIR='$T/rm' '$RM' >/dev/null && grep -q 'href=\"#f-[0-9]*\">app.module.ts</a>' '$T/rm/MIGRATION-REPORT.html' && grep -q '+import { RouterModule }' '$T/rm/MIGRATION-REPORT.html'"
fi

echo "── sign-off: every claim against its artifact ─────────────────"
check "signoff.yaml parses"                  "python3 -c \"import yaml;yaml.safe_load(open('$PB/signoff.yaml'))\""
check "signoff step precedes finalize, and finalize requires it" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];f=[s for s in p['lifecycle'] if s['id']=='finalize'][0];sys.exit(0 if ids.index('signoff')<ids.index('finalize') and f.get('requires')==['signoff'] else 1)\""
check "a failed sign-off is declared unrepairable" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));sys.exit(0 if 'NOT SIGNED OFF' in p['repair_stop_signatures'] else 1)\""
SO="$PB/../tools/signoff-report/target/release/signoff-report"
if [ -x "$SO" ]; then
  mkdir -p "$T/so"; "$SO" --project "$T/so" --playbook "$PB" --json "$T/so/signoff.json" --out "$T/so/report.html" >/dev/null 2>&1; SO_RC=$?
  # Exit 2 would mean the spec itself is invalid. An empty project reads INCOMPLETE, never SIGNED OFF.
  check "the checklist is a valid spec and an empty run is not signed off" "[ $SO_RC -ne 2 ] && ! grep -q '\"verdict\": *\"SIGNED OFF\"' '$T/so/signoff.json' && grep -q 'INCOMPLETE\|NOT SIGNED OFF' '$T/so/signoff.json'"
fi
check "validate law codified in laws.yaml"  "grep -q 'validate-not-just-compile' '$REPO/tools/playbook-gen/laws.yaml'"

echo "── the documentation: one site, the code and this run ───────────"
DP="$PB/tools/docs-pages/target/release/docs-pages"
mkdir -p "$T/docs/.cognidev/run" "$T/docs/.cognidev/feature" "$T/docs/.cognidev/angular" "$T/docs/.cognidev/modernization-angular-v2" "$T/docs/.cognidev/understand"
echo '{"playbook":"modernization-angular-v2","phases":{"understand":{"status":"Ok"},"validate":{"status":"Failed"},"check-routes":{"status":"Skipped"}}}' > "$T/docs/.cognidev/run/phases.json"
cat > "$T/docs/.cognidev/run/signoff.json" <<'JSON'
{"verdict":"NOT SIGNED OFF","subject":"It was read.","counts":{"total":3,"passed":1,"failed":1,"not_verified":1},
 "groups":[{"name":"Build proof","checks":[
   {"claim":"The production build reached terminal Ok.","verdict":"FAIL","evidence":".cognidev/run/phases.json · phase `validate` → Failed","reason":"the phase finished Failed, not Ok"},
   {"claim":"Every route opened in a browser.","verdict":"NOT VERIFIED","evidence":".cognidev/modernization-angular-v2/route-check.json","reason":"no such file"},
   {"claim":"The structural pass read this repository.","verdict":"PASS","evidence":"index.json","reason":null}]}]}
JSON
echo '{"angularjs_version":"~1.8.3","angular_version":"19.0.0","target_version":22,"band":"hybrid"}' > "$T/docs/.cognidev/angular/generation.json"
echo '{"briefing":{"ledger":{"routes_legacy":77,"routes_modern":0,"legacy_units":537}}}' > "$T/docs/.cognidev/understand/angular-assessment.json"
echo '{"routes_legacy":77,"routes_modern":0,"legacy_units":537}' > "$T/docs/.cognidev/modernization-angular-v2/ledger-after.json"
echo '{"counts":{"matched":4,"unported":2,"missing-target":0},"units":[{"kind":"service","name":"aqHelper","file":"app/b.js","line":9,"target":"q/b.ts","origin":"generated","status":"unported","bindings":{"expected":0,"found":0,"missing":[]},"injections":{"expected":2,"found":0,"missing":["qaToaster"]},"members":{"expected":1,"found":0,"missing":["load"]},"template":"none"}]}' > "$T/docs/.cognidev/modernization-angular-v2/unit-compare.json"
printf '**Router hand-over** — the modern half is to own the URL.\n' > "$T/docs/.cognidev/feature/request.md"
echo '{"done":true,"met":["app.module.ts: the Router is registered"],"missing":[]}' > "$T/docs/.cognidev/modernization-angular-v2/request-result.json"
if [ -x "$DP" ]; then
  CW_WORKDIR="$T/docs" "$DP" --playbook "$PB" >/dev/null 2>&1; DP_RC=$?
  J="$T/docs/docs/cognidev/derived.json"
  check "run pages: written where the documentation cycle reads them" "[ $DP_RC -eq 0 ] && [ -f '$J' ]"
  check "run pages: valid JSON in the page shape"        "python3 -c \"import json,sys;p=json.load(open('$J'));sys.exit(0 if all(set(('id','title','summary','intent','provenance','blocks'))<=set(x) for x in p) else 1)\""
  check "run pages: migration, validation, sign-off, status" "python3 -c \"import json,sys;p=json.load(open('$J'));sys.exit(0 if [x['id'] for x in p]==['migration','validation','signoff','status'] else 1)\""
  check "run pages: no page renders HTML of its own"     "! grep -qi '<div\|<table\|<span\|doctype' '$J'"
  check "run pages: the failed claim and the skipped step are open" "python3 -c \"import json,sys;p=json.load(open('$J'));st=[x for x in p if x['id']=='status'][0];t=json.dumps(st);sys.exit(0 if 'The production build reached terminal Ok.' in t and 'Open every route in a browser' in t else 1)\""
  check "run pages: a passing claim is not open"         "python3 -c \"import json,sys;p=json.load(open('$J'));st=[x for x in p if x['id']=='status'][0];sys.exit(0 if 'The structural pass read this repository.' not in json.dumps(st) else 1)\""
  check "run pages: an unmatched count is actionable"    "grep -q '2 unit(s) — not ported' '$J' && grep -q 'unported row says what the port must produce' '$J'"
  check "run pages: the unmatched unit names what is missing" "grep -q 'injection qaToaster' '$J'"
  mkdir -p "$T/nodocs"
  CW_WORKDIR="$T/nodocs" "$DP" --playbook "$PB" >/dev/null 2>&1; ND_RC=$?
  check "run pages: refuses a workspace no playbook has run in" "[ $ND_RC -eq 1 ] && [ ! -f '$T/nodocs/docs/cognidev/derived.json' ]"
fi
check "the documentation cycle is a step, and it runs after both verdicts" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];k={s['id']:s.get('kind') for s in p['lifecycle']};sys.exit(0 if k.get('docs')=='docs' and ids.index('signoff')<ids.index('docs') and ids.index('inventory')<ids.index('docs') and ids.index('doc-pages')<ids.index('docs')<ids.index('finalize') else 1)\""
check "the run's pages are written before the cycle renders them" "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));ids=[s['id'] for s in p['lifecycle']];sys.exit(0 if ids.index('doc-pages')<ids.index('docs') else 1)\""
check "every report of the run lands in docs/"          "python3 -c \"import yaml,sys;p=yaml.safe_load(open('$PB/playbook.yaml'));d=[o['path'] for s in p['lifecycle'] for o in (s.get('outputs') or []) if o.get('kind')=='report' and not o['path'].startswith('.cognidev/')];sys.exit(0 if all(x.startswith('docs') or x.endswith('.md') for x in d) else 1)\""
check "the sign-off claims the documentation site"      "grep -q 'docs/index.html' '$PB/signoff.yaml'"
check "no playbook step writes its own index"           "! grep -q 'INDEX.html' '$PB/playbook.yaml'"

echo "── manifest + questionnaire validity ────────────────────────────"
check "playbook.yaml parses"                 "python3 -c \"import yaml;yaml.safe_load(open('$PB/playbook.yaml'))\""
check "brownfield.json parses"               "python3 -c \"import json;json.load(open('$PB/brownfield.json'))\""
for q in "$PB"/questionnaire/*.yaml; do
  check "questionnaire $(basename "$q") parses" "python3 -c \"import yaml;yaml.safe_load(open('$q'))\""
done
if [ -f "$REPO/tools/questionnaire-flow/validate.py" ]; then
  cat > "$T/ans.json" <<'JSON'
{ "git_strategy":"work-branch","current_generation":"angular-9-15","driver":"full-modernize","scope":"",
  "target_version":"22","adopt_idioms":["standalone","control-flow","signals"],"test_runner":"vitest","package_manager":"npm",
  "migration_strategy":"auto","state_management":"signals","styling":"scss",
  "strictness":"strict","e2e":"playwright","keep_untouched":"",
  "router_ownership":"modern-owns","batch_size":"one","route_gate":"build-and-suite" }
JSON
  check "questionnaire flow validates" "python3 '$REPO/tools/questionnaire-flow/validate.py' '$PB' --answers '$T/ans.json' >/dev/null 2>&1"
fi

echo
echo "── result: $pass passed, $fail failed ──"
[ "$fail" -eq 0 ]
