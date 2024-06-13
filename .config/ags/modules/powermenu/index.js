import icons from "../icons/index.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import RoundedCorner, { RoundedAngleEnd } from "../roundedCorner/index.js";

/**
 * @param {string} name
 * @param {string} icon
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
    cursor: "pointer",
    on_hover: self => {
      buttonDescription.reveal_child = true;
      self.toggleClassName("session-button-focused", true);
    },
    on_hover_lost: self => {
      buttonDescription.reveal_child = false;
      self.toggleClassName("session-button-focused", false);
    },
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
    ...props,
  });
  // .on("focus-in-event", (self) => {
  //   buttonDescription.reveal_child = true;
  //   self.toggleClassName("session-button-focused", true);
  // })
  // .on("focus-out-event", (self) => {
  //   buttonDescription.reveal_child = false;
  //   self.toggleClassName("session-button-focused", false);
  // });
};

const SessionBox = () => {
  const lockButton = SessionButton("Lock", icons.powermenu.lock, () => {
    App.closeWindow("session");
    execAsync(["bash", "-c", `ags -b lockscreen -c ${App.configDir}/lockscreen.js`]);
  });
  const logoutButton = SessionButton("Logout", icons.powermenu.logout, () => {
    App.closeWindow("session");
    execAsync(["bash", "-c", "loginctl terminate-user $USER"]);
  });
  const sleepButton = SessionButton("Sleep", icons.powermenu.sleep, () => {
    App.closeWindow("session");
    execAsync("systemctl suspend");
  });
  const shutdownButton = SessionButton("Shutdown", icons.powermenu.shutdown, () => {
    App.closeWindow("session");
    execAsync("systemctl poweroff");
  });
  const rebootButton = SessionButton("Reboot", icons.powermenu.reboot, () => {
    App.closeWindow("session");
    execAsync("systemctl reboot");
  });
  return Widget.Box({
    children: [
      lockButton,
      logoutButton,
      sleepButton,
      shutdownButton,
      rebootButton,
    ]
  });
};

const SessionRevealer = () => Widget.Revealer({
  transition: "slide_down",
  reveal_child: false,
  child: Widget.Box({
    vertical: true,
    children: [
      Widget.Box({
        children: [
          SessionBox(),
          RoundedAngleEnd("topright", {class_name: "angle"})
        ]
      }),
      RoundedCorner("topleft", {class_name: "corner"})
    ]
  })
})
  .hook(App, (rev, windowName, visible) => {
    if(windowName === "session")
      rev.reveal_child = visible;
  }, "window-toggled");


export default () => Widget.Window({
  name: "session",
  class_name: "session",
  layer: "overlay",
  visible: false,
  anchor: ["top", "left"],
  child: Widget.Box({
    vertical: true,
    css: "min-height: 2px;",
    children: [
      SessionRevealer(),
    ]
  }),
});

