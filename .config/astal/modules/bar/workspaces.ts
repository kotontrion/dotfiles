const Hyprland = await Service.import("hyprland");

const WSButton = (wsID: number) => Component.Button({
  cssClasses: ["ws-button"],
  onClick: () => Hyprland.messageAsync(`dispatch workspace ${wsID}`).catch(logError),
  child: Component.Label({
    label: `${wsID}`,
    cssClasses: ["ws-button-label"]
  })
}).hook(Hyprland.active.workspace, button => button.toggleCssClass("active", Hyprland.active.workspace.id == wsID))

export default () => Component.Box({
  cssClasses: ["ws-container"],
  children: Array.from({length: 10}, (_, i) => i+1).map(WSButton)
}).hook(Hyprland, (box) => {
    box.children.forEach((button, i) => {
      const ws = Hyprland.getWorkspace(i + 1);
      const ws_before = Hyprland.getWorkspace(i);
      const ws_after = Hyprland.getWorkspace(i + 2);
      button.toggleCssClass("occupied", (ws?.windows ?? 0) > 0);
      button.toggleCssClass("occupied-left", !ws_before || ws_before?.windows <= 0);
      button.toggleCssClass("occupied-right", !ws_after || ws_after?.windows <= 0);
    });
  }, "notify::workspaces")
