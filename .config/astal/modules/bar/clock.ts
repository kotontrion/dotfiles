
const timeVar = Variable("", {
  poll: [1000, ["date", "+%H:%M:%S"]]
});
const dateVar = Variable("", {
  poll: [5000, ["date", "+%a %Y-%m-%d"]]
});

export default () => Widget.Box({
  cssClasses: ["clock-container"],
  vertical: true,
  children: [
    Widget.Label({
      cssClasses: ["clock-date"],
      hpack: "end",
      label: dateVar.bind()
    }),
    Widget.Label({
      cssClasses: ["clock-time"],
      hpack: "end",
      label: timeVar.bind()
    }),
  ],
})



