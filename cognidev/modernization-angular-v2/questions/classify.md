# Classification questions — S2b (question bank Part C)

- revision: 2026-09-23.2

Copied from `Jev-Angular-Source-Questions-Final.md` Part C. The `classify`
tool reads this file: every `## <id>` block with `decided_by: jev` becomes a
question; `ask_when` is evaluated against the unit's fact card, so a unit is
asked only the questions that apply to it. Change the revision line whenever a
question changes: it is part of the cache key, so cached answers to an old
wording are never reused.

`ask_when` grammar: clauses joined by ` or `; each clause is `fact = value`,
`fact in [a, b]`, or a bare boolean fact.

Revisions:
- 2026-09-22.2 — calibration on 40 blind-labelled AWB units: `directive_kind`
  gains an order of precedence (was 6/10), `service_state` says what counts as
  held state (was 13/17).
- 2026-09-23.1 — layered questions: `primary_role` (one 23-option choice) removed;
  `handles_external_integration` and `handles_workflow` added; the layer is
  derived in code from the unit's kind and its yes/no concerns.
- 2026-09-23.2 — `service_kind` added (level 2 for services): deriving a service's
  layer from its yes/no concerns scored 7/17 against the blind labels, because
  screen-helper factories touch everything.

Stage 6 selects the questions whose `ask_when` holds for the unit; Stage 7
sends them in one request with the unit's facts and source.

## How the questions are layered (revision 3)

Top-down, one level at a time. Only questions whose options truly exclude
each other are choices; anything a unit can be *and* also be is a separate
yes/no, so true answers never split one probability pool.

| Level | Question | Answered by | Type |
|---|---|---|---|
| 1. What is it? | component, directive, controller, service/factory/provider, filter, route, module, constant, template | code (`artifact_kind`, from the registration) | — |
| 2. What kind of that thing? | screen kind (`controller_kind`), directive kind (`directive_kind`), how a service holds state (`service_state`) — asked only for that kind | Jev | choice |
| 3. What does it touch? | the 12 `handles_*` questions below, each on its own | Jev | yes/no |
| 4. Which layer? | derived from levels 1 and 3 (Part D) | code | — |

`primary_role` (a single 23-option choice) was removed in revision 3: it mixed
what a unit is, its UI job, what it touches and its layer in one pool, so a
unit that is truly a form *and* an auth screen *and* a data caller split its
probability three ways (0.43 / 0.29 / 0.28) while each of those, asked as its
own yes/no, came back ≥ 0.91.

## handles_ui_rendering
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind in [runtime_code, template]
- instructions: Does this unit produce or bind what the user sees (markup, templates, view bindings)?

## handles_user_input
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind in [runtime_code, template]
- instructions: Does this unit respond to user actions such as clicks, typing, scrolling, dragging, keyboard shortcuts, form submission or wizard steps?

## handles_navigation
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind in [runtime_code, template]
- instructions: Does this unit define routes or move the user between screens (state changes, redirects, URL parameters)?

## handles_data_access
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit fetch or save data from a backend, directly or through a data service?

## handles_shared_state
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit hold, read or change application-wide state shared with other parts of the app (context objects, stores, session storage)? Values passed only between a component and its direct parent through bindings do not count.

## handles_business_rules
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit apply product-specific business rules or calculations?

## handles_validation
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind in [runtime_code, template]
- instructions: Does this unit validate user input or data against rules?

## handles_auth
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit deal with login, session, credentials, tokens, roles or permissions?

## handles_formatting
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind in [runtime_code, template]
- instructions: Does this unit format or transform values for display (dates, numbers, labels, text)?

## handles_errors_logging
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit handle errors or failures, show error messages to the user, or report problems to a logging or monitoring service? A debug or trace log line on its own does not count.

## handles_external_integration
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit wrap a browser API, SDK, analytics system or other third-party service (for example websockets, file readers, clipboard, a charting or editor library), rather than the application's own backend?

## handles_workflow
- type: noul
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = runtime_code
- instructions: Does this unit coordinate a multi-step user or business workflow by calling several other services in sequence, rather than doing one job itself?

## controller_kind
- type: choice
- decided_by: jev
- stage: 7
- ask_when: artifact_kind in [angularjs_controller, angularjs_component] or directive_declares_controller
- instructions: This unit has an AngularJS controller. What kind of screen logic does it drive?

- `page_controller` — Drives a whole page or route: loads its data on entry and coordinates child components.
- `list_grid_controller` — Drives a list, table or grid: columns, paging, sorting, filtering, row actions.
- `form_controller` — Drives a form: field values, validation, submit and cancel.
- `wizard_controller` — Drives a multi-step flow: current step, moving between steps, collecting results.
- `modal_controller` — Drives a modal dialog, sidebar or popup: open, close, return a result.
- `widget_controller` — Drives a small reusable control such as a button, toggle, picker or badge.
- `entry_flow_controller` — Runs an entry or redirect flow such as login, SSO or deep-link landing, with little UI of its own.
- `other` — None of the above.

## directive_kind
- type: choice
- decided_by: jev
- stage: 7
- ask_when: artifact_kind = angularjs_directive
- instructions: This unit is an AngularJS directive. Which kind is it? If more than one fits, take the first that applies in this order: dom_manipulation, transclusion_wrapper, element_with_template, attribute_behaviour. A directive with its own template whose link or compile function also changes the DOM or binds jQuery/DOM events is dom_manipulation.

