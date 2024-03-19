import Gio from "gi://Gio";


const main = "/tmp/astal/main.js";
const entry = `${App.configDir}/main.ts`;

async function applyScss() {
  await Utils.execAsync(`sass ${App.configDir}/scss/main.scss ${App.configDir}/style.css`);
  console.log("Scss compiled");

  // Apply compiled css
  App.resetCss();
  App.applyCss(`${App.configDir}/style.css`);
  console.log("Compiled css applied");
}

const promises = [];
promises.push(applyScss());
promises.push(Utils.execAsync([
  "bun", "build", entry,
  "--outfile", main,
  "--external", "resource://*",
  "--external", "gi://*",
  "--external", "file://*",
]));

Promise.all(promises)
  .then(() => import(`file://${main}`))
  .catch(e => {
    print(e)
    logError(e);
    App.quit();
  });


Utils.monitorFile(`${App.configDir}/scss`, (_, eventType) => {
  if (eventType === Gio.FileMonitorEvent.CHANGES_DONE_HINT) {
    applyScss().catch(logError);
  }
});

