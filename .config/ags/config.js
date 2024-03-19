#!/usr/bin/ags -c

import {exec, idle, monitorFile} from "resource:///com/github/Aylur/ags/utils.js";
import Bar from "./modules/bar/index.js";
import {
  CornerTopleft,
  CornerTopright,
  CornerBottomright,
  CornerBottomleft
} from "./modules/roundedCorner/index.js";
import {IndicatorWidget} from "./modules/indicator/index.js";
import Quicksettings from "./modules/quicksettings/index.js";
import Launcher from "./modules/applauncher/index.js";
import PowerMenu from "./modules/powermenu/index.js";
import {PopupNotifications} from "./modules/notifications/index.js";
import App from "resource:///com/github/Aylur/ags/app.js";
import Gio from "gi://Gio";
import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";


const applyScss = () => {
  // Compile scss
  exec(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
  exec(`sass ${App.configDir}/scss/highlight.scss ${App.configDir}/highlight.css`);
  console.log("Scss compiled");

  // Apply compiled css
  App.resetCss();
  App.applyCss(`${App.configDir}/style.css`);
  console.log("Compiled css applied");
};

monitorFile(`${App.configDir}/scss`, (_, eventType) => {
  if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
    applyScss();
  }
});

applyScss();

/**
 * @param {import('types/@girs/gtk-3.0/gtk-3.0').Gtk.Window[]} windows
  */
function addWindows(windows) {
  windows.forEach(win => App.addWindow(win));
}

idle(() => addWindows([
  Bar(0),
  CornerTopleft(),
  CornerTopright(),
  CornerBottomleft(),
  CornerBottomright(),
  IndicatorWidget(),
  Quicksettings(),
  Launcher(),
  PowerMenu(),
  PopupNotifications(),
]));


//config
Notifications.popupTimeout = 5000;
Notifications.forceTimeout = true;


App.config({
  style: "./style.css",
  icons: "./modules/icons",
  closeWindowDelay: {
    sideright: 350,
    quicksettings: 500,
    launcher: 500,
    bar0: 350,
    session: 350,
  },
});

