import Service from 'resource:///com/github/Aylur/ags/service.js';
import {timeout} from 'resource:///com/github/Aylur/ags/utils.js'
import Brightness from '../brightness/index.js'
import Audio from 'resource:///com/github/Aylur/ags/service/audio.js'

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class IndicatorService extends Service {
  static {
    Service.register(
      this,
      {'popup': ['double'],},
      {
        'brightness': ['float', 'rw'],
        'volume': ['float', 'rw'],
        'current': ['string', 'r'],
      }
    );
  }

  _delay = 1500;
  _count = 0;
  _current = 'volume'

  constructor() {
    super();
    Brightness.connect('notify::screen-value', () => {
      this._current = 'brightness'
      this.notify('brightness')
      this.notify('current')
      this.popup()
    })
    Audio.connect('speaker-changed', () => {
      this._current = 'volume'
      this.notify('volume')
      this.notify('current')
      this.popup()
    })
  }

  get current() { return this._current }

  get brightness() { return Brightness.screen_value}
  set brightness(value) { Brightness.screen_value = value}

  get volume() { return Audio.speaker?.volume || 0 }
  set volume(value) {
    if (!Audio.speaker) return
    Audio.speaker.volume = value
  }

  popup(value) {
    this.emit('popup', value ??= 1);
    this._count++;
    timeout(this._delay, () => {
      this._count--;

      if (this._count === 0)
        this.emit('popup', -1);
    });
  }

  connect(event = 'popup', callback) {
    return super.connect(event, callback);
  }
}

const service = new IndicatorService();
export default service;
