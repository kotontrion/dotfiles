import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import {Fzf} from "../../node_modules/fzf/dist/fzf.es.js";
import Gtk from "gi://Gtk?version=3.0";
import icons from "../icons/index.js";

/**
 * @typedef {import('node_modules/fzf/dist/types/main').Fzf<import('types/widgets/button.js').default[]>} FzfAppButton
 * @typedef {import('node_modules/fzf/dist/types/main').FzfResultItem<import('types/widgets/button.js').default>}
 * FzfResultAppButton
 */

const AppButton = tab => Widget.Button({
  on_clicked: () => {
    execAsync(`bt activate ${tab.address}`)
      .then(() => Hyprland.sendMessage(`dispatch focuswindow title:${tab.title}`));
    App.closeWindow("launcher");
  },
  attribute: {"tab": tab},
  tooltip_text: tab.title,
  class_name: "app-button",
  child: Widget.Box({
    children: [
      //TODO: add favicon
      Widget.Box({
        vertical: true,
        children: [
          Widget.Label({
            xalign: 0,
            max_width_chars: 28,
            truncate: "end",
            use_markup: true,
            label: tab.title,
            class_name: "app-name",
          }),
          Widget.Label({
            xalign: 0,
            max_width_chars: 40,
            truncate: "end",
            use_markup: true,
            label: tab.url,
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
    const titleChars = entry.item.attribute.tab.title.normalize().split("");
    // @ts-ignore
    entry.item.child.children[0].children[0].label = titleChars.map(/** @param {string} char, @param {number} i*/(char, i) => {
      if (entry.positions.has(i))
        return `<span foreground="${hexcolor}">${char}</span>`;
      else
        return char;
    }).join("");
    const urlChars = entry.item.attribute.tab.url.normalize().split("");
    // @ts-ignore
    entry.item.child.children[0].children[1].label = urlChars.map(/** @param {string} char, @param {number} i*/(char, i) => {
      if (entry.positions.has(titleChars.length + i))
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
      const tab = results.children[0]?.attribute.tab;
      if(tab) execAsync(`bt activate ${tab.address}`)
        .then(() => Hyprland.sendMessage(`dispatch focuswindow title:${tab.title}`));
      App.closeWindow("launcher");
    })
    .hook(launcherState, () =>{
      if(launcherState.value != "Firefox") return;
      entry.text = "-";
      entry.text = "";
      entry.grab_focus();
    })
    .hook(App, async (_, name, visible) => {
      if (name !== "launcher" || !visible) return;
      //explicityly destroy all Buttons to prevent errors
      fzf?.find("").map(e => e.item.destroy());
      const btlist = await execAsync("bt list");
      const tabs = btlist.split("\n").map(tab => {
        const data = tab.split("\t");
        return {
          "address": data[0],
          "title": data[1],
          "url": data[2]
        };
      });
      fzf = new Fzf(tabs.map(AppButton), {
        /**
         * @param {import('types/widgets/box').default} item
         * @returns {string}
         */
        selector: (item) => item.attribute.tab.title + item.attribute.tab.url,
      });
      if(launcherState.value == "Firefox") {
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

