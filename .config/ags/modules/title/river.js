import Widget from "resource:///com/github/Aylur/ags/widget.js";
import AstalRiver from "gi://AstalRiver";

const river = AstalRiver.River.get_default();

const FocusedTitle = () => Widget.EventBox({
  class_name: "title-container",
  child: Widget.Box({
    class_name: "title-box",
    children: [
      Widget.Label({
        hpack: "end",
        class_name: "title-title",
        truncate: "end",
        max_width_chars: 22,
      }).hook(river, (self) => {
        self.label = river.focused_view || "Desktop";
      }, "notify::focused-view"),
    ]
  })
});

export default FocusedTitle;
