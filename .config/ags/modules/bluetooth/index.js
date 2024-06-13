import Widget from "resource:///com/github/Aylur/ags/widget.js";
// @ts-ignore
import Bluetooth from "resource:///com/github/Aylur/ags/service/bluetooth.js";
import { Switch } from "../widgets/widgets.js";

const BluetoothList = () => Widget.Box({
  class_name: "spacing-5",
  hexpand: true,
  vertical: true,
})
  .hook(Bluetooth, box => {
    box.children = Bluetooth.devices.map(device => Widget.Box({
      hexpand: false,
      class_name: "spacing-5",
      children: [
        Widget.Icon(device.icon_name + "-symbolic"),
        Widget.Label(device.name),
        Widget.Box({hexpand: true}),
        device.connecting ?
          Widget.Spinner({
            active: true
          }) :
          Switch({active: device.connected})
            .on("notify::active", ({active}) => {
              if (active !== device.connected)
                device.setConnection(active);
            })
      ],
    }));
  });

export default BluetoothList;
