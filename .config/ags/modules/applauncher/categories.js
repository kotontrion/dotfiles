import Applications from "resource:///com/github/Aylur/ags/service/applications.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import { AppIcon } from "./search.js";

const mainCategories = [
  "AudioVideo",
  "Audio",
  "Video",
  "Development",
  "Education",
  "Game",
  "Graphics",
  "Network",
  "Office",
  "Science",
  "Settings",
  "System",
  "Utility"
];

/**
 * @param {import('types/service/applications').Application} app
 */
const getCategories = app => {
  /** @param {string} cat */
  const substitute = cat => {
    const map = {
      "Audio": "Multimedia",
      "AudioVideo": "Multimedia",
      "Video": "Multimedia",
      "Graphics": "Multimedia",
      "Science": "Education",
      "Settings": "System",
    };
    return map[cat] ?? cat;
  };
  return app.app.get_categories()
    ?.split(";")
    .filter(c => mainCategories.includes(c))
    .map(substitute)
    .filter((c, i, arr) => i === arr.indexOf(c)) ?? [];
};

const CategoryList = () => {

  const catsMap = new Map();

  Applications.list.forEach(app => {
    const cats = getCategories(app);
    cats.forEach(cat => {
      if(!catsMap.has(cat)) catsMap.set(cat, []);
      catsMap.get(cat).push(app);
    });
  });
  return catsMap;
};

/**
 * @param {import('types/service/applications.js').Application} app
 */
const AppButton = app => Widget.Button({
  on_clicked: () => {
    app.launch();
    App.closeWindow("launcher");
  },
  tooltip_text: app.description,
  class_name: "app-button",
  child: Widget.Box({
    vertical: true,
    children: [
      AppIcon(app),
      Widget.Label({
        max_width_chars: 8,
        truncate: "end",
        label: app.name,
        vpack: "center",
        class_name: "app-name",
      }),
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
 * @param {import('types/service/applications').Application[]} list
 * @returns {import('types/widgets/box').default}
 */
const CategoryListWidget = list => {
  const flowBox = Widget.FlowBox({});
  list.forEach(app => {
    flowBox.add(AppButton(app));
  });
  return Widget.Box({
    class_name: "launcher-category",
    children: [
      Widget.Scrollable({
        hscroll: "never",
        vscroll: "automatic",
        hexpand: true,
        child: Widget.Box({
          vertical: true,
          children: [
            flowBox,
            Widget.Box({vexpand: true})
          ]
        })
      })
    ]
  });
};

const Categories = () => {
  return Object.fromEntries([...CategoryList()].map(([key, val]) => [key, CategoryListWidget(val)]));
};

export default Categories;



