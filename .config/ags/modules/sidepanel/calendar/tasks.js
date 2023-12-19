import TaskService from 'resource:///com/github/Aylur/ags/service/tasks.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';
// @ts-ignore
import ICalGLib from 'gi://ICalGLib';

const SubTask = (task, list) => Widget.Box({
  spacing: 5,
  children: [
    Widget.Label({
      label: ' 󱞩',
      yalign: 0,
    }),
    Task(task, list)
  ]
});

const Task = (task, list) => Widget.Box({
  class_name: 'task',
  vertical: true,
  children: [
    Widget.Box({
      spacing: 5,
      tooltip_text: `${task.description}`,
      children: [
        Widget.CheckButton({active: task.status === ICalGLib.PropertyStatus.COMPLETED})
          .on('notify::active', ({active}) => {
            if (active === (task.status === ICalGLib.PropertyStatus.COMPLETED)) return;
            task.status = active ? ICalGLib.PropertyStatus.COMPLETED : ICalGLib.PropertyStatus.NONE;
            task.save();
          }),
        Widget.Label({
          label: task.summary,
          xalign: 0,
          hexpand: true
        }),
        Widget.Label({
          setup: (label) => {
            if (!task.due) label.visible = false;
            else label.label = task.due.toLocaleString();
          },
        })
      ]
    }),
    //...Array.from(task.subTasks).map(uid => SubTask(list.getTask(uid), list))
  ],
});

async function getTasks(box, list) {
  const tasks = (await list.getTasks()).map(task => Task(task, list));
  box.children = tasks;
}

const TaskList = (list) => Widget.Box({
  vertical: true,
  class_name: 'task-list',
})
  .hook(list, (box) => getTasks(box, list));

const TaskPage = () => Widget.Box({vertical: true})
  .hook(TaskService, (box) => {
    if (!TaskService.tasklists) return;
    box.children = TaskService.tasklists.map(TaskList);
  });


export default TaskPage;
