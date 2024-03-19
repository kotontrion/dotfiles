import CurvedBarEnd from "misc/curvedBarEnd"
import icons from "misc/icons"

const Mpris = await Service.import("mpris")

const MprisContainer = () => Component.Box({
  cssClasses: ["bar-container"],
  children: [
    Component.Icon().hook(Mpris, icon => {
      const player = Mpris.getPlayer("spotify") || Mpris.getPlayer()
      if(!player) return
      const status = player.play_back_status
      icon.icon = status === "Playing"
                  ? icons.mpris.playing
                  : status === "Paused"
                    ? icons.mpris.paused
                    : icons.mpris.stopped
    }),
    Component.MarqueeLabel({
      useMarkup: true,
      maxWidthChars: 35
    }).hook(Mpris, label => { 
      const player = Mpris.getPlayer("spotify") || Mpris.getPlayer();
      if (!player) return;
      label.label = player?.track_title + " - " + player?.track_artists;
    })
  ]
})

const MprisBarContainer = () => Component.Box({
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

const MprisBarRevealer = () => Component.Revealer({
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

export default () => Component.Box({
  vertical: true,
  children: [MprisBarRevealer()]
})
