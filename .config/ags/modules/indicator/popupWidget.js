import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import AgsBox from 'resource:///com/github/Aylur/ags/widgets/box.js';
import GLib from 'gi://GLib';
import Gtk from 'gi://Gtk'
// import Audio from 'resource:///com/github/Aylur/ags/service/audio.js';
// import Brightness from '../brightness/index.js';
import Indicator from './indicatorService.js';
import GObject from "gi://GObject";

//TODO: figure out a way to type this properly
const OsdValue = (name, label, progress, props = {}) => Widget.Box({
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
          label: label
        })
      ]
    }),
    Widget.ProgressBar({
      class_name: 'osd-progress',
      hexpand: true,
      vertical: false,
      value: progress
    })
  ],
});

const brightnessIndicator = OsdValue('Brightness',
  Indicator.bind('brightness').transform(bright => `${Math.round(bright*100)}`),
  Indicator.bind('brightness')
)

const volumeIndicator = OsdValue('Volume',
  Indicator.bind('volume').transform(volume => `${Math.round(volume*100)}`),
  Indicator.bind('volume').transform(volume => Math.min(volume, 1))
);

const IndicatorValues = () => Widget.Revealer({
  transition: 'slide_down',
  child: Widget.Stack({
    transition: 'slide_up_down',
    visible_child_name: Indicator.bind('current'),
    items: [
      ['brightness', brightnessIndicator],
      ['volume', volumeIndicator],
    ]
  })
})
  .hook(Indicator, (revealer, value) => {
    revealer.reveal_child = (value > -1);
  }, 'popup')


export default () => Widget.Window({
  name: `indicator`,
  class_name: 'indicator',
  layer: 'overlay',
  visible: true,
  anchor: ['top', 'left'],
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
