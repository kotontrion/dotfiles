import Widget, {Box} from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons/index.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import GLib from "gi://GLib";
import {lookUpIcon} from "resource:///com/github/Aylur/ags/utils.js";

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 */
const CoverArt = player => Widget.Box({
  class_name: "music-cover",
  css: player.bind('cover_path').transform(coverPath => `background-image: url('${coverPath || ""}');`),
  children: [
    Widget.Icon({
      icon: lookUpIcon(player.name) ? player.name : icons.mpris.fallback,
      vpack: "center",
      hpack: "center",
      visible: player.bind("cover_path").transform(coverPath => !GLib.file_test(coverPath || "", GLib.FileTest.EXISTS))
    })
  ],
})
/**
 * @param {import('types/service/mpris').MprisPlayer} player
 */
const MprisPlayer = player => Widget.Box({
  class_name: "music-container",
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
              class_name: "music-title",
              xalign: 0,
              label: player.bind("track_title")
            }),
            Widget.Label({
              max_width_chars: 35,
              truncate: "end",
              class_name: "music-artist",
              xalign: 0,
              label: player.bind("track_artists").transform(art => art.join(", "))
            }),
          ]
        }),
        Widget.Box({
          children: [
            Widget.Box({
              vpack: "center",
              children: [
                Widget.Button({
                  class_name: "music-button-prev",
                  on_clicked: () => player.previous(),
                  child: Widget.Icon(icons.mpris.prev),
                }),
                Widget.Button({
                  class_name: "music-button-next",
                  on_clicked: () => player.next(),
                  child: Widget.Icon(icons.mpris.next)
                }),
              ]
            }),
            Widget.Box({hexpand: true}),
            Widget.Button({
              on_clicked: () => player.playPause(),
              child: Widget.CircularProgress({
                class_name: "music-progress",
                start_at: 0.75,
                child: Widget.Icon()
                  .hook(Mpris, (icon) => {
                    let icn = icons.mpris.stopped;
                    if (player.play_back_status === "Playing")
                      icn = icons.mpris.playing;
                    else if (player.play_back_status === "Paused")
                      icn = icons.mpris.paused;
                    icon.icon = icn;
                  }),
              })
                .hook(Mpris, (prog) => {
                  if (!player) return;
                  prog.value = player.position / player.length;
                })
                .poll(1000, (prog) => {
                  if (!player) return;
                  prog.value = player.position / player.length;
                })
            })
          ]
        })
      ]
    })
  ]
})
  .hook(Mpris, (self) => {
    const coverPath = player.cover_path || "";
    const bg = GLib.file_test(coverPath, GLib.FileTest.EXISTS)
      ? `url('${coverPath}')`
      : "none";
    self.css = `background-image: ${bg};
                background-position: center;
                background-size: cover;
                `;
  });

const PlayerList = () => Box({
  vertical: true,
  spacing: 5,
  attribute: {
    "player": new Map(),
    /**
     * @param {import('types/widgets/box').default} box
     * @param {string} id
    */
    "onAdded": (box, id) => {
      const player = Mpris.getPlayer(id);
      if (!id || !player || box.attribute.player.has(id)) return;
      const playerWidget = MprisPlayer(player);
      box.attribute.player.set(id, playerWidget);
      box.pack_start(playerWidget, false, false, 0);
      box.show_all();
    },
    /**
     * @param {import('types/widgets/box').default} box
     * @param {string} id
    */
    "onRemoved": (box, id) => {
      if (!id || !box.attribute.player.has(id)) return;
      box.attribute.player.get(id).destroy();
      box.attribute.player.delete(id);
      box.show_all();
    }
  }
})
  .hook(Mpris, (box, id) => box.attribute.onAdded(box, id), "player-added")
  .hook(Mpris, (box, id) => box.attribute.onRemoved(box, id), "player-closed");

export default PlayerList;
