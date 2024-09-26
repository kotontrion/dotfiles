import AstalRiver from "gi://AstalRiver";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gdk from "gi://Gdk";

const river = AstalRiver.River.get_default();
const display = Gdk.Display.get_default();

function getRiverOutput(widget) {
  const gdkmonitor = display?.get_monitor_at_window(widget.get_window());
  const monitor_name = Utils.getMonitorName(gdkmonitor);
  return river.get_output(monitor_name);
}

function applyCssToWs(box) {
  const output = getRiverOutput(box);
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
const WorkspaceButton = (i, output) => Widget.EventBox({
  class_name: "ws-button",
  //NOTE: i would perfer shift/ctrl-click fo different behaviour
  //but i can't get the modifier keys without also havin keyboard focus
  on_primary_click_release: () => {
    output.focused_tags = 1 << (i-1);
  },
  on_secondary_click_release: () => {
    output.focused_tags = output.focused_tags ^ (1 << (i-1));
  },
  on_middle_click_release: () => {
    river.run_command_async(["set-view-tags", `${1 << (i-1)}`], null);
  },
  child: Widget.Label({
    label: `${i}`,
    class_name: "ws-button-label"
  })
});

export const Workspaces = () => {
  return Widget.EventBox({
    child: Widget.Box({
      class_name: "ws-container",
    }).on("realize", (self) => {
      self.children = Array.from({length: 9}, (_, i) => i + 1).map(i => WorkspaceButton(i, getRiverOutput(self)))
    })
      .hook(river, applyCssToWs, "changed")
  });
};


export default Workspaces;
