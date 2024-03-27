import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Indicator from "./indicatorService.js";
import icons from "../icons/index.js";
import RoundedCorner, { RoundedAngleEnd } from "../roundedCorner/index.js";

/**
 * @param {number} brightness
 * @returns {string}
 */
const brightnessToIcon = brightness => {
  const idx = Math.floor(brightness * (icons.brightness.screen.length - 1));
  return icons.brightness.screen[idx];
};

/**
 * @param {number} volume
 * @returns {string}
 */
const volumeToIcon = volume => {
  if (volume <= 0)    return icons.audio.volume.muted;
  if (volume <= 0.33) return icons.audio.volume.low;
  if (volume <= 0.66) return icons.audio.volume.medium;
  if (volume <= 1) return icons.audio.volume.high;
  if (volume > 1) return icons.audio.volume.overamplified;
  return icons.audio.volume.high;
};


/**
 *
 * @param {import('types/@girs/gtk-3.0/gtk-3.0').Gtk.Widget} icon
 * @param {import('types/service').Binding<any, any, string>} label
 * @param {import('types/service').Binding<any, any, number>} progress
 * @param {import('types/widgets/box').BoxProps} props
 * @returns {import('types/widgets/box').default}
 */
const OsdValue = (icon, label, progress, props = {}) => Widget.Box({
  ...props,
  class_name: "osd-indicator",
  hexpand: true,
  spacing: 8,
  children: [
    // Widget.Icon({
    //   class_name: "osd-icon",
    //   icon: icon,
    // }),
    icon,
    Widget.ProgressBar({
      class_name: "osd-progress",
      hexpand: true,
      vpack: "center",
      vertical: false,
      value: progress
    }),
    Widget.Label({
      hexpand: false,
      class_name: "osd-value-txt",
      label: label
    })
  ]
});

const brightnessIndicator = OsdValue(
  Widget.Label({
    class_name: "osd-icon",
    label: Indicator.bind("brightness").transform(brightnessToIcon),
  }),
  Indicator.bind("brightness").transform(bright => `${Math.round(bright*100)}`),
  Indicator.bind("brightness")
);

const volumeIndicator = OsdValue(
  Widget.Icon({
    class_name: "osd-icon",
    icon: Indicator.bind("volume").transform(volumeToIcon),
  }),
  Indicator.bind("volume").transform(volume => `${Math.round(volume*100)}`),
  Indicator.bind("volume").transform(volume => Math.min(volume, 1))
);

const IndicatorValues = () => Widget.Revealer({
  transition: "slide_down",
  child: Widget.Box({
    vertical: true,
    children: [
      Widget.Box({
        children: [
          Widget.Stack({
            transition: "slide_up_down",
            class_name: "indicator-container",
            visible_child_name: Indicator.bind("current"),
            children: {
              "brightness": brightnessIndicator,
              "volume": volumeIndicator,
            }
          }),
          RoundedAngleEnd("topright", {class_name: "angle"})
        ]
      }),
      RoundedCorner("topleft", {class_name: "corner"})
    ]
  })
})
  .hook(App, (self, windowName, visible) => {
    if(windowName === "indicator") self.reveal_child = visible;
  }, "window-toggled");


export default () => Widget.Window({
  name: "indicator",
  class_name: "indicator",
  layer: "overlay",
  visible: true,
  anchor: ["top", "left"],
  child: Widget.EventBox({
    on_hover: () => {
      Indicator.popup(-1);
    },
    child: Widget.Box({
      vertical: true,
      css: "min-height: 2px;",
      children: [
        IndicatorValues(),
      ]
    })
  }),
})
  .hook(Indicator, (_, value) => {
    if(value > 0) App.openWindow("indicator");
    else App.closeWindow("indicator");
  }, "popup");
