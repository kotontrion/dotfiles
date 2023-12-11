function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/coq" instead of "highlight.js/lib/languages/coq.js"'
      );
    }
  }
  emitWarning();
    export default require('./coq.js');