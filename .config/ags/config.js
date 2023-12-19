import {exec} from 'resource:///com/github/Aylur/ags/utils.js'
import Bar from './modules/bar/index.js'
import {
  CornerTopleft,
  CornerTopright,
  CornerBottomright,
  CornerBottomleft
} from './modules/roundedCorner/index.js'
import {IndicatorWidget} from "./modules/indicator/index.js";
import Sidepanel from './modules/sidepanel/index.js'
import Launcher from './modules/applauncher/index.js'
import PowerMenu from './modules/powermenu/index.js'
import {PopupNotifications} from './modules/notifications/index.js'
import DirectoryMonitorService from './directoryMonitorService.js'

import App from 'resource:///com/github/Aylur/ags/app.js'

const applyScss = () => {
  // Compile scss
  exec(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
  exec(`sass ${App.configDir}/scss/highlight.scss ${App.configDir}/highlight.css`);
  console.log('Scss compiled');

  // Apply compiled css
  App.resetCss();
  App.applyCss(`${App.configDir}/style.css`);
  console.log('Compiled css applied');
};

DirectoryMonitorService.connect('changed', () => applyScss())
applyScss()

export default {
  style: `${App.configDir}/style.css`,
  closeWindowDelay: {
    sideright: 350,
    launcher: 350,
    bar0: 350,
  },
  windows: [
    Bar(0),
    CornerTopleft(),
    CornerTopright(),
    CornerBottomleft(),
    CornerBottomright(),
    IndicatorWidget(),
    Sidepanel(),
    Launcher(),
    PowerMenu(),
    PopupNotifications(),
  ],
}

