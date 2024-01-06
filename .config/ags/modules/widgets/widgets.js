import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Gtk from "gi://Gtk";
import AgsWidget from "resource:///com/github/Aylur/ags/widgets/widget.js";
import Vte from "gi://Vte";
import WebKit2 from "gi://WebKit2?version=4.1";

class AgsSwitch extends AgsWidget(Gtk.Switch, "AgsSwitch") {
  static { AgsWidget.register(this, {}); }
  /**
     * @param {import('types/widgets/widget').BaseProps<
     *      AgsSwitch, Gtk.Switch.ConstructorProperties
     * >} params */
  constructor(params) {
    // @ts-expect-error
    super(params);
  }
}


const Switch =  Widget.createCtor(AgsSwitch);
// TODO: createCtor does not work on these, fifure out why
const WebView = Widget.subclass(WebKit2.WebView, "AgsWebView");
const Terminal = Widget.subclass(Vte.Terminal, "AgsVteTerminal");

export {
  Switch,
  Terminal,
  WebView
};
