import Lock from "gi://GtkSessionLock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import { RoundedAngleEnd, RoundedCorner } from "./modules/roundedCorner/index.js";
import Clock from "./modules/clock/index.js";
import SessionBox from "./modules/powermenu/sessionbox.js";


Utils.exec(`sass ${App.configDir}/scss/lock.scss ${App.configDir}/lockstyle.css`);
App.applyCss(`${App.configDir}/lockstyle.css`);


const lock = Lock.prepare_lock();

const windows = [];

function unlock() {
  for (const win of windows) {
    win.child.children[0].reveal_child = false;
  }
  Utils.timeout(500, () => {
    lock.unlock_and_destroy();
    //HACK: wait for unlock to be finished,
    //usually call wl_display.sync,
    //but not sure how in this context
    Utils.timeout(2000, () => App.quit());
  });
}

const Right = () => Widget.Box({
  hpack: "end",
  children: [
    RoundedAngleEnd("topleft", {class_name: "angle", hexpand: true}),
    Clock(),
  ]
});

const Left = () => Widget.Box({
  children: [
    SessionBox(),
    RoundedAngleEnd("topright", {class_name: "angle"})
  ]
});

const Bar = () => Widget.CenterBox({
  start_widget: Left(),
  end_widget: Right(),
});

const LoginBox = () => Widget.Box({
  children: [
    Widget.Overlay({
      hexpand: true,
      vexpand: true,
      child: Widget.Box({
        vertical: true,
        vpack: "center",
        hpack: "center",
        spacing: 16,
        children: [
          Widget.Box({
            hpack: "center",
            class_name: "avatar",
          }),
          Widget.Box({
            class_name: "entry-box",
            vertical: true,
            children: [
              Widget.Label("Enter password:"),
              Widget.Separator(),
              Widget.Entry({
                hpack: "center",
                xalign: 0.5,
                visibility: false,
                placeholder_text: "password",
                on_accept: self => {
                  self.sensitive = false;
                  Utils.authenticate(self.text ?? "")
                    .then(() => unlock())
                    .catch(e => {
                      self.text = "";
                      self.parent.children[0].label = e.message;
                      self.sensitive = true;
                    });
                }
              }).on("realize", (entry) => entry.grab_focus()),
            ]
          })
        ]
      }),
      overlays: [
        RoundedCorner("topleft", {class_name: "corner"}),
        RoundedCorner("topright", {class_name: "corner"}),
      ]
    })
  ]
});


const LockWindow = () => new Gtk.Window({
  child: Widget.Box({
    children: [
      Widget.Revealer({
        reveal_child: false,
        transition: "crossfade",
        transition_duration: 500,
        child: Widget.Box({
          class_name: "lock-container",
          vertical: true,
          children: [
            Bar(),
            LoginBox()
          ]
        })
      }).on("realize", self => Utils.idle(() => self.reveal_child = true))
    ]
  })
});

lock.lock_lock();

function createWindow(monitor){
  const win = LockWindow();
  windows.push(win);
  lock.new_surface(win, monitor);
  win.show();
}

const display = Gdk.Display.get_default();
for (let m = 0;  m < display?.get_n_monitors();  m++) {
  const monitor = display?.get_monitor(m);
  createWindow(monitor);
}

display?.connect("monitor-added", (disp, monitor) => {
  createWindow(monitor);
});

Utils.timeout(50000, () => unlock());
