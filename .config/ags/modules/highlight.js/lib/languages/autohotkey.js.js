function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/autohotkey" instead of "highlight.js/lib/languages/autohotkey.js"'
      );
    }
  }
  emitWarning();
    export default require('./autohotkey.js');