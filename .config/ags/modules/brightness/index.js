import Service from "resource:///com/github/Aylur/ags/service.js";
import {exec, execAsync, monitorFile, readFile, writeFile} from "resource:///com/github/Aylur/ags/utils.js";
import Gio from "gi://Gio";
import GLib from 'gi://GLib';

/**
 * @param {number} num
 * @param {number} min
 * @param {number} max
 */
const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class BrightnessService extends Service {
  static {
    Service.register(
      this,
      {"screen-changed": ["float"],},
      {"screen-value": ["float", "rw"],},
    );
  }

  _screenValue = 0;
  _maxValue = 0;

  _maxPath = "/sys/class/backlight/intel_backlight/max_brightness";
  _brightnessPath = "/sys/class/backlight/intel_backlight/brightness";
  _brightnessFile;

  get screen_value() {
    return this._screenValue;
  }

  /**
   * @param {number} percent
   */
  set screen_value(percent) {
    percent = clamp(percent, 0, 1);
    this._screenValue = percent;
    const stream = new Gio.DataOutputStream({
      close_base_stream: true,
      base_stream: this._brightnessFile.open_readwrite(null).get_output_stream()
    })
    stream.put_string(Math.floor(percent * this._maxValue).toString(), null)
    this.emit("screen-changed", this._screenValue);
    this.notify("screen-value");
  }

  /**
  * @param {Gio.File} file
  */
  _readBrightness(file){
    const brightness = Number(readFile(file));
    this._screenValue = brightness / this._maxValue;
    this.emit("screen-changed", this._screenValue);
    this.notify("screen-value");
  }

  constructor() {
    super();
    const maxFile = Gio.File.new_for_path(this._maxPath);
    this._maxValue = Number(readFile(maxFile));
    this._brightnessFile = Gio.File.new_for_path(this._brightnessPath);
    this._readBrightness(this._brightnessFile);
    monitorFile(this._brightnessPath, (file) => {
      this._readBrightness(file)
    });
  }

  connect(event = "screen-changed", callback) {
    return super.connect(event, callback);
  }
}

const service = new BrightnessService();
export default service;
