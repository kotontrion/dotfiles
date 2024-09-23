import Network from "resource:///com/github/Aylur/ags/service/network.js";
import {execAsync, notify} from "resource:///com/github/Aylur/ags/utils.js";
import icons from "../icons/index.js";
import Gtk from "gi://Gtk?version=3.0";


const WifiAccessPoint = ap => {

  return Widget.Button({
    class_name: "wifi-ap",
    on_clicked: () => execAsync(`nmcli device wifi connect ${ap.bssid}`).catch(e => {
      notify({
        summary: "Network",
        body: e,
        actions:{
          "Open network manager": () => execAsync("nm-connection-editor")
        }
      });
    }).catch(e => console.error(e)),
    //TODO: make it look better, maybe using pango?
    tooltip_text: JSON.stringify(ap, null, 2),
    child:  Widget.Box({
      class_name: "spacing-5",
      children: [
        Widget.Label("󱞩"),
        Widget.Icon({icon: ap.iconName}),
        Widget.Label({label: ap.bssid}),
        Widget.Icon({
          icon: icons.tick,
          hexpand: true,
          hpack: "end",
        }).on("realize", self => self.visible = ap.active)
      ],
    })
  });
};

const WifiGroup = (expander, aps) => {
  const strongest = aps.sort((a, b) => b.strength - a.strength);

  if(!expander) {
    expander = Widget.Expander({
      class_name: "wifi-group",
      label_widget: Widget.Box({
        class_name: "spacing-5",
        children: [
          Widget.Icon({icon: strongest[0].iconName}),
          Widget.Label({label: strongest[0].ssid}),
        ]
      })
    })
      .hook(Network, self => {
        self.toggleClassName("connected", Network.wifi.ssid === aps[0].ssid);
      });
  }

  const group = Widget.Box({
    class_name: "wifi-group-list",
    vertical: true,
    children: strongest.map(WifiAccessPoint)
  });
  expander.child = group;

  return expander;
};

export const WifiList = () => Widget.Box({
  class_name: "spacing-5",
  vertical: true,
  attribute: {
    networks: new Map()
  }
}).hook(Network, box => {
  const aps = Network.wifi.access_points.sort((a, b) => b.strength - a.strength);
  const apGroups = Object.values(aps.reduce((acc, ap) => {
    if(!acc[ap.ssid]) acc[ap.ssid] = [];
    acc[ap.ssid].push(ap);
    return acc;
  }, {}));
  const networkMap = new Map();
  apGroups.forEach(group => {
    networkMap.set(group[0].ssid,
      WifiGroup(box.attribute.networks.get(group[0].ssid), group));
  });
  box.attribute.networks = networkMap;
  box.children = Array.from(networkMap.values());
});

export default WifiList;
