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
                if (meta.getAttribute('name') == meta_.getAttribute('name')) {
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

    document.addEventListener('DOMContentLoaded', async () => {

      // Get every href attribute
      let hrefs = document.querySelectorAll('[href]');
      let urls = document.querySelectorAll('[url]');
      let srcs = document.querySelectorAll('[src]');

      // ['/', './', '../'] => 'https://<origin>/'
      let origin = window.location.origin;
      let path = window.location.pathname;
      let pathArray = path.split('/');
      let pathArrayLength = pathArray.length;

      let urlModel = {
        href: hrefs,
        url: urls,
        src: srcs,
      }

      let entries = Object.entries(urlModel);

      for (let i = 0; i < entries.length; i++) {
        let entry = entries[i];
        let entryName = entry[0];
        let entryArray = entry[1];

        // Loop through every entry
        a: for (let j = 0; j < entryArray.length; j++) {
          let element = entryArray[j];
          let href = element.getAttribute('href');
          // If 'a' tag, attach 'a' click event hydrator;
          if (element.tagName == 'A') {

            let urlArray = href.split('/');
            let url_ = href;

            // Has Protocol prefix?
            let hasProtocol = (
              (urlArray[0] + '').includes(':')
              // Since // is 2 /, we check if we have 1 empty item
              && (urlArray[1] + '') == ''
            );

            // console.log(url_)

            if (!hasProtocol) {
              url_ = origin + '/' + href;
              url_ = new URL(url_);
            }

            // If starts with '#/', return because is Router route
            if (url_.hash.startsWith('#/')) {
              continue a;
            }

            else element.addEventListener('click', async (e) => {
              e.preventDefault();
              let data = Grecha.loaded[href];
              // Write HTML to DOM
              if (data) {
                document.write(data);
              }

              else {
                // Load Loading HTML template.
                HTMLRoot.innerHTML = SushaTemplates.loadinglinks.innerHTML;
                let html = await fetch(href).then(res => res.text());
                document.write(html);
              }
            })
          }

          Grecha.preloaded.push({
            tag: element,
            attribute: entryName,
            value: element.getAttribute(entryName)
          });
        }
      }

      if (Grecha.preloaded.length < 1) {
        console.info('[GS Optimizer] No elements found to preload.');
        return;
      }

      // Loop through every preloaded element
      await new Promise(async (resolve, reject) => {
        for (let i = 0; i < Grecha.preloaded.length; i++) {
          let element = Grecha.preloaded[i];

          // Construct URL
          let url = element.value;
          let urlArray = url.split('/');

          // Has Protocol prefix?
          let hasProtocol = (
            (urlArray[0] + '').includes(':')
            // Since // is 2 /, we check if we have 1 empty item
            && (urlArray[1] + '') == ''
          );

          if (!hasProtocol) {
            url = origin + '/' + url;
          }

          let url_ = new URL(url);
          let groupsOfPathPeriods = url_.pathname.split('.');

          if (groupsOfPathPeriods.length > 1) {
            let fileExtention = groupsOfPathPeriods[groupsOfPathPeriods.length - 1];

            switch (element.attribute) {
              case 'html':
                break;
              default: return
            }
          }

          // If starts with '#/', return because is Router route
          if (url_.hash.startsWith('#/')) {
            return;
          }

          // Fetch Element
          let fetchedElement = await fetch(url);
          let fetchedElementText = await fetchedElement.text();

          Grecha.loaded.push({
            tag: element,
            attribute: element.attribute,
            value: fetchedElementText
          });
        }
      })
    })

  }
}

// @ Module Exports
if (globalThis?.window) {

  window.Grecha = Grecha;
  window.Susha = new Grecha(window)

} else {

  globalThis?.module?.exports
    ? module.exports.Grecha = Susha
    : false;

  globalThis?.module?.exports
    ? module.exports.Susha = new Grecha(globalThis)
    : false;
}

export default Susha;