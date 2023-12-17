
import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import {lookUpIcon} from "resource:///com/github/Aylur/ags/utils.js";
import icons from '../icons/index.js'
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk';
import Pango from 'gi://Pango'
import {timeout} from 'resource:///com/github/Aylur/ags/utils.js'

const NotificationIcon = notification => {
    let icon;
    if (notification.image) {
        return Widget.Box({
            vexpand: false,
            hexpand: false,
            vpack: 'center',
            class_name: 'notification-icon',
            css: `background-image: url('${notification.image}');
                  background-size: auto 100%;
                  background-repeat: no-repeat;
                  background-position: center;`,
        })
    } else if (lookUpIcon(notification.app_icon)) icon = notification.app_icon
    else icon = icons.notifications.chat
    return Widget.Icon({
        class_name: 'notification-icon',
        icon: icon
    })
}

const Notification = notification => Widget.Box({
    class_name: 'notification',
    vertical: true,
    children: [
        Widget.EventBox({
          on_primary_click: (box) => {
            const label = box.child.children[1].children[1]
            if (label.lines < 0) {
              label.lines = 3
              label.truncate = 'end'
            }
            else {
              label.lines = -1
              label.truncate = 'none' 
            }
          },
          child: Widget.Box({
            children: [
                NotificationIcon(notification),
                Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Box({
                            children: [
                                Widget.Label({
                                    class_name: "notification-title",
                                    label: notification.summary,
                                    justification: 'left',
                                    max_width_chars: 24,
                                    truncate: 'end',
                                    wrap: true,
                                    xalign: 0,
                                    hexpand: true,
                                }),
                                Widget.Label({
                                    class_name: "notification-time",
                                    label: GLib.DateTime.new_from_unix_local(notification.time).format('%H:%M'),
                                }),
                                Widget.Button({
                                    class_name: "notification-close",
                                    child: Widget.Icon(icons.notifications.close),
                                    on_clicked: () => {notification.close()},
                                })
                            ]
                        }),
                        Widget.Label({
                            class_name: "notification-body",
                            justification: 'left',
                            max_width_chars: 24,
                            lines: 3,
                            truncate: 'end',
                            wrap_mode: Pango.WrapMode.WORD_CHAR,
                            xalign: 0,
                            wrap: true,
                            label: notification.body
                        }),
                        notification.hints.value && Widget.ProgressBar({
                          class_name: "notification-progress",
                          value: (notification.hints.value.unpack() || 0) / 100
                        })
                    ]
                })
            ]
          })
        }),
        Widget.Box({
            spacing: 5,
            children: notification.actions.map(action => Widget.Button({
                child: Widget.Label(action.label),
                on_clicked: () => notification.invoke(action.id),
                class_name: "notification-action-button",
                hexpand: true,
            }))
        })
    ]
})

const NotificationReveal = (notification, visible = false) => {
    

    const widget = Widget.Revealer({
        child: Notification(notification),
        reveal_child: visible,
        transition: 'slide_left',
        transition_duration: 200,
        setup: (revealer) => {
            timeout(1, () => {
                revealer.reveal_child = true
            })
        },
    });

    let box;

    const destroyWithAnims = () => {
        widget.reveal_child = false;
        timeout(200, () => {
            box.destroy()
        })
    }
    box = Widget.Box({
        hexpand: true,
        hpack: 'end',
        children: [widget],
    })
    //box.pack_end(widget, false, false, 0)
    //@ts-ignore
    box._destroyWithAnims = destroyWithAnims
    return box
}

export default NotificationReveal;
