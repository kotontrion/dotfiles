import Applications from "resource:///com/github/Aylur/ags/service/applications.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {lookUpIcon} from "resource:///com/github/Aylur/ags/utils.js";
import {Fzf} from "../../node_modules/fzf/dist/fzf.es.js";
import Gtk from "gi://Gtk";

/**
 * @typedef {import('node_modules/fzf/dist/types/main').Fzf<import('types/widgets/button').default[]>} FzfAppButton
 * @typedef {import('node_modules/fzf/dist/types/main').FzfResultItem<import('types/widgets/button').default>}
 * FzfRestulAppButton
 */

/**
 * @param {import('types/service/applications.js').Application} app
 */
export const AppIcon = app => {
  const icon = app.icon_name && lookUpIcon(app.icon_name)
    ? app.icon_name
    : "image-missing";

  return Widget.Icon({
    class_name: "app-icon",
    icon: icon,
  });
};

/**
 * @param {import('types/service/applications.js').Application} app
 */
const AppButton = app => Widget.Button({
  on_clicked: () => {
    app.launch();
    //Hyprland.sendMessage(`dispatch exec ${app.executable}`).then(e => print(e)).catch(logError);
    //app._frequency++;
    App.closeWindow("launcher");
  },
  attribute: {"app": app},
  tooltip_text: app.description,
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
            label: app.name,
            class_name: "app-name",
          }),
          Widget.Label({
            xalign: 0,
            max_width_chars: 40,
            truncate: "end",
            label: app.description,
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
const fzf = new Fzf(Applications.list.map(AppButton), {
  /**
   * @param {import('types/widgets/box').default} item
   * @returns {string}
   */
  selector: (item) => item.attribute.app.name,
  tiebreakers: [/** @param {FzfRestulAppButton} a, @param {FzfRestulAppButton} b*/(a, b) => b.item.attribute.app._frequency - a.item.attribute.app._frequency]
});

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
    const nameChars = entry.item.attribute.app.name.normalize().split("");
    // @ts-ignore
    entry.item.child.children[1].children[0].label = nameChars.map(/** @param {string} char, @param {number} i*/(char, i) => {
      if (entry.positions.has(i))
        return `<span foreground="${hexcolor}">${char}</span>`;
      else
        return char;
    }).join("");
  });
  results.children = fzfResults.map(e => e.item);
}

const SearchBox = () => {
  const results = Widget.Box({
    vertical: true,
    vexpand: true,
    class_name: "search-results",
  });
  const entry = Widget.Entry({class_name: "search-entry"})
    .on("notify::text", (entry) => searchApps(entry.text || "", results))
    .on("activate", () => {
      // @ts-ignore
      results.children[0]?.attribute.app.launch();
      App.closeWindow("launcher");
    })
    .hook(App, (_, name, visible) => {
      if (name !== "launcher" || !visible) return;
      entry.text = "";
      entry.grab_focus();
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

