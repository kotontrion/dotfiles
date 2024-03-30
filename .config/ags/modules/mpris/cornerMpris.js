import { RoundedCorner } from "../roundedCorner/index.js"
import { PlayerIcon, MprisPlayer } from "./mprisList.js"

const Mpris = await Service.import("mpris")

const revealMpris = Variable(false)

const MprisIconContainer = () => Widget.Box({
  children: Mpris.bind("players").transform(p => p.map(PlayerIcon))
})

const MprisListContainer = () => {
  const delay = 300
  const rev2 = Widget.Revealer({
    reveal_child: false,
    transition: "slide_up",
    transition_duration: delay,
    child: Widget.Box({
      vertical: true,
      class_name: "mpris-list-container",
      children: Mpris.bind("players").transform(p => p.map(MprisPlayer))
    })
  })
  const rev1 = Widget.Revealer({
    reveal_child: false,
    transition: "slide_right",
    transition_duration: delay,
    child: rev2
  })

  revealMpris.connect("notify::value", () => {
    if(revealMpris.value) {
      rev1.reveal_child = true
      Utils.timeout(10, () => rev2.reveal_child = true)
    }
    else {
      rev2.reveal_child = false
      Utils.timeout(10, () => rev1.reveal_child = false)
    }
  })

  return Widget.Box({
    children: [rev1]
  })
}
const MprisContainer = () => Widget.Box({
  vertical: true,
  children: [
    MprisIconContainer(),
    MprisListContainer()
  ]
})

export default () => Widget.EventBox({
  hpack: "start",
  vpack: "end",
  on_hover: () => revealMpris.value = true,
  on_hover_lost: () => revealMpris.value = false,
  visible: Mpris.bind("players").transform(p => p.length > 0),
  child: Widget.Box({
    vertical: true,
    children: [
      RoundedCorner("bottomleft", {class_name: "corner"}),
      Widget.Box({
        children: [
          Widget.Box({
            class_name: "corner-container",
            children: [
              MprisContainer()
            ]
          }),
          RoundedCorner("bottomleft", {class_name: "corner"}),
        ]
      }),
    ]
  })
})


