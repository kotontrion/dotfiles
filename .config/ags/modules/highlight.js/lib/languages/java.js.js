function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/java" instead of "highlight.js/lib/languages/java.js"'
      );
    }
  }
  emitWarning();
    export default require('./java.js');