let Methods = (cw, class_) => new Object({

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
    return this.wrap$('b')

  },

  italic$() {
    return this.wrap$('i')

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
    this.att$(`data-${key}`, value);
    return this;
  },

  // Append a child element
  append$(child) {
    if (child instanceof ElementWrapper) {
      this.element.appendChild(child.element);
    } else if (child instanceof HTMLElement) {
      this.element.appendChild(child);
    } else if (typeof child === 'string') {
      this.element.appendChild(document.createTextNode(child));
    }
    return this;
  },

  // Set ID attribute
  id$(id) {
    this.att$('id', id);
    return this;
  },

  // Set classes
  class$(...classes) {
    this.element.classList.add(...classes);
    return this;
  },

  // Set styles directly on an element
  style$(styleObject) {
    for (const property in styleObject) {
      this.element.style[property] = styleObject[property];
    }
    return this;
  },

  // Toggle class on an element
  toggleClass$(className) {
    this.element.classList.toggle(className);
    return this;
  },

  // Set inner HTML
  html$(htmlContent) {
    this.element.innerHTML = htmlContent;
    return this;
  },

  // Set inner Text
  text$(textContent) {
    this.element.textContent = textContent;
    return this;
  },

  // Additional methods to be included in the ElementWrapper class

  // Set a placeholder attribute for an input element
  placeholder$(placeholderValue) {
    this.att$('placeholder', placeholderValue);
    return this;
  },

  // Set the type attribute for an input or button element
  type$(typeValue) {
    this.att$('type', typeValue);
    return this;
  },

  // Add an event listener
  on$(event, handler) {
    this.element.addEventListener(event, handler);
    return this;
  },

  // Remove an event listener
  off$(event, handler) {
    this.element.removeEventListener(event, handler);
    return this;
  },

  // Perform an action upon pressing the Enter key
  onEnter$(callback) {
    this.on$('keydown', (e) => {
      if (e.key === 'Enter') callback(e);
    });
    return this;
  },

  // Focus the element
  focus$() {
    this.element.focus();
    return this;
  },

  // Blur the element
  blur$() {
    this.element.blur();
    return this;
  },

  // Add an attribute for accessibility purposes
  aria$(key, value) {
    this.att$(`aria-${key}`, value);
    return this;
  },

  // Append multiple children at once
  appendChildren$(...children) {
    children.forEach((child) => {
      this.append$(child);
    });
    return this;
  },

  // Set the disabled attribute on an element
  disabled$(isDisabled) {
    if (isDisabled) {
      this.att$('disabled', 'true');
    } else {
      this.element.removeAttribute('disabled');
    }
    return this;
  },

  // Create and append a new child element
  createElement$(tag, ...children) {
    this.append$(new ElementWrapper(tag, ...children));
    return this;
  },

  // Fetch and display content - Example: Asynchronous operation to load data
  fetchContent$(url, processContentCallback) {
    fetch(url)
      .then(response => response.json())
      .then(data => processContentCallback(this, data))
      .catch(error => console.error('Error:', error));
    return this;
  },

  style$(styleObject) {
    Object.assign(this.element.style, styleObject);
  },

  stylesheet$() {
    // Stylesheets are cached in the wrapper
    if (this?._stylesheet) {
      return this._stylesheet;
    }

    // Create a new stylesheet
    const stylesheet = new ElementWrapper(document.createElement('style'));

    // Append the stylesheet to the wrapper
    this.append$(stylesheet);
  },

  bounds$() {
    return this.element.getBoundingClientRect();
  },

  str$() {
    return (
      this.element?.outerHTML
      || this.element?.innerHTML
    );
  },

})

// @ EXP
export default Methods;