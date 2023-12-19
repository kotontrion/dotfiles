import Widget from 'resource:///com/github/Aylur/ags/widget.js';
// @ts-ignore
import Bluetooth from 'resource:///com/github/Aylur/ags/service/bluetooth.js';

const BluetoothList = () => Widget.Box({
  hexpand: true,
  vertical: true,
})
  .hook(Bluetooth, box => {
    box.children = Bluetooth.devices.map(device => Widget.Box({
      hexpand: false,
      children: [
        //Widget.Icon(device.iconName + '-symbolic'),
        Widget.Label(device.name),
        Widget.Box({hexpand: true}),
        device.connecting ?
          Widget.Spinner({
            active: true
          }) :
          Widget.Switch({active: device.connected})
            .on('notify::active', (sw) => {
              const active = sw.active;
              if (active !== device.connected)
                device.setConnection(active);
            })
      ],
    }));
  });

export default BluetoothList;
