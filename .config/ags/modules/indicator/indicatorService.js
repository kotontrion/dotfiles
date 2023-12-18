import Service from 'resource:///com/github/Aylur/ags/service.js';
import {timeout} from 'resource:///com/github/Aylur/ags/utils.js'

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class IndicatorService extends Service {
  static {
    Service.register(
      this,
      {'popup': ['double'],},
    );
  }

  _delay = 1500;
  _count = 0;

  popup(value) {
    this.emit('popup', value);
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
