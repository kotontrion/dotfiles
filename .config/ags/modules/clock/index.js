import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Variable from "resource:///com/github/Aylur/ags/variable.js";
import App from "resource:///com/github/Aylur/ags/app.js";

const timeVar = Variable('', {
  poll: [1000, [`date`, "+%H:%M:%S"]]
});
const dateVar = Variable('', {
    poll: [5000, [`date`, "+%a %Y-%m-%d"]]
});
const Clock = () => Widget.EventBox({
    child: Widget.Box({
        class_name: 'clock-container',
        vertical: true,
        children: [
            Widget.Label({
                class_name: 'clock-date',
                hpack: "end",
                binds: [
                    ["label", dateVar]
                ]
            }),
            Widget.Label({
                class_name: 'clock-time',
                hpack: "end",
                binds: [
                    ["label", timeVar]
                ]
            }),
        ],
    })
})

export default Clock;
