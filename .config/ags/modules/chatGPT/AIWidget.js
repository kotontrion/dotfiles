import { Button, Icon, Box, Label, Entry, Scrollable } from 'resource:///com/github/Aylur/ags/widget.js';
import ChatGPT from './AIService.js';
import icons from '../icons/index.js'
import RoundedCorner from '../roundedCorner/index.js';
import Keys from '../../keys.js';
import { QSState } from '../sidepanel/quicksettings.js'
import App from 'resource:///com/github/Aylur/ags/app.js'
import Gtk from 'gi://Gtk'

const Message = (msg) => Box({
  hpack: msg.role === 'user' ? 'end' : 'start',
  children: [
    msg.role === 'assistant' && RoundedCorner('bottomright', {class_name: 'ai-message-corner'}),
    Box({
      class_name: `ai-message ${msg.role}`,
      vertical: true,
      children: [
        Label({
          label: Keys[msg.role] || msg.role,
          xalign: 0,
          hpack: msg.role === 'user' ? 'end' : 'start',
          class_name: 'ai-role',
          hexpand: true,
          wrap: true,
          selectable: true,
        }),
        Label({
          label: msg.content,
          xalign: 0,
          hpack: msg.role === 'user' ? 'end' : 'start',
          class_name: 'ai-content',
          hexpand: true,
          wrap: true,
          max_width_chars: 35,
          selectable: true,
          binds: [['label', msg, 'content']],
          connections: [[msg, label => label.toggleClassName('thinking', msg.thinking), 'notify::thinking']]
        })
      ]
    }),
    msg.role === 'user' && RoundedCorner('bottomleft', {class_name: 'ai-message-corner'}),
  ]
})

export default () => {
  const box = Box({
    class_name: 'ai-container',
    vertical: true,
    children: [
      Scrollable({
        class_name: 'ai-message-list',
        hscroll: 'never',
        vscroll: 'automatic',
        vexpand: true,
        child: Box({
          vertical: true,
          connections: [[ChatGPT, (box, idx) => {
              const msg = ChatGPT.messages[idx];
              if (!msg) return;
              box.add(Message(msg))
            }, 'newMsg'],
          [ChatGPT, box => { box.children = [] }, 'clear']]
        })
      }),
      Box({
        spacing: 5,
        children: [
          Entry({
            on_accept: (e) => {
              ChatGPT.send(e.text);
              e.text = '';
            },
            hexpand: true,
            connections: [
              [QSState, (entry) => {
                if(QSState.value === 'chatgpt')
                  entry.grab_focus()
              }],
              [App, (entry, window, visible) => {
                if(window === 'sideright' && visible && QSState.value === 'chatgpt')
                  entry.grab_focus()
              }]
            ]
          }),
          Button({
            class_name: 'ai-send-button',
            on_clicked: (btn) => {
              const entry = btn.parent.children[0];
              ChatGPT.send(entry.text);
              entry.text = ''
            },
            child: Icon(icons.ui.send),
          }),
        ]
      }),
    ],
  })
  return box;
}
