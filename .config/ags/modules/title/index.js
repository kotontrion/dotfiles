
import Config from "../config/index.js";

let FocusedTitle;

switch(Config.wm) {
  case "Hyprland":
    const hl = (await import("./hyprland.js"));
    FocusedTitle = hl.default;
    break;
  case "river":
    const riv = (await import("./river.js"));
    FocusedTitle = riv.default;
    break;
  default:
    console.warn("could not determine compositor. Make sure the XDG_CURRENT_DESKTOP environment variable is set correctly.");
    FocusedTitle = () => Widget.Box();
    break;

}

export {
  FocusedTitle
};
export default FocusedTitle;
