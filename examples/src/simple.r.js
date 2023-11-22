const r = router({

  "/": (r) => {
    let head = h1(
      "Hello Susha!"
    );
    
    let topContainer = div(
      head,
      hr(),
      p("This is a simple router example!!")
    )

    return div(
      topContainer,
    )
  },

  // Working 404
  '/404': () => div(
    h1("404"),
    p("You've hit an error page!!"),
    div(a("Home").att$("href", "#"))
  )

});

entry.appendChild(r);