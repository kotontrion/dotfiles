import icons from "../icons/index.js";
import Gdk from "gi://Gdk?version=3.0";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import App from "resource:///com/github/Aylur/ags/app.js";

/**
 * @param {string} name
 * @param icon
 * @param {function(import('types/widgets/button').default): void} command
 */
const SessionButton = (name, icon, command, props = {}) => {
  const buttonDescription = Widget.Revealer({
    vpack: "end",
    transition_duration: 200,
    transition: "slide_down",
    reveal_child: false,
    child: Widget.Label({
      class_name: "session-button-desc",
      label: name,
    }),
  });
  return Widget.Button({
    on_clicked: command,
    class_name: "session-button",
    child: Widget.Overlay({
      class_name: "session-button-box",
      child: Widget.Icon({
        class_name: "session-button-icon",
        icon: icon,
      }),
      overlays: [
        buttonDescription,
      ]
    }),
    on_hover: (button) => {
      const display = Gdk.Display.get_default();
      const cursor = Gdk.Cursor.new_from_name(display, "pointer");
      button.get_window().set_cursor(cursor);
      buttonDescription.reveal_child = true;
    },
    on_hover_lost: (button) => {
      const display = Gdk.Display.get_default();
      const cursor = Gdk.Cursor.new_from_name(display, "default");
      button.get_window().set_cursor(cursor);
      buttonDescription.reveal_child = false;
    },
    ...props,
  })
    .on("focus-in-event", (self) => {
      buttonDescription.reveal_child = true;
      self.toggleClassName("session-button-focused", true);
    })
    .on("focus-out-event", (self) => {
      buttonDescription.reveal_child = false;
      self.toggleClassName("session-button-focused", false);
    });
};

const SessionScreen = () => {
  // lock, logout, sleep
  const lockButton = SessionButton("Lock", icons.powermenu.lock, () => {
    App.closeWindow("session");
    execAsync("gtklock");
  });
  const logoutButton = SessionButton("Logout", icons.powermenu.logout, () => {
    App.closeWindow("session");
    execAsync(["bash", "-c", "loginctl terminate-user $USER"]);
  });
  const sleepButton = SessionButton("Sleep", icons.powermenu.sleep, () => {
    App.closeWindow("session");
    execAsync("systemctl suspend");
  });
  // hibernate, shutdown, reboot
  //const hibernateButton = SessionButton('Hibernate', 'downloading', () => { App.closeWindow('session'); execAsync('systemctl hibernate') });
  const shutdownButton = SessionButton("Shutdown", icons.powermenu.shutdown, () => {
    App.closeWindow("session");
    execAsync("systemctl poweroff");
  });
  const rebootButton = SessionButton("Reboot", icons.powermenu.reboot, () => {
    App.closeWindow("session");
    execAsync("systemctl reboot");
  });
  const cancelButton = SessionButton("Cancel", icons.powermenu.close, () => App.closeWindow("session"));
  return Widget.Box({
    class_name: "session-bg",
    vertical: true,
    children: [
      Widget.EventBox({
        on_primary_click: () => App.closeWindow("session"),
        on_secondary_click: () => App.closeWindow("session"),
        on_middle_click: () => App.closeWindow("session"),
      }),
      Widget.Box({
        hpack: "center",
        vpack: "center",
        vexpand: true,
        hexpand: true,
        vertical: true,
        children: [
          Widget.Box({
            vpack: "center",
            vertical: true,
            spacing: 15,
            children: [
              Widget.Box({
                hpack: "center",
                spacing: 15,
                children: [ // lock, logout, sleep
                  lockButton,
                  logoutButton,
                  sleepButton,
                ]
              }),
              Widget.Box({
                hpack: "center",
                spacing: 15,
                children: [ // hibernate, shutdown, reboot
                  //hibernateButton,
                  shutdownButton,
                  rebootButton,
                ]
              }),
              Widget.Box({
                hpack: "center",
                spacing: 15,
                children: [ // hibernate, shutdown, reboot
                  cancelButton,
                ]
              }),
            ]
          })
        ]
      })
    ],
  })
    .hook(App, (_b, name, visible) => {
      if (visible) lockButton.grab_focus(); // Lock is the default option
    });
};

export default () => Widget.Window({
  name: "session",
  popup: true,
  visible: false,
  focusable: true,
  exclusivity: "ignore",
  layer: "overlay",
  anchor: ["top", "bottom", "left", "right"],
  child: SessionScreen(),
});
