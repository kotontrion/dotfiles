function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/fsharp" instead of "highlight.js/lib/languages/fsharp.js"'
      );
    }
  }
  emitWarning();
    export default require('./fsharp.js');