function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/tp" instead of "highlight.js/lib/languages/tp.js"'
      );
    }
  }
  emitWarning();
    export default require('./tp.js');