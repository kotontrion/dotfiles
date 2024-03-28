import icons from "../icons/index.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import Gtk from "gi://Gtk?version=3.0"
import Gio from "gi://Gio"
import GLib from "gi://GLib"

function parseEntry(entry) {
  return Object.fromEntries(entry.split("\n").slice(1).map((item) => item.split("=", 2)));
}

function buildSelection() {
  const selection = []
  const btn = new Gtk.RadioButton({
    child: Widget.Entry({
      className: "de-entry",
      onAccept: self => {
        self.get_ancestor(Gtk.Popover.$gtype).popdown()
      }
    }),
  })
  btn.connect("toggled", self => {
    if(self.active) self.child.grab_focus()
  })

  const wl_dir = Gio.File.new_for_path("/usr/share/wayland-sessions")
  let file_enumerator = wl_dir.enumerate_children("standard::*", Gio.FileQueryInfoFlags.NONE, null)
  let file = file_enumerator.next_file(null)
  while(file) {
    const entry = parseEntry(Utils.readFile(wl_dir.get_child(file.get_name()).get_path()))
    const widget = new Gtk.RadioButton({
      label: entry.Name,
      tooltip_text: entry.Comment,
      group: btn
    })
    
    selection.push({
      widget,
      entry
    })
    if(entry.Name === "Hyprland") widget.active = true
    file = file_enumerator.next_file(null)
  }

  selection.push({
    widget: btn
  })

  return selection
}

const DESelection = buildSelection()

export function get_selected_DE() {
  for (const item of DESelection) {
    if(!item.widget.active) continue;
    if(item.entry) return item.entry.Exec
    else return item.widget.child.text
  }
}

/**
 * @param {string} name
 * @param {string} icon
 * @param {function(import('types/widgets/button').default): void} command
 */
const SessionButton = (name, icon, command, props = {}) => {
  return Widget.Button({
    on_clicked: command,
    class_name: "session-button",
    cursor: "pointer",
    tooltip_markup: name,
    child: Widget.Icon({
      class_name: "session-button-icon",
      icon: icon,
    }),
    ...props,
  });
};

const SessionBox = () => {
  const sleepButton = SessionButton("Sleep", icons.powermenu.sleep, () => {
    execAsync("systemctl suspend");
  });
  const shutdownButton = SessionButton("Shutdown", icons.powermenu.shutdown, () => {
    execAsync("systemctl poweroff");
  });
  const rebootButton = SessionButton("Reboot", icons.powermenu.reboot, () => {
    execAsync("systemctl reboot");
  });
  const settingsButton = SessionButton("Settings", icons.header.settings, () => {
    popover.popup()
  });
  const popover = new Gtk.Popover({
    relative_to: settingsButton,
    constrain_to: Gtk.PopoverConstraint.WINDOW,
    child: Widget.Box({
      vertical: true,
      children: DESelection.map(sel => sel.widget)
    })
  })
  return Widget.Box({
    children: [
      sleepButton,
      shutdownButton,
      rebootButton,
      settingsButton
    ]
  });
};

export default SessionBox;
