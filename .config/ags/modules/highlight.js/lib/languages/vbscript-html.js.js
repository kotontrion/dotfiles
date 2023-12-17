function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/vbscript-html" instead of "highlight.js/lib/languages/vbscript-html.js"'
      );
    }
  }
  emitWarning();
    export default require('./vbscript-html.js');