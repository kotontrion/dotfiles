import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { Workspaces, hideEmptyWorkspaces } from "../workspaces/index.js";
import FocusedTitle from "../title/index.js";
import {RoundedAngleEnd} from "../roundedCorner/index.js";
import Tray from "../systemtray/index.js";
import Clock from "../clock/index.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";
import Brightness from "../brightness/index.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import {NotificationIndicator} from "../notifications/index.js";
import {MusicBarContainer} from "../mpris/index.js";
import Cairo from "cairo";


const Right = () => Widget.EventBox({
  hpack: "end",
  child: Widget.Box({
    children: [
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
  on_secondary_click_release: () => hideEmptyWorkspaces.value = !hideEmptyWorkspaces.value,
  child: Widget.Box({
    children: [
      Workspaces(),
      FocusedTitle(),
    ]
  }),
});

const Bar = () => {
  const left = Left();
  const center = Center();
  const right = Right();
  const bar = Widget.CenterBox({
    start_widget: Widget.Box({
      children: [
        left,
        RoundedAngleEnd("topright", {class_name: "angle"})
      ]
    }),
    center_widget: center,
    end_widget: Widget.Box({
      children: [
        Widget.Box({hexpand: true}),
        RoundedAngleEnd("topleft", {class_name: "angle", click_through: true}),
        right
      ]
    }),
  });

  const setInputShape = () => {
    const region = new Cairo.Region();

    const lAlloc = left.get_allocation();
    const cAlloc = center.children[0].get_allocation();
    const rAlloc = right.get_allocation();

    region.unionRectangle(lAlloc);
    region.unionRectangle(cAlloc);
    region.unionRectangle(rAlloc);

    bar.get_toplevel().input_shape_combine_region(region);
  };

  left.on("size-allocate", setInputShape);
  center.on("size-allocate", setInputShape);
  right.on("size-allocate", setInputShape);

  return bar;
};

const BarWindow = (/** @type {import('types/@girs/gdk-3.0/gdk-3.0').Gdk.Monitor} */ gdkmonitor) => Widget.Window({
  gdkmonitor,
  name: `bar${monitorCounter}`,
  anchor: ["top", "left", "right"],
  exclusivity: "exclusive",
  child: Bar()
});

export default BarWindow;
