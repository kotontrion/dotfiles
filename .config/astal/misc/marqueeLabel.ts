import GLib from "gi://GLib?version=2.0"
import Gtk from "gi://Gtk?version=4.0"
import { register } from "resource:///astal/widgets/widget.js"
import { type Widget, type BaseProps } from "types/widgets/widget"

export type MarqueeLabelProps<
    Attr = unknown,
    Self = MarqueeLabel<Attr>
> = BaseProps<Self, Gtk.Widget.ConstructorProperties & {
  label?: string,
  speed?: number,
  maxWidthChars?: number,
  use_markup?: boolean,
}, Attr>

export interface MarqueeLabel<Attr> extends Widget<Attr> { }
export class MarqueeLabel<Attr = unknown> extends Gtk.Widget{
  
  static {
    register(this, {
      properties: {
        "label": ["string", "rw"],
        "speed": ["int", "rw"],
        "maxWidthChars": ["int", "rw"],
        "use-markup": ["boolean", "rw"],
      }
    })
  }

  #label
  #timeoutId

  #speed
  #maxWidthChars

  get label() { return this.#label.label }
  set label(label) { this.#label.label = label }
  get speed() { return this.#speed }
  set speed(speed) { this.#speed = speed }
  get useMarkup() { return this.#label.useMarkup }
  set useMarkup(useMarkup) { this.#label.useMarkup = useMarkup }

  constructor({
    label = "",
    speed = 1,
    maxWidthChars = -1,
    useMarkup = false,
    ...props
  }: MarqueeLabelProps = {}) {
    super(props as Gtk.Widget.ConstructorProperties)
    this.#label = Widget.Label({
      label,
      useMarkup
    })
    this.#label.set_parent(this)
    this.#timeoutId = this.add_tick_callback(this._onTick.bind(this))
    this.overflow = Gtk.Overflow.HIDDEN

    this.#speed = speed
    this.#maxWidthChars = maxWidthChars
  }

  vfunc_size_allocate(width: number, height: number, baseline: number): void {
    const measure = this.#label.measure(Gtk.Orientation.HORIZONTAL, height)
    this.#label.allocate(measure[0], height, baseline, null)
  }

  vfunc_get_request_mode() {
    return Gtk.SizeRequestMode.WIDTH_FOR_HEIGHT
  }

  vfunc_measure(orientation: Gtk.Orientation, for_size: number): [number, number, number, number] {
    if(this.#maxWidthChars < 0)
      return this.#label.measure(orientation, for_size)
    else {
      const pl = this.#label.get_layout().copy()
      pl.set_text(this.#label.label.substring(0, this.#maxWidthChars), -1)
      const value = pl.get_pixel_size()[orientation == Gtk.Orientation.VERTICAL ? 1 : 0]
      return [value, value, -1, -1]
    }
  }

  vfunc_snapshot(snapshot: Gtk.Snapshot): void {
    this.snapshot_child(this.#label, snapshot)
  }

  _onTick(widget, frameClock) {
    let allocation = this.get_allocation();
    let labelAllocation = this.#label.get_allocation();
    labelAllocation.x -= this.#speed;
    if (labelAllocation.x < -labelAllocation.width) {
      labelAllocation.x = allocation.width;
    }
    this.#label.size_allocate(labelAllocation, -1);
    return GLib.SOURCE_CONTINUE;
  }
}
export default (props: MarqueeLabelProps) => new MarqueeLabel(props)
