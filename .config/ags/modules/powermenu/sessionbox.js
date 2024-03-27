import icons from "../icons/index.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";

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
  return Widget.Box({
    children: [
      sleepButton,
      shutdownButton,
      rebootButton,
    ]
  });
};

export default SessionBox;
