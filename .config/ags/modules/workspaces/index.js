import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gdk from "gi://Gdk";

export const hideEmptyWorkspaces = Variable(false);

function wsVisible(i, button) {
  const display = Gdk.Display.get_default();
  const hlMonID = Hyprland.getWorkspace(i)?.monitorID;
  if(hlMonID !== undefined) {
    const hlMon = JSON.parse(Hyprland.message("j/monitors")).find(mon => mon.id === hlMonID);
    const gdkMon = display?.get_monitor_at_window(button.get_window());
    return display?.get_monitor_at_point(hlMon.x, hlMon.y) === gdkMon;
  }
  return false;
}

function applyCssToWs(box) {
  box.children.forEach((button, i) => {
    const ws = Hyprland.getWorkspace(i + 1);
    const ws_before = Hyprland.getWorkspace(i);
    const ws_after = Hyprland.getWorkspace(i + 2);
    button.toggleClassName("occupied", ws?.windows > 0 || hideEmptyWorkspaces.value);
    const occLeft = hideEmptyWorkspaces.value
      ? box.children.findIndex(button => button.visible) === i
      : (!ws_before || ws_before?.windows <= 0);
    const occRight = hideEmptyWorkspaces.value
      ? box.children.reverse().findIndex(button => button.visible) === box .children.length - i - 1
      : !ws_after || ws_after?.windows <= 0;
    button.toggleClassName("occupied-left", occLeft);
    button.toggleClassName("occupied-right", occRight);
  });
}

/** @param {number} i */
const WorkspaceButton = (i) => Widget.EventBox({
  class_name: "ws-button",
  on_primary_click_release: () => Hyprland.messageAsync(`dispatch workspace ${i}`)
    .catch(logError),
  child: Widget.Label({
    label: `${i}`,
    class_name: "ws-button-label"
  })
})
  .hook(hideEmptyWorkspaces, (button) => {
    button.visible = !hideEmptyWorkspaces.value || wsVisible(i, button);
  })
  .hook(Hyprland, (button) => {
    button.visible = !hideEmptyWorkspaces.value || wsVisible(i, button);
  }, "notify::workspaces")
  .hook(Hyprland.active.workspace, (button) => {
    const active = JSON.parse(Hyprland.message("j/monitors")).map(mon => mon.activeWorkspace.id).includes(i) && wsVisible(i, button);

    button.toggleClassName("active", active);
  });

export const Workspaces = () => Widget.EventBox({
  child: Widget.Box({
    class_name: "ws-container",
    children: Array.from({length: 10}, (_, i) => i + 1).map(i => WorkspaceButton(i)),
  })
    .hook(Hyprland, applyCssToWs, "notify::workspaces")
    .hook(hideEmptyWorkspaces, applyCssToWs)
});


export default Workspaces;
