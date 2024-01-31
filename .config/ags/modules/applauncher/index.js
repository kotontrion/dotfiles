import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {timeout} from "resource:///com/github/Aylur/ags/utils.js";
import SearchBox from "./search.js";
import RoundedCorner from "../roundedCorner/index.js";
import Categories from "./categories.js";
import HyprlandBox from "./hyprlands.js";
import FirefoxBox from "./firefox.js";
import StackState from "../stackState/stackState.js";
import Gdk from "gi://Gdk";
import icons from "../icons/index.js";

const LauncherState = new StackState("Search");

/**
 * @param {string} item
 */
const StackSwitcherButton = item => Widget.Button({
  class_name: "launcher-switcher-button",
  tooltip_text: item,
  child: Widget.Icon(icons.launcher[item.toLowerCase()] || "image-missing"),
  on_clicked: () => LauncherState.value = item,
})
  .hook(LauncherState, button => {
    button.toggleClassName("focused", LauncherState.value == item);
    const focusedID = LauncherState.items.indexOf(LauncherState.value);
    button.toggleClassName("before-focused", LauncherState.items[focusedID-1] == item);
    button.toggleClassName("after-focused", LauncherState.items[focusedID+1] == item);
  });

/**
 * @param {boolean} start
 */
const StackSwitcherPadding = start => Widget.Box({
  class_name: "launcher-switcher-button",
  vexpand: true,
  children: [Widget.Icon()]
})
  .hook(LauncherState, (box) => {
    const focusedID = LauncherState.items.indexOf(LauncherState.value);
    box.toggleClassName("before-focused", start && focusedID === 0);
    box.toggleClassName("after-focused", !start && focusedID === LauncherState.items.length - 1);
  });
/**
 * @param {string[]} items
 */
const StackSwitcher = items => Widget.Box({
  vertical: true,
  class_name: "launcher-switcher",
  children: [
    StackSwitcherPadding(true),
    ...items.map(i => StackSwitcherButton(i)),
    StackSwitcherPadding(false),
  ]
});

const LauncherStack = () => Widget.Stack({
  visible_child_name: LauncherState.bind(),
  transition: "over_right",
  class_name: "launcher",
  items: [
    ["Search", SearchBox(LauncherState)],
    ...Categories(),
    ["Hyprland", HyprlandBox(LauncherState)],
    ["Firefox", FirefoxBox(LauncherState)]
  ]
});

export default () => {
  const stack = LauncherStack();
  LauncherState.items = stack.items.map(i => i[0]);
  const stackSwitcher = StackSwitcher(stack.items.map(i => i[0]));
  return Widget.Window({
    keymode: "on-demand",
    visible: false,
    popup: true,
    anchor: ["left", "top", "bottom"],
    name: "launcher",
    child: Widget.Box({
      css: "padding-right: 2px",
      children: [
        Widget.Revealer({
          reveal_child: false,
          transition: "slide_right",
          transition_duration: 350,
          child: stackSwitcher,
        }).hook(App, (revealer, name, visible) => {
          if (name === "launcher") {
            if(visible) revealer.reveal_child = visible;
            else timeout(100, () => revealer.reveal_child = visible);
          }
        }),
        Widget.Box({
          children: [
            Widget.Overlay({
              child: Widget.Box({
                children: [
                  Widget.Revealer({
                    reveal_child: false,
                    child: stack,
                    transition_duration: 350,
                    transition: "slide_right"
                  }).hook(App, (revealer, name, visible) => {
                    if (name === "launcher") {
                      if(visible) timeout(100, () => revealer.reveal_child = visible);
                      else revealer.reveal_child = visible;
                    }
                  }),
                  Widget.Box({css: "min-width: 1rem"})
                ]
              }),
              overlays: [
                RoundedCorner("topleft", {class_name: "corner"}),
                RoundedCorner("bottomleft", {class_name: "corner"}),
              ]
            }),
          ]
        })
      ]
    })
  })
    .on("key-press-event", (_, event) => {
      const keyval = event.get_keyval()[1];
      if (event.get_state()[1] != (Gdk.ModifierType.MOD1_MASK | Gdk.ModifierType.MOD2_MASK)) return;
      switch (keyval) {
        case Gdk.KEY_n:
        case Gdk.KEY_Tab:
          LauncherState.next();
          break;
        case Gdk.KEY_p:
          LauncherState.prev();
          break;
        case Gdk.KEY_0:
        case Gdk.KEY_KP_0:
          LauncherState.setIndex(0);
          break;
        case Gdk.KEY_1:
        case Gdk.KEY_KP_1:
          LauncherState.setIndex(1);
          break;
        case Gdk.KEY_2:
        case Gdk.KEY_KP_2:
          LauncherState.setIndex(2);
          break;
        case Gdk.KEY_3:
        case Gdk.KEY_KP_3:
          LauncherState.setIndex(3);
          break;
        case Gdk.KEY_4:
        case Gdk.KEY_KP_4:
          LauncherState.setIndex(4);
          break;
        case Gdk.KEY_5:
        case Gdk.KEY_KP_5:
          LauncherState.setIndex(5);
          break;
        case Gdk.KEY_6:
        case Gdk.KEY_KP_6:
          LauncherState.setIndex(6);
          break;
        case Gdk.KEY_7:
        case Gdk.KEY_KP_7:
          LauncherState.setIndex(7);
          break;
        case Gdk.KEY_8:
        case Gdk.KEY_KP_8:
          LauncherState.setIndex(8);
          break;
        case Gdk.KEY_9:
        case Gdk.KEY_KP_9:
          LauncherState.setIndex(9);
          break;
      }
    });
};

