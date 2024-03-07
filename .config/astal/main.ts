import Bar from "./modules/bar/bar.js"

App.config({
  icons: "./assets",
  closeWindowDelay: {
  },
  windows: () => [
    Bar()
  ],
})
