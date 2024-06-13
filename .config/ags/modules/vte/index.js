import GLib from "gi://GLib";
import Gtk from "gi://Gtk?version=3.0";
import {exec} from "resource:///com/github/Aylur/ags/utils.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";

let LyricsTerminal;

try {
  const Vte = (await import("gi://Vte?version=2.91")).default;
  const Terminal = Widget.subclass(Vte.Terminal, "AgsVteTerminal");

  const LrxTerm = () => {
    const terminal = Terminal({
      class_name: "terminal",
      name: "lyrics-terminal",
    });
    // HACK: style context is only accessable after the widget was added to the
    // hierachy, so i do this to set the color once.
    terminal.on("realize", () => {
      const bgCol = terminal.get_style_context().get_property("background-color", Gtk.StateFlags.NORMAL);
      const fgCol = terminal.get_style_context().get_property("color", Gtk.StateFlags.ACTIVE);
      const fgColfaded = terminal.get_style_context().get_property("color", Gtk.StateFlags.NORMAL);
      terminal.set_color_background(bgCol);
      print(`${Utils.rgbaToHexString(fgCol)}`);
      print(`${Utils.rgbaToHexString(fgColfaded)}`);
      terminal.spawn_async(
        Vte.PtyFlags.DEFAULT,
        GLib.get_home_dir(),
        [
          "sptlrx",
          "--current",
          `${Utils.rgbaToHexString(fgCol)},bold`,
          "--before",
          `${Utils.rgbaToHexString(fgColfaded)},faint,italic`,
          "--after",
          `${Utils.rgbaToHexString(fgColfaded)},faint`,
        ],
        [],
        GLib.SpawnFlags.SEARCH_PATH,
        null,
        GLib.MAXINT32,
        null,
        null,
      );
    });
    return terminal;
  };

  if (exec("which sptlrx") != "") LyricsTerminal = LrxTerm;
  else {
    console.warn("sptlrx is not installed. Lyrics module has been disabled.");
    LyricsTerminal = () => Widget.Box();
  }
}
catch(e) {
  console.warn("vte3 is not installed. Terminal modules has been disabled.");
  LyricsTerminal = () => Widget.Box();
}

export {
  LyricsTerminal
};

