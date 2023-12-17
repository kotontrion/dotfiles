function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/routeros" instead of "highlight.js/lib/languages/routeros.js"'
      );
    }
  }
  emitWarning();
    export default require('./routeros.js');