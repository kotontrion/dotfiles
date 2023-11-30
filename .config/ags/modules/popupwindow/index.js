import Widget from "resource:///com/github/Aylur/ags/widget.js"
import App from 'resource:///com/github/Aylur/ags/app.js';

const Padding = windowName => Widget.EventBox({
    className: 'padding',
    hexpand: true,
    vexpand: true,
    connections: [['button-press-event', () => App.toggleWindow(windowName)]],
});

const PopupRevealer = (windowName, transition, child) => Widget.Box({
    css: 'padding: 1px;',
    children: [Widget.Revealer({
        transition,
        child,
        transitionDuration: 350,
        connections: [[App, (revealer, name, visible) => {
            if (name === windowName)
                revealer.reveal_child = visible;
        }]],
    })],
});


export default ({ layout = 'center', expand = true, name, child, ...rest }) => Widget.Window({
    name,
    child: Widget.Box({
      children: [
        Padding(name),
        PopupRevealer(name, 'slide_left', child)
      ]
    }),
    popup: true,
    focusable: true,
    visible: false,
    ...rest,
});

