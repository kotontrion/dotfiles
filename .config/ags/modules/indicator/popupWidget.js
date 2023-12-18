import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import AgsBox from 'resource:///com/github/Aylur/ags/widgets/box.js';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk'
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
import Brightness from '../brightness/index.js';
import Indicator from './indicatorService.js';
import GObject from "gi://GObject";

//TODO: figure out a way to type this properly
const OsdValue = (name, labelConnections, progressConnections, props = {}) => Widget.Box({
  ...props,
  vertical: true,
  class_name: 'osd-indicator',
  hexpand: true,
  children: [
    Widget.Box({
      vexpand: true,
      children: [
        Widget.Label({
          xalign: 0, yalign: 0, hexpand: true,
          class_name: 'osd-label',
          label: `${name}`,
        }),
        Widget.Label({
          hexpand: false, class_name: 'osd-value-txt',
          label: '100'
        })
          // @ts-ignore
          .hook(...labelConnections)
      ]
    }),
    Widget.ProgressBar({
      class_name: 'osd-progress',
      hexpand: true,
      vertical: false
    })
      // @ts-ignore
      .hook(...progressConnections),
  ],
});

const brightnessIndicator = OsdValue('Brightness',
  [Brightness, self => {
    self.label = `${Math.round(Brightness.screen_value * 100)}`;
  }, 'notify::screen-value'],
  [Brightness, (progress) => {
    const updateValue = Brightness.screen_value;
    progress.value = updateValue;
  }, 'notify::screen-value'],
)

const volumeIndicator = OsdValue('Volume',
  [Audio, (label) => {
    // @ts-ignore
    label.label = `${Math.round(Audio.speaker?.volume * 100)}`;
  }], [Audio, (progress) => {
    // @ts-ignore
    const updateValue = Math.min(Audio.speaker?.volume, 1);
    // @ts-ignore
    if (!isNaN(updateValue)) progress.value = updateValue;
  }],
);

const IndicatorValues = () => Widget.Revealer({
  transition: 'slide_down',
  child: Widget.Box({
    hpack: 'center',
    vertical: true,
    children: [
      brightnessIndicator,
      volumeIndicator,
    ]
  })
})
  .hook(Indicator, (revealer, value) => {
    revealer.reveal_child = (value > -1);
  }, 'popup')


export default (monitor) => Widget.Window({
  name: `indicator${monitor}`,
  monitor,
  class_name: 'indicator',
  layer: 'overlay',
  visible: true,
  anchor: ['top', 'right'],
  child: Widget.EventBox({
    on_hover: () => {
      Indicator.popup(-1);
    },
    child: Widget.Box({
      vertical: true,
      css: 'min-height: 2px;',
      children: [
        IndicatorValues(),
      ]
    })
  }),
});
