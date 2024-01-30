import Service from "resource:///com/github/Aylur/ags/service.js";
import {monitorFile, readFile, exec} from "resource:///com/github/Aylur/ags/utils.js";
import Gio from "gi://Gio";

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


  _interface = exec("sh -c 'ls -w1 /sys/class/backlight | head -1'");
  _path = `/sys/class/backlight/${this._interface}`;
  _brightnessPath = `${this._path}/brightness`;
  _maxPath = `${this._path}/max_brightness`;
  _brightnessFile;

  get screen_value() {
    return this._screenValue;
  }

  /**
   * @param {number} percent
   */
  set screen_value(percent) {
    percent = clamp(percent, 0, 1);
    const fileStream = this._brightnessFile.open_readwrite(null);
    this._screenValue = percent;
    const stream = new Gio.DataOutputStream({
      close_base_stream: true,
      base_stream: fileStream.get_output_stream()
    });
    stream.put_string(Math.floor(percent * this._maxValue).toString(), null);
    fileStream.close(null);
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
      this._readBrightness(file);
    });
  }

  /**
  * @param {string} event
  * @param {*} callback
  */
  connect(event = "screen-changed", callback) {
    return super.connect(event, callback);
  }
}

const service = new BrightnessService();
export default service;
