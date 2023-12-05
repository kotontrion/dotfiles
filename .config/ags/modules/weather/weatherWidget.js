import Widget from 'resource:///com/github/Aylur/ags/widget.js';
import Weather from './index.js'

const WeatherBox = () => Widget.Box({
  class_name: 'weather-container',
  spacing: 5,
  children: [
    Widget.Label({
      class_name: 'weather-icon',
      binds: [['label', Weather, 'icon']]
    }),
    Widget.Label({
      class_name: 'weather-temp',
      binds: [['label', Weather, 'temp', out => out + '°C']]
    })
  ],
  binds: [['tooltip-markup', Weather, 'description']]
})

export default WeatherBox
