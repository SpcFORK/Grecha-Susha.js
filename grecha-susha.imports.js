(async () => {

  var imports = {
    ElementWrapper: import('./module/src/elementWrapper.js'),
    tag: import('./module/tag.js'),
    globalMethods: import('./module/src/globalMethods.js'),
  }

  function impDefault(impObjs) {
    let entries = Object.entries(impObjs);
    let imps = {};

    entries.forEach(([key, val]) => {
      imps[key] = val?.default || val;
    });

    return imps;
  }

  async function PromiseLoaded(impObjs) {
    let entries = Object.entries(impObjs);

    const results = await Promise.all(entries.map(([key, val]) => {
      return val.then(imp => ({ key, imp }));
    }));
    return results.reduce((imps, { key: key_1, imp: imp_1 }) => {
      imps[key_1] = imp_1.default || imp_1;
      return imps;
    }, {});
  }

  async function whenLoaded(varname, cb) {
    return new Promise(async (resolve, reject) => {
      if (window[varname]) {
        return resolve(cb(window[varname]));
      } else {
        await new Promise(resolve => setTimeout(resolve, 100));
        return whenLoaded(varname, cb);
      }

    });
  }

  imports = window.imports = await PromiseLoaded(imports);

  Object.assign(globalThis?.window || globalThis, {
    ...imports,
    whenLoaded,
  })

  class Grecha {
    static ElementWrapper = imports.ElementWrapper;
    static gm = imports.globalMethods;
    static tag = imports.tag;

    constructor(window) {
      let g_ = this;

      this.ElementWrapper = imports.ElementWrapper;
      this.tag = imports.tag;
      this.gm = imports.globalMethods;

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
        window[tagName] = (...children) => imports.tag(tagName, ...children);
      }
      // ---

      // @ Class Exports
      if (typeof module == 'undefined') {
        Object.assign(window, this.gm);
      }

    }
  }

  // @ Module Exports
  if (typeof module !== 'undefined') {
    module.exports = {
      Grecha,

    };

  } else {
    window.__Grecha__ = Grecha;
    new Grecha(window);

    addEventListener('DOMContentLoaded', window?.GrechaLoaded?.())
  }

})()