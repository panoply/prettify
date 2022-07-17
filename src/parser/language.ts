import { create, assign } from '@utils/native';
import { Language, LanguageNames, Prettify } from 'types/prettify';
import { prettify } from '@prettify/model';

const lexmap = (function () {

  const o = create(null);

  o.markup = 'markup';
  o.html = 'markup';
  o.liquid = 'markup';
  o.xml = 'markup';

  o.javascript = 'script';
  o.typescript = 'script';
  o.jsx = 'script';
  o.tsx = 'script';
  o.json = 'script';

  o.less = 'style';
  o.scss = 'style';
  o.sass = 'style';
  o.css = 'style';

  o.text = 'text';

  return o;

})();

const map = (function () {

  const o = create(null);

  o.html = 'HTML';
  o.xhtml = 'XHTML';
  o.liquid = 'Liquid';
  o.xml = 'XML';
  o.jsx = 'JSX';
  o.tsx = 'TSX';

  o.json = 'JSON';
  o.yaml = 'YAML';

  o.css = 'CSS';
  o.scss = 'SCSS';
  o.sass = 'SASS';
  o.less = 'LESS';

  o.text = 'Plain Text';

  o.javascript = 'JavaScript';
  o.typescript = 'TypeScript';

  return o;

})();

export function setLexer (input: string) {

  if (typeof input !== 'string') return 'markup';
  if (input.indexOf('html') > -1) return 'markup';
  if (lexmap[input] === undefined) return 'script';

  return lexmap[input];
}

function setLanguageName (input: string) {

  if (typeof input !== 'string' || map[input] === undefined) return input.toUpperCase();

  return map[input];

}

export function reference (language: LanguageNames) {

  const result: Language = create(null);

  if (language === 'unknown') {
    result.language = language as any;
    result.languageName = 'Unknown' as any; ;
    result.lexer = 'markup';
  } else if (language === 'xhtml' || language === 'markup') {
    result.language = 'xml' as any;
    result.languageName = 'XHTML' as any; ;
    result.lexer = 'markup';
  } else {
    result.language = language as any;
    result.languageName = setLanguageName(language);
    result.lexer = setLexer(language);
  }

  if (prettify.hooks.language.length > 0) {
    for (const hook of prettify.hooks.language) {
      const langhook = hook(result);
      if (typeof langhook === 'object') assign(result, langhook);
    }
  }

  return result;

}

/* -------------------------------------------- */
/* DETECTION HOOK                               */
/* -------------------------------------------- */

detect.reference = reference;

detect.listen = function (callback: Prettify['hooks']['language'][number]) {
  prettify.hooks.language.push(callback);
};

