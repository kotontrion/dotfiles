import Service from "resource:///com/github/Aylur/ags/service.js";
import Gio from "gi://Gio";
import GLib from "gi://GLib";

class ConfigService extends Service {
  static {
    Service.register(
      this,
      {
        "css-changed": [],
      },
      {
        "wm": ["string", "r"]
      }
    );
  }

  _wm = "";

  get wm() { return this._wm; }

  constructor() {
    super();

    this._wm = GLib.getenv("XDG_CURRENT_DESKTOP") || "";

    this.applyScss();

    Utils.monitorFile(`${App.configDir}/scss`, (_, eventType) => {
      if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
        this.applyScss();
      }
    });
  }

  applyScss() {
    // Compile scss
    Utils.exec(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
    Utils.exec(`sass ${App.configDir}/scss/highlight.scss ${App.configDir}/highlight.css`);
    console.log("Scss compiled");

    // Apply compiled css
    App.resetCss();
    App.applyCss(`${App.configDir}/style.css`);
    console.log("Compiled css applied");
    this.emit("css-changed");
  };


}

const service = new ConfigService();
export default service;
