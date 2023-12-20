import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import App from 'resource:///com/github/Aylur/ags/app.js';

/**
 * @param {string} windowName
 * @param {import('types/widgets/revealer').Transition} transition
 * @param {import('node_modules/@girs/gtk-3.0/gtk-3.0').Gtk.Widget} child
 */
const PopupRevealer = (windowName, transition, child) => Widget.Box({
  css: 'padding: 1px;',
  children: [Widget.Revealer({
    transition,
    child,
    transition_duration: 350,
  })
    .hook(App, (revealer, name, visible) => {
      if (name === windowName)
        revealer.reveal_child = visible;
    }
    )
  ],
});

/** @param {import('types/widgets/window').WindowProps & {
 *      name: string
 *      child: import('node_modules/@girs/gtk-3.0/gtk-3.0').Gtk.Widget
 *      transition?: import('types/widgets/revealer').RevealerProps['transition']
 *  }} o
 */
export default ({name, child, ...rest}) =>
  Widget.Window({
    name,
    child: Widget.Box({
      children: [
        PopupRevealer(name, 'slide_left', child)
      ]
    }),
    popup: true,
    focusable: true,
    visible: false,
    ...rest,
  });

