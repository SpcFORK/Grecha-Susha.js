import tag from '../tag.js';
import depadString from '../depadString.js';
import ElementWrapper from './elementWrapper.js';

const windowMethods = {

  tag,

  htmlDoc(...nodes) {
    return tag('', ...nodes);
  },

  // @ Basic
  img(src) {
    // return new ElementWrapper("img").att$("src", src).get$();
    return tag("img").att$("src", src)
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
        head(),

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
    allCSS: {
      txt: (
        [...document.styleSheets]
          .map((styleSheet) => {
            try {
              return [...styleSheet.cssRules].map((rule) => rule.cssText).join("");
            } catch (e) {
              console.log(
                "Access to stylesheet %s is denied. Ignoring…",
                styleSheet.href,
              );
            }
          })
          .filter(Boolean)
          .join("\n")
      ),

      objs: Array(...document.styleSheets)
    },

    findCSSRule(selector) {
      return Array(...document.styleSheets)
        .map((styleSheet) => {
          try {
            return [...styleSheet.cssRules].filter((rule) => rule.selectorText === selector)[0];
          } catch (e) {
            console.log(
              "Access to stylesheet %s is denied. Ignoring...",
              styleSheet.href,
            );
          }
        })
        .filter(Boolean);

    },

    async importBatch(...cssURLS) {
      try {
        const link = document.createElement("link");
        link.rel = "stylesheet";
        link.href = cssURLS.join(";");
        document.head.appendChild(link);

        await new Promise((resolve, reject) => {
          link.onload = resolve;
          link.onerror = reject;
        });
      } catch (error) {
        console.error("Error importing CSS batch:", error);
      }
    },
  },

  /** 
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
  }
}

export default windowMethods;