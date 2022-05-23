import { prettydiff } from '../parser/prettydiff';
import { PrettyDiffOptions } from '../../types/prettydiff';

export default (function beautify_markup_init () {

  function markup (options: PrettyDiffOptions) {

    /* -------------------------------------------- */
    /* CONSTANTS                                    */
    /* -------------------------------------------- */

    const externalIndex = {};
    const lexer = 'markup';
    const data = options.parsed;
    const lf = options.crlf === true ? '\r\n' : '\n';
    const c = (prettydiff.end < 1 || prettydiff.end > data.token.length)
      ? data.token.length
      : prettydiff.end + 1;

    /* -------------------------------------------- */
    /* LOCAL SCOPES                                 */
    /* -------------------------------------------- */

    let a = prettydiff.start;
    let comstart = -1;
    let next = 0;
    let count = 0;
    let indent = (isNaN(options.indentLevel) === true) ? 0 : Number(options.indentLevel);

    const type = {
      is: (index: number, name: string) => data.types[index] === name,
      not: (index: number, name: string) => data.types[index] !== name,
      idx: (index: number, name: string) => data.types[index].indexOf(name)
    };

    const token = {
      is: (index: number, tag: string) => data.token[index] === tag,
      not: (index: number, tag: string) => data.token[index] !== tag
    };

    const levels = (() => {

      const level = (prettydiff.start > 0)
        ? Array(prettydiff.start).fill(0, 0, prettydiff.start)
        : [];

      function nextIndex () {

        let x = a + 1;
        let y = 0;

        if (type.is(x, undefined)) return x - 1;
        if (type.is(x, 'comment') || (a < c - 1 && type.idx(x, 'attribute') > -1)) {

          do {

            if (type.is(x, 'jsx_attribute_start')) {

              y = x;

              do {

                if (type.is(x, 'jsx_attribute_end') && data.begin[x] === y) break;

                x = x + 1;

              } while (x < c);

            } else if (type.not(x, 'comment') && type.idx(x, 'attribute') < 0) return x;

            x = x + 1;

          } while (x < c);
        }

        return x;

      };

      function anchorList () {

        const stop = data.begin[a];

        let aa = a;

        // Verify list is only a link list
        // before making changes
        //
        do {

          aa = aa - 1;

          if (
            token.is(aa, '</li>')
            && token.is(aa - 1, '</a>')
            && data.begin[data.begin[aa]] === stop
            && data.begin[aa - 1] === data.begin[aa] + 1
          ) {

            aa = data.begin[aa];

          } else {

            return;

          }

        } while (aa > stop + 1);

        // Now make the changes
        aa = a;

        do {

          aa = aa - 1;

          if (type.is(aa + 1, 'attribute')) {
            level[aa] = -10;
          } else if (token.not(aa, '</li>')) {
            level[aa] = -20;
          }

        } while (aa > stop + 1);

      };

      /**
       * HTML / Liquid Comment Identation for markup
       * and template tags.
       */
      function comment () {

        let x = a;
        let test = false;

        if (data.lines[a + 1] === 0 && options.forceIndent === false) {

          do {

            if (data.lines[x] > 0) {
              test = true;
              break;
            }

            x = x - 1;

          } while (x > comstart);

          x = a;

        } else {
          test = true;
        }

        // The first condition applies indentation
        // while the else block does not.
        //
        if (test === true) {

          const ind = (
            type.is(next, 'end') ||
            type.is(next, 'template_end')
          ) ? indent + 1
            : indent;

          do {
            level.push(ind);
            x = x - 1;
          } while (x > comstart);

          // Indent correction so that a following end tag
          // is not indented 1 too much
          //
          if (ind === indent + 1) level[a] = indent;

          // Indentation must be applied to the tag
          // preceeding the comment
          //
          if (
            type.is(x, 'attribute') ||
            type.is(x, 'template_attribute') ||
            type.is(x, 'jsx_attribute_start')
          ) {
            level[data.begin[x]] = ind;
          } else {
            level[x] = ind;
          }

        } else {

          do {
            level.push(-20);
            x = x - 1;
          } while (x > comstart);

          level[x] = -20;

        }

        comstart = -1;

      };

      function content () {

        let ind = indent;

        if (options.forceIndent === true || options.forceAttribute === true) {
          level.push(indent);
          return;
        }

        if (next < c
          && (type.idx(next, 'end') > -1 || type.idx(next, 'start') > -1)
          && data.lines[next] > 0
        ) {

          level.push(indent);
          ind = ind + 1;

          if (
            data.types[a] === 'singleton'
            && a > 0
            && type.idx(a - 1, 'attribute') > -1
            && type.is(data.begin[a - 1], 'singleton')
          ) {

            if (data.begin[a] < 0 || (
              type.is(data.begin[a - 1], 'singleton')
              && data.begin[data.ender[a] - 1] !== a
            )) {
              level[a - 1] = indent;
            } else {
              level[a - 1] = indent + 1;
            }
          }
        } else if (
          a > 0
          && type.is(a, 'singleton')
          && type.idx(a - 1, 'attribute') > -1
        ) {

          level[a - 1] = indent;
          count = data.token[a].length;
          level.push(-10);

        } else if (data.lines[next] === 0) {

          level.push(-20);

        } else if ((options.wrap === 0 || (
          a < c - 2
          && type.idx(a + 2, 'attribute') > -1
          && (
            data.token[a].length
            + data.token[a + 1].length
            + data.token[a + 2].length
            + 1
          ) > options.wrap) || (
          (
            data.token[a].length
            + data.token[a + 1].length
          ) > options.wrap
        )) && (
          type.is(a + 1, 'singleton') ||
          type.is(a + 1, 'template')
        )) {

          // Wrap if
          // 1. options.wrap is 0
          // 2. next token is singleton with an attribute and exceeds wrap
          // 3. next token is template or singleton and exceeds wrap
          //
          level.push(indent);

        } else {
          count = count + 1;
          level.push(-10);
        }

        if (
          a > 0
          && type.idx(a - 1, 'attribute') > -1
          && data.lines[a] < 1
        ) {

          level[a - 1] = -20;
        }

        if (count > options.wrap) {

          let d = a;
          let e = Math.max(data.begin[a], 0);

          if (type.is(a, 'content') && options.preserveText === false) {

            let countx = 0;

            const chars = data.token[a].replace(/\s+/g, ' ').split(' ');

            do {

              d = d - 1;

              if (level[d] < 0) {
                countx = countx + data.token[d].length;
                if (level[d] === -10) countx = countx + 1;
              } else {
                break;
              }
            } while (d > 0);

            d = 0;
            e = chars.length;

            do {

              if (chars[d].length + countx > options.wrap) {
                chars[d] = lf + chars[d];
                countx = chars[d].length;
              } else {
                chars[d] = ` ${chars[d]}`;
                countx = countx + chars[d].length;
              }

              d = d + 1;

            } while (d < e);

            if (chars[0].charAt(0) === ' ') {
              data.token[a] = chars.join('').slice(1);
            } else {
              level[a - 1] = ind;
              data.token[a] = chars.join('').replace(lf, '');
            }

            if (data.token[a].indexOf(lf) > 0) {
              count = data.token[a].length - data.token[a].lastIndexOf(lf);
            }

          } else {

            do {

              d = d - 1;

              if (level[d] > -1) {

                count = data.token[a].length;
                if (data.lines[a + 1] > 0) count = count + 1;
                return;
              }

              if (data.types[d].indexOf('start') > -1) {
                count = 0;
                return;
              }

              if (data.lines[d + 1] > 0 && (
                type.not(d, 'attribute') ||
                (type.is(d, 'attribute') && type.is(d + 1, 'attribute'))
              )) {

                if (
                  type.not(d, 'singleton') ||
                  (type.is(d, 'attribute') && type.is(d + 1, 'attribute'))
                ) {

                  count = data.token[a].length;
                  if (data.lines[a + 1] > 0) count = count + 1;
                  break;
                }
              }

            } while (d > e);

            level[d] = ind;

          }
        }
      };

      function external () {

        const skip = a;

        do {

          if (
            data.lexer[a + 1] === lexer
            && data.begin[a + 1] < skip
            && type.not(a + 1, 'start')
            && type.not(a + 1, 'singleton')
          ) break;

          level.push(0);

          a = a + 1;

        } while (a < c);

        level.push(indent - 1);
        externalIndex[skip] = a;
        next = nextIndex();

        if (
          data.lexer[next] === lexer
          && data.stack[a].indexOf('attribute') < 0 && (
            data.types[next] === 'end' ||
            data.types[next] === 'template_end'
          )
        ) {
          indent = indent - 1;
        }
      };

      function attribute () {

        const parent = a - 1;

        function wrap (index: number) {

          const item = data.token[index].replace(/\s+/g, ' ').split(' ');
          const ilen = item.length;

          let bb = 1;
          let acount = item[0].length;

          if ((/=['"]?(<|{[{%]|^)/).test(data.token[index])) return;

          do {

            if (acount + item[bb].length > options.wrap) {
              acount = item[bb].length;
              item[bb] = lf + item[bb];
            } else {
              item[bb] = ` ${item[bb]}`;
              acount = acount + item[bb].length;
            }

            bb = bb + 1;

          } while (bb < ilen);

          data.token[index] = item.join('');

        };

        let plural = false;
        let y = a;
        let len = data.token[parent].length + 1;
        let lev = (() => {

          if (type.idx(a, 'start') > 0) {

            let x = a;

            do {

              if (data.types[x].indexOf('end') > 0 && data.begin[x] === a) {
                if (x < c - 1 && type.idx(x + 1, 'attribute') > -1) {
                  plural = true;
                  break;
                }
              }

              x = x + 1;

            } while (x < c);

          } else if (a < c - 1 && type.idx(a + 1, 'attribute') > -1) {
            plural = true;
          }

          if (type.is(parent, 'singleton')) return indent + 1;

          if (type.is(next, 'end') || type.is(parent, 'template_end')) {

            return type.is(parent, 'singleton')
              ? indent + 2
              : indent + 1;
          }

          return indent;

        })();

        const earlyexit = false;
        let attStart = false;

        if (plural === false && type.is(a, 'comment_attribute')) {

          // lev must be indent unless the "next" type is end then its indent + 1
          level.push(indent);

          if (data.types[parent] === 'singleton') {
            level[parent] = indent + 1;
          } else {
            level[parent] = indent;
          }

          return;
        }

        if (lev < 1) lev = 1;

        // First, set levels and determine if there
        // are template attributes. When we have template
        // attributes we handle them in a similar manner
        // as HTML attributes, with only slight differences.
        //
        do {

          count = count + data.token[a].length + 1;

          if (type.idx(a, 'attribute') > 0) {

            // HOT PATCH
            //
            // Template attribute values will not be placed
            // on newlines, and correctly spaced.
            //
            // NOTE: -10 equals single line space
            // NOTE: -20 removes spacing
            //
            if (type.is(a, 'template_attribute')) {

              len = len + data.token[a].length + 1;

              level.push(options.forceAttribute ? lev : -10);

            } else if (type.is(a, 'comment_attribute')) {

              level.push(lev);

            } else if (type.idx(a, 'start') > 0) {

              attStart = true;

              if (a < c - 2 && type.idx(a + 2, 'attribute') > 0) {

                level.push(-20);

                a = a + 1;
                externalIndex[a] = a;

              } else {

                if (parent === a - 1 && plural === false) {
                  level.push(lev);
                } else {
                  level.push(lev + 1);
                }

                if (data.lexer[a + 1] !== lexer) {
                  a = a + 1;
                  external();
                }
              }

            } else if (type.idx(a, 'end') > 0) {

              if (level[a - 1] !== -20) {
                level[a - 1] = level[data.begin[a]] - 1;
              }

              if (data.lexer[a + 1] !== lexer) {
                level.push(-20);
              } else {
                level.push(lev);
              }

            } else {
              level.push(lev);
            }

            // earlyexit = true;

          } else if (type.is(a, 'attribute')) {

            len = len + data.token[a].length + 1;

            if (options.preserveAttribute) {

              level.push(-10);

            } else if (options.forceAttribute || attStart || (
              a < c - 1
              && type.is(a + 1, 'template_attribute')
              && type.idx(a + 1, 'attribute') > 0
            )) {

              // HOT PATCH
              //
              // This series of checks will ensure that Liquid
              // tags surrounded by html attributes are not preserved
              // for example:
              //
              // <div data-{{ tag }}-attr="x"></div>
              //
              // We check the previous token, current token and next
              // token to determine whether or not we have this formation.
              //
              if ((
                (/-$/).test(data.token[a - 1])
                && (/^-/).test(data.token[a + 1])
                && (/^{[{%]-?/).test(data.token[a])
                && (/[%}]}$/).test(data.token[a])
              ) || (
                (/-$/).test(data.token[a])
                && (/^-/).test(data.token[a + 2])
                && (/^{[{%]-?/).test(data.token[a + 1])
                && (/[%}]}$/).test(data.token[a + 1])
              )) {
                level.push(-20);
              } else {
                level.push(-10);
              }

            } else {

              level.push(-10);
            }

          } else if (data.begin[a] < parent + 1) {

            break;
          }

          a = a + 1;

        } while (a < c);

        a = a - 1;

        if (
          level[a - 1] > 0
          && type.idx(a, 'end') > 0
          && type.idx(a, 'attribute') > 0
          && !type.is(a, 'singleton')
          && plural
        ) {

          level[a - 1] = level[a - 1] - 1;

        }

        if (level[a] !== -20) {

          if (
            options.language === 'jsx'
            && type.idx(parent, 'start') > -1
            && type.is(a + 1, 'script_start')
          ) {
            level[a] = lev;
          } else {
            level[a] = level[parent];
          }
        }

        if (options.forceAttribute === true) {
          count = 0;
          level[parent] = lev;
        } else {
          level[parent] = -10;
        }

        if (
          earlyexit === true ||
          options.preserveAttribute === true ||
          data.token[parent] === '<%xml%>' ||
          data.token[parent] === '<?xml?>'
        ) {
          count = 0;
          return;
        }

        y = a;

        // Second, Ensure tag contains more than one attribute
        //
        if (y > parent + 1) {

          // Finally, indent attributes if tag length exceeds
          // the wrap limit
          //
          if (options.selfCloseSpace === false) len = len - 1;

          if (
            len > options.wrap
            && options.wrap > 0
            && options.forceAttribute === false
          ) {

            count = data.token[a].length;

            do {

              if (
                data.token[y].length > options.wrap
                && (/\s/).test(data.token[y]) === true) {
                wrap(y);
              }

              y = y - 1;

              level[y] = lev;

            } while (y > parent);

          }
        } else if (
          type.is(a, 'attribute')
          && options.wrap > 0
          && data.token[a].length > options.wrap
          && (/\s/).test(data.token[a]) === true
        ) {

          wrap(a);
        }

      };

      // Ensure correct spacing is applied
      //
      // NOTE: data.lines -> space before token
      // NOTE: level -> space after token
      //
      do {

        if (data.lexer[a] === lexer) {

          if (data.token[a].toLowerCase().indexOf('<!doctype') === 0) level[a - 1] = indent;

          if (data.types[a].indexOf('attribute') > -1) {

            attribute();

          } else if (type.is(a, 'comment')) {

            if (comstart < 0) comstart = a;
            if (type.not(a + 1, 'comment') || (a > 0 && type.idx(a - 1, 'end') > -1)) comment();

          } else if (type.not(a, 'comment')) {

            next = nextIndex();

            if (type.is(next, 'end') || type.is(next, 'template_end')) {

              // When tags are expressed on a single line
              // and the content of those tags contain no whitespace
              // then the single line expression is respected.
              // It's here where we need to fix or adjust that logic
              //
              indent = indent - 1;

              if (type.is(next, 'template_end') && type.is(data.begin[next] + 1, 'template_else')) {
                indent = indent - 1;
              }

              // HOT PATCH
              //
              // Support <dl></dl> anchor list tags,
              // previously only ol and ul were supported
              //
              if (
                token.is(a, '</ol>') ||
                token.is(a, '</ul>') ||
                token.is(a, '</dl>')
              ) {

                anchorList();
              }
            }

            if (type.is(a, 'script_end') && type.is(a + 1, 'end')) {

              if (data.lines[a + 1] < 1) {
                level.push(-20);
              } else {
                level.push(-10);
              }

            } else if ((options.forceIndent === false ||
              (options.forceIndent && type.is(next, 'script_start'))
            ) && (
              type.is(a, 'content') ||
              type.is(a, 'singleton') ||
              type.is(a, 'template')
            )) {

              count = count + data.token[a].length;

              if (data.lines[next] > 0 && type.is(next, 'script_start')) {

                level.push(-10);

              } else if (options.wrap > 0 && (
                type.idx(a, 'template') < 0 ||
                (next < c && type.idx(a, 'template') > -1 && type.idx(a, 'template') < 0)
              )) {

                content();

              } else if (next < c && (
                type.idx(next, 'end') > -1 ||
                type.idx(next, 'start') > -1
              ) && (
                data.lines[next] > 0 ||
                type.idx(a, 'template_') > -1
              )) {

                level.push(indent);

              } else if (data.lines[next] === 0) {

                level.push(-20);

              } else {

                level.push(indent);

              }

            } else if (type.is(a, 'start') || type.is(a, 'template_start')) {

              indent = indent + 1;

              if (type.is(a, 'template_start') && type.is(a + 1, 'template_else')) {
                indent = indent + 1;
              }

              if (options.language === 'jsx' && token.is(a + 1, '{')) {

                if (data.lines[a + 1] === 0) {
                  level.push(-20);
                } else {
                  level.push(-10);
                }

              } else if (type.is(a, 'start') && type.is(next, 'end')) {

                level.push(-20);

              } else if (type.is(a, 'start') && type.is(next, 'script_start')) {

                level.push(-10);

              } else if (options.forceIndent === true) {

                level.push(indent);

              } else if (type.is(a, 'template_start') && type.is(next, 'template_end')) {

                // Applied a single line when tag is empty
                //
                level.push(-20);

              } else if (data.lines[next] === 0 && (
                type.is(next, 'content') ||
                type.is(next, 'singleton') ||
                (type.is(next, 'start') && type.is(next, 'template'))
              )) {

                level.push(-20);
              } else {
                level.push(indent);
              }
            } else if (options.forceIndent === false && data.lines[next] === 0 && (
              type.is(next, 'content') ||
              type.is(next, 'singleton')
            )) {

              level.push(-20);

            } else if (type.is(a + 2, 'script_end')) {

              level.push(-20);

            } else if (type.is(a, 'template_else')) {

              if (type.is(next, 'template_end')) {
                level[a - 1] = indent + 1;
              } else {
                level[a - 1] = indent - 1;
              }

              level.push(indent);

            } else {

              level.push(indent);
            }
          }

          if (
            type.not(a, 'content')
            && type.not(a, 'singleton')
            && type.not(a, 'template')
            && type.not(a, 'attribute')
          ) {
            count = 0;
          }

        } else {
          count = 0;
          external();
        }

        a = a + 1;

      } while (a < c);

      return level;

    })();

    //  beautify_markup_apply
    return (function () {

      const build = [];
      const ind = (() => {

        const indy = [ options.indentChar ];
        const size = options.indentSize - 1;

        let aa = 0;

        if (aa < size) {
          do {
            indy.push(options.indentChar);
            aa = aa + 1;
          } while (aa < size);
        }

        return indy.join('');

      })();

      /* -------------------------------------------- */
      /* MARKUP APPLY SCOPES                          */
      /* -------------------------------------------- */

      let a = prettydiff.start;
      let external = '';
      let lastLevel = options.indentLevel;

      /**
       * Applies a new line character plus the correct
       * amount of identation for the given line of code
       * ---
       * Original: beautify_markup_apply_nl
       */
      function newline (tabs: number) {

        const linesout = [];
        const pres = options.preserveLine + 1;
        const total = Math.min(data.lines[a + 1] - 1, pres);

        let index = 0;

        if (tabs < 0) tabs = 0;

        do {
          linesout.push(lf);
          index = index + 1;
        } while (index < total);

        if (tabs > 0) {

          index = 0;

          do {
            linesout.push(ind);
            index = index + 1;
          } while (index < tabs);

        }

        return linesout.join('');
      };

      // beautify_markup_apply_multilin
      function multiline () {

        const lines = data.token[a].split(lf);
        const line = data.lines[a + 1];

        const lev = ((levels[a - 1] > -1)
          ? type.is(a, 'attribute')
            ? levels[a - 1] + 1
            : levels[a - 1]
          : (() => {

            let bb = a + 1;
            let start = (bb > -1 && type.idx(bb, 'start') > -1);

            if (levels[a] > -1 && type.is(a, 'attribute')) return levels[a] + 1;

            do {

              bb = bb - 1;

              if (levels[bb] > -1) {
                if (type.is(a, 'content') && start === false) {
                  return levels[bb];
                } else {
                  return levels[bb] + 1;
                }
              }

              console.log(a);

              if (type.idx(bb, 'start') > -1) start = true;

            } while (bb > 0);

            return 1;

          })()
        );

        data.lines[a + 1] = 0;

        let aa = 0;
        const len = lines.length - 1;

        do {
          build.push(lines[aa]);
          build.push(newline(lev));
          aa = aa + 1;
        } while (aa < len);

        data.lines[a + 1] = line;
        build.push(lines[len]);

        if (levels[a] === -10) {
          build.push(' ');
        } else if (levels[a] > -1) {
          build.push(newline(levels[a]));
        }
      };

      function attributeEnd () {

        const parent = data.token[a];
        const regend = (/(\/|\?)?>$/);
        const end = regend.exec(parent);

        let y = a + 1;
        let jsx = false;
        let space = (options.selfCloseSpace === true && end !== null && end[0] === '/>')
          ? ' '
          : '';

        if (end === null) return;

        data.token[a] = parent.replace(regend, '');

        do {

          if (type.is(y, 'jsx_attribute_end') && data.begin[data.begin[y]] === a) {

            jsx = false;

          } else if (data.begin[y] === a) {

            if (type.is(y, 'jsx_attribute_start')) {
              jsx = true;
            } else if (type.idx(y, 'attribute') < 0 && jsx === false) {
              break;
            }

          } else if (jsx === false && (data.begin[y] < a || type.idx(y, 'attribute') < 0)) {
            break;
          }

          y = y + 1;

        } while (y < c);

        if (type.is(y - 1, 'comment_attribute')) space = newline(levels[y - 2] - 1);

        data.token[y - 1] = data.token[y - 1] + space + end[0];

      };

      do {

        if (data.lexer[a] === lexer || prettydiff.beautify[data.lexer[a]] === undefined) {

          if ((
            type.is(a, 'start') ||
            type.is(a, 'singleton') ||
            type.is(a, 'xml') ||
            type.is(a, 'sgml')
          ) && type.idx(a, 'attribute') < 0
            && a < c - 1
            && data.types[a + 1] !== undefined
            && type.idx(a + 1, 'attribute') > -1
          ) {

            attributeEnd();

          }

          if (token.not(a, undefined) && data.token[a].indexOf(lf) > 0 && ((
            type.is(a, 'content') && options.preserveText === false
          ) ||
            type.is(a, 'comment') ||
            type.is(a, 'attribute')
          )) {

            multiline();

          } else {

            build.push(data.token[a]);

            if (levels[a] === -10 && a < c - 1) {
              build.push(' ');
            } else if (levels[a] > -1) {
              lastLevel = levels[a];
              build.push(newline(levels[a]));
            }
          }

        } else {

          if (externalIndex[a] === a && type.not(a, 'reference')) {
            build.push(data.token[a]);
          } else {

            options.indentLevel = lastLevel;
            prettydiff.end = externalIndex[a];
            prettydiff.start = a;

            external = prettydiff.beautify[data.lexer[a]](options).replace(/\s+$/, '');

            build.push(external);

            if (levels[prettydiff.iterator] > -1 && externalIndex[a] > a) {
              build.push(newline(levels[prettydiff.iterator]));
            }

            a = prettydiff.iterator;

          }
        }

        a = a + 1;

      } while (a < c);

      prettydiff.iterator = c - 1;

      if (build[0] === lf || build[0] === ' ') build[0] = '';

      return build.join('');

    }());

  }

  prettydiff.beautify.markup = markup;

}());
