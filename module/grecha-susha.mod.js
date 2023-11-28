import ElementWrapper from './src/elementWrapper.js';
import tag from './tag.js';
import globalMethods from './src/globalMethods.js';

class Grecha {
  static ElementWrapper = ElementWrapper;
  static gm = globalMethods;
  static tag = tag;


  static preloaded = [];
  static loaded = [];


  constructor(window) {
    let g_ = this;

    this.ElementWrapper = ElementWrapper;
    this.tag = tag;
    this.gm = globalMethods;

    // @ Tag-init for basic wrapping tags
    const MUNDANE_TAGS = [
      "canvas",

      "h1",
      "h2",
      "h3",

      "main",
      "section",
      "article",
      "aside",
      "footer",
      "header",

      "p",
      "a",
      "br",
      "hr",
      "b",
      "i",
      "u",
      "s",
      "sub",
      "sup",
      "mark",
      "small",
      "big",
      "strong",
      "em",
      "ins",
      "del",
      "q",
      "blockquote",
      "pre",
      "code",
      "kbd",
      "samp",
      "var",
      "abbr",
      "address",
      "cite",
      "dfn",
      // "img",
      "map",
      "area",
      "wbr",

      "ul",
      "ol",
      "li",

      "div",
      "span",

      "html",
      "head",
      "body",
    ];

    for (const tagName of MUNDANE_TAGS) {
      window[tagName] = (...children) => tag(tagName, ...children);
    }
    // ---

    // @ Class Exports
    if (typeof module == 'undefined') {
      Object.assign(window, this.gm);
    }

    function windowOptimizer() {
      /* A function to check for mistakes made by devs, and fix them (The logging said errors) */

      // Head?
      if (!document.head) {
        console.error('[GS Optimizer] Head not found, Creating...');
        document.head = document.createElement('head');
        document.documentElement.appendChild(document.head);
      }

      // @ MetaCheck
      let headMetas = document.head.querySelectorAll('meta');

      // Create basic Metas
      let metas = [
        tag('meta').att$('charset', 'utf-8'),
        tag('meta').att$('name', 'viewport').att$('content', 'width=device-width, initial-scale=1.0'),
        tag('meta').att$('name', 'description').att$('content', 'A Grecha-Susha website.'),
        tag('meta').att$('name', 'theme-color').att$('content', '#ff0000'),
        tag('meta').att$('name', 'og:title').att$('content', 'Grecha-Susha'),
        tag('meta').att$('name', 'og:description').att$('content', 'A Grecha-Susha website.'),
        tag('meta').att$('name', 'og:image').att$('content', 'https://grecha-susha.github.io/assets/images/logo.png'),
        tag('meta').att$('name', 'og:url').att$('content', 'https://grecha-susha.github.io/'),
      ]

      if (headMetas.length < 0) {
        console.error('[META ERROR] Metas not found.');

        // Append Metas
        headMetas.forEach(meta => document.head.appendChild(meta));

        return;
      }

      else {

        if (headMetas.length < metas.length) {
          console.error('[META ERROR] Metas don\'t meet standards, creating ones not found.');

          // Append Metas
          metas.forEach(meta => {
            function create_meta(meta) {
              console.error(`[META ERROR] Meta ${meta.str$()} doesn't exist, creating...`);
              document.head.appendChild(meta.get$());
            }

            if (headMetas.length < 1) {
              create_meta(meta);

            } else {
              headMetas.forEach(meta_ => {
                meta?.element && (meta = meta.get$())
                if (meta.getAttribute?.('name') == meta_.getAttribute?.('name')) {
                  create_meta(meta);
                }
              })
            }

          });
        }

      }

      checkForFavicon();

    }

    function checkForFavicon() {
      // Check for (example): '<link rel="shortcut icon" type="image/x-icon" href="/images/favicon.ico">'
      let favicon = document.head.querySelector('link[rel="shortcut icon"]');
      if (!favicon) {
        console.error('[FAVICON ERROR] FAVICON not found, creating...');

        // Create FAVICON
        let faviCanvas = CICOIconBuilder.drawPixelArt(`
        gg0gggggggggggggg0gg
        gg00gggggggggggg00gg
        gg000gggggggggg000gg
        gg0000gg0000gg0000gg
        yy0000000000000000yy
        yy0000y000000y0000yy
        yyy00yyy0000yyy00yyy
        yyyy00yy0yy0yy00yyyy
        rrrrrr00rrrr00rrrrrr
        brrrrr00rrrr00rrrrrb
        brrrrrr000000rrrrrrb
        bbbrrrrr0000rrrrrbbb
        `.trim().replace(/ /g, ''), 200)

        let faviURL = CICOIconBuilder.canvasToDataURI(faviCanvas);

        let link = tag('link')
          .att$('rel', 'shortcut icon')
          .att$('type', 'image/x-icon')
          .att$('href', faviURL)
          .get$()

        document.head.appendChild(link);

        faviCanvas.remove();
      }
    }

    windowOptimizer();

    document.addEventListener('DOMContentLoaded', hydrate)

  }
}

// @ Module Exports
if (globalThis?.window) {

  !window.Grecha && (window.Grecha = Grecha)
  !window.Susha && (window.Susha = new Grecha(window))

} else {

  globalThis?.module?.exports
    ? module.exports.Grecha = Susha
    : false;

  globalThis?.module?.exports
    ? module.exports.Susha = new Grecha(globalThis)
    : false;
}

export default Susha;