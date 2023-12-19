import Service from 'resource:///com/github/Aylur/ags/service.js';
import {exec, execAsync, monitorFile, readFile} from "resource:///com/github/Aylur/ags/utils.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class BrightnessService extends Service {
  static {
    Service.register(
      this,
      {'screen-changed': ['float'],},
      {'screen-value': ['float', 'rw'],},
    );
  }

  _screenValue = 0;
  _maxValue = 0;

  get screen_value() {
    return this._screenValue;
  }

  set screen_value(percent) {
    percent = clamp(percent, 0, 1);
    this._screenValue = percent;

    execAsync(`brightnessctl s ${percent * 100}% -q`)
      .then(() => {
        this.emit('screen-changed', percent);
        this.notify('screen-value');
      })
      .catch(print);
  }

  _readBrightness(){
    const current = Number(exec('brightnessctl g'));
    this._screenValue = current / this._max;
    this.emit('screen-changed', this._screenValue);
    this.notify('screen-value');
  }

  constructor() {
    super();
    this._max = Number(exec('brightnessctl m'));
    this._readBrightness()
    monitorFile('/sys/class/backlight/intel_backlight/brightness', (file) => {
      const brightness = Number(readFile(file))
      this._screenValue = brightness / this._max;
      this.emit('screen-changed', this._screenValue);
      this.notify('screen-value');
    })
  }

  connect(event = 'screen-changed', callback) {
    return super.connect(event, callback);
  }
}

const service = new BrightnessService();
export default service;
