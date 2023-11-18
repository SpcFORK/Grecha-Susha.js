import tag from './tag.js';

function sourceMapJump(url, ns, map) {
  const defaultMap = url;
  let namespace = ns;
  let newMap = map;

  if (!newMap) {
    if (namespace) {
      newMap = namespace;
      namespace = null;
    } else {
      newMap = defaultMap;
      url = null;
    }
  }

  const newOBJ = { imports: {} };
  window.srcJump = window.srcJump || {};

  try {
    for (const [importName, _url] of Object.entries(newMap.imports)) {
      const moduleName = namespace ? `@${namespace}/${importName}` : importName;
      const fullUrl = (url ?? '/') + _url;
      newOBJ.imports[moduleName] = fullUrl;

      const script = tag('script')
        .att$('src', fullUrl)
        .att$('type', 'module')
        .get$();
      const moduleImporter = tag('script')
        .att$('type', 'module')
        .text$(
          `import * as imports from '${fullUrl}';
          for (const [name, value] of Object.entries(imports)) {
            window.srcJump['${importName || fullUrl}'] = window['${importName || fullUrl}'] = {name, value};
          }`
        )
        .get$();
      document.head.append(script, moduleImporter);
    }

    const mapContent = JSON.stringify(newOBJ);
    const mapScript = tag("script")
      .att$('type', 'importmap')
      .text$(mapContent)
      .get$();
    document.head.appendChild(mapScript);
  } catch (error) {
    console.error(`sourceMapJump error: ${error.message}`);
    throw error; // Rethrow the error to allow it to be handled upstream if necessary
  }
}

export default sourceMapJump;