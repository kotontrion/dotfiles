const Hyprland = await Service.import("hyprland")

export default () => Component.Box({
  vertical: true,
  cssClasses: ["title-container"],
  children: [
    Component.Label({
      hpack: "end",
      cssClasses: ["title-class"],
      truncate: "end",
      maxWidthChars: 22,
      label: Hyprland.active.client.bind("class").transform(cls => cls.length === 0 ? "Desktop" : cls)
    }),
    Component.Label({
      hpack: "end",
      cssClasses: ["title-title"],
      truncate: "end",
      maxWidthChars: 22,
      label: Hyprland.active.client.bind("title").transform(title => title.length === 0 ? "Desktop" : title)
    })
  ]
})


