/**
 * AngularJS Material's `$mdMedia` breakpoint names as the CSS media queries they stood for,
 * for Angular CDK's BreakpointObserver (which takes queries, not names).
 */
export const MD_MEDIA: Record<string, string> = {
  'xs': '(max-width: 599px)',
  'gt-xs': '(min-width: 600px)',
  'sm': '(min-width: 600px) and (max-width: 959px)',
  'gt-sm': '(min-width: 960px)',
  'md': '(min-width: 960px) and (max-width: 1279px)',
  'gt-md': '(min-width: 1280px)',
  'lg': '(min-width: 1280px) and (max-width: 1919px)',
  'gt-lg': '(min-width: 1920px)',
  'xl': '(min-width: 1920px)',
};

/** The media query of a `$mdMedia(name)` call; a name it does not know is taken as a query already. */
export function mdMedia(name: string): string {
  return MD_MEDIA[name] ?? name;
}
