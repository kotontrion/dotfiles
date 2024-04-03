import icons from "../icons/index.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import { RoundedAngleEnd, RoundedCorner } from "../roundedCorner/index.js";

const sessionBoxTooltipText = Variable({text: "", visible: false});

export const SessionBoxTooltip = () => Widget.Box({
  vpack: "start",
  hpack: "start",
  children: [
    Widget.Revealer({
      reveal_child: sessionBoxTooltipText.bind().as(v => v.visible),
      child: Widget.Box({
        vertical: true,
        children: [
          Widget.Box({
            children: [
              Widget.Label({
                class_name: "tooltip",
                label: sessionBoxTooltipText.bind().as(v => v.text)
              }),
              RoundedAngleEnd("topright", {class_name: "angle"})
            ]
          }),
          RoundedCorner("topleft", {class_name: "corner"}),
        ]
      })
    })
  ]
});

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
    child: Widget.Icon({
      class_name: "session-button-icon",
      icon: icon,
    }),
    onHover: () => {
      sessionBoxTooltipText.setValue({text: name, visible: true});
    },
    onHoverLost: () => {
      sessionBoxTooltipText.setValue({text: name, visible: false});
    },
    ...props,
  });
};

const SessionBox = () => {
  const logoutButton = SessionButton("Logout", icons.powermenu.logout, () => {
    execAsync(["bash", "-c", "loginctl terminate-user $USER"]);
  });
  const sleepButton = SessionButton("Sleep", icons.powermenu.sleep, () => {
    execAsync("systemctl suspend");
  });
  const shutdownButton = SessionButton("Shutdown", icons.powermenu.shutdown, () => {
    execAsync("systemctl poweroff");
  });
  const rebootButton = SessionButton("Reboot", icons.powermenu.reboot, () => {
    execAsync("systemctl reboot");
  });
  return Widget.Box({
    children: [
      logoutButton,
      sleepButton,
      shutdownButton,
      rebootButton,
    ]
  });
};

export default SessionBox;
