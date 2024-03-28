#!/usr/bin/ags -c

import Greetd from "resource:///com/github/Aylur/ags/service/greetd.js";
import Widget from "resource:///com/github/Aylur/ags/widget.js";
import { RoundedAngleEnd, RoundedCorner } from "./modules/roundedCorner/index.js";
import Clock from "./modules/clock/index.js";
import SessionBox from "./modules/powermenu/index.js";
import Gtk from "gi://Gtk?version=3.0";
import { get_selected_DE } from "./modules/powermenu/index.js";

const state = Variable("username");

const label = Widget.Label("Enter username:");
const entry = Widget.Entry({
  hpack: "center",
  xalign: 0.5,
  placeholder_text: "password",
  on_accept: () => handle_input().catch(logError)
}).on("realize", (entry) => entry.grab_focus());


function setState(stat, msg) {
  switch(stat) {
    case "username":
      state.value =  "username";
      entry.visibility = true;
      label.label = "Enter username:";
      break;
    case "secret":
      state.value =  "auth";
      entry.visibility = false;
      label.label = msg || "Enter password:";
      break;
    case "visible":
      state.value =  "auth";
      entry.visibility = true;
      label.label = msg || "Enter password:";
      break;
    case "starting":
      state.value =  "starting";
      break;
  }
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
              label,
              Widget.Separator(),
              entry,
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
})


const win = new Gtk.Window({
  name: "greeter",
  child: Widget.Box({
    vertical: true,
    children: [
      Bar(),
      LoginBox()
    ]
  }),
})
win.show_all()

async function handle_response(res) {
  if(!res) return;
  let next_resp;
  switch(res.type) {
    case "success":
      if(state.value === "starting") App.quit();
      setState("starting")
      next_resp = await Greetd.startSession([get_selected_DE()]);
      break;
    case "error":
      Greetd.cancelSession();
      setState("username");
      break;
    case "auth_message":
      switch(res.auth_message_type){
        case "secret":
          setState("secret", `${res.auth_message}`);
          break;
        case "visible":
          setState("visible", `${res.auth_message}`);
          break;
        case "info":
          label.label = `${res.auth_message}`
          next_resp = await Greetd.postAuth();
          break;
        case "error":
          label.label = `${res.auth_message}`
          next_resp = await Greetd.postAuth();
          break;
      }
      break;
  }
  return handle_response(next_resp);
}

async function handle_input() {
  let res;
  switch(state.value){
    case "username":
      res = await Greetd.createSession(entry.text);
      entry.text = "";
      break;
    case "auth":
      res = await Greetd.postAuth(entry.text);
      entry.text = "";
      break;
  }
  return handle_response(res);
}

App.config({
  style: `${App.configDir}/style.css`,
})
