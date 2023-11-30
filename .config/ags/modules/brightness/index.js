import Service from 'resource:///com/github/Aylur/ags/service.js';
import { exec, execAsync } from "resource:///com/github/Aylur/ags/utils.js";

const clamp = (num, min, max) => Math.min(Math.max(num, min), max);

class BrightnessService extends Service {
    static {
        Service.register(
            this,
            { 'screen-changed': ['float'], },
            { 'screen-value': ['float', 'rw'], },
        );
    }

    _screenValue = 0;

    get screen_value() { return this._screenValue; }

    set screen_value(percent) {
        percent = clamp(percent, 0, 1);
        this._screenValue = percent;

        execAsync(`brightnessctl s ${percent * 100}% -q`)
            .then(() => {
                // signals has to be explicity emitted
                this.emit('screen-changed', percent);
                this.notify('screen-value');

                // or use Service.changed(propName: string) which does the above two
                // this.changed('screen');
            })
            .catch(print);
    }

    constructor() {
        super();
        const current = Number(exec('brightnessctl g'));
        const max = Number(exec('brightnessctl m'));
        this._screenValue = current / max;
    }

    connect(event = 'screen-changed', callback) {
        return super.connect(event, callback);
    }
}

const service = new BrightnessService();
export default service;
