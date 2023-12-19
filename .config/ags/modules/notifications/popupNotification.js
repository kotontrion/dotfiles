import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import {Box, Window} from 'resource:///com/github/Aylur/ags/widget.js';
import Notification from './notification.js';

const Popups = () => Box({
  vertical: true,
  spacing: 5,
  hpack: 'end',
  attribute: {
    'map': new Map(),
    'dismiss': (box, id) => {
      if (!box.attribute.map.has(id))
        return;
      const notif = box.attribute.map.get(id);
      notif.attribute.count--;
      if (notif.attribute.count <= 0) {
        box.attribute.map.delete(id);
        notif.attribute.destroyWithAnims();
      }
    },
    'notify': (box, id) => {
      if (Notifications.dnd || !Notifications.getNotification(id))
        return;
      const notif = box.attribute.map.get(id);
      if (!notif) {
        const notification = Notification(Notifications.getNotification(id));
        box.attribute.map.set(id, notification);
        notification.attribute.count = 1;
        box.pack_start(notification, false, false, 0);
      } else {
        const notification = Notification(Notifications.getNotification(id), true);
        notification.attribute.count = notif.attribute.count + 1;
        box.remove(notif);
        notif.destroy();
        box.pack_start(notification, false, false, 0);
        box.attribute.map.set(id, notification);
      }
    },
  },
})
  .hook(Notifications, (box, id) => box.attribute.notify(box, id), 'notified')
  .hook(Notifications, (box, id) => box.attribute.dismiss(box, id), 'dismissed')
  .hook(Notifications, (box, id) => box.attribute.dismiss(box, id, true), 'closed');

const PopupList = () => Box({
  class_name: 'notifications-popup-list',
  css: 'padding: 1px; min-width: 1px',
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
