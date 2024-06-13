
import GLib from "gi://GLib";

let Workspaces;
let hideEmptyWorkspaces;

switch(GLib.getenv("XDG_CURRENT_DESKTOP")) {
  case "Hyprland":
    const hl = (await import("./hyprland.js"));
    Workspaces = hl.Workspaces;
    hideEmptyWorkspaces = hl.hideEmptyWorkspaces;
    break;
  case "river":
    const riv = (await import("./river.js"));
    Workspaces = riv.Workspaces;
    hideEmptyWorkspaces = Variable(false);
    break;

}

export {
  Workspaces,
  hideEmptyWorkspaces
};
export default Workspaces;


