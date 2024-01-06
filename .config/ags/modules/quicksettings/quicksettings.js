import Widget from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons/index.js";
import MprisPlayerList from "../mpris/index.js";
import AudioContent from "../audio/index.js";
import AIContent, {ChatGPT} from "../chatGPT/index.js";
import Menu from "./menu.js";
import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import NotificationList from "../notifications/index.js";
import WifiList from "../network/index.js";
import BluetoothList from "../bluetooth/index.js";
// @ts-ignore
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";
import { Switch, Terminal } from "../widgets/widgets.js";
import Cava from "../cava/cava.js";
import GLib from "gi://GLib";
import Gtk from "gi://Gtk";
import Vte from "gi://Vte";

/**
 * @param {import('gi://Gtk').Gtk.Widget} content
 */
const QuickSettingsPage = content => Widget.Scrollable({
  class_name: "qs-page",
  vexpand: true,
  hexpand: true,
  hscroll: "never",
  child: content
});

/**
 * @returns {import('gi://Gtk').Gtk.Widget}
 */
const QSNotification = () => QuickSettingsPage(Menu({
  title: "Notifications",
  icon: icons.notifications.chat,
  content: NotificationList(),
  headerChild: Widget.Box({
    spacing: 5,
    children: [
      Widget.Button({
        on_clicked: () => Notifications.clear(),
        child: Widget.Box({
          children: [
            Widget.Label("Clear "),
            Widget.Icon(icons.trash.empty)
          ]
        }),
        visible: Notifications.bind("notifications").transform(notifs => notifs.length > 0)
      }),
      Switch({})
        .hook(Notifications, (sw) => {
          if (sw.active === Notifications.dnd)
            sw.active = !Notifications.dnd;
        })
        .on("notify::active", ({active}) => {
          if (active === Notifications.dnd)
            Notifications.dnd = !active;
        })
    ]
  })
}));

/**
 * @returns {import('gi://Gtk').Gtk.Widget}
 */
const QSWifi = () => QuickSettingsPage(Menu({
  title: "Wi-Fi",
  icon: "network-wireless-signal-good-symbolic",
  content: WifiList(),
  headerChild: Switch({})
    .hook(Network, (sw) => {
      if (sw.active !== Network.wifi.enabled)
        sw.active = Network.wifi.enabled;
    })
    .on("notify::active", ({active}) => {
      if (active !== Network.wifi.enabled)
        Network.wifi.enabled = active;
    })
}));

/**
 * @returns {import('gi://Gtk').Gtk.Widget}
 */
const QSBluetooth = () => QuickSettingsPage(
  Menu({
    title: "Bluetooth",
    icon: icons.bluetooth.enabled,
    content: BluetoothList(),
    headerChild: Switch({})
      .hook(Bluetooth, (sw) => {
        if (sw.active !== Bluetooth.enabled)
          sw.active = Bluetooth.enabled;
      })
      .on("notify::active", ({active}) => {
        if (active !== Bluetooth.enabled)
          Bluetooth.enabled = active;
      })
  }));

/**
 * @returns {import('gi://Gtk').Gtk.Widget}
 */
const QSAudio = () => QuickSettingsPage(
  Menu({
    title: "Audio",
    icon: icons.audio.volume.high,
    content: AudioContent()
  })
);

/**
 * @returns {import('gi://Gtk').Gtk.Widget}
 */
const QSMpris = () => {
  const terminal = Terminal({
    class_name: "terminal",
    name: "lyrics-terminal",
  });
  // HACK: style context is only accessable after the widget was added to the
  // hierachy, so i do this to set the color once.
  const connId = terminal.connect("draw", () => {
    terminal.disconnect(connId);
    const bgCol = terminal.get_style_context().get_property("background-color", Gtk.StateFlags.NORMAL);
    terminal.set_color_background(bgCol);
  });
  // TODO: set these colors via css
  terminal.spawn_async(
    Vte.PtyFlags.DEFAULT,
    GLib.get_home_dir(),
    [
      "sptlrx",
      "--current",
      "#cba6f7,bold",
      "--before",
      "#3e3e4e,faint,italic",
      "--after",
      "#a6adc8,faint",
    ],
    [],
    GLib.SpawnFlags.SEARCH_PATH,
    null,
    GLib.MAXINT32,
    null,
    null,
  );
  return QuickSettingsPage(
    Widget.Box({
      vertical: true,
      children: [
        Menu({
          title: "Player",
          icon: icons.mpris.fallback,
          content: Widget.Box({
            vertical: true,
            spacing: 10,
            children: [
              MprisPlayerList(),
              terminal,
              Widget.Box({vexpand: true}),
            ]
          })
        }),
        Cava({
          bars: 30,
          barHeight: 150,
          smooth: true,
        })
      ]
    })
  );
};

/**
 * @returns {import('gi://Gtk').Gtk.Widget}
 */
const QSChatGPT = () => QuickSettingsPage(
  Menu({
    title: "ChatGPT",
    icon: icons.ai,
    content: AIContent(),
    headerChild: Widget.Button({
      on_clicked: () => ChatGPT.clear(),
      child: Widget.Box({
        children: [
          Widget.Label("Clear "),
          Widget.Icon(icons.trash.empty),
        ]
      }),
    }),
  })
);

/**
   * @returns {[string, import('gi://Gtk').Gtk.Widget][]}
   */
export const Quicksettings = () => {
  /** @type [string, import('gi://Gtk').Gtk.Widget][] */
  const items = [
    ["Notifications", QSNotification()],
    ["Wifi", QSWifi()],
    ["Bluetooth", QSBluetooth()],
    ["Audio", QSAudio()],
    ["Mpris", QSMpris()],
    ["ChatGPT", QSChatGPT()],
  ];
  return items;
};

export default Quicksettings;
