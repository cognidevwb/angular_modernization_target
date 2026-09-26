/**
 * The widget editor previews a widget in an iframe that runs the dashboard in widget edit mode.
 * The legacy dashboard reached the editor through the parent page's AngularJS root scope
 * (`$window.parent.angular.element($window.frameElement).scope().$root.$broadcast(name, …)`).
 * The rewrite has no scope to reach, so the dashboard dispatches the same event name and
 * arguments as a DOM event on its own `<iframe>` element in the parent page; the editor
 * listens on the iframe for `WIDGET_EDITOR_EVENT` and broadcasts `detail.name` / `detail.args`
 * on its RootState.
 */
export const WIDGET_EDITOR_EVENT = 'tb-widget-editor-event';

/** The iframe this page runs in (the widget editor's preview), or null when it is the top page. */
function hostFrame(): Element | null {
  try {
    return window.frameElement;
  } catch {
    // a cross-origin parent: not the widget editor
    return null;
  }
}

/** `parentScope.$root.$broadcast(name, …args)` of the legacy dashboard in the widget editor's iframe. */
export function notifyWidgetEditor(name: string, ...args: any[]): void {
  const frame = hostFrame();
  if (frame) {
    frame.dispatchEvent(new CustomEvent(WIDGET_EDITOR_EVENT, { detail: { name, args } }));
  }
}
