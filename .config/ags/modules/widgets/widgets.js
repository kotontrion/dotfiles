import Gtk from "gi://Gtk?version=3.0";
import GObject from "gi://GObject";

if(!GObject.type_from_name("AgsTextView"))
  Widget.TextView = Widget.subclass(Gtk.TextView, "AgsTextView");

if(!GObject.type_from_name("AgsComboBoxText"))
  Widget.ComboBoxText = Widget.subclass(Gtk.ComboBoxText, "AgsComboBoxText");

if(!GObject.type_from_name("AgsExpander"))
  Widget.Expander = Widget.subclass(Gtk.Expander, "AgsExpander");
