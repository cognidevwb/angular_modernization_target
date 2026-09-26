import $ from 'jquery';
import moment from 'moment';
// @ts-ignore -- tinycolor2 and tv4 ship no type declarations; the carried scripts use them untyped.
import tinycolor from 'tinycolor2';
// @ts-ignore
import tv4 from 'tv4';

/**
 * The legacy build's webpack ProvidePlugin made `$`, `jQuery`, `window.jQuery`,
 * `tinycolor`, `tv4` and `moment` free globals for every module. The carried
 * libraries (legacy-lib/, flot, jquery plugins) and the widget scripts stored on
 * the server still read them as globals, so they are installed on `window` here,
 * in a module main.ts imports before anything else.
 */
const g = window as any;
g.$ = g.jQuery = $;
g.moment = moment;
g.tinycolor = tinycolor;
g.tv4 = tv4;
