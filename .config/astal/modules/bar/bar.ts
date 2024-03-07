import Workspaces from "./workspaces.js"
import WindowTitle from "./title.js"
import Clock from "./clock.js"
import CurvedBarEnd from "../misc/curvedBarEnd.js"

const Right = () => Widget.Box({
  children: [
    CurvedBarEnd({
      cssClasses: ["bar-end"],
      position: "top_right",
    }),
    Widget.Box({
      cssClasses: ["bar-container"],
      hpack: "end",
      children: [
        Clock()
      ]
    })
  ]
})

const Center = () => Widget.Box({
  children: [
  ]
})

const Left = () => Widget.Box({
  children: [
    Widget.Box({
      cssClasses: ["bar-container"],
      children: [
        Workspaces(),
        WindowTitle(),
      ]
    }),
    CurvedBarEnd({
      cssClasses: ["bar-end"]
    })
  ]
})

const Bar = () => Widget.CenterBox({
  start_widget: Left(),
  center_widget: Center(),
  end_widget: Right(),
})

const BarRevealer = (windowName: string) => Widget.Box({
  children: [
    Widget.Revealer({
      setup: (rev) => Utils.timeout(10, () => rev.revealChild = true),
      transition: "slide_down",
      cssClasses: ["bar-revealer"],
      revealChild: true,
      hexpand: true,
      child: Bar(),
      transitionDuration: 350,
    }).hook(App, (revealer, name, visible) => {
      if (name === windowName)
      revealer.revealChild = visible;
    })
  ]
})

export default () => Widget.Window({
  name: "bar",
  anchor: ["top", "left", "right"],
  exclusivity: "exclusive",
  child: BarRevealer("bar")
})
