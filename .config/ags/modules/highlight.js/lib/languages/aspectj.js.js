function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/aspectj" instead of "highlight.js/lib/languages/aspectj.js"'
      );
    }
  }
  emitWarning();
    export default require('./aspectj.js');