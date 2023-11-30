import {exec} from 'resource:///com/github/Aylur/ags/utils.js'
import Bar from './modules/bar/index.js'
import {
    CornerTopleft,
    CornerTopright,
    CornerBottomright,
    CornerBottomleft
} from './modules/roundedCorner/index.js'
import { IndicatorWidget } from "./modules/indicator/index.js";
import Sidepanel from './modules/sidepanel/index.js'
import Launcher from './modules/applauncher/index.js'
import PowerMenu from './modules/powermenu/index.js'
import { PopupNotifications } from './modules/notifications/index.js'
import DirectoryMonitorService from './directoryMonitorService.js'

import App from 'resource:///com/github/Aylur/ags/app.js'
import Battery from 'resource:///com/github/Aylur/ags/service/battery.js'
import Applications from 'resource:///com/github/Aylur/ags/service/applications.js'
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js'
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js'
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import Mpris from 'resource:///com/github/Aylur/ags/service/mpris.js'
import Network from 'resource:///com/github/Aylur/ags/service/network.js'
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js'
import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js'

//export service for use in ags -r
globalThis.Battery = Battery
globalThis.App = App
globalThis.Applications = Applications
globalThis.Audio = Audio
globalThis.Bluetooth = Bluetooth
globalThis.Hyprland = Hyprland
globalThis.Mpris = Mpris
globalThis.Network = Network
globalThis.Notifications = Notifications
globalThis.SystemTray = SystemTray

exec(`sassc ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);

const applyScss = () => {
    // Compile scss
    exec(`sassc ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
    console.log('Scss compiled');

    // Apply compiled css
    App.resetCss();
    App.applyCss(`${App.configDir}/style.css`);
    console.log('Compiled css applied');
};

DirectoryMonitorService.connect('changed', () => applyScss())

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

