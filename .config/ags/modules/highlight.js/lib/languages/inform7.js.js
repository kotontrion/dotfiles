function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/inform7" instead of "highlight.js/lib/languages/inform7.js"'
      );
    }
  }
  emitWarning();
    export default require('./inform7.js');