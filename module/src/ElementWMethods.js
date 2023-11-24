let Methods = (cw, class_) => new Object({

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

})

// @ EXP
export default Methods;