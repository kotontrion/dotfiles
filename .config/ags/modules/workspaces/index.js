
import Config from "../config/index.js";

let Workspaces;
let hideEmptyWorkspaces;

switch(Config.wm) {
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
  default:
    console.warn("could not determine compositor. Make sure the XDG_CURRENT_DESKTOP environment variable is set correctly.");
    Workspaces = () => Widget.Box();
    hideEmptyWorkspaces = Variable(false);
    break;
}

export {
  Workspaces,
  hideEmptyWorkspaces
};
export default Workspaces;


