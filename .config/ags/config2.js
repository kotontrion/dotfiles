import Widget from 'resource:///com/github/Aylur/ags/widget.js'
import Hyprland from 'resource:///com/github/Aylur/ags/service/hyprland.js'
import { execAsync, timeout } from 'resource:///com/github/Aylur/ags/utils.js'
const { Box, Button, Label } = Widget;



// TODO: add current window indicator below workspace indicator

const Tab = i => Widget.Box({
  vertical: true,
  css: 'padding: 1px',
  properties: [['index', i]],
  children: [
    Widget.Revealer({
    transition: 'slide_down',
    child: Box({
      className: 'workspace',
      properties: [['index', i]],
      children: [
        Button({
          label: `Workspace ${i}`,
          properties: [['index', i]],
          onClicked: () => execAsync([
            'hyprctl',
            'dispatch',
            'workspace',
            `${i}`
          ]).catch(console.error),
          onMiddleClick: () => execAsync(),
          onSecondaryClick: () => execAsync([
            'hyprctl',
            'dispatch',
            'movetoworkspacesilent',
            `${i}`
          ]).catch(console.error)
        }),
        Button({
          label: '+',
          onClicked: () => execAsync([
            'hyprctl',
            'dispatch',
            'workspace',
            `${i++}`
          ])
        })
      ]
    })
  })]
});

export const Workspaces = () => Box({
    className: 'workspaces',
    css: 'padding: 1px',
    children: Array.from({ length: 10 }, (_, i) => i + 1).map(i => Tab(i)),
    connections: [[Hyprland, self => self.children.forEach(tab => {
        //btn.className = btn._index === Hyprland.active.workspace.id ? 'focused' : '';
        const visible = Hyprland.workspaces.some(ws => ws.id === tab._index);
        tab.children[0].revealChild = visible;
    })]]
});


const win = Widget.Window({
  exclusivity: 'exclusive',
  anchor: ['top', 'left', 'right'],
  name: 'bunbun',
  child: Workspaces()
})

export default {
  windows: [
    win
  ]
}




