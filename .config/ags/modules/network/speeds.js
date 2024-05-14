
import GTop from "gi://GTop";

const path = "/sys/class/net/";

const siPrefixes = ["", "k", "M", "G"];
const toSIUnits = (number) => {
  if (number === 0) return number.toString();
  const siBase = Math.floor(Math.log10(Math.abs(number))/3);
  const prefix = siPrefixes[siBase];
  if (siBase === 0) return number.toString();
  const baseNumber = parseFloat((number / Math.pow(10, siBase * 3)).toFixed(2));
  return `${baseNumber}${prefix}`;
};

let prevBytesIn = 0;
let prevBytesOut = 0;

function getNetworkLoad() {

  let currentBytesIn = 0;
  let currentBytesOut = 0;

  const netload = new GTop.glibtop_netload();
  const interfaces = Utils.exec(`ls -w1 ${path}`).split("\n");

  for (const iface of interfaces) {
    GTop.glibtop_get_netload(netload, iface);
    currentBytesIn += netload.bytes_in;
    currentBytesOut += netload.bytes_out;
  }

  const speedIn = currentBytesIn - prevBytesIn;
  const speedOut = currentBytesOut - prevBytesOut;

  prevBytesIn = currentBytesIn;
  prevBytesOut = currentBytesOut;

  return {
    up: `${toSIUnits(speedOut)}B/s`,
    down: `${toSIUnits(speedIn)}B/s`,
  };
}

export const speeds = Variable({up: "0B/s", down: "0B/s"}, {
  poll: [1000, getNetworkLoad]
});


export default speeds;

