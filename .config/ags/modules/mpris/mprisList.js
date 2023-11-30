import Widget, {Box} from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons/index.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import GLib from "gi://GLib";

const CoverArt = player => Widget.Box({
    class_name: 'music-cover',
    children: [
        Widget.Icon({
            icon: icons.mpris.fallback,
            vpack: 'center',
            hpack: 'center',
        })
    ],
    connections: [[Mpris, (self) => {
        const coverPath = player.cover_path;
        self.children[0].visible = !GLib.file_test(coverPath, GLib.FileTest.EXISTS);
        self.css = `background-image: url('${coverPath}');`;
    }]],

})

const MprisPlayer = player => Widget.Box({
    class_name: 'music-container',
    connections: [[Mpris, (self) => {
        const coverPath = player.cover_path;
        const bg = GLib.file_test(coverPath, GLib.FileTest.EXISTS)
          ? `url('${coverPath}')`
          : 'none'
        self.css = `background-image: ${bg};
                    background-position: center;
                    background-size: cover;
                    `;
    }]],
    children: [
        CoverArt(player),
        Widget.Box({
            vertical: true,
            children: [
                Widget.Box({
                    vertical: true,
                    children: [
                        Widget.Label({
                            max_width_chars: 35,
                            truncate: "end",
                            class_name: 'music-title',
                            xalign: 0,
                            binds: [['label', player, 'track-title']]
                        }),
                        Widget.Label({
                            max_width_chars: 35,
                            truncate: "end",
                            class_name: 'music-artist',
                            xalign: 0,
                            binds: [['label', player, 'track-artists', out => out.join(', ')]]
                        }),
                    ]
                }),
                Widget.Box({
                    children: [
                        Widget.Box({
                            vpack: 'center',
                            children: [
                                Widget.Button({
                                    class_name: 'music-button-prev',
                                    on_clicked: () => player.previous(),
                                    child: Widget.Icon(icons.mpris.prev),
                                }),
                                Widget.Button({
                                    class_name: 'music-button-next',
                                    on_clicked: () => player.next(),
                                    child: Widget.Icon(icons.mpris.next)
                                }),
                            ]
                        }),
                        Widget.Box({hexpand: true}),
                        Widget.Button({
                            on_clicked: () => player.playPause(),
                            child: Widget.CircularProgress({
                                class_name: 'music-progress',
                                start_at: 0.75,
                                child: Widget.Icon({
                                    connections: [[Mpris, (icon) => {
                                        let icn = icons.mpris.stopped
                                        if (player.play_back_status === 'Playing')
                                            icn = icons.mpris.playing
                                        else if (player.play_back_status === 'Paused')
                                            icn = icons.mpris.paused
                                        icon.icon = icn
                                    }]]
                                }),
                                connections: [
                                    [Mpris, (prog) => {
                                        if (!player) return
                                        prog.value = player.position / player.length
                                    }],
                                    [1000, (prog) => {
                                        if (!player) return
                                        prog.value = player.position / player.length
                                    }]
                                ]
                            }),
                        })
                    ]
                })
            ]
        })
    ]
})

const PlayerList = () => Box({
    vertical: true,
    spacing: 5,
    properties: [
        ["player", new Map()],
        ["onAdded", (box, id) => {
            const player = Mpris.getPlayer(id);
            if (!id || !player || box._player.has(id)) return;
            const playerWidget = MprisPlayer(player);
            box._player.set(id, playerWidget);
            box.pack_start(playerWidget, false, false, 0);
            box.show_all();
        }],
        ["onRemoved", (box, id) => {
            if (!id || !box._player.has(id)) return
            box._player.get(id).destroy();
            box._player.delete(id);
            box.show_all();
        }]
    ],
    connections: [
        //@ts-ignore
        [Mpris, (box, id) => box._onAdded(box, id), 'player-added'],
        //@ts-ignore
        [Mpris, (box, id) => box._onRemoved(box, id), 'player-closed'],
    ]
});

export default PlayerList
