import {Box, Button, Icon, Label} from "resource:///com/github/Aylur/ags/widget.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";
import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import {execAsync} from "resource:///com/github/Aylur/ags/utils.js";
import icons from "../icons/index.js";


export const WifiList = () => Box({
    vertical: true,
    spacing: 5,
    connections: [[Network, box => {
        box.children =
            Network.wifi?.access_points.map(ap => Button({
                on_clicked: () => execAsync(`nmcli device wifi connect ${ap.bssid}`).catch(e => {
                    const cmd = ["notify-send", "Wi-Fi", e, "-A", "open=Open network manager"]
                    execAsync(cmd)
                      .then(e => {if(e == 'open') execAsync('nm-connection-editor')}).catch(e => console.error(e))
                }).catch(e => console.error(e)),
                child: Box({
                    children: [
                        Icon(ap.iconName),
                        Label({label: ap.ssid}),
                        // @ts-ignore
                        ap.active &&
                        Icon({
                            icon: icons.tick,
                            hexpand: true,
                            hpack: 'end',
                        }),
                    ],
                }),
            }))
    },
    ]],
});

export default WifiList
