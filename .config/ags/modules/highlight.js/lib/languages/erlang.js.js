function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/erlang" instead of "highlight.js/lib/languages/erlang.js"'
      );
    }
  }
  emitWarning();
    export default require('./erlang.js');