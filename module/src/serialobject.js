/**
 * Manages the creation and retrieval of serialized SerialObjects.
 */

const o_ = {
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

if (typeof window !== 'undefined') {
  if (typeof window.serialized == 'undefined') {
    window.serialized = new o_.ValueSerializer();
  }
} else {
  // For non-browser environments, export the class directly
  module.exports = o_.ValueSerializer;
}