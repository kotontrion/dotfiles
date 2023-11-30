import SystemTray from 'resource:///com/github/Aylur/ags/service/systemtray.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js'

const {Gravity} = imports.gi.Gdk;

const SysTrayItem = item => Widget.Button({
    class_name: 'systray-item',
    child: Widget.Icon({
        hpack: 'center',
        binds: [['icon', item, 'icon']]
    }),
    binds: [['tooltip-markup', item, 'tooltip-markup']],
    on_clicked: btn => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
    on_secondary_click: btn => item.menu.popup_at_widget(btn, Gravity.SOUTH, Gravity.NORTH, null),
});

const Tray = (props = {}) => Widget.Box({
    class_name: 'systray-container',
    spacing: 8,
    properties: [
        ['items', new Map()],
        ['onAdded', (box, id) => {
            const item = SystemTray.getItem(id);
            if (!item) return;
            // @ts-ignore
            if (item.menu) item.menu.class_name = 'menu';
            if (box._items.has(id) || !item)
                return;
            const widget = SysTrayItem(item);
            box._items.set(id, widget);
            box.pack_start(widget, false, false, 0);
            box.show_all();
        }],
        ['onRemoved', (box, id) => {
            if (!box._items.has(id))
                return;

            box._items.get(id).destroy();
            box._items.delete(id);
        }],
    ],
    connections: [
        //@ts-ignore
        [SystemTray, (box, id) => box._onAdded(box, id), 'added'],
        //@ts-ignore
        [SystemTray, (box, id) => box._onRemoved(box, id), 'removed'],
    ],
})

export default Tray;
