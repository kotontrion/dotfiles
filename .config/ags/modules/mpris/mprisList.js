import Widget, {Box} from "resource:///com/github/Aylur/ags/widget.js";
import icons from "../icons/index.js";
import Mpris from "resource:///com/github/Aylur/ags/service/mpris.js";
import {lookUpIcon, execAsync} from "resource:///com/github/Aylur/ags/utils.js";

/**
 * @param {string} coverPath
 */
async function blurCoverArtCss(coverPath) {

  /** @param {string} bg
  *   @param {string} color
  */
  const genCss = (bg, color) =>
    `background-image: radial-gradient(
      circle at right,
      rgba(0, 0, 0, 0),
      ${color} 11.5rem), url('${bg}');
    background-position: right top, right top;
    background-size: contain;
    transition: all 0.7s ease;
    background-repeat: no-repeat;`;

  if(coverPath) {
    const color = await execAsync(`bash -c "convert ${coverPath} -alpha off -crop 5%x100%0+0+0 -colors 1 -unique-colors txt: | head -n2 | tail -n1 | cut -f4 -d' '"`);
    return genCss(coverPath, color);
  }
  return "background-color: #0e0e1e";
}

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 * @param {import('types/widgets/icon').Props} props
 */
const PlayerIcon = (player, { ...props } = {}) => {
  const icon = lookUpIcon(player.entry)
    ? player.entry
    : icons.mpris.fallback;
  return Widget.Icon({
    ...props,
    class_name: "music-player-icon",
    icon: icon,
  });
};

/**
 * @param {import('types/service/mpris').MprisPlayer} player
 */
const MprisPlayer = player => Widget.Box({
  class_name: "music-container",
  vertical: true,
  children: [
    Widget.Box({
      tooltip_text: player.identity || "",
      children: [
        PlayerIcon(player),
        Widget.Label({
          class_name: "music-player-name",
          label: player.identity
        })
      ]
    }),
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
          class_name: "music-control-box",
          children: [
            Widget.Box({
              vpack: "center",
              spacing: 10,
              children: [
                Widget.Button({
                  class_name: "music-button",
                  on_clicked: () => player.previous(),
                  child: Widget.Icon(icons.mpris.prev),
                }),
                Widget.Button({
                  on_clicked: () => player.playPause(),
                  child: Widget.CircularProgress({
                    class_name: "music-progress",
                    start_at: 0.75,
                    child: Widget.Icon({
                      class_name: "music-button",
                    })
                      .hook(Mpris, (icon) => {
                        let icn = icons.mpris.stopped;
                        if (player.play_back_status === "Playing")
                          icn = icons.mpris.playing;
                        else if (player.play_back_status === "Paused")
                          icn = icons.mpris.paused;
                        icon.icon = icn;
                      }),
                  })
                    .hook(player, (prog) => {
                      if (!player) return;
                      prog.value = player.position / player.length;
                    })
                    .poll(1000, (prog) => {
                      if (!player) return;
                      prog.value = player.position / player.length;
                    })
                }),
                Widget.Button({
                  class_name: "music-button",
                  on_clicked: () => player.next(),
                  child: Widget.Icon(icons.mpris.next)
                }),
              ]
            }),
          ]
        })
      ]
    })
  ]
}).hook(player, async (self) => {
  self.css = await blurCoverArtCss(player.cover_path);
}, "notify::cover-path");


const PlayerList = () => Box({
  hexpand: true,
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
    },
    /**
     * @param {import('types/widgets/box').default} box
     * @param {string} id
    */
    "onRemoved": (box, id) => {
      if (!id || !box.attribute.player.has(id)) return;
      box.attribute.player.get(id).destroy();
      box.attribute.player.delete(id);
    }
  }
})
  .hook(Mpris, (box, id) => box.attribute.onAdded(box, id), "player-added")
  .hook(Mpris, (box, id) => box.attribute.onRemoved(box, id), "player-closed");

export default PlayerList;
