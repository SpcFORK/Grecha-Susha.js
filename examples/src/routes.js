const r = router({

  "/": (r) => {
    let head = h1(
      "Hello Susha!"
    );
    
    let topContainer = div(
      head
    )

      .att$('class', [
        'top-container',
        'flex',
        'flex-col',
        'justify-center',
        'items-center',
      ])

    return div(
      topContainer,
    )

      .att$('class', [
        'container',
        'flex',
      ])
      .get$()
  },

  // Working 404
  '/404': () => div(
    h1("404"),
    p("You've hit an error page!!"),
    div(a("Home").att$("href", "#"))
  )

});

entry.appendChild(r);