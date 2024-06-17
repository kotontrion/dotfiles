import Gdk from "gi://Gdk?version=3.0";
import {Binding} from "resource:///com/github/Aylur/ags/service.js";

const display = Gdk.Display.get_default();
function getMonitorName(gdkmonitor) {
  const screen = display.get_default_screen();
  for(let i = 0; i < display.get_n_monitors(); ++i) {
    if(gdkmonitor === display.get_monitor(i))
      return screen.get_monitor_plug_name(i);
  }
}

function rgbaToHexString(rgba) {
  const red = Math.max(0, Math.min(1, rgba.red));
  const green = Math.max(0, Math.min(1, rgba.green));
  const blue = Math.max(0, Math.min(1, rgba.blue));
  const alpha = Math.max(0, Math.min(1, rgba.alpha));

  const redHex = ("00" + Math.round(red * 255).toString(16)).slice(-2);
  const greenHex = ("00" + Math.round(green * 255).toString(16)).slice(-2);
  const blueHex = ("00" + Math.round(blue * 255).toString(16)).slice(-2);
  const alphaHex = ("00" + Math.round(alpha * 255).toString(16)).slice(-2);

  return `#${redHex}${greenHex}${blueHex}${alphaHex}`;
}

function bind(obj, prop) {
  return new Binding(obj, prop);
}

Utils.getMonitorName = getMonitorName;
Utils.rgbaToHexString = rgbaToHexString;
Utils.bind = bind;
