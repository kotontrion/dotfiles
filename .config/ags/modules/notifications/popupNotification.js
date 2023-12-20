import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import {Box, Window} from 'resource:///com/github/Aylur/ags/widget.js';
import Notification from './notification.js';

const Popups = () => Box({
  vertical: true,
  spacing: 5,
  hpack: 'end',
  attribute: {
    'map': new Map(),
    /**
     * @param {import('types/widgets/box').default} box
     * @param {number} id
    */
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
    /**
     * @param {import('types/widgets/box').default} box
     * @param {number} id
    */
    'notify': (box, id) => {
      const notif = Notifications.getNotification(id);
      if (Notifications.dnd || !notif)
        return;
      const replace = box.attribute.map.get(id);
      if (!replace) {
        const notification = Notification(notif);
        box.attribute.map.set(id, notification);
        notification.attribute.count = 1;
        box.pack_start(notification, false, false, 0);
      } else {
        const notification = Notification(notif, true);
        notification.attribute.count = replace.attribute.count + 1;
        box.remove(replace);
        replace.destroy();
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

export default () => Window({
  layer: 'overlay',
  name: 'popupNotifications',
  anchor: ['top', 'right'],
  child: PopupList(),
});
