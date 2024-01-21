import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk?version=3.0";
import Variable from "resource:///com/github/Aylur/ags/variable.js";

const Cava = ({
  bars = 20,
  barHeight = 100,
  align = "end",
  vertical = false,
  smooth = false,
}) => Widget.DrawingArea({
  class_name: "cava",
  attribute: {
    "cavaVar": Variable([], {
      listen: [
        [
          "bash",
          "-c",
          `printf "[general]\n  \
                    framerate=60\n    \
                    bars = ${bars}\n  \
                    [output]\n        \
                    channels = mono\n \
                    method = raw\n    \
                    raw_target = /dev/stdout\n \
                    data_format = ascii\n \
                    ascii_max_range = ${barHeight}\n" | \
                    cava -p /dev/stdin`
        ],
        out => {
          return out.split(";").slice(0, -1);
        }]
    })
  },
  setup: widget => {
    if (vertical) widget.set_size_request(barHeight, bars);
    else widget.set_size_request(bars, barHeight);
    const varHandler = widget.attribute.cavaVar.connect("changed", () => widget.queue_draw());
    widget.on("destroy", () => {
      widget.attribute.cavaVar.stopListen();
      widget.attribute.cavaVar.disconnect(varHandler);
    });
  },
}).on("draw", (widget, cr) => {
  const context = widget.get_style_context();
  const h = widget.get_allocated_height();
  const w = widget.get_allocated_width();

  const bg = context.get_property("background-color", Gtk.StateFlags.NORMAL);
  const fg = context.get_property("color", Gtk.StateFlags.NORMAL);
  const radius = context.get_property("border-radius", Gtk.StateFlags.NORMAL);

  cr.arc( radius,     radius,     radius, Math.PI,        3 * Math.PI/2 );
  cr.arc( w - radius, radius,     radius, 3 * Math.PI /2, 0             );
  cr.arc( w - radius, h - radius, radius, 0,              Math.PI/2     );
  cr.arc( radius,     h - radius, radius, Math.PI/2,      Math.PI       );
  cr.closePath();
  cr.clip();

  cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha);
  cr.rectangle(0, 0, w, h);
  cr.fill();

  cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha);
  if (!smooth) {
    for (let i = 0; i < widget.attribute.cavaVar.value.length; i++) {
      const height = h * (widget.attribute.cavaVar.value[i] / barHeight);
      let y = 0;
      let x = 0;
      switch (align) {
        case "start":
          y = 0;
          x = 0;
          break;
        case "center":
          y = (h - height) / 2;
          x = (w - height) / 2;
          break;
        case "end":
        default:
          y = h - height;
          x = w - height;
          break;
      }
      if (vertical) cr.rectangle(x, i * (h / bars), height, h / bars);
      else cr.rectangle(i * (w / bars), y, w / bars, height);
      cr.fill();
    }
  } else {
    let lastX = 0;
    let lastY = h - h * (widget.attribute.cavaVar.value[0] / barHeight);
    cr.moveTo(lastX, lastY);
    for (let i = 1; i < widget.attribute.cavaVar.value.length; i++) {
      const height = h * (widget.attribute.cavaVar.value[i] / barHeight);
      let y = h - height;
      cr.curveTo(lastX + w / (bars - 1) / 2, lastY, lastX + w / (bars - 1) / 2, y, i * (w / (bars - 1)), y);
      lastX = i * (w / (bars - 1));
      lastY = y;
    }
    cr.lineTo(w, h);
    cr.lineTo(0, h);
    cr.fill();
  }
});


export default Cava;
