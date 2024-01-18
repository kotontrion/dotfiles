import {Box, Button, Icon, Label} from "resource:///com/github/Aylur/ags/widget.js";
import Network from "resource:///com/github/Aylur/ags/service/network.js";
import {execAsync, notify} from "resource:///com/github/Aylur/ags/utils.js";
import icons from "../icons/index.js";


export const WifiList = () => Box({
  vertical: true,
  spacing: 5,
})
  .hook(Network, box => {
    box.children =
      Network.wifi?.access_points.map(ap => Button({
        on_clicked: () => execAsync(`nmcli device wifi connect ${ap.bssid}`).catch(e => {
          notify({
            summary: "Network",
            body: e,
            actions:{
              "Open network manager": () => execAsync("nm-connection-editor")
            }
          });
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
              hpack: "end",
            }),
          ],
        }),
      }));
  });

export default WifiList;
