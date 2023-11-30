import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import {Box, Revealer, Window} from 'resource:///com/github/Aylur/ags/widget.js';
import Notification from './notification.js';

const Popups = () => Box({
    vertical: true,
    spacing: 5,
    hpack: 'end',
    properties: [
        ['map', new Map()],
        ['dismiss', (box, id, force = false) => {
            if (!box._map.has(id))
                return;
            const notif = box._map.get(id);
            notif._count--
            if(notif._count <= 0){
              box._map.delete(id)
              notif._destroyWithAnims();
            }
        }],
        ['notify', (box, id) => {
            if (Notifications.dnd || !Notifications.getNotification(id))
                return;
            const notif = box._map.get(id)
            if(!notif) {
              const notification = Notification(Notifications.getNotification(id))
              box._map.set(id, notification);
              notification._count = 1
              box.pack_start(notification, false, false, 0);
            }
            else {
              const notification = Notification(Notifications.getNotification(id), true)
              notification._count = notif._count + 1;
              box.remove(notif)
              notif.destroy()
              box.pack_start(notification, false, false, 0)
              box._map.set(id, notification)
            }
        }],
    ],
    connections: [
        //@ts-ignore
        [Notifications, (box, id) => box._notify(box, id), 'notified'],
        //@ts-ignore
        [Notifications, (box, id) => box._dismiss(box, id), 'dismissed'],
        //@ts-ignore
        [Notifications, (box, id) => box._dismiss(box, id, true), 'closed'],
    ],
})


const PopupList = () => Box({
    class_name: 'notifications-popup-list',
    css: 'padding: 1px',
    children: [
        Popups(),
    ],
});

export default monitor => Window({
    monitor,
    layer: 'overlay',
    name: `notifications${monitor}`,
    anchor: ['top', 'right'],
    child: PopupList(),
});