- `element_with_template` — Has its own template or templateUrl and isolated scope bindings, whether restricted to element or attribute. Target: `@Component`.
- `attribute_behaviour` — Has no template of its own; adds behaviour to the element it is placed on. Target: `@Directive`.
- `dom_manipulation` — Uses link or compile functions to change the DOM directly, bind jQuery/DOM events, or call $compile. Target: manual rework.
- `transclusion_wrapper` — Wraps caller-supplied content using transclude. Target: content projection.
- `other` — None of the above.

## service_kind
- type: choice
- decided_by: jev
- stage: 7
- ask_when: artifact_kind in [angularjs_service, angularjs_factory, angularjs_provider, angular_injectable_service]
- instructions: This unit is a service. What is its main job? Answer by what most of its code does, not by its name. The other things it touches are asked separately.

- `ui_helper` — Supports specific screens: builds grid columns, toolbar or sidebar items, modal options or view models, or drives one screen's behaviour.
- `data_access_client` — Calls the backend (HTTP, REST, websockets) and returns the data, with little logic of its own.
- `state_store` — Holds application state that several parts of the app read and change.
- `business_logic` — Applies product rules or calculations independent of any one screen.
- `workflow_coordinator` — Runs a multi-step process by calling several other services in order.
- `integration_wrapper` — Wraps a browser API, SDK or third-party library.
- `infrastructure` — Logging, error handling, HTTP interceptors, caching, configuration or other cross-cutting plumbing.
- `auth_session` — Login, current user, session, tokens, roles or permissions.
- `helper_utility` — Generic helpers with no product knowledge (strings, dates, arrays, formatting).
- `model_definition` — Defines data models, classes, enums or constants.
- `test_mock` — Mock or fake implementation used for tests or local development.
- `unknown` — The code does not establish its main job.

## service_state
- type: choice
- decided_by: jev
- stage: 7
- ask_when: artifact_kind in [angularjs_service, angularjs_factory, angularjs_provider, angular_injectable_service]
- instructions: This unit is a service. How does it hold state between calls? Only data kept in the service's own fields or closure variables between calls counts; local variables inside a function, constants and injected dependencies do not.

- `stateless` — Keeps no data between calls; every call works only from its arguments.
- `caches_data` — Keeps copies of fetched or computed data to avoid repeating work.
- `shared_mutable_state` — Holds data that other units read and change; changes are visible across the app.
- `other` — None of the above.

## template_kind
- type: choice
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = template
- instructions: This file is a template. What is it used for?

- `component_template` — The template of a single component or element directive.
- `route_view` — The top-level view shown for a route or UI-router state.
- `include_partial` — A fragment pulled into other templates with ng-include or similar.
- `modal_or_sidebar` — The body of a modal dialog, sidebar or popup.
- `other` — None of the above.

## style_scope
- type: choice
- decided_by: jev
- stage: 7
- ask_when: source_asset_kind = style
- instructions: This file is a stylesheet. What does it style?

- `global_theme` — Global theme, variables, mixins or resets used across the app.
- `component_scoped` — Styles for one component or view.
- `vendor_override` — Overrides the styling of a third-party library.
- `other` — None of the above.

## AngularJS semantic traits

What the parser cannot see from structure alone. Asked only when
`angular_generation = angularjs_1x` or `depends_on_legacy` is yes.

## relies_on_digest_timing
- type: noul
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy
- instructions: Does this code's correctness depend on when the AngularJS digest cycle runs (values updated in a later digest, $timeout used to wait for rendering, safeApply wrappers)?

## relies_on_scope_inheritance
- type: noul
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy
- instructions: Does this code read or write values it expects to inherit from a parent scope, rather than receiving them through explicit bindings or injection?

## relies_on_global_state
- type: noul
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy
- instructions: Does this code depend on global or window-level state (global objects, $rootScope properties, session storage) that other code also changes?

## has_initialization_side_effects
- type: noul
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy
- instructions: Does creating this unit (its constructor, factory body or $onInit) cause side effects such as network calls, redirects, alerts, global writes or event subscriptions?

## event_coupled
- type: noul
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy
- instructions: Does this code coordinate with distant parts of the app through AngularJS scope events ($emit, $broadcast, $on) or a global publish/subscribe bus, rather than direct calls? A component's own @Output or & callback binding to its parent does not count.

## manual_dom_lifecycle
- type: noul
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy
- instructions: Does this code create, move or destroy DOM or child scopes by hand, and is it responsible for cleaning them up?

## modern_style_adoption
- type: choice
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angular_2_plus
- instructions: This unit is written for modern Angular. How closely does it follow current target-version Angular conventions?

- `target_idiomatic` — Follows current target conventions (standalone components, inject(), signals, built-in control flow where applicable).
- `supported_older_style` — Valid on the target but uses older supported patterns (NgModules, constructor injection, *ngIf).
- `mixed_style` — Combines target conventions with older or legacy-shaped patterns.
- `legacy_shaped` — Modern syntax, but organized around AngularJS semantics (scope-like shared objects, $q, digest assumptions).

No `not_applicable` option: with it, a modern component scored 0.50
`not_applicable`; without it, the real answer won.

## migration_difficulty
- type: score
- decided_by: jev
- stage: 7
- ask_when: angular_generation = angularjs_1x or depends_on_legacy or wrapped_for_modern
- instructions: How hard is it to migrate this unit to idiomatic modern Angular?

0. `trivial` — Mechanical rewrite with no behavioural risk.
1. `moderate` — Some rework of dependencies, async patterns or bindings.
2. `hard` — Deep coupling to AngularJS internals ($scope, digest cycle, DOM, $compile).
