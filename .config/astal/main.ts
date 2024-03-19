
import MarqueeLabel from "misc/marqueeLabel"
import CurvedBarEnd from "misc/curvedBarEnd"

const Comp = {
  ...Widget,
  CurvedBarEnd,
  MarqueeLabel,
}

declare global {
  const Component: typeof Comp
}

Object.assign(globalThis, {
  Component: Comp,
});

import Bar from "./modules/bar/bar.js"

App.config({
  icons: "./assets",
  closeWindowDelay: {
  },
  windows: () => [
    Bar()
  ],
})
