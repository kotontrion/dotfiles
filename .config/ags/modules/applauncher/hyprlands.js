import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {lookUpIcon} from "resource:///com/github/Aylur/ags/utils.js";
import {Fzf} from "../../node_modules/fzf/dist/fzf.es.js";
import Gtk from "gi://Gtk?version=3.0";
import icons from "../icons/index.js";

/**
 * @typedef {import('node_modules/fzf/dist/types/main').Fzf<import('types/widgets/button.js').default[]>} FzfAppButton
 * @typedef {import('node_modules/fzf/dist/types/main').FzfResultItem<import('types/widgets/button.js').default>}
 * FzfResultAppButton
 */

/**
 * @param {import('types/service/hyprland.js').Client} app
 */
export const AppIcon = app => {
  const icon = app.class && lookUpIcon(app.class)
    ? app.class
    : "image-missing";

  return Widget.Icon({
    class_name: "app-icon",
    icon: icon,
  });
};

/**
 * @param {import('types/service/hyprland.js').Client} app
 */
const AppButton = app => Widget.Button({
  on_clicked: () => {
    Hyprland.messageAsync(`dispatch focuswindow address:${app.address}`)
      .catch(logError);
    App.closeWindow("launcher");
  },
  attribute: {"app": app},
  tooltip_text: app.title,
  class_name: "app-button",
  child: Widget.Box({
    children: [
      AppIcon(app),
      Widget.Box({
        vertical: true,
        children: [
          Widget.Label({
            xalign: 0,
            max_width_chars: 28,
            truncate: "end",
            use_markup: true,
            label: app.title,
            class_name: "app-name",
          }),
          Widget.Label({
            xalign: 0,
            max_width_chars: 40,
            truncate: "end",
            use_markup: true,
            label: app.class,
            class_name: "app-description",
          })
        ]
      })
    ]
  }),
})
  .on("focus-in-event", (self) => {
    self.toggleClassName("focused", true);
  })
  .on("focus-out-event", (self) => {
    self.toggleClassName("focused", false);
  });

/**
 * @type FzfAppButton
 */
let fzf;

/**
 * @param {string} text
 * @param {import('types/widgets/box').default} results
 */
function searchApps(text, results) {
  results.children.forEach(c => results.remove(c));
  const fzfResults = fzf.find(text);
  const context = results.get_style_context();
  const color = context.get_color(Gtk.StateFlags.NORMAL);
  const hexcolor = "#" + (color.red * 0xff).toString(16).padStart(2, "0")
    + (color.green * 0xff).toString(16).padStart(2, "0")
    + (color.blue * 0xff).toString(16).padStart(2, "0");
  fzfResults.forEach(entry => {
    const classChars = entry.item.attribute.app.class.normalize().split("");
    // @ts-ignore
    entry.item.child.children[1].children[1].label = classChars.map(/** @param {string} char, @param {number} i*/(char, i) => {
      if (entry.positions.has(i))
        return `<span foreground="${hexcolor}">${char}</span>`;
      else
        return char;
    }).join("");
    const titleChars = entry.item.attribute.app.title.normalize().split("");
    // @ts-ignore
    entry.item.child.children[1].children[0].label = titleChars.map(/** @param {string} char, @param {number} i*/(char, i) => {
      if (entry.positions.has(classChars.length + i))
        return `<span foreground="${hexcolor}">${char}</span>`;
      else
        return char;
    }).join("");
  });
  results.children = fzfResults.map(e => e.item);
}

const SearchBox = (launcherState) => {
  const results = Widget.Box({
    vertical: true,
    vexpand: true,
    class_name: "search-results",
  });
  const entry = Widget.Entry({
    class_name: "search-entry",
    placeholder_text: "search",
    primary_icon_name: icons.launcher.search,
  })
    .on("notify::text", (entry) => searchApps(entry.text || "", results))
    .on("activate", () => {
      const address = results.children[0]?.attribute.app.address;
      if(address) Hyprland.messageAsync(`dispatch focuswindow address:${address}`)
        .catch(logError);
      App.closeWindow("launcher");
    })
    .hook(launcherState, () =>{
      if(launcherState.value != "Hyprland") return;
      entry.text = "-";
      entry.text = "";
      entry.grab_focus();
    })
    .hook(App, (_, name, visible) => {
      if (name !== "launcher" || !visible) return;
      //explicityly destroy all Buttons to prevent errors
      fzf?.find("").map(e => e.item.destroy());
      fzf = new Fzf(Hyprland.clients.filter(client => client.title != "").map(AppButton), {
        /**
         * @param {import('types/widgets/box').default} item
         * @returns {string}
         */
        selector: (item) => item.attribute.app.class + item.attribute.app.title,
      });
      if(launcherState.value == "Hyprland") {
        entry.text = "-";
        entry.text = "";
        entry.grab_focus();
      }
    }, "window-toggled");
  return Widget.Box({
    vertical: true,
    class_name: "launcher-search",
    children: [
      entry,
      Widget.Scrollable({
        class_name: "search-scroll",
        child: results
      })
    ]
  });
};
export default SearchBox;

