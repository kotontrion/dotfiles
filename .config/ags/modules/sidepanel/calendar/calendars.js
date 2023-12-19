import CalendarService from 'resource:///com/github/Aylur/ags/service/calendar.js';
import Widget from 'resource:///com/github/Aylur/ags/widget.js';

const Event = (event) => Widget.Box({
  class_name: 'event',
  vertical: true,
  children: [
    Widget.Box({
      spacing: 5,
      tooltip_text: `${event.description}`,
      children: [
        Widget.Label({
          label: event.summary,
          xalign: 0,
          hexpand: true
        }),
        Widget.Label({
          setup: (label) => {
            if (!event.dtstart) label.visible = false;
            else label.label = event.dtstart.toLocaleString();
          },
        })
      ]
    }),
  ],
});

async function getEvents(box, calendar) {
  try {
    const now = new Date();
    const week = new Date();
    week.setDate(week.getDate() + 90);
    const tasks = (await calendar.getEventsInRange(now, week)).map(event => Event(event));
    box.children = tasks;
  } catch (e) {
    logError(e);
  }
}

const EventList = (calendar) => Widget.Box({
  vertical: true,
  class_name: 'event-list',
})
  .hook(calendar, (box) => getEvents(box, calendar));

const TaskPage = () => Widget.Box({vertical: true})
  .hook(CalendarService, (box) => {
    if (!CalendarService.calendars) return;
    box.children = CalendarService.calendars.map(EventList);
  });


export default TaskPage;
