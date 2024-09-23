import Widget from "resource:///com/github/Aylur/ags/widget.js";
import AstalRiver from "gi://AstalRiver";

const river = AstalRiver.River.get_default();

const FocusedTitle = () => Widget.EventBox({
  class_name: "title-container",
  child: Widget.Box({
    class_name: "title-box",
    children: [
      Widget.Label({
        class_name: "title-title",
        truncate: "end",
        max_width_chars: 22,
        label: Utils.bind(river, "focused-view").as(v => v || "Desktop")
      })
    ]
  })
});

export default FocusedTitle;
