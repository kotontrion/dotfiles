function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/nsis" instead of "highlight.js/lib/languages/nsis.js"'
      );
    }
  }
  emitWarning();
    export default require('./nsis.js');