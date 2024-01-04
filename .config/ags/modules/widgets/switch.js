import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk";
import AgsWidget from "resource:///com/github/Aylur/ags/widgets/widget.js";

class Switch extends AgsWidget(Gtk.Switch, "Switch") {
  static { AgsWidget.register(this, {}); }
  /**
     * @param {import('types/widgets/widget').BaseProps<
     *      Switch, Gtk.Switch.ConstructorProperties
     * >} params */
  constructor(params) {
    // @ts-expect-error
    super(params);
  }
}

export default Widget.createCtor(Switch);
