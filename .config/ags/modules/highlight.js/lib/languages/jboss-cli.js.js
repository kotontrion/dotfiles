function emitWarning() {
    if (!emitWarning.warned) {
      emitWarning.warned = true;
      console.log(
        'Deprecation (warning): Using file extension in specifier is deprecated, use "highlight.js/lib/languages/jboss-cli" instead of "highlight.js/lib/languages/jboss-cli.js"'
      );
    }
  }
  emitWarning();
    export default require('./jboss-cli.js');