function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/apache" instead of "highlight.js/lib/languages/apache.js"'
      );
    }
  }
  emitWarning();
    export default require('./apache.js');