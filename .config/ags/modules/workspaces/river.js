import AstalRiver from "gi://AstalRiver";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gdk from "gi://Gdk";

const river = AstalRiver.River.get_default();
const display = Gdk.Display.get_default();

function applyCssToWs(box, river) {
  const monitor_name = Utils.getMonitorName(display.get_monitor_at_window(box.get_window()));
  const output = river.get_output(monitor_name);
  if(output == null) return;
  const focused = output.focused_tags;
  const occupied = output.occupied_tags;
  box.children.forEach((button, i) => {
    button.toggleClassName("occupied", occupied & (1 << (i)));
    button.toggleClassName("occupied-left", i == 0 || !(occupied & (1 << (i-1))));
    button.toggleClassName("occupied-right", i == 8 || !(occupied & (1 << (i+1))));
    button.toggleClassName("active", focused & (1 << (i)));
    button.toggleClassName("active-left", i == 0 || !(focused & (1 << (i-1))));
    button.toggleClassName("active-right", i == 8 || !(focused & (1 << (i+1))));
  });
}

/** @param {number} i */
const WorkspaceButton = (i) => Widget.EventBox({
  class_name: "ws-button",
  // on_primary_click_release: () => Hyprland.messageAsync(`dispatch workspace ${i}`)
  // .catch(logError),
  child: Widget.Label({
    label: `${i}`,
    class_name: "ws-button-label"
  })
});

export const Workspaces = () => {
  return Widget.EventBox({
    child: Widget.Box({
      class_name: "ws-container",
      children: Array.from({length: 9}, (_, i) => i + 1).map(i => WorkspaceButton(i)),
    })
      .hook(river, (box) => applyCssToWs(box, river), "changed")
  });
};


export default Workspaces;
