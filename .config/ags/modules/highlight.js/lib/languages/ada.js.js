function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/ada" instead of "highlight.js/lib/languages/ada.js"'
      );
    }
  }
  emitWarning();
    export default require('./ada.js');