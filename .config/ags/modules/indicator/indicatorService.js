import Service from "resource:///com/github/Aylur/ags/service.js";
import {timeout} from "resource:///com/github/Aylur/ags/utils.js";
import Brightness from "../brightness/index.js";
import Audio from "resource:///com/github/Aylur/ags/service/audio.js";

class IndicatorService extends Service {
  static {
    Service.register(
      this,
      {"popup": ["double"],},
      {
        "brightness": ["float", "rw"],
        "volume": ["float", "rw"],
        "current": ["string", "r"],
      }
    );
  }

  _delay = 1500;
  _count = 0;
  _current = "volume";
  _volume = 0;

  constructor() {
    super();
    Brightness.connect("notify::screen-value", () => {
      this._current = "brightness";
      this.notify("brightness");
      this.notify("current");
      this.popup();
    });
    Audio.connect("speaker-changed", () => {
      if(!Audio.speaker || Audio.speaker.volume == this._volume) return;
      this._current = "volume";
      this._volume = Audio.speaker.volume;
      this.notify("volume");
      this.notify("current");
      this.popup();
    });
  }

  get current() { return this._current; }

  get brightness() { return Brightness.screen_value;}
  set brightness(value) { Brightness.screen_value = value;}

  get volume() { return this._volume; }
  set volume(value) {
    if (!Audio.speaker) return;
    Audio.speaker.volume = value;
  }

  /** @param {number} [value = 1] */
  popup(value = 1) {
    this.emit("popup", value);
    this._count++;
    timeout(this._delay, () => {
      this._count--;

      if (this._count === 0)
        this.emit("popup", -1);
    });
  }

  /**
   * @param {string} event
   * @param {*} callback
  */
  connect(event = "popup", callback) {
    return super.connect(event, callback);
  }
}

const service = new IndicatorService();
export default service;
