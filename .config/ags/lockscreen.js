import Lock from "gi://GtkSessionLock";
import Gdk from "gi://Gdk?version=3.0";
import Gtk from "gi://Gtk?version=3.0";
import { RoundedAngleEnd, RoundedCorner } from "./modules/roundedCorner/index.js";
import Clock from "./modules/clock/index.js";
import SessionBox, {SessionBoxTooltip} from "./modules/powermenu/sessionbox.js";
import { MprisCorner } from "./modules/mpris/index.js";
import AstalAuth from "gi://AstalAuth";

Utils.exec(`sass ${App.configDir}/scss/lock.scss ${App.configDir}/lockstyle.css`);
App.applyCss(`${App.configDir}/lockstyle.css`);

const prompt = Variable("");
const inputVisible = Variable(false);
const inputNeeded = Variable(false);

const auth = new AstalAuth.Pam();


const Notif = (msg, type) => {
  const notif = Widget.Box({
    class_name: `auth-notif ${type}`,
    children: [
      Widget.Label({
        label: msg,
        max_width_chars: 25,
        wrap: true,
      })
    ]
  });

  const revealer = Widget.Revealer({
    child: notif,
    hpack: "end",
    transition: "slide_left",
    transition_duration: 250,
    reveal_child: false,
  });

  Utils.timeout(20000, () => {
    revealer.reveal_child = false;
    Utils.timeout(revealer.transition_duration, () => {
      revealer.destroy();
    });
  });
  Utils.idle(() => {
    revealer.reveal_child = true;
  });
  return revealer;
};

const AuthNotifs = () => Widget.Box({
  hpack: "end",
  vpack: "start",
  vertical: true,
})
  .hook(auth, (self, msg) => {
    if(!msg) return;
    self.add(Notif(msg, "error"));
    self.show_all();
    auth.supply_secret(null);
  }, "auth-error")
  .hook(auth, (self, msg) => {
    if(!msg) return;
    self.add(Notif(msg, "info"));
    self.show_all();
    auth.supply_secret(null);
  }, "auth-info")
  .hook(auth, (self, msg) => {
    if(!msg) return;
    self.add(Notif(msg, "fail"));
    self.show_all();
  }, "fail");



auth.connect("auth-prompt-visible", (auth, msg) => {
  prompt.setValue(msg);
  inputVisible.setValue(true);
  inputNeeded.setValue(true);
});
auth.connect("auth-prompt-hidden", (auth, msg) => {
  prompt.setValue(msg);
  inputVisible.setValue(false);
  inputNeeded.setValue(true);
});

auth.connect("success", unlock);
auth.connect("fail", (p, msg) => {
  auth.start_authenticate();
});

const lock = Lock.prepare_lock();

const windows = [];

function unlock() {
  for (const win of windows) {
    win.window.child.children[0].reveal_child = false;
  }
  Utils.timeout(500, () => {
    lock.unlock_and_destroy();
    windows.forEach(w => w.window.destroy());
    Gdk.Display.get_default()?.sync();
    App.quit();
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
            class_name: inputNeeded.bind().as(n => `entry-box ${n ? "" : "hidden"}`),
            vertical: true,
            children: [
              Widget.Label({
                label: prompt.bind()
              }),
              Widget.Separator(),
              Widget.Entry({
                hpack: "center",
                xalign: 0.5,
                visibility: inputVisible.bind(),
                sensitive: inputNeeded.bind(),
                on_accept: self => {
                  inputNeeded.setValue(false);
                  auth.supply_secret(self.text);
                  self.text = "";
                }
              }).on("realize", (entry) => entry.grab_focus()),
            ]
          })
        ]
      }),
      overlays: [
        RoundedCorner("topleft", {class_name: "corner"}),
        RoundedCorner("topright", {class_name: "corner"}),
        RoundedCorner("bottomleft", {class_name: "corner"}),
        RoundedCorner("bottomright", {class_name: "corner"}),
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
            Widget.Overlay({
              child: LoginBox(),
              overlays: [
                SessionBoxTooltip(),
                MprisCorner(),
                AuthNotifs(),
              ]
            })
          ]
        })
      }).on("realize", self => Utils.idle(() => self.reveal_child = true))
    ]
  })
});


function createWindow(monitor){
  const window = LockWindow();
  const win = {window, monitor};
  windows.push(win);
  return win;
}

function lock_screen() {
  const display = Gdk.Display.get_default();
  for (let m = 0;  m < display?.get_n_monitors();  m++) {
    const monitor = display?.get_monitor(m);
    createWindow(monitor);
  }
  display?.connect("monitor-added", (disp, monitor) => {
    const w = createWindow(monitor);
    lock.new_surface(w.window, w.monitor);
    w.window.show();
  });
  lock.lock_lock();
  windows.map(w => {
    lock.new_surface(w.window, w.monitor);
    w.window.show();
  });
}

function on_finished() {
  lock.destroy();
  windows.forEach(w => w.window.destroy());
  Gdk.Display.get_default()?.sync();
  App.quit();
}

// lock.connect("locked", on_locked);
lock.connect("finished", on_finished);
lock_screen();
auth.start_authenticate();

