import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Gtk from 'gi://Gtk'

const RoundedCorner = (place, props) => Widget.DrawingArea({
    ...props,
    hpack: place.includes('left') ? 'start' : 'end',
    vpack: place.includes('top') ? 'start' : 'end',
    setup: widget => {
        const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
        const r = 25 //widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);
        widget.set_size_request(r, r);
        widget.connect('draw', (widget, cr) => {
            const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
            const r = widget.get_style_context().get_property('border-radius', Gtk.StateFlags.NORMAL);
            // const borderColor = widget.get_style_context().get_property('color', Gtk.StateFlags.NORMAL);
            // const borderWidth = widget.get_style_context().get_border(Gtk.StateFlags.NORMAL).left; // ur going to write border-width: something anyway
            widget.set_size_request(r, r);

            switch (place) {
                case 'topleft':
                    cr.arc(r, r, r, Math.PI, 3 * Math.PI / 2);
                    cr.lineTo(0, 0);
                    break;

                case 'topright':
                    cr.arc(0, r, r, 3 * Math.PI / 2, 2 * Math.PI);
                    cr.lineTo(r, 0);
                    break;

                case 'bottomleft':
                    cr.arc(r, 0, r, Math.PI / 2, Math.PI);
                    cr.lineTo(0, r);
                    break;

                case 'bottomright':
                    cr.arc(0, 0, r, 0, Math.PI / 2);
                    cr.lineTo(r, r);
                    break;
            }

            cr.closePath();
            cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
            cr.fill();
            // cr.setLineWidth(borderWidth);
            // cr.setSourceRGBA(borderColor.red, borderColor.green, borderColor.blue, borderColor.alpha);
            // cr.stroke();
        })
    }
});

export const RoundedAngleEnd = (place, props) => Widget.DrawingArea({
    ...props,
    vexpand: true,
    hexpand: true,
    setup: widget => {
        const ratio = 1.5;
        const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
        const r = widget.get_allocated_height()
        widget.set_size_request(ratio*r, r);
        widget.connect('draw', (widget, cr) => {
            const c = widget.get_style_context().get_property('background-color', Gtk.StateFlags.NORMAL);
            const r = widget.get_allocated_height()
            widget.set_size_request(ratio*r, r);
            switch (place) {
                case 'topleft':
                    cr.moveTo(0, 0)
                    cr.curveTo(ratio*r/2, 0, ratio*r/2, r, ratio*r, r);
                    cr.lineTo(ratio*r, 0);
                    break;

                case 'topright':
                    cr.moveTo(ratio*r, 0)
                    cr.curveTo(ratio*r/2, 0, ratio*r/2, r, 0, r);
                    cr.lineTo(0, 0);
                    break;
            }

            cr.closePath();
            cr.setSourceRGBA(c.red, c.green, c.blue, c.alpha);
            cr.fill();
        })
    }
});


export const CornerTopleft = () => Widget.Window({
    name: 'cornertl',
    layer: 'top',
    anchor: ['top', 'left'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('topleft', { className: 'corner', }),
});
export const CornerTopright = () => Widget.Window({
    name: 'cornertr',
    layer: 'top',
    anchor: ['top', 'right'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('topright', { className: 'corner', }),
});
export const CornerBottomleft = () => Widget.Window({
    name: 'cornerbl',
    layer: 'top',
    anchor: ['bottom', 'left'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('bottomleft', { className: 'corner', }),
});
export const CornerBottomright = () => Widget.Window({
    name: 'cornerbr',
    layer: 'top',
    anchor: ['bottom', 'right'],
    exclusivity: 'normal',
    visible: true,
    child: RoundedCorner('bottomright', { className: 'corner', }),
});


export default RoundedCorner;
