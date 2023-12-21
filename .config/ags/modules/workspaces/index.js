import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

const WorkspaceButton = (i) => Widget.EventBox({
  class_name: "ws-button",
  on_primary_click_release: () => Hyprland.sendMessage(`dispatch workspace ${i}`),
  child: Widget.Label({
    label: `${i}`,
    class_name: "ws-button-label"
  })
})
  .hook(Hyprland.active.workspace, (button) => {
    button.toggleClassName("active", Hyprland.active.workspace.id === i);
  });

const Workspaces = () => Widget.EventBox({
  child: Widget.Box({
    class_name: "ws-container",
    children: Array.from({length: 10}, (_, i) => i + 1).map(i => WorkspaceButton(i)),
  })
    .hook(Hyprland, (box) => {
      box.children.forEach((button, i) => {
        const ws = Hyprland.getWorkspace(i + 1);
        const ws_before = Hyprland.getWorkspace(i);
        const ws_after = Hyprland.getWorkspace(i + 2);
        //toggleClassName is not part od Gtk.Widget, but we know box.children only includes AgsWidgets
        //@ts-ignore
        button.toggleClassName("occupied", ws?.windows > 0);
        //@ts-ignore
        button.toggleClassName("occupied-left", !ws_before || ws_before?.windows <= 0);
        //@ts-ignore
        button.toggleClassName("occupied-right", !ws_after || ws_after?.windows <= 0);
      });
    }, "notify::workspaces")
});


export default Workspaces;
