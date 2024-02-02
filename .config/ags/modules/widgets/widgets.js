import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk?version=3.0";

const Switch =  Widget.subclass(Gtk.Switch, "AgsSwitch");
const TextView =  Widget.subclass(Gtk.TextView, "AgsTextView");

export {
  Switch,
  TextView,
};
