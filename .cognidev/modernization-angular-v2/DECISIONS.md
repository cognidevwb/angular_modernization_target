# Open decisions (S5)

Jev requests: 580 sent, 113 from cache, 0 errors.

**Pick-one tasks** by who settled them: {"gap":942,"jev":194}. A pick is taken only when it is clear (probability ≥ 0.6, "none" < 0.2, its own fit ≥ 0.2); otherwise the task goes to the gap list with Jev's answers.

**Split reviews:** 49 screens; functions: {"move":4,"not asked (a lifecycle hook, or too large for one request)":3,"review":91,"stay":479} (move ≥ 0.7, stay < 0.3, review between).

## Picks by idiom

| Idiom | Fact | Jev | Gap |
|---|---|---|---|
| `member.$q.defer` | 0 | 68 | 141 |
| `scope.$watch` | 0 | 53 | 100 |
| `ngmodel.$viewValue` | 0 | 0 | 103 |
| `member.$filter.call` | 0 | 0 | 53 |
| `member.$attrs.field` | 0 | 30 | 18 |
| `scope.$on` | 0 | 1 | 46 |
| `member.$compile.call` | 0 | 0 | 45 |
| `token.$compile` | 0 | 0 | 42 |
| `helper.equals` | 0 | 32 | 2 |
| `ngmodel.$setViewValue` | 0 | 0 | 30 |
| `member.$rootScope.field` | 0 | 0 | 27 |
| `ngmodel.$setValidity` | 0 | 0 | 27 |
| `require.ngModel` | 0 | 0 | 26 |
| `ngmodel.$render` | 0 | 0 | 25 |
| `require.parent` | 0 | 0 | 25 |
| `token.$filter` | 0 | 0 | 24 |
| `scope.$broadcast` | 0 | 0 | 17 |
| `filter.filter` | 0 | 0 | 16 |
| `token.$rootScope` | 0 | 0 | 15 |
| `helper.lowercase` | 0 | 0 | 12 |
| `scope.$eval` | 0 | 0 | 11 |
| `helper.isObject` | 0 | 0 | 10 |
| `ngmodel.$setPristine` | 0 | 0 | 10 |
| `filter.orderBy` | 0 | 0 | 9 |
| `resource.$get` | 0 | 0 | 9 |
| `member.$controller.call` | 0 | 0 | 7 |
| `member.$location.search` | 0 | 0 | 7 |
| `scope.$emit` | 0 | 0 | 7 |
| `scope.$new` | 0 | 0 | 7 |
| `token.$controller` | 0 | 0 | 7 |
| `member.$rootScope.$broadcast` | 0 | 0 | 6 |
| `ngmodel.$setDirty` | 0 | 0 | 6 |
| `member.$rootScope.$on` | 0 | 2 | 3 |
| `helper.bind` | 0 | 0 | 4 |
| `helper.noop` | 0 | 0 | 4 |
| `member.$rootScope.scope` | 0 | 0 | 4 |
| `member.$state.go` | 0 | 0 | 4 |
| `scope.$parent` | 0 | 0 | 4 |
| `event.$stateChangeStart` | 0 | 0 | 3 |
| `helper.forEach` | 0 | 3 | 0 |
| `scope.$destroy` | 0 | 3 | 0 |
| `scope.$watchGroup` | 0 | 0 | 3 |
| `local.token.store` | 0 | 0 | 2 |
| `member.$animate.enabled` | 0 | 0 | 2 |
| `member.$parse.call` | 0 | 0 | 2 |
| `member.$state.includes` | 0 | 0 | 2 |
| `token.$animate` | 0 | 0 | 2 |
| `jqlite.plugin` | 0 | 1 | 0 |
| `jqlite.ready` | 0 | 0 | 1 |
| `local.token.jwtHelper` | 0 | 0 | 1 |
| `member.$animate.enter` | 0 | 0 | 1 |
| `member.$animate.leave` | 0 | 0 | 1 |
| `member.$location.host` | 0 | 0 | 1 |
| `member.$location.port` | 0 | 0 | 1 |
| `member.$location.protocol` | 0 | 0 | 1 |
| `ngmodel.$formatters` | 0 | 0 | 1 |
| `ngmodel.$parsers` | 0 | 0 | 1 |
| `require.self` | 0 | 0 | 1 |
| `scope.$watchCollection` | 0 | 0 | 1 |
| `token.$attrs` | 0 | 1 | 0 |
| `token.$injector` | 0 | 0 | 1 |
| `token.$parse` | 0 | 0 | 1 |

