import CurvedBarEnd from "misc/curvedBarEnd"
import icons from "misc/icons"

const Mpris = await Service.import("mpris")

const MprisContainer = () => Widget.Box({
  cssClasses: ["bar-container"],
  children: [
    Widget.Icon().hook(Mpris, icon => {
      const player = Mpris.getPlayer("spotify") || Mpris.getPlayer()
      if(!player) return
      const status = player.play_back_status
      icon.icon = status === "Playing"
                  ? icons.mpris.playing
                  : status === "Paused"
                    ? icons.mpris.paused
                    : icons.mpris.stopped
    }),
    Widget.Label({
      maxWidthChars: 35,
      truncate: "end",
    }).hook(Mpris, label => { 
      const player = Mpris.getPlayer("spotify") || Mpris.getPlayer();
      if (!player) return;
      label.label = player?.track_title + " - " + player?.track_artists;
    })
  ]
})

const MprisBarContainer = () => Widget.Box({
  children: [
    CurvedBarEnd({
      cssClasses: ["bar-end"],
      position: "top_left",
    }),
    MprisContainer(),
    CurvedBarEnd({
      cssClasses: ["bar-end"],
      position: "top_right",
    })
  ]
})

const MprisBarRevealer = () => Widget.Revealer({
  child: MprisBarContainer(),
  transition: "slide_down",
  transitionDuration: 200,
  revealChild: Utils.watch([], [
    [Mpris, "player-changed"],
    [Mpris, "player-added"],
    [Mpris, "player-closed"]
  ], () => Mpris.players)
  .transform(players => players.filter(p => p.play_back_status !== "Stopped"))
  .transform(players => players.length > 0)
})

export default () => Widget.Box({
  vertical: true,
  children: [MprisBarRevealer()]
})
