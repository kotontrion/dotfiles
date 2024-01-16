import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Workspaces from "../workspaces/index.js";
import FocusedTitle from "../title/index.js";
import {RoundedAngleEnd} from "../roundedCorner/index.js";
import Tray from "../systemtray/index.js";
import Clock from "../clock/index.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import Brightness from "../brightness/index.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import {timeout} from "resource:///com/github/Aylur/ags/utils.js";
import {NotificationIndicator} from "../notifications/index.js";
import {MusicBarContainer} from "../mpris/index.js";

const Right = () => Widget.EventBox({
  hpack: "end",
  child: Widget.Box({
    children: [
      RoundedAngleEnd("topleft", {class_name: "angle", hexpand: true}),
      Tray(),
      Widget.EventBox({
        on_primary_click_release: () => App.toggleWindow("quicksettings"),
        on_secondary_click_release: () => App.toggleWindow("launcher"),
        on_scroll_up: () => {
          if (Audio.speaker == null) return;
          Audio.speaker.volume += 0.03;
        },
        on_scroll_down: () => {
          if (Audio.speaker == null) return;
          Audio.speaker.volume -= 0.03;
        },
        child: Widget.Box({
          children: [
            NotificationIndicator(),
            Clock(),
          ]
        })
      })
    ]
  })
});

const Center = () => Widget.Box({
  children: [
    MusicBarContainer()
  ]
});

const Left = () => Widget.EventBox({
  on_scroll_up: () => {
    Brightness.screen_value += 0.03;
  },
  on_scroll_down: () => {
    Brightness.screen_value -= 0.03;
  },
  child: Widget.Box({
    children: [
      Workspaces(),
      FocusedTitle(),
      RoundedAngleEnd("topright", {class_name: "angle"})
    ]
  }),
});

const Bar = () => Widget.CenterBox({
  start_widget: Left(),
  center_widget: Center(),
  end_widget: Right(),
});

const BarRevealer = (windowName) => Widget.Box({
  class_name: "bar-revealer",
  children: [
    Widget.Revealer({
      setup: (rev) => timeout(10, () => rev.reveal_child = true),
      transition: "slide_down",
      reveal_child: true,
      child: Bar(),
      transition_duration: 350,
    }).hook(App, (revealer, name, visible) => {
      if (name === windowName)
        revealer.reveal_child = visible;
    })
  ]
});

const BarWindow = (/** @type {number} */ monitor) => Widget.Window({
  monitor,
  name: `bar${monitor}`,
  anchor: ["top", "left", "right"],
  exclusivity: "exclusive",
  child: BarRevealer(`bar${monitor}`)
});

export default BarWindow;
