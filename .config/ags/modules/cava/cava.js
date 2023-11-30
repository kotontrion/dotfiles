import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Gtk from 'gi://Gtk';
import Variable from 'resource:///com/github/Aylur/ags/variable.js';

const Cava = ({
    bars = 20,
    barHeight = 100,
    align = 'end',
    vertical = false,
    smooth = false,
}) => Widget.DrawingArea({
    className: 'cava',
    properties: [
        ['cavaVar', Variable([], {
        listen: [
            [
                'bash',
                '-c',
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
                return out.split(';').slice(0, -1)
            }]
    })]],
    setup: widget => {
        if (vertical) widget.set_size_request(barHeight, bars);
        else widget.set_size_request(bars, barHeight);
        const varHandler = widget._cavaVar.connect('changed', () => widget.queue_draw());
        widget.connect('destroy', () => {
            widget._cavaVar.disconnect(varHandler);
        })
    },
    connections: [
        ['draw', (widget, cr) => {
            const context = widget.get_style_context();
            const h = widget.get_allocated_height();
            const w = widget.get_allocated_width();

            const bg = context.get_property('background-color', Gtk.StateFlags.NORMAL);
            const fg = context.get_property('color', Gtk.StateFlags.NORMAL);

            cr.setSourceRGBA(bg.red, bg.green, bg.blue, bg.alpha);
            cr.rectangle(0, 0,w, h);
            cr.fill();

            cr.setSourceRGBA(fg.red, fg.green, fg.blue, fg.alpha);
            if(!smooth){
              for( let i = 0; i < widget._cavaVar.value.length; i++){
                const height = h * (widget._cavaVar.value[i]/barHeight)
                let y = 0;
                let x = 0;
                switch (align) {
                    case 'start':
                        y = 0;
                        x = 0;
                        break;
                    case 'center':
                        y = (h - height)/2;
                        x = (w - height)/2;
                        break;
                    case 'end':
                    default:
                        y = h - height;
                        x = w - height;
                        break;
                }
                if (vertical) cr.rectangle(x, i*(h/bars), height, h/bars);
                else cr.rectangle(i*(w/bars), y, w/bars, height);
                cr.fill();
              }
            }
            else {
              let lastX = 0;
              let lastY = h - h * (widget._cavaVar.value[0]/barHeight)
              cr.moveTo(lastX, lastY)
              for( let i = 1; i < widget._cavaVar.value.length; i++){
                const height = h * (widget._cavaVar.value[i]/barHeight)
                let y = h - height;
                let x = w - height;
                cr.curveTo(lastX + w/(bars-1)/2, lastY, lastX + w/(bars-1)/2, y, i*(w/(bars-1)), y);
                lastX = i*(w/(bars-1))
                lastY = y
              }
              cr.lineTo(w, h)
              cr.lineTo(0, h)
              cr.fill();
            }
        }]]
})

export default Cava
