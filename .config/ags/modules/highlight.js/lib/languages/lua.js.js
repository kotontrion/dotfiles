function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/lua" instead of "highlight.js/lib/languages/lua.js"'
      );
    }
  }
  emitWarning();
    export default require('./lua.js');