## Jev's picks

- **T61.4** `helper.equals` in `ReactSchemaForm` L241 → **lodash** — Jev: lodash 0.84, fit 0.41
- **T61.19** `scope.$watch` in `ReactSchemaForm` L192 → **on_changes** — Jev: on_changes 0.94, fit 0.33
- **T61.22** `scope.$watch` in `ReactSchemaForm` L199 → **on_changes** — Jev: on_changes 0.88, fit 0.37
- **T61.31** `scope.$destroy` in `ReactSchemaForm` L72 → **child_destroy** — Jev: child_destroy 0.97, fit 0.24
- **T61.55** `helper.equals` in `ReactSchemaForm` L56 → **lodash** — Jev: lodash 0.81, fit 0.35
- **T64.9** `helper.forEach` in `utils` L69 → **object_entries** — Jev: object_entries 0.88, fit 0.53
- **T64.11** `helper.forEach` in `utils` L70 → **object_entries** — Jev: object_entries 0.73, fit 0.47
- **T64.37** `member.$q.defer` in `utils` L578 → **new_promise** — Jev: new_promise 0.80, fit 0.22
- **T66.4** `member.$q.defer` in `adminService` L35 → **new_promise** — Jev: new_promise 0.88, fit 0.36
- **T67.9** `member.$q.defer` in `alarmService` L62 → **new_promise** — Jev: new_promise 0.79, fit 0.27
- **T67.11** `member.$q.defer` in `alarmService` L77 → **new_promise** — Jev: new_promise 0.82, fit 0.24
- **T71.15** `member.$q.defer` in `customerService` L128 → **new_promise** — Jev: new_promise 0.79, fit 0.25
- **T71.18** `member.$q.defer` in `customerService` L160 → **new_promise** — Jev: new_promise 0.85, fit 0.39
- **T72.13** `member.$q.defer` in `dashboardService` L162 → **new_promise** — Jev: new_promise 0.82, fit 0.37
- **T72.18** `member.$q.defer` in `dashboardService` L129 → **new_promise** — Jev: new_promise 0.82, fit 0.33
- **T72.22** `member.$q.defer` in `dashboardService` L173 → **new_promise** — Jev: new_promise 0.81, fit 0.36
- **T72.24** `member.$q.defer` in `dashboardService` L184 → **new_promise** — Jev: new_promise 0.82, fit 0.40
- **T72.26** `member.$q.defer` in `dashboardService` L195 → **new_promise** — Jev: new_promise 0.81, fit 0.37
- **T72.30** `member.$q.defer` in `dashboardService` L217 → **new_promise** — Jev: new_promise 0.83, fit 0.40
- **T73.4** `member.$q.defer` in `entityRelationService` L41 → **new_promise** — Jev: new_promise 0.86, fit 0.35
- **T73.16** `member.$q.defer` in `entityRelationService` L118 → **new_promise** — Jev: new_promise 0.80, fit 0.27
- **T73.26** `member.$q.defer` in `entityRelationService` L179 → **new_promise** — Jev: new_promise 0.79, fit 0.31
- **T74.4** `member.$q.defer` in `eventService` L30 → **new_promise** — Jev: new_promise 0.85, fit 0.23
- **T77.5** `member.$q.defer` in `loginService` L41 → **new_promise** — Jev: new_promise 0.86, fit 0.41
- **T77.9** `member.$q.defer` in `loginService` L68 → **new_promise** — Jev: new_promise 0.81, fit 0.33
- **T77.17** `member.$q.defer` in `loginService` L115 → **new_promise** — Jev: new_promise 0.80, fit 0.36
- **T78.4** `member.$q.defer` in `queueService` L30 → **new_promise** — Jev: new_promise 0.85, fit 0.45
- **T79.18** `member.$q.defer` in `ruleChainService` L86 → **new_promise** — Jev: new_promise 0.79, fit 0.34
- **T79.24** `member.$q.defer` in `ruleChainService` L119 → **new_promise** — Jev: new_promise 0.81, fit 0.36
- **T79.26** `member.$q.defer` in `ruleChainService` L202 → **new_promise** — Jev: new_promise 0.81, fit 0.25
- **T79.34** `member.$q.defer` in `ruleChainService` L237 → **new_promise** — Jev: new_promise 0.80, fit 0.25
- **T79.37** `member.$q.defer` in `ruleChainService` L281 → **new_promise** — Jev: new_promise 0.92, fit 0.38
- **T79.39** `member.$q.defer` in `ruleChainService` L292 → **new_promise** — Jev: new_promise 0.79, fit 0.33
- **T84.13** `member.$q.defer` in `tenantService` L75 → **new_promise** — Jev: new_promise 0.82, fit 0.39
- **T85.6** `member.$q.defer` in `timeService` L62 → **new_promise** — Jev: new_promise 0.80, fit 0.34
- **T88.20** `member.$q.defer` in `userService` L434 → **new_promise** — Jev: new_promise 0.83, fit 0.34
- **T88.25** `member.$q.defer` in `userService` L482 → **new_promise** — Jev: new_promise 0.83, fit 0.25
- **T88.41** `member.$q.defer` in `userService` L550 → **new_promise** — Jev: new_promise 0.80, fit 0.32
- **T88.43** `member.$q.defer` in `userService` L565 → **new_promise** — Jev: new_promise 0.85, fit 0.35
- **T88.59** `member.$q.defer` in `userService` L166 → **new_promise** — Jev: new_promise 0.82, fit 0.26
- **T88.62** `member.$q.defer` in `userService` L274 → **new_promise** — Jev: new_promise 0.83, fit 0.22
- **T89.8** `member.$q.defer` in `assetService` L57 → **new_promise** — Jev: new_promise 0.78, fit 0.23
- **T90.15** `member.$rootScope.$on` in `telemetryWebsocketService` L77 → **service_subject** — Jev: service_subject 0.83, fit 0.23
- **T93.23** `member.$q.defer` in `deviceService` L140 → **new_promise** — Jev: new_promise 0.83, fit 0.28
- **T93.25** `member.$q.defer` in `deviceService` L167 → **new_promise** — Jev: new_promise 0.82, fit 0.27
- **T93.41** `member.$q.defer` in `deviceService` L279 → **new_promise** — Jev: new_promise 0.88, fit 0.51
- **T93.51** `member.$q.defer` in `deviceService` L341 → **new_promise** — Jev: new_promise 0.78, fit 0.32
- **T94.23** `member.$q.defer` in `entityViewService` L130 → **new_promise** — Jev: new_promise 0.79, fit 0.33
- **T94.25** `member.$q.defer` in `entityViewService` L142 → **new_promise** — Jev: new_promise 0.80, fit 0.42
- **T94.27** `member.$q.defer` in `entityViewService` L153 → **new_promise** — Jev: new_promise 0.84, fit 0.40
- **T94.31** `member.$q.defer` in `entityViewService` L187 → **new_promise** — Jev: new_promise 0.84, fit 0.38
- **T94.33** `member.$q.defer` in `entityViewService` L202 → **new_promise** — Jev: new_promise 0.84, fit 0.33
- **T94.35** `member.$q.defer` in `entityViewService` L213 → **new_promise** — Jev: new_promise 0.79, fit 0.39
- **T95.25** `member.$q.defer` in `entityService` L187 → **new_promise** — Jev: new_promise 0.85, fit 0.30
- **T95.26** `member.$q.defer` in `entityService` L211 → **new_promise** — Jev: new_promise 0.78, fit 0.26
- **T95.30** `member.$q.defer` in `entityService` L360 → **new_promise** — Jev: new_promise 0.89, fit 0.37
- **T95.44** `member.$q.defer` in `entityService` L977 → **new_promise** — Jev: new_promise 0.82, fit 0.29
- **T95.48** `member.$q.defer` in `entityService` L1340 → **new_promise** — Jev: new_promise 0.80, fit 0.24
- **T95.50** `member.$q.defer` in `entityService` L1381 → **new_promise** — Jev: new_promise 0.83, fit 0.28
- **T95.53** `helper.equals` in `entityService` L1511 → **strict** — Jev: strict 0.61, fit 0.48
- **T95.54** `member.$q.defer` in `entityService` L1159 → **new_promise** — Jev: new_promise 0.77, fit 0.26
- **T95.60** `member.$q.defer` in `entityService` L1310 → **new_promise** — Jev: new_promise 0.85, fit 0.34
- **T96.54** `member.$q.defer` in `widgetService` L437 → **new_promise** — Jev: new_promise 0.80, fit 0.32
- **T96.56** `member.$q.defer` in `widgetService` L449 → **new_promise** — Jev: new_promise 0.82, fit 0.33
- **T96.58** `member.$q.defer` in `widgetService` L462 → **new_promise** — Jev: new_promise 0.83, fit 0.29
- **T96.60** `member.$q.defer` in `widgetService` L486 → **new_promise** — Jev: new_promise 0.77, fit 0.24
- **T96.73** `member.$q.defer` in `widgetService` L714 → **new_promise** — Jev: new_promise 0.81, fit 0.27
- **T96.76** `member.$q.defer` in `widgetService` L727 → **new_promise** — Jev: new_promise 0.84, fit 0.38
- **T96.78** `member.$q.defer` in `widgetService` L739 → **new_promise** — Jev: new_promise 0.82, fit 0.30
- **T96.80** `member.$q.defer` in `widgetService` L758 → **new_promise** — Jev: new_promise 0.85, fit 0.25
- **T96.82** `member.$q.defer` in `widgetService` L772 → **new_promise** — Jev: new_promise 0.85, fit 0.29
- **T96.84** `member.$q.defer` in `widgetService` L786 → **new_promise** — Jev: new_promise 0.79, fit 0.23
- **T97.15** `helper.equals` in `bufferStore` L342 → **lodash** — Jev: lodash 0.86, fit 0.41
- **T97.17** `helper.equals` in `bufferStore` L376 → **lodash** — Jev: lodash 0.82, fit 0.54
- **T98.13** `helper.equals` in `itembuffer` L376 → **lodash** — Jev: lodash 0.87, fit 0.51
- **T98.17** `helper.equals` in `itembuffer` L342 → **lodash** — Jev: lodash 0.87, fit 0.43
- **T102.2** `helper.forEach` in `<dynamic:tbEventDirectives>` L22 → **for_of** — Jev: for_of 0.87, fit 0.35
- **T108.6** `member.$rootScope.$on` in `menu` L33 → **service_subject** — Jev: service_subject 0.83, fit 0.25
- **T109.15** `member.$attrs.field` in `milliSecondsToTimeString` L70 → **host_attribute** — Jev: host_attribute 0.62, fit 0.49
- **T109.17** `member.$attrs.field` in `milliSecondsToTimeString` L72 → **input** — Jev: input 0.63, fit 0.32
- **T109.21** `member.$attrs.field` in `milliSecondsToTimeString` L74 → **host_attribute** — Jev: host_attribute 0.67, fit 0.49
- **T109.27** `member.$attrs.field` in `milliSecondsToTimeString` L93 → **host_attribute** — Jev: host_attribute 0.67, fit 0.49
- **T109.30** `member.$attrs.field` in `milliSecondsToTimeString` L94 → **host_attribute** — Jev: host_attribute 0.64, fit 0.41
- **T109.35** `helper.equals` in `milliSecondsToTimeString` L255 → **lodash** — Jev: lodash 0.83, fit 0.42
- **T112.4** `scope.$watch` in `range` L61 → **on_changes** — Jev: on_changes 0.78, fit 0.29
- **T112.5** `scope.$watch` in `range` L66 → **on_changes** — Jev: on_changes 0.72, fit 0.32
- **T112.6** `scope.$watch` in `range` L71 → **on_changes** — Jev: on_changes 0.84, fit 0.41
- **T112.8** `scope.$watch` in `range` L76 → **on_changes** — Jev: on_changes 0.87, fit 0.38
- **T116.13** `scope.$watch` in `tbAlarmsTableWidget` L135 → **on_changes** — Jev: on_changes 0.70, fit 0.37
- **T116.15** `helper.equals` in `tbAlarmsTableWidget` L147 → **lodash** — Jev: lodash 0.80, fit 0.55
- **T116.20** `scope.$watch` in `tbAlarmsTableWidget` L175 → **effect** — Jev: effect 0.62, fit 0.37
- **T124.9** `scope.$watch` in `tbCircularProgress` L40 → **on_changes** — Jev: on_changes 0.76, fit 0.33
- **T125.9** `member.$attrs.field` in `tbConfirmOnExit` L24 → **input** — Jev: input 0.64, fit 0.20
- **T129.18** `scope.$watch` in `tbDashboard` L312 → **effect** — Jev: effect 0.73, fit 0.45
- **T129.20** `helper.equals` in `tbDashboard` L320 → **lodash** — Jev: lodash 0.86, fit 0.44
- **T129.24** `helper.equals` in `tbDashboard` L339 → **lodash** — Jev: lodash 0.60, fit 0.40
- **T129.27** `helper.equals` in `tbDashboard` L357 → **lodash** — Jev: lodash 0.86, fit 0.48
- **T130.24** `member.$q.defer` in `tbDashboardAutocomplete` L46 → **new_promise** — Jev: new_promise 0.77, fit 0.28
- **T130.38** `helper.equals` in `tbDashboardAutocomplete` L106 → **lodash** — Jev: lodash 0.80, fit 0.39
- **T130.40** `scope.$watch` in `tbDashboardAutocomplete` L110 → **on_changes** — Jev: on_changes 0.88, fit 0.37
- **T130.41** `helper.equals` in `tbDashboardAutocomplete` L111 → **lodash** — Jev: lodash 0.73, fit 0.48
- **T135.71** `member.$q.defer` in `tbDatakeyConfig` L128 → **new_promise** — Jev: new_promise 0.87, fit 0.34
- **T137.32** `scope.$watch` in `tbDatasourceEntity` L96 → **on_changes** — Jev: on_changes 0.69, fit 0.33
- **T137.50** `helper.equals` in `tbDatasourceEntity` L105 → **lodash** — Jev: lodash 0.82, fit 0.47
- **T137.104** `member.$q.defer` in `tbDatasourceEntity` L241 → **new_promise** — Jev: new_promise 0.78, fit 0.28
- **T138.24** `scope.$watch` in `tbDatasourceFunc` L82 → **on_changes** — Jev: on_changes 0.72, fit 0.28
- **T138.25** `scope.$watch` in `tbDatasourceFunc` L100 → **on_changes** — Jev: on_changes 0.71, fit 0.37
- **T139.11** `scope.$watch` in `tbDatetimePeriod` L74 → **on_changes** — Jev: on_changes 0.77, fit 0.36
- **T140.13** `member.$attrs.field` in `tbDetailsSidenav` L41 → **host_attribute** — Jev: host_attribute 0.67, fit 0.43
- **T140.15** `token.$attrs` in `tbDetailsSidenav` L48 → **host_attribute** — Jev: host_attribute 0.64, fit 0.29
- **T143.9** `helper.equals` in `tbEntitiesHierarchyWidget` L87 → **lodash** — Jev: lodash 0.81, fit 0.47
- **T143.20** `helper.equals` in `tbEntitiesHierarchyWidget` L261 → **strict** — Jev: strict 0.81, fit 0.76
- **T143.21** `helper.equals` in `tbEntitiesHierarchyWidget` L270 → **lodash** — Jev: lodash 0.61, fit 0.49
- **T144.13** `helper.equals` in `tbEntitiesTableWidget` L129 → **lodash** — Jev: lodash 0.83, fit 0.47
- **T160.54** `scope.$watch` in `tbExpandFullscreen` L87 → **effect** — Jev: effect 0.68, fit 0.36
- **T160.57** `member.$attrs.field` in `tbExpandFullscreen` L101 → **input** — Jev: input 0.61, fit 0.36
- **T160.58** `member.$attrs.field` in `tbExpandFullscreen` L102 → **input** — Jev: input 0.66, fit 0.35
- **T160.60** `member.$attrs.field` in `tbExpandFullscreen` L105 → **input** — Jev: input 0.68, fit 0.33
- **T160.61** `member.$attrs.field` in `tbExpandFullscreen` L114 → **host_attribute** — Jev: host_attribute 0.63, fit 0.45
- **T160.63** `member.$attrs.field` in `tbExpandFullscreen` L116 → **host_attribute** — Jev: host_attribute 0.67, fit 0.43
- **T167.13** `helper.equals` in `tbGatewayConfig` L88 → **lodash** — Jev: lodash 0.81, fit 0.38
- **T168.34** `helper.equals` in `tbGatewayConfigSelect` L50 → **lodash** — Jev: lodash 0.79, fit 0.52
- **T169.13** `scope.$watch` in `tbGatewayForm` L98 → **on_changes** — Jev: on_changes 0.61, fit 0.35
- **T170.4** `scope.$watch` in `tbGrid` L61 → **on_changes** — Jev: on_changes 0.78, fit 0.29
- **T170.5** `scope.$watch` in `tbGrid` L66 → **on_changes** — Jev: on_changes 0.72, fit 0.32
- **T170.6** `scope.$watch` in `tbGrid` L71 → **on_changes** — Jev: on_changes 0.84, fit 0.41
- **T170.8** `scope.$watch` in `tbGrid` L76 → **on_changes** — Jev: on_changes 0.87, fit 0.38
- **T171.4** `scope.$watch` in `tbGridCardContent` L61 → **on_changes** — Jev: on_changes 0.78, fit 0.29
- **T171.5** `scope.$watch` in `tbGridCardContent` L66 → **on_changes** — Jev: on_changes 0.72, fit 0.32
- **T171.6** `scope.$watch` in `tbGridCardContent` L71 → **on_changes** — Jev: on_changes 0.84, fit 0.41
- **T171.8** `scope.$watch` in `tbGridCardContent` L76 → **on_changes** — Jev: on_changes 0.87, fit 0.38
- **T172.7** `member.$attrs.field` in `tbHelp` L59 → **host_attribute** — Jev: host_attribute 0.63, fit 0.34
- **T172.8** `member.$attrs.field` in `tbHelp` L60 → **host_attribute** — Jev: host_attribute 0.75, fit 0.51
- **T173.14** `member.$attrs.field` in `tbJsFunc` L52 → **input** — Jev: input 0.72, fit 0.29
- **T173.20** `member.$attrs.field` in `tbJsFunc` L54 → **host_attribute** — Jev: host_attribute 0.63, fit 0.37
- **T173.24** `member.$attrs.field` in `tbJsFunc` L59 → **host_attribute** — Jev: host_attribute 0.68, fit 0.54
- **T173.38** `helper.equals` in `tbJsFunc` L129 → **lodash** — Jev: lodash 0.78, fit 0.46
- **T174.29** `helper.equals` in `tbJsonContent` L121 → **lodash** — Jev: lodash 0.80, fit 0.46
- **T175.14** `helper.equals` in `tbJsonForm` L56 → **lodash** — Jev: lodash 0.81, fit 0.35
- **T175.21** `scope.$destroy` in `tbJsonForm` L72 → **child_destroy** — Jev: child_destroy 0.97, fit 0.24
- **T175.65** `scope.$watch` in `tbJsonForm` L192 → **on_changes** — Jev: on_changes 0.94, fit 0.33
- **T175.68** `scope.$watch` in `tbJsonForm` L199 → **on_changes** — Jev: on_changes 0.88, fit 0.37
- **T175.75** `helper.equals` in `tbJsonForm` L241 → **lodash** — Jev: lodash 0.84, fit 0.41
- **T176.12** `member.$attrs.field` in `tbJsonObjectEdit` L42 → **host_attribute** — Jev: host_attribute 0.61, fit 0.39
- **T176.19** `helper.equals` in `tbJsonObjectEdit` L94 → **lodash** — Jev: lodash 0.82, fit 0.50
- **T178.4** `scope.$watch` in `tbKeyValMap` L57 → **on_changes** — Jev: on_changes 0.78, fit 0.42
- **T181.6** `scope.$watch` in `tbLedLight` L32 → **on_changes** — Jev: on_changes 0.62, fit 0.29
- **T181.8** `scope.$watch` in `tbLedLight` L36 → **on_changes** — Jev: on_changes 0.69, fit 0.30
- **T184.15** `helper.equals` in `tbManageWidgetActions` L110 → **lodash** — Jev: lodash 0.62, fit 0.46
- **T185.14** `scope.$watch` in `tbMaterialIconSelect` L56 → **effect** — Jev: effect 0.62, fit 0.50
- **T189.6** `scope.$watch` in `tbMultipleInputWidget` L58 → **on_changes** — Jev: on_changes 0.62, fit 0.35
- **T189.9** `scope.$on` in `tbMultipleInputWidget` L76 → **service_subject** — Jev: service_subject 0.84, fit 0.24
- **T190.7** `jqlite.plugin` in `tbNavTree` L82 → **keep_jquery** — Jev: keep_jquery 0.90, fit 0.60
- **T194.19** `scope.$watch` in `tbRelatedEntityAutocomplete` L102 → **on_changes** — Jev: on_changes 0.66, fit 0.33
- **T194.28** `member.$q.defer` in `tbRelatedEntityAutocomplete` L43 → **new_promise** — Jev: new_promise 0.82, fit 0.33
- **T211.16** `scope.$watch` in `tbTimeinterval` L118 → **on_changes** — Jev: on_changes 0.80, fit 0.32
- **T211.19** `scope.$watch` in `tbTimeinterval` L124 → **on_changes** — Jev: on_changes 0.89, fit 0.37
- **T211.22** `scope.$watch` in `tbTimeinterval` L130 → **on_changes** — Jev: on_changes 0.94, fit 0.40
- **T211.25** `scope.$watch` in `tbTimeinterval` L136 → **on_changes** — Jev: on_changes 0.86, fit 0.35
- **T211.28** `scope.$watch` in `tbTimeinterval` L142 → **on_changes** — Jev: on_changes 0.79, fit 0.30
- **T213.13** `member.$attrs.field` in `tbTimewindow` L70 → **host_attribute** — Jev: host_attribute 0.62, fit 0.49
- **T213.15** `member.$attrs.field` in `tbTimewindow` L72 → **input** — Jev: input 0.63, fit 0.32
- **T213.19** `member.$attrs.field` in `tbTimewindow` L74 → **host_attribute** — Jev: host_attribute 0.67, fit 0.49
- **T213.27** `member.$attrs.field` in `tbTimewindow` L93 → **host_attribute** — Jev: host_attribute 0.67, fit 0.49
- **T213.30** `member.$attrs.field` in `tbTimewindow` L94 → **host_attribute** — Jev: host_attribute 0.64, fit 0.41
- **T213.81** `helper.equals` in `tbTimewindow` L255 → **lodash** — Jev: lodash 0.83, fit 0.42
- **T217.5** `member.$attrs.field` in `tbWidget` L35 → **input** — Jev: input 0.73, fit 0.20
- **T218.34** `scope.$watch` in `tbWidgetConfig` L248 → **effect** — Jev: effect 0.64, fit 0.28
- **T218.68** `scope.$watch` in `tbWidgetConfig` L298 → **effect** — Jev: effect 0.64, fit 0.33
- **T218.83** `scope.$watch` in `tbWidgetConfig` L328 → **on_changes** — Jev: on_changes 0.77, fit 0.28
- **T222.12** `scope.$watch` in `tripAnimation` L146 → **on_changes** — Jev: on_changes 0.71, fit 0.35
- **T230.6** `scope.$watch` in `AddItemController` L61 → **on_changes** — Jev: on_changes 0.78, fit 0.29
- **T230.7** `scope.$watch` in `AddItemController` L66 → **on_changes** — Jev: on_changes 0.72, fit 0.32
- **T230.8** `scope.$watch` in `AddItemController` L71 → **on_changes** — Jev: on_changes 0.84, fit 0.41
- **T230.10** `scope.$watch` in `AddItemController` L76 → **on_changes** — Jev: on_changes 0.87, fit 0.38
- **T248.15** `member.$q.defer` in `DatakeyConfigDialogController` L41 → **new_promise** — Jev: new_promise 0.88, fit 0.34
- **T256.4** `scope.$watch` in `ItemCardController` L61 → **on_changes** — Jev: on_changes 0.78, fit 0.29
- **T256.5** `scope.$watch` in `ItemCardController` L66 → **on_changes** — Jev: on_changes 0.72, fit 0.32
- **T256.6** `scope.$watch` in `ItemCardController` L71 → **on_changes** — Jev: on_changes 0.84, fit 0.41
- **T256.8** `scope.$watch` in `ItemCardController` L76 → **on_changes** — Jev: on_changes 0.87, fit 0.38
- **T263.14** `helper.equals` in `MaterialIconsDialogController` L56 → **lodash** — Jev: lodash 0.81, fit 0.35
- **T263.21** `scope.$destroy` in `MaterialIconsDialogController` L72 → **child_destroy** — Jev: child_destroy 0.97, fit 0.24
- **T263.65** `scope.$watch` in `MaterialIconsDialogController` L192 → **on_changes** — Jev: on_changes 0.94, fit 0.33
- **T263.68** `scope.$watch` in `MaterialIconsDialogController` L199 → **on_changes** — Jev: on_changes 0.88, fit 0.37
- **T263.75** `helper.equals` in `MaterialIconsDialogController` L241 → **lodash** — Jev: lodash 0.84, fit 0.41
- **T264.20** `scope.$watch` in `MaterialIconsDialogController` L56 → **effect** — Jev: effect 0.62, fit 0.50
- **T270.12** `member.$attrs.field` in `TimewindowPanelController` L70 → **host_attribute** — Jev: host_attribute 0.62, fit 0.49
- **T270.14** `member.$attrs.field` in `TimewindowPanelController` L72 → **input** — Jev: input 0.63, fit 0.32
- **T270.18** `member.$attrs.field` in `TimewindowPanelController` L74 → **host_attribute** — Jev: host_attribute 0.67, fit 0.49
- **T270.26** `member.$attrs.field` in `TimewindowPanelController` L93 → **host_attribute** — Jev: host_attribute 0.67, fit 0.49
- **T270.29** `member.$attrs.field` in `TimewindowPanelController` L94 → **host_attribute** — Jev: host_attribute 0.64, fit 0.41
- **T270.80** `helper.equals` in `TimewindowPanelController` L255 → **lodash** — Jev: lodash 0.83, fit 0.42
- **T272.14** `helper.equals` in `WidgetActionDialogController` L110 → **lodash** — Jev: lodash 0.62, fit 0.46
- **T273.3** `member.$attrs.field` in `WidgetController` L35 → **input** — Jev: input 0.73, fit 0.20

## Functions Jev moves to a service

- `tbEntitiesHierarchyWidget`: `defaultNodeRelationQueryFunction`
- `tbGatewayForm`: `gatewayMainConfigJSON`, `getGatewayConfigJSON`
- `tbMultipleInputWidget`: `save`
