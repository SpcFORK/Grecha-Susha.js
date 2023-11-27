class Grecha {
  constructor(window) {
    let g_ = this;

    class ElementWrapper {

      static LOREM = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

      static _lorem_ = function() {
        window.LOREM = ElementWrapper.LOREM;
      }()

      static RouterSymbol = Symbol.for("grecha-router");
      static CoreSymbol = Symbol.for("grecha-core");
      static modulesSymbol = Symbol.for("grecha-modules");

      get innerHTML() { return this.element.innerHTML; }
      get outerHTML() { return this.element.outerHTML; }

      /* We create attractive class. */

      constructor(name, ...children) {
        if (typeof name === "string") {
          this.element = document.createElement(name);

        } else {
          this.element = name;
        }

        let methods = this.methods();

        Object.assign(this, methods);
        Object.assign(this.element, methods);

        if (this.element.parentElement) {
          this._outerHTML_ = () => this.element.outerHTML;
        }

        if (children) for (const child of children) {
          if (typeof child === 'string') {
            this.element.appendChild(document.createTextNode(child));
          } else if (child instanceof ElementWrapper) {
            this.element.appendChild(child.element);
          } else {
            this.element.appendChild(child);
          }
        }
      }

      methods() {
        let cw = this
        return {

          element: this?.element || this,

          __LOREM__() { return ElementWrapper.LOREM },
          get LOREM() { return this.__LOREM__() },

          att$(name, value) {
            if (Array.isArray(value)) {
              value = value.join(' ');
            }

            cw.element.setAttribute(name, value);
            return cw;
          },

          onclick$(callback) {
            cw.element.onclick = callback;
            return cw;
          },

          get$() {
            return cw.element;
          },

          wrapper$() {
            return cw;
          },

          // @ Tag Wrapper
          wrap$(t) {
            // Contains <b data-grecha>?
            // Get Only child

            let w = cw.element.querySelector('[data-grecha="wrap$' + t + '"]');

            // has attr ?
            if (!w) {
              let b = new ElementWrapper(t);

              if (t && t instanceof HTMLElement) {
                b._changeElement(t);
              }

              b.att$('data-grecha', 'wrap$' + t);

              b.element.innerHTML = cw.element.innerHTML
              cw.element.innerHTML = '';
              cw.element.appendChild(b.element);

              return cw.element;
            } else {

              // Get wrapped element

              console.log(w);
              cw.element.innerHTML = w.innerHTML;
              w.innerHTML = '';

              // Remove w node from Document.
              w?.remove?.()

              return cw.element;

            }
          },

          bold$() {
            return cw.wrap$('b')

          },

          italic$() {
            return cw.wrap$('i')

          },

          underline$() {
            return cw.wrap$('u')

          },

          strike$() {
            return cw.wrap$('s')

          },

          // Into Link
          link$(href, text) {
            let wrapped = this.wrap$('a')

            if (wrapped && (href || text)) {
              wrapped.firstChild.att$('href', href)
              wrapped.firstChild.att$('target', '_blank')
              wrapped.firstChild.att$('rel', 'noopener noreferrer')
              wrapped.firstChild.att$('title', text)

              return wrapped
            }
          },

          // Set XY
          absolutePos$(x, y) {
            cw.element.style.position = 'absolute';
            cw.element.style.display = 'flex';
            cw.element.style.flexWrap = 'wrap';

            cw.element.style.left = x;
            cw.element.style.top = y;
          },

          // Reset Position
          resetPos$() {
            cw.element.style.position = 'static';
            cw.element.style.display = 'block';
            cw.element.style.flexWrap = 'nowrap';

            cw.element.style.left = '';
            cw.element.style.top = '';
          },

          // Register a new attribute for a custom data type
          data$(key, value) {
            cw.att$(`data-${key}`, value);
            return cw;
          },

          // Append a child element
          append$(child) {
            if (child instanceof ElementWrapper) {
              cw.element.appendChild(child.element);
            } else if (child instanceof HTMLElement) {
              cw.element.appendChild(child);
            } else if (typeof child === 'string') {
              cw.element.appendChild(document.createTextNode(child));
            }
            return cw;
          },

          // Set ID attribute
          id$(id) {
            cw.att$('id', id);
            return cw;
          },

          // Set classes
          class$(...classes) {
            cw.element.classList.add(...classes);
            return cw;
          },

          // Set styles directly on an element
          style$(styleObject) {
            for (const property in styleObject) {
              cw.element.style[property] = styleObject[property];
            }
            return cw;
          },

          // Toggle class on an element
          toggleClass$(className) {
            cw.element.classList.toggle(className);
            return cw;
          },

          // Set inner HTML
          html$(htmlContent) {
            cw.element.innerHTML = htmlContent;
            return cw;
          },

          // Set inner Text
          text$(textContent) {
            cw.element.textContent = textContent;
            return cw;
          },

          // Additional methods to be included in the ElementWrapper class

          // Set a placeholder attribute for an input element
          placeholder$(placeholderValue) {
            cw.att$('placeholder', placeholderValue);
            return cw;
          },

          // Set the type attribute for an input or button element
          type$(typeValue) {
            cw.att$('type', typeValue);
            return cw;
          },

          // Add an event listener
          on$(event, handler) {
            cw.element.addEventListener(event, handler);
            return cw;
          },

          // Remove an event listener
          off$(event, handler) {
            cw.element.removeEventListener(event, handler);
            return cw;
          },

          // Perform an action upon pressing the Enter key
          onEnter$(callback) {
            cw.on$('keydown', (e) => {
              if (e.key === 'Enter') callback(e);
            });
            return cw;
          },

          // Focus the element
          focus$() {
            cw.element.focus();
            return cw;
          },

          // Blur the element
          blur$() {
            cw.element.blur();
            return cw;
          },

          // Add an attribute for accessibility purposes
          aria$(key, value) {
            cw.att$(`aria-${key}`, value);
            return cw;
          },

          // Append multiple children at once
          appendChildren$(...children) {
            children.forEach((child) => {
              cw.append$(child);
            });
            return cw;
          },

          // Set the disabled attribute on an element
          disabled$(isDisabled) {
            if (isDisabled) {
              cw.att$('disabled', 'true');
            } else {
              cw.element.removeAttribute('disabled');
            }
            return cw;
          },

          // Create and append a new child element
          createElement$(tag, ...children) {
            cw.append$(new ElementWrapper(tag, ...children));
            return cw;
          },

          // Fetch and display content - Example: Asynchronous operation to load data
          fetchContent$(url, processContentCallback) {
            fetch(url)
              .then(response => response.json())
              .then(data => processContentCallback(cw, data))
              .catch(error => console.error('Error:', error));
            return cw;
          },

          stylesheet$() {
            // Stylesheets are cached in the wrapper
            if (cw?._stylesheet) {
              return cw._stylesheet;
            }

            // Create a new stylesheet
            const stylesheet = new ElementWrapper(document.createElement('style'));

            // Append the stylesheet to the wrapper
            this.append$(stylesheet);
          },

          bounds$() {
            return cw.element.getBoundingClientRect();
          },

          str$() {
            return (
              cw.element?.outerHTML
              || cw.element?.innerHTML
            );
          },

        }

      }

      _changeElement(el) {
        this.element = el;

        this._applyMethods();

        return this;
      }

      _applyMethods() {
        Object.assign(this.element, this.methods);
      }
    }

    function tag(tag, ...children) {
      return new ElementWrapper(tag, ...children).get$();
    }

    function depadString(str = '', cnln = 0) {
      // For each line, remove cnln

      var gr_ = () => {
        return str
          .split('\n')
          .map((line) => line.slice(cnln))
          .join('\n')
      }

      var lr_ = (am) => {
        return str
          .split('\n')
          .map((line) => ' '.repeat(am) + line)
          .join('\n')
      }

      if (cnln < 0) {
        // Neg, so add WS
        return lr_(-cnln)
      }

      else if (cnln < 1) {
        // Get lenth of whitespace on first line
        cnln = str.match(/^\s*/)[0].length
      }

      return gr_()
    }

    // @ Tag-init for basic wrapping tags [$TI]
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

    // @ Tagware
    const windowMethods = {

      SushaWrapper: ElementWrapper,

      tag,

      htmlDoc(...nodes) {
        return tag('', ...nodes);
      },

      Serializer: class {
        constructor(doc) {
          !doc && (doc = document);
          this.doc = doc;
        }

        serialize(node) {
          const serializer = new XMLSerializer();
          return serializer.serializeToString(node);
        }

        /**
         * Manages the creation and retrieval of serialized SerialObjects.
         */
        static Code = {
          /**
           * Utility function to serialize the object state.
           * @param {Object} state - The state object to be serialized.
           * @returns {string} The serialized state as a string.
           */
          serializeState(state) {
            return JSON.stringify(state);
          },

          /**
           * Utility function to deserialize the object state.
           * @param {string} serializedState - The serialized state as a string.
           * @returns {Object} The deserialized state object.
           */
          deserializeState(serializedState) {
            return JSON.parse(serializedState);
          },

          /**
           * Manages the creation and retrieval of serialized SerialObjects.
           */
          ValueSerializer: class ValueSerializer {

            /** @type {SerialObject[]} The list of SerialObjects. */
            static SOs = [];

            /**
             * ValueSerializer constructor.
             */
            constructor() {
              /** @type {HTMLElement} The hidden container where serialized data are stored as DOM elements. */
              this.container = this._initializeContainer();
              this.SOs.push(this.container);
            }

            /**
             * Initializes the container as a hidden DIV into which serialized elements are placed.
             * @returns {HTMLElement} The container.
             * @private
             */
            _initializeContainer() {
              const container = document.createElement('div');
              container.style.display = 'none';
              container.id = 'serial-object-container';
              document.body.appendChild(container);
              return container;
            }

            /**
             * Creates a SerialObject with the given data.
             * @param {Object} data The data to serialize into a new SerialObject.
             * @returns {SerialObject} The created SerialObject.
             */
            createSerialObject(data) {
              data = data;
              const serialObject = new SerialObject(data);
              serialObject.serialize(this.container);
              return serialObject;
            }

            /**
             * Retrieves a SerialObject by its key from the container.
             * @param {string} key The key associated with the SerialObject.
             * @returns {SerialObject} The deserialized SerialObject.
             */
            getSerialObject(key) {
              const element = this.container.querySelector(`[data-serial="${key}"]`);
              if (element) {
                const data = deserializeState(element.textContent);
                return new SerialObject({ [key]: data.state });
              }
              return null;
            }

            /**
             * Saves the state of all SerialObjects to a JSON string.
             * @returns {string} A JSON string representation of all serialized objects' states.
             */
            saveState() {
              const children = this.container.children;
              const state = Array.from(children).map(child => ({
                id: child.dataset.serial,
                state: child.textContent
              }));
              return JSON.stringify(state);
            }

            /**
             * Loads and deserializes the state of all SerialObjects from a JSON string.
             * @param {string} jsonString A JSON string representation of all serialized objects' states.
             */
            loadState(jsonString) {
              const state = JSON.parse(jsonString);
              state.forEach(obj => {
                const element = document.createElement('span');
                element.dataset.serial = obj.id;
                element.textContent = obj.state;
                this.container.appendChild(element);
              });
            }
          },

          /**
           * Represents a serializable object.
           *
           * - Use the ValueSerializer to create and retrieve SerialObjects instead.
           */
          SerialObject: class SerialObject {
            /**
             * SerialObject constructor.
             * @param {Object} data The initial data to be serialized.
             */
            constructor(data) {
              /** @type {Object} The serial proxy object. */
              this.serial = this._initializeSerialProxy(data);
            }

            /**
             * Initializes a proxy to manage the SerialObject.
             * @param {Object} data The initial data to be serialized.
             * @returns {Proxy} The proxy object.
             * @private
             */
            _initializeSerialProxy(data) {
              const handler = {
                get: (target, property) => {
                  return target[property] ? target[property].state : undefined;
                },
                set: (target, property, value) => {
                  target[property] = {
                    type: typeof value,
                    state: value
                  };
                  return true;
                },
                deleteProperty: (target, property) => {
                  return delete target[property];
                }
              };
              const proxy = new Proxy({}, handler);
              for (const [key, value] of Object.entries(data)) {
                proxy[key] = value;
              }
              return proxy;
            }

            /**
             * Serializes the object by creating a DOM element with serialized data.
             * @param {HTMLElement} container The container to append the serialized data element.
             */
            serialize(container) {
              const element = document.createElement('span');
              element.dataset.serial = this.getId();
              element.textContent = serializeState({ state: this.serial });
              container.appendChild(element);
            }

            /**
             * Generates a unique ID for the SerialObject based on its data.
             * @returns {string} The unique ID.
             */
            getId() {
              return Object.keys(this.serial).join('_');
            }

            /**
             * Deserializes the object from a DOM element by reading properties from its attributes.
             * @param {HTMLElement} element The DOM element containing serialized data.
             */
            deserialize(element) {
              const value = deserializeState(element.textContent);
              Object.assign(this.serial, value.state);
            }
          }

          // // Usage
          // const env = new Environment();
          // env.loadState(); // Load state on initialization, if available

          // // Example of modifying the environment state
          // env.setState('user', { name: 'Alice', age: 30 });
          // env.setState('theme', 'dark');

          // // Example of retrieving from the environment state
          // const user = env.getState('user');
          // const theme = env.getState('theme');

          // // Before the page unloads, save the current state
          // window.addEventListener('beforeunload', () => env.saveState());
        }
      },

      // @ Basic
      img(src, alt) {
        // return new ElementWrapper("img").att$("src", src).get$();
        return tag("img")
          .att$("src", src)
          .att$("alt", alt || src)
      },

      input(type) {
        // return new ElementWrapper("input").att$("type", type).get$();
        return tag("input").type$(type)
      },

      button(text) {
        // return new ElementWrapper("button").att$("text", text).get$();
        return tag("button").att$('text', text)
      },

      select(...options) {
        let select = tag("select");
        for (const option of options) {
          select.appendChild(tag("option").att$("value", option));
        }
        return select;
      },

      // @ Router
      router(routes) {
        const resultWrapper = div().wrapper$();
        const result = resultWrapper.get$();

        const GR_SYM = ElementWrapper.RouterSymbol;
        const GC_SYM = ElementWrapper.CoreSymbol;

        // Expose wrapper for quick access
        window[GR_SYM] = resultWrapper;

        let WSt = window[GC_SYM] = {
          WindowState: {
            current: null,
            history: [],
            stack: [],
          }
        }

        // @ CREDIT (FORK): juniorrantila
        for (const k in routes) routes[k].state = { id: 0 };

        let locations = {
          url() { return new URL(window.location) },
          hashLocation(url) { return (url ?? this.url()).hash.slice(1) || '/' },
        }

        var url = locations.url();
        var hashLocation = locations.hashLocation();

        const currentLocation = { value: hashLocation };

        if (!routes[currentLocation.value]) {
          currentLocation.value = '/';
        }

        const state = () => routes[currentLocation.value].state;

        // ---

        let methods = {

          get __handler__() { return window[GR_SYM] },

          syncHash() {
            // @ CREDIT (FORK): juniorrantila
            state().id = 0;

            url = locations.url();
            hashLocation = locations.hashLocation(url);

            const route404 = '/404';

            if (!(hashLocation in routes)) {
              console.assert(route404 in routes, `Route "${route404}" not found among the routes.`);
              hashLocation = route404;
            }

            result.replaceChildren(routes[hashLocation](result));
            currentLocation.value = hashLocation;

            // @ Window Handler
            window[GC_SYM]?.syncHash?.(hashLocation);

            return result;
          },

          destroyGrechaSync() {
            window.removeEventListener("hashchange", methods.syncHash);
          },

          deleteGrecha() {
            delete window[g_];
            for (const method in methods) delete window[method];
            delete window[GR_SYM];
          },

          // @ CREDIT (FORK): juniorrantila
          useState(initialValue) {
            const id = state().id++;

            state()[id] = state()[id] ?? initialValue;

            return [
              () => state()[id],
              (v) => {
                state()[id] = v;
                result.refresh();
              }
            ];
          },
          // ---

        }

        window.addEventListener("hashchange", methods.syncHash);

        Object.assign(result, methods);

        // @ Some simplification/quality of life changes. 
        result.refresh = result.syncHash;
        // ---

        methods.syncHash();

        return result;
      },

      // @ Quick-Canvas
      qCanvas(context, ...args) {
        const canvas = tag('canvas');
        const ctx = canvas.getContext(context || "2d");

        for (const [i, arg] of args.entries()) {
          if (typeof arg === "string") {
            canvas.setAttribute(arg, args[i + 1]);
          }

          else if (typeof arg === "function") {
            canvas.addEventListener(arg.name, arg);
          }

          else if (typeof arg === "object") {
            Object.assign(canvas, arg);
          }
        }

        return {
          canvas,
          ctx,
        };
      },

      // @ Quick-Image
      qImage(src) {
        const image = img(src)
        return {
          image,
        };

      },

      __spreadArray: (
        (this && this.__spreadArray) || function(to, from) {
          for (var i = 0, il = from.length, j = to.length; i < il; i++, j++)
            to[j] = from[i];
          return to;
        }
      ),

      tabSwitcher(names, choose) {
        return div(
          ...names.map((name, i) => {
            return span(
              a(
                p(name)
                  // @ We spec.
                  .att$("href", `#`)
                  .onclick$(() => choose(i))
              )
            ).att$('class', 'tab')

          })
        ).att$('class', 'tab-switcher')
      },

      tabs(ts) {
        const names = Object.keys(ts);
        const tags = Object.values(ts);

        let active = 0;
        const tabSlot = div(
          tags[active]
        )

        return div(
          tabSwitcher(names, (i) => {
            tabSlot.replaceChildren(tags[active]);
            tabSlot.appendChild(tags[i]);
            active = i;
          })
        )
      },

      webgl(w, h) {
        const p_h = h ?? 112;
        const p_w = w ?? 112;

        const previewCanvas = this.qCanvas(
          "webgl",

          ["width", p_w,],
          ["height", p_h,],
          ["class", "preview-canvas",]
        )

        if (previewCanvas.ctx === null) {
          throw new MediaError(
            "Unable to initialize WebGL. Your browser or machine may not support it.",
          );
        }

        return previewCanvas
      },

      distance(el1, el2) {
        if (!(el1?.element || el2?.element)) return;
        const rect1 = el1.element.bounds$();
        const rect2 = el2.element.bounds$();

        // From Center
        const x = Math.abs(rect1.x + rect1.width / 2 - rect2.x - rect2.width / 2);
        const y = Math.abs(rect1.y + rect1.height / 2 - rect2.y - rect2.height / 2);
        return Math.sqrt(x * x + y * y);

      },

      animate(e, cb) {
        const shouldLoop = Symbol.for("ShouldLoop");
        e[shouldLoop] = true;

        let animationFrameId;

        const looper = () => {
          if (!e[shouldLoop]) {
            return;
          }

          cb(() => {
            e[shouldLoop] = true
            if (e[shouldLoop]) {
              animationFrameId = requestAnimationFrame(looper);
            }
          });

          animationFrameId = requestAnimationFrame(looper);
        };

        looper()

        return () => {
          e[shouldLoop] = false;
          cancelAnimationFrame(animationFrameId);
        };
      },

      // @ Advanced

      scrollTo(type, id = '') {
        if (!['link', 'go'].includes(type)) return;

        const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        if (!id) {
          scrollToTop();
          return;
        }

        const element = document.querySelector(id);
        element ? element.scrollIntoView({ behavior: 'smooth', block: 'start' }) : scrollToTop();
      },

      depadString,

      nodesToString(...nodes) {
        return nodes.map(n => n.outerHTML).join("");
      },

      createDocument(...args) {
        return new DOMParser()
          .parseFromString(
            args,
            "text/html"
          )
      },


      // @ Expert
      SushaTemplates: {
        get ExampleDocument() {
          return html(
            head(
              tag('title', 'Example Document'),
            ),

            body(
              main(
                article(
                  section(

                    h1('Hello World!')
                      .att$('class', 'title')
                    ,

                    small('From Susha.')
                      .att$('class', 'subtitle')
                    ,

                    hr(),
                    br(),

                    p('This is a template.')
                      .att$('class', 'content')
                    ,

                    p('It is <strong>very</strong> <em>simple</em>.')
                      .att$('class', 'content')
                    ,

                    p('Susha allows you to create templates much like React.')
                      .att$('class', 'content')
                    ,

                    p('(But is waaaay better!!)')
                      .att$('class', 'content')
                  )
                )
                  .att$('class', 'main')
              )

            ) // @BODY

          ) // @HTML
        },
      },

      typing: {
        TypedObject: class TypedObject {
          constructor(obj) {
            if (!obj) obj = {};

            TypedObject.typeEntries(this, obj);

            return this
          }

          static typeEntries(th, obj) {
            Object.entries(obj).forEach(([key, value]) => {
              th[key] = typeof value;
            });
          }

          static set(th, data) {
            return Object.assign(th, data)
          }
        },

        TypeProxy: class TypeProxy {
          static collection = [];
          static holderSymbol = Symbol.for('meta');
          static coreSymbol = Symbol.for('core');

          static add(data) {
            TypeProxy.collection.push(data);

            if (this[TypeProxy.holderSymbol].length < 1) {
              this[TypeProxy.holderSymbol] = [data];
            } else {
              this[TypeProxy.holderSymbol].push(data);
            }
          }

          // An Object which, once defined, keeps values strictly that type.
          constructor(obj) {
            if (!obj) obj = {};

            this[TypeProxy.coreSymbol] = {};

            this._OBJECT_ = {
              [TypeProxy.coreSymbol]: createTypedObject('TypedStorage', {
                check: (value) => {
                  return typeof value === this[TypeProxy.coreSymbol];
                },
                get: (key) => {
                  return this[TypeProxy.coreSymbol][key];
                },
                set: (key, value) => {
                  // Check Types
                  if (this[TypeProxy.coreSymbol][key] && typeof this[TypeProxy.coreSymbol][key] !== typeof value) {
                    throw new TypeError(`Expected type ${typeof value} for key ${key} but got ${typeof this[TypeProxy.coreSymbol][key]}`);
                  }

                  return this[TypeProxy.coreSymbol][key] = value;
                },
              }),
            };

            let o__ = this._OBJECT_.typed = new this._OBJECT_[TypeProxy.coreSymbol](obj);

            return new Proxy(this._OBJECT_.typed, {
              get: (target, key) => {
                if (o__.check(key)) {
                  return o__.get(key);
                } else {
                  return target[key];
                }
              },
              set: (target, key, value) => {
                if (o__.check(key)) {
                  o__.set(key, value);
                } else {
                  throw new TypeError(`Expected type ${typeof value} for key ${key} but got ${typeof o__.get(key)}`);
                }
              },
            });
          }
        },

        createTypedObject(name = '', methods) {
          let _t = {
            [name]: class extends TypedObject {
              constructor(obj) {
                super(obj);
                TypedObject.set(this, methods);
              }
            }
          }

          return _t[name]
        }
      },

      SushaServiceBuilder: {
        get ServiceWorker() {
          return navigator?.serviceWorker || false
        },

        get cacheBuilder() {
          return class CacheBuilder {
            constructor(name, files) {
              this.name = name;
              this.files = files || [];
              this._runner();

              if (files) {
                for (const file of files) {
                  this.add(file);
                }
              }

            }

            async _runner() {
              const cache = await this.init();

              this.cache = cache;
              return cache;
            }

            async _beforeHandler() {
              if (!this.cache) {
                await this._runner();
              }

              function _handler() {
                // Helper to delete a specific cache if it doesn't match the current cache name
                function deleteCacheIfNotCurrent(cache, cacheName) {
                  if (cache !== cacheName) {
                    console.log('Service Worker: Clearing Old Cache');
                    return caches.delete(cache);
                  }
                }

                // Helper to clear all caches that are not the current one
                function clearOldCaches(cacheName) {
                  caches.keys().then(cacheNames => {
                    return Promise.all(cacheNames.map(cache => deleteCacheIfNotCurrent(cache, cacheName)));
                  });
                }

                // Helper to clear all caches
                clearOldCaches(this.name);
              }

              // Call Activate Event 
              self.addEventListener('activate', e => {
                console.log('Service Worker: Activated  ', e);
                e.waitUntil(
                  _handler()
                );
              })

              // ---

              async function fetchHandle(e) {
                try {
                  const res = await fetch(e.request);
                  const resClone = res.clone();
                  caches.open(cacheName)
                    .then(cache => {
                      cache.put(e.request, resClone);
                    });
                  return res;
                } catch (err) {
                  const res_1 = await caches.match(e.request);
                  return res_1;
                }
              }

              // Call Fetch Event  
              self.addEventListener('fetch', e => {
                console.log('Service Worker: Fetching');
                e.respondWith(
                  fetchHandle(e)
                );
              });

              return this.cache;
            }

            async init(catch_ = () => { }) {
              const cache = caches.open(this.name)

              cache.catch(catch_)

              return await cache;
            }

            async add(...urls) {
              let hr_ = await this._SbeforeHandler();

              if (!hr_) throw new Error("ADD: No cache found...?");

              const urls_ = urls.map(url => {
                if (typeof url === "string") {
                  return new URL(url, location.href)
                } else {
                  return url;
                }

              });

              // Call install Event 
              self.addEventListener('install', e => {
                // Wait until promise is finished  
                e.waitUntil(
                  hr_.addAll(urls_)
                    .catch(err => {
                      console.error(err);
                    })

                    .then(() => {
                      console.log('Service Worker Cache Updated');
                      return self.skipWaiting();

                    })

                    .catch(err => {
                      console.error(err);
                    })
                );
              })
            }
          }
        },

        _EstWorker(workerPath) {
          let sw = SushaServiceBuilder.ServiceWorker;

          if (!sw) {
            throw new Error(
              "Unable to register service worker. Your browser or machine may not support it."
            );
          }

          return sw.register(workerPath) // Promise
        },

        buildCache(cacheName) {

        },

        buildWorker(workerPath, cb, catch_) {
          return SushaServiceBuilder._EstWorker(workerPath)
            .then(() => {
              if (cb) cb();
            })
            .catch(a => { if (catch_) { catch_(a) } });
        },
      },

      SushaWorker: {

        get Worker() {
          return window?.Worker || false;
        },

        createWorker(src, options, woptions = {}) {
          {
            !onmessage
              ? onmessage = (event) => {
                if (
                  event.data instanceof Object &&
                  Object.hasOwn(event.data, "queryMethod") &&
                  Object.hasOwn(event.data, "queryMethodArguments")
                ) {
                  (woptions?.queryableFunctions || queryableFunctions)[event.data.queryMethod].apply(
                    self,
                    event.data.queryMethodArguments,
                  );
                } else {
                  woptions?.default?.(event.data);
                }
              }

              : null
          }

          if (!SushaWorker.Worker) {
            throw new Error('Workers are not supported in this environment.');
          }

          const worker = new Worker(src, options);
          Object.assign(worker, woptions);
          return worker;
        },

        get SharedWorker() {
          return window?.SharedWorker || false;
        },

        createSharedWorker(src, options, woptions = {}) {
          if (!SushaWorker.SharedWorker) {
            throw new Error('SharedWorkers are not supported in this environment.');
          }

          const sharedWorker = new SharedWorker(src, options);
          Object.assign(sharedWorker, woptions);

          sharedWorker.port.onmessage = function(e) {
            if (e.data?.type === 'result') {
              console.log('Received message from shared worker:', e.data);
            }
          };

          sharedWorker.port.start();

          return {
            ...sharedWorker,
            sendQuery(queryMethod, ...queryMethodArguments) {
              if (!queryMethod) {
                throw new TypeError(
                  "sendQuery requires at least one argument for the query method."
                );
              }
              sharedWorker.port.postMessage({
                queryMethod,
                queryMethodArguments,
              });
            }
          };
        },

        queryableWorker() {
          return class QueryableWorker {
            constructor(url, defaultListener = () => { }, onError) {
              this.worker = new Worker(url);
              this.listeners = {};
              this.defaultListener = defaultListener;

              if (onError) {
                this.worker.onerror = onError;
              }

              this.worker.onmessage = (event) => {
                if (event.data instanceof Object && event.data.queryMethodListener && this.listeners[event.data.queryMethodListener]) {
                  this.listeners[event.data.queryMethodListener].apply(this, event.data.queryMethodArguments);
                } else {
                  this.defaultListener(event.data);
                }
              };
            }

            postMessage(message) {
              this.worker.postMessage(message);
            }

            terminate() {
              this.worker.terminate();
            }

            addListener(name, listener) {
              this.listeners[name] = listener;
            }

            removeListener(name) {
              delete this.listeners[name];
            }

            sendQuery(queryMethod, ...queryMethodArguments) {
              if (!queryMethod) {
                throw new TypeError("QueryableWorker.sendQuery takes at least one argument");
              }
              this.worker.postMessage({ queryMethod, queryMethodArguments });
            }
          }
        },

        replyQuery(queryMethodListener, ...queryMethodArguments) {
          if (!queryMethodListener) {
            throw new TypeError("reply - takes at least one argument");
          }
          postMessage({
            queryMethodListener,
            queryMethodArguments,
          });
        },

        emulateMessage(vVal) {
          try {
            return JSON.parse(JSON.stringify(vVal));
          } catch (e) {
            console.error('Failed to emulate message:', e);
          }
        }
      },

      DCSS: {
        getAllCSS() {
          return (
            [...document.styleSheets]
              .map((styleSheet) => {
                try {
                  return [...styleSheet.cssRules]
                    .map((rule) => rule.cssText)
                    .join("");
                } catch (e) {
                  console.log(
                    "Access to stylesheet %s is denied. Ignoring…",
                    styleSheet.href
                  );
                }
              })
              .filter(Boolean)
              .join("\n")
          );
        },

        getCSSObjects() {
          return [...document.styleSheets];
        },

        findCSSRule(selector) {
          return (
            [...document.styleSheets]
              .map((styleSheet) => {
                try {
                  return [...styleSheet.cssRules].find(
                    (rule) => rule.selectorText === selector
                  );
                } catch (e) {
                  console.log(
                    "Access to stylesheet %s is denied. Ignoring...",
                    styleSheet.href
                  );
                }
              })
              .filter(Boolean)
          );
        },

        async importBatch(...cssURLs) {
          const links = cssURLs.map((url) => {
            const link = document.createElement("link");
            link.rel = "stylesheet";
            link.href = url;
            document.head.appendChild(link);
            return new Promise((resolve, reject) => {
              link.onload = resolve;
              link.onerror = reject;
            });
          });

          try {
            await Promise.all(links);
          } catch (error) {
            console.error("Error importing CSS batch:", error);
          }
        },
      },

      /** 
        * The code defines a class called SushaTransport that is intended to manage WebTransport connections. WebTransport is a protocol that allows browsers to send and receive data over HTTP/3.
       
        Here's a breakdown of each part:
        
        constructor(url): This is the constructor method that creates an instance of SushaTransport. It takes a URL as an argument. It then checks if the browser supports WebTransport. If not, it throws an error.
        
        async connect(): This method establishes the WebTransport connection. It waits until the transport is ready before logging that the connection is established.
        
        async sendData(data): This method allows sending text data over a unidirectional stream (one-way communication). It encodes the text data and writes it to a stream.
        
        async writeData(writable): This method writes predefined Uint8Array data to the provided writable stream.
        
        async readData(readable): This method reads data from the provided readable stream, logs the data to the console, and stops when there's no more data.
        
        async receiveData(): This is an improved method to receive data from a readable stream attached to this.stream. It decodes the received bytes to text and logs them to the console.
        
        async closeConnection(): This method closes the WebTransport connection, handles the closure of the transport, and logs whether the transport closed gracefully or due to an error.
        
        async receiveUnidirectional(): This method listens for incoming unidirectional streams from the server and logs the received data after decoding it from bytes to text.
        
        async setUpBidirectional(): This method sets up a bidirectional stream (two-way communication) and demonstrates how to send and receive data through it.
        
        async receiveBidirectional(): This method handles incoming bidirectional streams. For each bidirectional stream, it starts reading and writing data in parallel until there are no more streams.
        
        This code would be used in a web application where there's a need to send and receive data in real-time with low latency, such as in gaming or live streaming apps. The class simplifies managing the complex WebTransport API by providing methods for common tasks like connecting, sending, and receiving data.
        *
        *  Example:
        *  // Usage:
        * 
        *  // Remember to replace '<URL>' with the actual WebTransport server URL.
        * 
        *  const sushaTransport = new SushaTransport('<URL>');
        * 
        *  // Connect to the WebTransport server
        * 
        *  sushaTransport.connect().catch((error) => {
        *
        *    console.error('Failed to connect:', error);
        *
        *  });
        *
        *  // Send the string "Susha" to the server
        *
        *  sushaTransport.sendData('Susha').catch((error) => {
        *
        *    console.error('Failed to send data:', error);
        *
        *  });
        */
      sushaTransport: class SushaTransport {
        constructor(url) {
          if ('WebTransport' in window) {
            this.transport = new WebTransport(url);
          } else {
            throw new Error('WebTransport API is not supported in this browser.');
          }
        }

        async connect() {
          await this.transport.ready;
          console.log('WebTransport connection established!');
        }

        async sendData(data) {
          const writableStream = await this.transport.createUnidirectionalStream();
          const writer = writableStream.getWriter();
          const encoder = new TextEncoder();
          const encodedData = encoder.encode(data);

          await writer.write(encodedData);
          await writer.close();
          console.log('Data sent over WebTransport.');
        }

        async writeData(writable) {
          const writer = writable.getWriter();
          const data1 = new Uint8Array([65, 66, 67]);
          const data2 = new Uint8Array([68, 69, 70]);
          writer.write(data1);
          writer.write(data2);
        }

        async readData(readable) {
          const reader = readable.getReader();
          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }
            // value is a Uint8Array.
            console.log(value);
          }
        }

        // Improved method to receive data
        async receiveData() {
          const reader = this.stream.readable.getReader();
          const decoder = new TextDecoder();

          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                reader.releaseLock();
                break;
              }
              console.log(decoder.decode(value));
            }
          } catch (error) {
            console.error('Error while reading data:', error);
          }
        }

        // Method to close the WebTransport connection
        async closeConnection() {
          await writer.close();
          await transport.close(); // This will also close the readable stream

          try {
            await transport.closed;
            console.log(`The HTTP/3 connection to ${url} closed gracefully.`);
          } catch (error) {
            console.error(`The HTTP/3 connection to ${url} closed due to ${error}.`);
          }

          console.log('WebTransport connection closed.');
        }

        async receiveUnidirectional() {
          const reader = transport.incomingUnidirectionalStreams.getReader();
          try {
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                reader.releaseLock();
                return;
              }
              const streamReader = value.readable.getReader();
              try {
                while (true) {
                  const { value, done } = await streamReader.read();
                  if (done) {
                    break;
                  }
                  // value is a Uint8Array of bytes from the stream
                  console.log(new TextDecoder().decode(value));
                }
              } finally {
                streamReader.releaseLock();
              }
            }
          } finally {
            reader.releaseLock();
          }
        }

        async setUpBidirectional() {
          try {
            const { writable, readable } = await transport.createBidirectionalStream();

            // Use the writable and readable streams for sending and receiving data
            // For example, to write to the writable stream:
            const writer = writable.getWriter();
            const encoder = new TextEncoder();
            const data = encoder.encode('data to send');
            await writer.write(data);
            await writer.close();

            // To read from the readable stream:
            const reader = readable.getReader();
            while (true) {
              const { value, done } = await reader.read();
              if (done) {
                break;
              }
              console.log(new TextDecoder().decode(value));
            }

          } catch (error) {
            console.error('Error setting up bidirectional stream:', error);
          }
        }

        async receiveBidirectional() {
          const bds = transport.incomingBidirectionalStreams;
          const reader = bds.getReader();

          try {
            while (true) {
              const { done, value } = await reader.read();
              if (done) {
                reader.releaseLock();
                break;
              }
              // value is an instance of WebTransportBidirectionalStream
              const [readable, writable] = [value.readable, value.writable];
              await Promise.all([this.readData(readable), this.writeData(writable)]);
            }
          } catch (error) {
            console.error('Error during bidirectional stream handling:', error);
          }
        }

      },

      /** This code is defining a property called xmlRequest inside an object named SushaXML. The property is a getter function that returns a class definition when it's accessed. Let's break down the complex parts into simpler language.
       
      Class Definition: The code is defining a new class called SushaXMLRequest which extends from XMLHttpRequest. In simple terms, the SushaXMLRequest class has all the capabilities of XMLHttpRequest with some added functionalities. XMLHttpRequest is a built-in browser object that allows you to make network requests to retrieve data from a server, commonly used for AJAX calls.
       
      Constructor: The constructor is a special method for creating and initializing an object created with a class. In this case, SushaXMLRequest's constructor accepts url, options, and a set of callbacks (cbs) but with a default empty object {} if no callbacks are provided.
       
      Super Call: The super(url, options); line is calling the constructor of the parent class XMLHttpRequest with the url and options provided. This is necessary to ensure that the object is properly set up as an XMLHttpRequest.
       
      Callbacks Assignment: this.cbs is assigned the result of merging a _evlB object (explained later) with the provided callbacks. Object.assign is used to merge these objects together. This sets up a series of event listeners based on the callbacks provided.
       
      Event Listeners: addEventListener is used in a loop over all the keys of this.cbs to automatically subscribe to the events with the corresponding methods defined in cbs.
       
      Getter Method: get handleEvent() is a getter that returns a function. The function logged to log.textContent the type of the event that occurred and the number of bytes transferred during that event.
       
      _evlB Property: _evlB is a getter that returns an object with keys corresponding to various event types like loadstart, load, loadend, progress, error, and abort. Each key is associated with this.handleEvent which implies each event is handled by the handleEvent function returned by the getter get handleEvent().
       
      Here's the overall functionality in simpler terms:
       
      When SushaXML.xmlRequest is accessed, it provides you with a special class for sending network requests (SushaXMLRequest).
      You can create an instance of SushaXMLRequest with a specified URL, optional settings (options), and various event callbacks.
      It automatically sets up listeners for several types of events and logs information to the log element whenever these events trigger.
      It inherits from XMLHttpRequest, meaning it has all the features to send network requests but adds its own custom behavior for event handling. */
      SushaXML: {
        get xmlRequest() {
          return class SushaXMLRequest extends XMLHttpRequest {
            constructor(url, options, cbs = {}) {
              super(url, options);

              this.cbs = Object.assign(this._evlB, cbs);

              this.url = url;
              this.options = options;

              for (const event in this.cbs) {
                this.addEventListener(event, this.cbs[event]);
              }
            }

            get handleEvent() {
              return function(e) {
                log.textContent = `${log.textContent}${e.type}: ${e.loaded} bytes transferred\n`;
              }
            }

            get _evlB() {
              return {
                loadstart: this.handleEvent,
                load: this.handleEvent,
                loadend: this.handleEvent,
                progress: this.handleEvent,
                error: this.handleEvent,
                abort: this.handleEvent
              }
            }
          }
        },
      },

      SushaImporter: class SushaImporter {
        constructor(...urls) {
          this.urls = urls;
          this.xmls = [];
        }

        start(cb) {
          if (!cb) {
            if (window[Symbol.for('GSImporter')]) {
              cb = window[Symbol.for('GSImporter')].start
            } else {
              cb = () => { }
            }
          }

          this.urls.forEach(url => {
            let req = new SushaXML.xmlRequest(url);
            req.onload = (...e) => {
              this.xmls.push(req.responseXML);
              cb(url, ...e);

              // Use
              handleImport(url, ...e);
            }
            req.send();
          });

          function handleImport(url, ...e) {
            if (`${url}`.endsWith('.js')) {
              let script = document.createElement('script');
              script.src = url;
              document.head.appendChild(script);

            }

            else if (`${url}`.endsWith('.css')) {
              let link = document.createElement('link');
              link.rel = 'stylesheet';
              link.href = url;
              document.head.appendChild(link);
            }

            else if (`${url}`.endsWith('.json')) {
              fetch(url)
                .then(response => response.json())
                .then(data => {
                  window[Symbol.for('ImportedData')] = [
                    ...(
                      window[Symbol.for('ImportedData')]
                        ? window[Symbol.for('ImportedData')]
                        : []
                    ),
                    data
                  ];
                })
            }

            else if (`${url}`.endsWith('.html')) {
              fetch(url)
                .then(response => response.text())
                .then(data => {
                  window[Symbol.for('ImportedHTML')] = [
                    ...(
                      window[Symbol.for('ImportedHTML')]
                        ? window[Symbol.for('ImportedHTML')]
                        : []

                    ),
                    data
                  ]
                })
            }

            else if (`${url}`.endsWith('.png')) {
              fetch(url)
                .then(response => response.blob())
                .then(blob => {
                  let img = new Image();
                  img.src = URL.createObjectURL(blob);
                  img.onload = () => {
                    window[Symbol.for('ImportedImages')] = [
                      ...(
                        window[Symbol.for('ImportedImages')]
                          ? window[Symbol.for('ImportedImages')]
                          : []

                      ),
                      img
                    ]
                  }
                })
            }
          }

          return this;
        }

        get xml() {
          return this.xmls;
        }

        async awaitAll() {
          return await Promise.all(this.xmls);
        }
      },

      SushaMath: {
        sineWave(iterations, increaseFactor) {
          var counter = 0;
          var increase = Math.PI * 2 / increaseFactor;

          for (var i = 0; i <= 1; i += 1 / iterations) {
            var x = i;
            var y = Math.sin(counter) / 2 + 0.5;
            counter += increase;
            // Do something with x and y, like plotting the wave or storing the coordinates.
          }
        }


      }
    }

    // ---

    // @ Class Exports
    if (typeof module == 'undefined') {
      Object.assign(window, windowMethods);
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
      } else {

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

    }

    windowOptimizer();

  }
}

// @ Module Exports
if (typeof module !== 'undefined') {
  module.exports = {
    Grecha,
  };

} else {
  window.__Grecha__ = Grecha;
  window.__Susha__ = new Grecha(window);
}