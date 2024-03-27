import Gsk from "gi://Gsk?version=4.0";
import Gtk from "gi://Gtk?version=4.0"
import { register } from "resource:///astal/widgets/widget.js"
import { Widget, BaseProps } from "types/widgets/widget"

//TODO: add more
type Position = "top_left" | "top_right";

export type CurvedBarEndProps<
    Attr = unknown,
    Self = CurvedBarEnd<Attr>
> = BaseProps<Self, Gtk.Widget.ConstructorProperties & {
  position?: Position,
  ratio?: number
}, Attr>

export interface CurvedBarEnd<Attr> extends Widget<Attr> { }
export class CurvedBarEnd<Attr = unknown> extends Gtk.Widget {
  
  static {
    register(this, {
      properties: {
        "position": ["string", "rw"],
        "ratio": ["float", "rw"]
      }
    })
  }

  constructor({
    position = "top_left",
    ratio = 1.5,
    ...props
  }: CurvedBarEndProps = {}) {
    super(props as Gtk.Widget.ConstructorProperties)
    this._set("position", position)
    this._set("ratio", ratio)
  }

  set ratio(ratio) {
    if (this.ratio === ratio) return
    this._set("ratio", ratio)
  }
  get ratio(): number { return this._get("ratio") }


  set position(position) {
    if (this.position === position) return
    this._set("position", position)
  }
  get position() { return this._get("position") }

  vfunc_get_request_mode() {
    return Gtk.SizeRequestMode.WIDTH_FOR_HEIGHT
  }

  vfunc_measure(orientation: Gtk.Orientation, for_size: number) : [number, number, number, number]{
    let measure
    switch(orientation) {
      case Gtk.Orientation.VERTICAL:
        measure = [
          for_size / this.ratio,
          for_size / this.ratio,
          -1,
          -1
        ]
      case Gtk.Orientation.HORIZONTAL:
      default:
        measure = [
          for_size * this.ratio,
          for_size * this.ratio,
          -1,
          -1
        ]
    }
    return measure
  }

  vfunc_snapshot(snapshot: Gtk.Snapshot) {
    const width = this.get_allocated_width()
    const height = this.get_allocated_height()
    const style_context = this.get_style_context()
    const color = style_context.get_color()
   
    const builder = new Gsk.PathBuilder()

    switch(this.position) {
      case "top_right":
        builder.line_to(0, height)
        builder.cubic_to(width/2, height, width/2, 0, width, 0)
        builder.close()
        break
       case "top_left":
        builder.cubic_to(width/2, 0, width/2, height, width, height)
        builder.line_to(width, 0)
        builder.close()
        break
    }

    snapshot.append_fill(builder.to_path(), Gsk.FillRule.WINDING, color)
  }
}
export default (props: CurvedBarEndProps) => new CurvedBarEnd(props)
