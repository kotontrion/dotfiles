import {Box} from 'resource:///com/github/Aylur/ags/widget.js';
import {timeout} from 'resource:///com/github/Aylur/ags/utils.js';
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js';
import {Notification} from './index.js';

const NotificationList = () => Box({
  vertical: true,
  hpack: 'end',
  setup: (box) => {
    timeout(1000, () => {
      Notifications.notifications.forEach(notif => {
        box.attribute.onAdded(box, notif.id);
      });
    });
  },
  attribute: {
    'notifications': new Map(),
    /**
     * @param {import('types/widgets/box').default} box
     * @param {number} id
    */
    'onAdded': (box, id) => {
      const notif = Notifications.getNotification(id);
      if (!notif) return;
      const replace = box.attribute.notifications.get(id);
      if (replace) replace.destroy();
      const notification = Notification(notif, !!replace);
      box.attribute.notifications.set(id, notification);
      box.pack_start(notification, false, false, 0);
      box.show_all();
    },
    /**
     * @param {import('types/widgets/box').default} box
     * @param {number} id
    */
    'onRemoved': (box, id) => {
      if (!box.attribute.notifications.has(id)) return;
      box.attribute.notifications.get(id).attribute.destroyWithAnims();
      box.attribute.notifications.delete(id);
      box.show_all();
    }
  },
})
  .hook(Notifications, (box, id) => box.attribute.onAdded(box, id), 'notified')
  .hook(Notifications, (box, id) => box.attribute.onRemoved(box, id), 'closed');

export default NotificationList;
