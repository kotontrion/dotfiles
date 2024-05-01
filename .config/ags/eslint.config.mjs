import stylisticJs from "@stylistic/eslint-plugin-js";


export default [
  {
    ignores: ["modules/highlight.js/**/*.js"]
  },
  {
    "languageOptions": {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        "logError": "readonly",
        "App": "readonly",
        "Utils": "readonly",
        "Widget": "readonly",
        "Service": "readonly",
        "Variable": "readonly",
        "monitorCounter": "writable"
      },
    },
    plugins: {
      "@stylistic/js": stylisticJs
    },
    rules: {
      "@stylistic/js/indent": [
        "error",
        2,
        { "SwitchCase": 1 }
      ],
      "@stylistic/js/linebreak-style": [
        "error",
        "unix"
      ],
      "@stylistic/js/quotes": [
        "error",
        "double"
      ],
      "@stylistic/js/semi": [
        "error",
        "always"
      ]
    },

  }];
