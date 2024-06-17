import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gdk from "gi://Gdk?version=3.0";
import AstalTray from "gi://AstalTray";
const SystemTray = AstalTray.Tray.get_default();


const SysTrayItem = item => Widget.Button({
  class_name: "systray-item",
  attribute: item.create_menu(),
  child: Widget.Icon({
    hpack: "center",
    icon: Utils.watch(item.icon_pixbuf || item.icon_name || "image-missing"
      , item, () => item.icon_pixbuf || item.icon_name || "image-missing")
  }),
  tooltip_markup: Utils.bind(item, "tooltip_markup"),
  on_clicked: btn => btn.attribute?.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
  on_secondary_click: btn => btn.attribute?.popup_at_widget(btn, Gdk.Gravity.SOUTH, Gdk.Gravity.NORTH, null),
});

const Tray = () => Widget.Box({
  class_name: "systray-container spacing-5",
  attribute: {
    "items": new Map(),
    "onAdded": (box, id) => {
      if(!id) return;
      const item = SystemTray.get_item(id);
      // @ts-ignore
      if (box.attribute.items.has(id) || !item)
        return;
      const widget = SysTrayItem(item);
      box.attribute.items.set(id, widget);
      box.pack_start(widget, false, false, 0);
      box.show_all();
    },
    "onRemoved": (box, id) => {
      if (!box.attribute.items.has(id))
        return;
      box.attribute.items.get(id).destroy();
      box.attribute.items.delete(id);
    }
  },
  setup: self => {
    SystemTray.get_items().forEach(item => self.attribute.onAdded(self, item.item_id));
  }
})
  .hook(SystemTray, (box, id) => box.attribute.onAdded(box, id), "item_added")
  .hook(SystemTray, (box, id) => box.attribute.onRemoved(box, id), "item_removed");


export default Tray;
