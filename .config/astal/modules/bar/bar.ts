import Workspaces from "./workspaces"
import WindowTitle from "./title"
import Clock from "./clock"
import CurvedBarEnd from "misc/curvedBarEnd"
import Mpris from "./mpris"

const Right = () => Component.Box({
  children: [
    CurvedBarEnd({
      cssClasses: ["bar-end"],
      position: "top_left",
    }),
    Component.Box({
      cssClasses: ["bar-container"],
      hpack: "end",
      children: [
        Clock()
      ]
    })
  ]
})

const Center = () => Component.Box({
  children: [
    Mpris()
  ]
})

const Left = () => Component.Box({
  children: [
    Component.Box({
      cssClasses: ["bar-container"],
      children: [
        Workspaces(),
        WindowTitle(),
      ]
    }),
    CurvedBarEnd({
      cssClasses: ["bar-end"],
      position: "top_right",
    })
  ]
})

const Bar = () => Component.CenterBox({
  start_widget: Left(),
  center_widget: Center(),
  end_widget: Right(),
})

const BarRevealer = (windowName: string) => Component.Box({
  children: [
    Component.Revealer({
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

export default () => Component.Window({
  name: "bar",
  anchor: ["top", "left", "right"],
  exclusivity: "exclusive",
  child: BarRevealer("bar")
})
