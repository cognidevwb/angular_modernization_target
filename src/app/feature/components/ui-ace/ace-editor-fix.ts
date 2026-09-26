/**
 * Ported from src/app/components/ace-editor-fix.js: blocks ace's scroll warning and moves the
 * gutter tooltip to <body> (so it is not clipped), removing it when its editor leaves the page.
 */
export function fixAceEditor(aceEditor: any): void {
  aceEditor.$blockScrolling = Infinity;
  aceEditor.on('showGutterTooltip', (tooltip: any) => {
    if (!tooltip.isAttachedToBody) {
      document.body.appendChild(tooltip.$element);
      tooltip.isAttachedToBody = true;
      onElementRemoved(tooltip.$parentNode, () => {
        if (tooltip.$element.parentNode != null) {
          tooltip.$element.parentNode.removeChild(tooltip.$element);
        }
      });
    }
  });
}

function onElementRemoved(element: Node, callback: () => void): void {
  if (!document.body.contains(element)) {
    callback();
    return;
  }
  const observer = new MutationObserver(() => {
    if (!document.body.contains(element)) {
      callback();
      observer.disconnect();
    }
  });
  observer.observe(document.body, { childList: true });
}
