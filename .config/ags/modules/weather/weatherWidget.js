import Widget from "resource:///com/github/Aylur/ags/widget.js";
import Weather from "./index.js";

const WeatherBox = () => Widget.Box({
  class_name: "weather-container spacing-5",
  children: [
    Widget.Label({
      class_name: "weather-icon",
      label: Weather.bind("icon")
    }),
    Widget.Label({
      class_name: "weather-temp",
      label: Weather.bind("temp").transform(temp => temp + "°C")
    })
  ],
  tooltip_markup: Weather.bind("description")
});

export default WeatherBox;
