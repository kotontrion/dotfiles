import {Box} from "resource:///com/github/Aylur/ags/widget.js";
import {timeout} from "resource:///com/github/Aylur/ags/utils.js";
import Notifications from "resource:///com/github/Aylur/ags/service/notifications.js";
import {Notification} from "./index.js";

const NotificationList = () => Box({
    vertical: true,
    hpack: 'end',
    setup: (box) => {
        timeout(1000, () => {
            Notifications.notifications.forEach(notif => {
                //@ts-ignore
                box._onAdded(box, notif.id)
            })
        })
    },
    properties: [
        ["notifications", new Map()],
        ["onAdded", (box, id) => {
            const notif = Notifications.getNotification(id);
            if (!notif) return;
            const replace = box._notifications.get(id)
            if (replace) box.remove(replace)
            const notification = Notification(Notifications.getNotification(id), !!replace);
            box._notifications.set(id, notification);
            box.pack_start(notification, false, false, 0);
            box.show_all();
        }],
        ["onRemoved", (box, id) => {
            if (!box._notifications.has(id)) return;
            //box._notifications.get(id).destroy();
            box._notifications.get(id)._destroyWithAnims();
            box._notifications.delete(id);
            box.show_all();
        }]
    ],
    connections: [
        //@ts-ignore
        [Notifications, (box, id) => box._onAdded(box, id), 'notified'],
        //@ts-ignore
        [Notifications, (box, id) => box._onRemoved(box, id), 'closed'],
    ]
});

export default NotificationList
