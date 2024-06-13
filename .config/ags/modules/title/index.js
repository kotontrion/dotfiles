
import GLib from "gi://GLib";

let FocusedTitle;

switch(GLib.getenv("XDG_CURRENT_DESKTOP")) {
  case "Hyprland":
    const hl = (await import("./hyprland.js"));
    FocusedTitle = hl.default;
    break;
  case "river":
    const riv = (await import("./river.js"));
    FocusedTitle = riv.default;
    break;

}

export {
  FocusedTitle
};
export default FocusedTitle;
