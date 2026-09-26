import { Injectable } from '@angular/core';
import { TranslateCompiler } from '@ngx-translate/core';
import MessageFormat from '@messageformat/core';

/**
 * angular-translate interpolated `{{param}}` by default and ran MessageFormat
 * only for the messages written in it (`{count, plural, one {…} other {…}}`).
 * The same here: a message with a plural or select clause is compiled with
 * MessageFormat into a function of its params; every other message stays a
 * string for ngx-translate's `{{param}}` parser.
 */
const ICU = /\{\s*[\w.]+\s*,\s*(plural|select|selectordinal)\s*,/;

@Injectable()
export class LegacyTranslateCompiler extends TranslateCompiler {
  private readonly formats = new Map<string, MessageFormat>();

  private format(lang: string): MessageFormat {
    const locale = (lang || 'en').replace('_', '-');
    let mf = this.formats.get(locale);
    if (!mf) {
      try {
        mf = new MessageFormat(locale);
      } catch {
        mf = new MessageFormat('en');
      }
      this.formats.set(locale, mf);
    }
    return mf;
  }

  compile(value: string, lang: string): any {
    if (typeof value !== 'string' || !ICU.test(value)) {
      return value;
    }
    // messageformat.js 0.x (angular-translate's) took a bare number as an exact
    // case (`1 {1 alarm}`); MessageFormat 3 writes it `=1 {…}`
    const exact = value.replace(/([\s,}])(\d+)\s*\{/g, '$1=$2 {');
    try {
      return this.format(lang).compile(exact);
    } catch {
      return value;
    }
  }

  compileTranslations(translations: any, lang: string): any {
    if (typeof translations === 'string') {
      return this.compile(translations, lang);
    }
    if (translations && typeof translations === 'object') {
      const out: any = Array.isArray(translations) ? [] : {};
      for (const key of Object.keys(translations)) {
        out[key] = this.compileTranslations(translations[key], lang);
      }
      return out;
    }
    return translations;
  }
}
