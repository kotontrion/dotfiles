import PopupWindow from "../popupwindow/index.js";
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from "resource:///com/github/Aylur/ags/app.js"
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import QuickSettings, {QSState} from './quicksettings.js'
import Hyprland from "resource:///com/github/Aylur/ags/service/hyprland.js";
import icons from "../icons/index.js";
import Calendar from './calendar/index.js'
import Cava from '../cava/index.js'
import Gdk from "gi://Gdk";
import {WeatherWidget} from "../weather/index.js";

const ModuleReloadIcon = (props = {}) => Widget.Button({
  ...props,
  class_name: 'sidebar-iconbutton',
  tooltip_text: 'Reload Hyprland',
  on_clicked: () => {
    Hyprland.sendMessage('reload');
    App.toggleWindow('sideright');
  },
  child: Widget.Icon({icon: icons.header.refresh})
})

const ModuleSettingsIcon = (props = {}) => Widget.Button({
  ...props,
  class_name: 'sidebar-iconbutton',
  tooltip_text: 'Open Settings',
  on_clicked: () => {
    execAsync(['bash', '-c', 'XDG_CURRENT_DESKTOP="gnome" gnome-control-center']);
    App.toggleWindow('sideright');
  },
  child: Widget.Icon({
    icon: icons.header.settings
  })
})

const ModulePowerIcon = (props = {}) => Widget.Button({
  ...props,
  class_name: 'txt-small sidebar-iconbutton',
  tooltip_text: 'Session',
  on_clicked: () => {
    App.toggleWindow('session');
    App.closeWindow('sideright');
  },
  child: Widget.Icon({
    icon: icons.header.power
  })
})

const Header = () => Widget.Box({
  spacing: 8,
  children: [
    WeatherWidget(),
    Widget.Label()
      .poll(5000, label => {
        execAsync([`date`, "+%H:%M"]).then(timeString => {
          label.label = `• ${timeString}`;
        }).catch(print);
      }),
    Widget.Label({hpack: 'center'})
      .poll(5000, label => {
        execAsync(['bash', '-c', `uptime -p | sed -e 's/up //;s/ hours,/h/;s/ minutes*/m/'`]).then(upTimeString => {
          label.label = `• uptime ${upTimeString}`;
        }).catch(print);
      }),
    Widget.Box({hexpand: true}),
    ModuleReloadIcon({hpack: 'end'}),
    ModuleSettingsIcon({hpack: 'end'}),
    ModulePowerIcon({hpack: 'end'}),
  ]
})

let i = 0;

const SidebarRight = () => Widget.Box({
  // vertical: true,
  vexpand: true,
  hexpand: true,
  children: [
    Widget.EventBox({
      on_primary_click: () => App.closeWindow('sideright'),
      on_secondary_click: () => App.closeWindow('sideright'),
      on_middle_click: () => App.closeWindow('sideright'),
    }),
    Widget.Box({
      vertical: true,
      vexpand: true,
      spacing: 8,
      class_name: 'sidebar-right',
      children: [
        Header(),
        QuickSettings(),
        // Cava({barHeight: 200, smooth: true}),
        // Calendar requires ags to be built from my EDS-integration branch
        // Calendar(),
      ],
    }),
  ]
});

export default () => PopupWindow({
  anchor: ['right', 'top', 'bottom'],
  name: 'sideright',
  child: SidebarRight(),
})
  .on('key-press-event', (_, event) => {
    const keyval = event.get_keyval()[1]
    if (
      (keyval === Gdk.KEY_n)
      && ((event.get_state()[1]) & Gdk.ModifierType.CONTROL_MASK) > 0
    )
      QSState.next()
    if (
      (keyval === Gdk.KEY_p)
      && ((event.get_state()[1]) & Gdk.ModifierType.CONTROL_MASK) > 0
    )
      QSState.prev()
  })
