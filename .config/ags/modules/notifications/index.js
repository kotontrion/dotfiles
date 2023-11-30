import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import icons from '../icons/index.js'
import Notifications from 'resource:///com/github/Aylur/ags/service/notifications.js'
import Notification from "./notification.js";
import PopupNotifications from './popupNotification.js'
import NotificationList from './notificationList.js'

const NotificationsIndicator = () => Widget.Icon({
    icon: icons.notifications.noisy,
    class_name: "notification-indicator",
    connections: [
        [Notifications, (icon) => {
            icon.visible = Notifications.notifications.length > 0 && !Notifications.dnd
        }]
    ]
})

const DNDIndicator = () => Widget.Icon({
    icon: icons.notifications.silent,
    class_name: "notification-indicator",
    binds: [["visible", Notifications, "dnd"]]
})

export const NotificationIndicator = () => Widget.Box({
    class_name: "notification-indicator-container",
    children: [
        NotificationsIndicator(),
        DNDIndicator()
    ]
})

export { Notification, PopupNotifications }
export default NotificationList
