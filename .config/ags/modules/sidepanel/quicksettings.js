import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import App from 'resource:///com/github/Aylur/ags/app.js'
import icons from '../icons/index.js'
import MprisPlayerList from '../mpris/index.js'
import AudioContent from '../audio/index.js'
import Menu from "./menu.js";
import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import NotificationList from '../notifications/index.js'
import WifiList from '../network/index.js'
import BluetoothList from '../bluetooth/index.js'
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js'
import Network from "resource:///com/github/Aylur/ags/service/network.js";

const QuickSettingsButton = ({icon, title, stack, ...props}) => Widget.Button({
    child: Widget.Icon(icon),
    class_name: "qs-button",
    ...props,
    on_clicked: (button) => {
        stack.visible_child_name = title
    },
    connections: [
      [stack, (button, name) => {
        button.toggleClassName('active', title === stack.visible_child_name);
      }, 'notify::visible-child-name'] 
    ]
})
const QuickSettingsHeader = (stack) => Widget.Box({
    homogeneous: true,
    spacing: 5,
    class_name: "qs-header",
    children: [
        QuickSettingsButton({
            icon: icons.notifications.chat,
            title: "notifications",
            class_name: 'qs-button active',
            tooltip_text: 'Notifications',
            stack
        }),
        QuickSettingsButton({
            icon: "network-wireless-signal-good-symbolic",
            title: "wifi",
            tooltip_text: 'Wi-Fi',
            stack
        }),
        QuickSettingsButton({
            icon: icons.bluetooth.enabled,
            title: "bluetooth",
            tooltip_text: 'Bluetooth',
            stack
        }),
        QuickSettingsButton({
            icon: icons.audio.volume.high,
            title: "audio",
            tooltip_text: 'Audio',
            stack
        }),
        QuickSettingsButton({
            icon: icons.mpris.fallback,
            title: "mpris",
            tooltip_text: 'Media',
            stack
        })
    ]
})

const QuickSettingsPage = content => Widget.Scrollable({
    class_name: "qs-page",
    vexpand: true,
    hscroll: 'never',
    child: content
})

const QuickSettingsContent = () => Widget.Stack({
    transition: 'slide_left_right',
    items: [
        ["notifications", QuickSettingsPage(Menu({
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
                                    Widget.Label("clear"),
                                    Widget.Icon(icons.trash.full)
                                ]
                            }),
                            binds: [['visible', Notifications, 'notifications', out => out.length > 0]]
                        }),
                        Widget.Switch({
                            connections: [
                                [Notifications, (sw) => {
                                    if (sw.active === Notifications.dnd)
                                        sw.active = !Notifications.dnd;
                                }],
                                ['notify::active', ({active}) => {
                                    if (active === Notifications.dnd)
                                        Notifications.dnd = !active
                                }]
                            ]
                        })
                    ]
                })
            }
        ))],
        ["wifi", QuickSettingsPage(Menu({
            title: "Wi-Fi",
            icon: "network-wireless-signal-good-symbolic",
            content: WifiList(),
            headerChild: Widget.Switch({
                connections: [
                    [Network, (sw) => {
                        if (sw.active !== Network.wifi.enabled)
                            sw.active = Network.wifi.enabled;
                    }],
                    ['notify::active', ({active}) => {
                        if (active !== Network.wifi.enabled)
                            Network.wifi.enabled = active;
                    }]
                ]
            })
        }))],
        ["bluetooth", QuickSettingsPage(Menu({
            title: "Bluetooth",
            icon: icons.bluetooth.enabled,
            content: BluetoothList(),
            headerChild: Widget.Switch({
                connections: [
                    [Bluetooth, (sw) => {
                        if (sw.active !== Bluetooth.enabled)
                            sw.active = Bluetooth.enabled;
                    }],
                    ['notify::active', ({active}) => {
                        if (active !== Bluetooth.enabled)
                            Bluetooth.enabled = active;
                    }]
                ]
            })
        }))],
        ["audio", QuickSettingsPage(Menu({
                title: "Audio",
                icon: icons.audio.volume.high,
                content: AudioContent()
            })
        )],
        ["mpris", QuickSettingsPage(Menu({
                title: "Player",
                icon: icons.mpris.fallback,
                content: MprisPlayerList(),
            })
        )],
    ],
})

const QuickSettings = () => { 
  const stack = QuickSettingsContent();
  const header = QuickSettingsHeader(stack);
  return Widget.EventBox({
    child: Widget.Box({
      vertical: true,
      children: [
        header,
        stack
      ],
    }),
  })
}
export default QuickSettings;
