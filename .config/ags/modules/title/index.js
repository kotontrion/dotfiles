import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'

const FocusedTitle = () => Widget.EventBox({
    class_name: 'title-container',
    child: Widget.Box({
        vertical: true,
        class_name: 'title-box',
        children: [
            Widget.Label({
                hpack: "end",
                class_name: 'title-class',
                truncate: 'end',
                max_width_chars: 22,
                connections: [[Hyprland.active.client, label => {
                    label.label = Hyprland.active.client.class.length === 0 ? 'Desktop' : Hyprland.active.client.class;
                }]],
            }),
            Widget.Label({
                hpack: "end",
                class_name: 'title-title',
                truncate: 'end',
                max_width_chars: 22,
                connections: [
                    [Hyprland.active.client, label => {
                        label.label = Hyprland.active.client.title.length === 0 ? `Workspace ${Hyprland.active.workspace.id}` : Hyprland.active.client.title;
                    }]
                ],
            })
        ]
    }),
})

export default FocusedTitle;