export function detect (sample: string): Language {

  let b:string[] = [];
  let c: number = 0;

  const vartest = (
    (/(((var)|(let)|(const)|(function)|(import))\s+(\w|\$)+[a-zA-Z0-9]*)/).test(sample) &&
    (/@import/).test(sample) === false
  );

  const finalstatic = (/((((final)|(public)|(private))\s+static)|(static\s+void))/).test(sample);

  function isStyle (): Language {

    if (/\n\s*#+\s+/.test(sample) || /^#+\s+/.test(sample)) return reference('markdown');

    if (
      /\$[a-zA-Z]/.test(sample) ||
      /\{\s*(\w|\.|\$|#)+\s*\{/.test(sample) || (
        /^[.#]?[\w][\w-]+\s+\{(?:\s+[a-z][a-z-]+:\s*\S+;)+\s+[&>+]?\s+[.#:]?[\w][\w-]\s+\{/.test(sample) &&
        /:\s*@[a-zA-Z];/.test(sample) === false
      )
    ) return reference('scss');

    if (/@[a-zA-Z]:/.test(sample) || /\.[a-zA-Z]\(\);/.test(sample)) return reference('less');

    return reference('css');
  };

  function notMarkup (): Language {

    let d: number = 1;
    let join: string = '';
    let flaga:boolean = false;
    let flagb: boolean = false;

    const pp: boolean = (/((public)|(private))\s+(static\s+)?(((v|V)oid)|(class)|(final))/).test(sample);

    function isScript (): Language {

      if (
        sample.indexOf('(') > -1 ||
        sample.indexOf('=') > -1 || (
          sample.indexOf(';') > -1 &&
          sample.indexOf('{') > -1
        )
      ) {

        /* -------------------------------------------- */
        /* TYPESCRIPT                                   */
        /* -------------------------------------------- */

        if (finalstatic === true || /\w<\w+(,\s+\w+)*>/.test(sample)) return reference('typescript');
        if (/(?:var|let|const)\s+\w+\s*:/.test(sample) || /=\s*<\w+/.test(sample)) return reference('typescript');

        /* -------------------------------------------- */
        /* JAVASCRIPT                                   */
        /* -------------------------------------------- */

        return reference('javascript');
      }

      /* -------------------------------------------- */
      /* UNKNOWN                                      */
      /* -------------------------------------------- */

      return reference('unknown');
    };

    function isScriptOrStyle (): Language {

      /* -------------------------------------------- */
      /* TYPESCRIPT                                   */
      /* -------------------------------------------- */

      if (
        /:\s*(?:number|string|boolean|any|unknown)(?:\[\])?/.test(sample) ||
        /(?:public|private)\s+/.test(sample) ||
        /(?:export|declare)\s+type\s+\w+\s*=/.test(sample) ||
        /(?:namespace|interface|enum|implements|declare)\s+\w+/.test(sample) ||
        /(?:typeof|keyof|as)\s+\w+/.test(sample) ||
        /\w+\s+as\s+\w+/.test(sample) ||
        /\[\w+(?:(?::\s*\w+)|(?:\s+in\s+\w+))\]:/.test(sample) ||
        /\):\s*\w+(?:\[\])?\s*(?:=>|\{)\s+/.test(sample) ||
        /(var|const|let)\s+\w+:\s*(string|number|boolean|string|any)(\[\])?/.test(sample)
      ) return reference('typescript');

      /* -------------------------------------------- */
      /* LIQUID                                       */
      /* -------------------------------------------- */

      if (
        /\s(class|var|const|let)\s+\w/.test(sample) === false &&
        /<[a-zA-Z](?:-[a-zA-Z])?/.test(sample) &&
        /<\/[a-zA-Z-](?:-[a-zA-Z])?/.test(sample) && (
          /\s?\{%/.test(sample) || /{{/.test(sample))) return reference('liquid');

      /* -------------------------------------------- */
      /* JAVASCRIPT                                   */
      /* -------------------------------------------- */

      if (
        /^(\s*[$@])/.test(sample) === false &&
        /([}\]];?\s*)$/.test(sample)
      ) {

        if (
          /^\s*import\s+\*\s+as\s+\w+\s+from\s+['"]/.test(sample) ||
          /module\.export\s+=\s+/.test(sample) ||
          /export\s+default\s+\{/.test(sample) ||
          /[?:]\s*[{[]/.test(sample) ||
          /^(?:\s*return;?(?:\s+[{[])?)/.test(sample)
        ) {

          return reference('javascript');

        }
      }

      /* -------------------------------------------- */
      /* LIQUID                                       */
      /* -------------------------------------------- */

      if (/{%/.test(sample) && /{{/.test(sample) && /<\w/.test(sample)) return reference('liquid');

      /* -------------------------------------------- */
      /* LESS                                         */
      /* -------------------------------------------- */

      if (/{\s*(?:\w|\.|@|#)+\s*\{/.test(sample)) return reference('less');

      /* -------------------------------------------- */
      /* SCSS                                         */
      /* -------------------------------------------- */

      if (/\$(\w|-)/.test(sample)) return reference('scss');

      /* -------------------------------------------- */
      /* LESS                                         */
      /* -------------------------------------------- */

      if (/[;{:]\s*@\w/.test(sample) === true) return reference('less');

      /* -------------------------------------------- */
      /* CSS                                          */
      /* -------------------------------------------- */

      return reference('css');
    };

    if (d < c) {

      do {
        if (flaga === false) {

          if (b[d] === '*' && b[d - 1] === '/') {
            b[d - 1] = '';
            flaga = true;
          } else if (
            flagb === false &&
            b[d] === 'f' &&
            d < c - 6 &&
            b[d + 1] === 'i' &&
            b[d + 2] === 'l' &&
            b[d + 3] === 't' &&
            b[d + 4] === 'e' &&
            b[d + 5] === 'r' &&
            b[d + 6] === ':'
          ) {
            flagb = true;
          }

        } else if (flaga === true && b[d] === '*' && d !== c - 1 && b[d + 1] === '/') {
          flaga = false;
          b[d] = '';
          b[d + 1] = '';
        } else if (flagb === true && b[d] === ';') {
          flagb = false;
          b[d] = '';
        }

        if (flaga === true || flagb === true) b[d] = '';

        d = d + 1;
      } while (d < c);
    }

    join = b.join('');

    /* -------------------------------------------- */
    /* JSON                                         */
    /* -------------------------------------------- */

    if (
      (/\s\/\//).test(sample) === false &&
      (/\/\/\s/).test(sample) === false &&
      (/^(\s*(\{|\[)(?!%))/).test(sample) === true &&
      (/((\]|\})\s*)$/).test(sample) &&
      sample.indexOf(',') !== -1) return reference('json');

    /* -------------------------------------------- */
    /* SCRIPT                                       */
    /* -------------------------------------------- */

    if (
      (/((\}?(\(\))?\)*;?\s*)|([a-z0-9]("|')?\)*);?(\s*\})*)$/i).test(sample) === true && (
        vartest === true ||
        pp === true ||
        (/console\.log\(/).test(sample) === true ||
        (/export\s+default\s+class\s+/).test(sample) === true ||
        (/export\s+(const|var|let|class)s+/).test(sample) === true ||
        (/document\.get/).test(sample) === true ||
        (/((=|(\$\())\s*function)|(\s*function\s+(\w*\s+)?\()/).test(sample) === true ||
        sample.indexOf('{') === -1 ||
        (/^(\s*if\s+\()/).test(sample) === true
      )
    ) return isScript();

    /* -------------------------------------------- */
    /* SCRIPT OR STYLE                              */
    /* -------------------------------------------- */

    // * u007b === {
    // * u0024 === $
    // * u002e === .
    if (
      sample.indexOf('{') > -1 && (
        /^(\s*[\u007b\u0024\u002e#@a-z0-9])/i.test(sample) ||
        /^(\s*\/(\*|\/))/.test(sample) ||
        /^(\s*\*\s*\{)/.test(sample)
      ) &&
      /^(\s*if\s*\()/.test(sample) === false &&
      /=\s*(\{|\[|\()/.test(join) === false && (
        (
          /(\+|-|=|\?)=/.test(join) === false ||
          /\/\/\s*=+/.test(join)) || (
          /=+('|")?\)/.test(sample) &&
          /;\s*base64/.test(sample)
        )
      ) && /function(\s+\w+)*\s*\(/.test(join) === false) return isScriptOrStyle();

    /* -------------------------------------------- */
    /* LIQUID OR UNKNOWN                            */
    /* -------------------------------------------- */

    return sample.indexOf('{%') > -1
      ? reference('liquid')
      : reference('unknown');

  };

  function isMarkup (): Language {

    function isHTML ():Language {

      return (
        /{%-?\s*(schema|for|if|unless|render|include)/.test(sample) ||
        /{%-?\s*end\w+/.test(sample) ||
        /{{-?\s*content_for/.test(sample) ||
        /{{-?\s*[a-zA-Z0-9_'".[\]]+\s*-?}}/.test(sample) || (
          /{%/.test(sample) &&
          /%}/.test(sample) &&
          /{{/.test(sample) &&
          /}}/.test(sample)
        )
      ) ? reference('liquid') : reference('html');

    };

    return (
      /^(\s*<!doctype\s+html>)/i.test(sample) ||
      /^(\s*<html)/i.test(sample) || (
        /<form\s/i.test(sample) &&
        /<label\s/i.test(sample) &&
        /<input\s/i.test(sample)
      ) || (
        /<img(\s+\w+=['"]?\S+['"]?)*\s+src\s*=/.test(sample) ||
        /<a(\s+\w+=['"]?\S+['"]?)*\s+href\s*=/.test(sample)
      ) || (
        /<ul\s/i.test(sample) &&
        /<li\s/i.test(sample) &&
        /<\/li>/i.test(sample) &&
        /<\/ul>/i.test(sample)
      ) || (
        /<head\s*>/.test(sample) &&
        /<\/head>/.test(sample)
      ) || (
        /^(\s*<!DOCTYPE\s+((html)|(HTML))\s+PUBLIC\s+)/.test(sample) &&
        /XHTML\s+1\.1/.test(sample) === false &&
        /XHTML\s+1\.0\s+(S|s)((trict)|(TRICT))/.test(sample) === false
      )
    ) ? isHTML() : /\s?{[{%]-?/.test(sample) ? reference('liquid') : reference('xml');

  };

  if (sample === null || sample.replace(/\s+/g, '') === '') return reference('unknown');

  /* -------------------------------------------- */
  /* MARKDOWN                                     */
  /* -------------------------------------------- */

  if (
    (
      /\n\s*#{1,6}\s+/.test(sample) ||
      /\n\s*(?:\*|-|(?:\d+\.))\s/.test(sample)
    ) && (
      /\[( |x|X)\]/.test(sample) ||
      /\s[*_~]{1,2}\w+[*_~]{1,2}/.test(sample) ||
      /\n\s*```[a-zA-Z]*?\s+/.test(sample) ||
      /-+\|(-+\|)+/.test(sample)
    )
  ) return reference('markdown');

  /* -------------------------------------------- */
  /* MARKUP                                       */
  /* -------------------------------------------- */

  if (/^(\s*<!DOCTYPE\s+html>)/i.test(sample)) return isMarkup();

  /* -------------------------------------------- */
  /* STYLE                                        */
  /* -------------------------------------------- */

  if ((/^\s*@(?:charset|import|include|keyframes|media|namespace|page)\b/).test(sample)) return isStyle();

  if (
    finalstatic === false &&
    /=(>|=|-|\+|\*)/.test(sample) === false &&
    /^(?:\s*((if)|(for)|(function))\s*\()/.test(sample) === false &&
    /(?:\s|;|\})((if)|(for)|(function\s*\w*))\s*\(/.test(sample) === false &&
    vartest === false &&
    /return\s*\w*\s*(;|\})/.test(sample) === false && (
      sample === undefined ||
      /^(?:\s*#(?!(!\/)))/.test(sample) || (
        /\n\s*(\.|@)\w+(\(|(\s*:))/.test(sample) &&
        />\s*<\w/.test(sample) === false
      ) || (
        /^\s*:root\s*\{/.test(sample) ||
        /-{2}\w+\s*\{/.test(sample) ||
        /^\s*(?:body|button|hr|section|h[1-6]|p|strong|\*)\s+\{\s+/.test(sample)
      )
    )
  ) return isStyle();

  b = sample.replace(/\[[a-zA-Z][\w-]*=['"]?[a-zA-Z][\w-]*['"]?\]/g, '').split('');
  c = b.length;

  /* -------------------------------------------- */
  /* MARKUP                                       */
  /* -------------------------------------------- */

  if (/^(\s*({{|{%|<))/.test(sample)) return isMarkup();

  /* -------------------------------------------- */
  /* NOT MARKUP                                   */
  /* -------------------------------------------- */

  if (finalstatic === true || (
    /^(?:[\s\w-]*<)/.test(sample) === false &&
    /(?:>[\s\w-]*)$/.test(sample) === false)) return notMarkup();

  /* -------------------------------------------- */
  /* MARKUP OR NOT                                */
  /* -------------------------------------------- */

  return (
    (

      /^(?:\s*<\?xml)/.test(sample) ||
      /(?:>[\w\s:]*)?<(?:\/|!|#)?[\w\s:\-[]+/.test(sample) || (
        /^\s*</.test(sample) &&
        /<\/\w+(\w|\d)+>\s*$/.test(sample)
      )

    ) && (

      /^(?:[\s\w]*<)/.test(sample) ||
      /(?:>[\s\w]*)$/.test(sample)

    )
  ) || (

    /^(?:\s*<s((cript)|(tyle)))/i.test(sample) &&
    /(?:<\/s((cript)|(tyle))>\s*)$/i.test(sample)

  ) ? (

      /^(?:[\s\w]*<)/.test(sample) === false ||
      /(?:>[\s\w]*)$/.test(sample) === false

    ) ? notMarkup() : isMarkup() : reference('unknown');
}
