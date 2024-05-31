import type { CalendarEvent } from "./CalendarUtils"

const monday: CalendarEvent[]  = [
    {
        name: "Dansk",
        start: new Date("2024-05-27T06:00:00.000Z"),
        end: new Date("2024-05-27T07:30:00.000Z")
    },
    {
        name: "Tysk",
        start: new Date("2024-05-27T07:50:00.000Z"),
        end: new Date("2024-05-27T09:20:00.000Z")
    },
    {
        name: "Engelsk",
        start: new Date("2024-05-27T10:10:00.000Z"),
        end: new Date("2024-05-27T10:55:00.000Z")
    },
    {
        name: "Matematik",
        start: new Date("2024-05-27T10:55:00.000Z"),
        end: new Date("2024-05-27T11:40:00.000Z")
    },
    {
        name: "Matematik",
        start: new Date("2024-05-27T11:45:00.000Z"),
        end: new Date("2024-05-27T12:30:00.000Z")
    }
]

const tuesday: CalendarEvent[] = [
    {
        name: "Fysik/kemi",
        start: new Date("2024-05-28T06:00:00.000Z"),
        end: new Date("2024-05-28T07:30:00.000Z")
    },
    {
        name: "Engelsk",
        start: new Date("2024-05-28T07:50:00.000Z"),
        end: new Date("2024-05-28T09:20:00.000Z")
    },
    {
        name: "Geografi",
        start: new Date("2024-05-28T10:10:00.000Z"),
        end: new Date("2024-05-28T10:55:00.000Z")
    },
    {
        name: "Dansk",
        start: new Date("2024-05-28T10:55:00.000Z"),
        end: new Date("2024-05-28T11:40:00.000Z")
    },
    {
        name: "Esport",
        start: new Date("2024-05-28T12:00:00.000Z"),
        end: new Date("2024-05-28T12:45:00.000Z")
    }
]
const wedensday: CalendarEvent[] = [
    {
        name: "Dansk",
        start: new Date("2024-05-29T06:00:00.000Z"),
        end: new Date("2024-05-29T07:30:00.000Z")
    },
    {
        name: "Samfundsfag",
        start: new Date("2024-05-29T07:50:00.000Z"),
        end: new Date("2024-05-29T09:20:00.000Z")
    },
    {
        name: "Fysik/kemi",
        start: new Date("2024-05-29T10:10:00.000Z"),
        end: new Date("2024-05-29T10:55:00.000Z")
    },
    {
        name: "Idræt",
        start: new Date("2024-05-29T10:55:00.000Z"),
        end: new Date("2024-05-29T11:40:00.000Z")
    },
    {
        name: "Idræt",
        start: new Date("2024-05-29T11:45:00.000Z"),
        end: new Date("2024-05-29T12:30:00.000Z")
    },
]
const thursdag: CalendarEvent[] = [
    {
        name: "Matematik",
        start: new Date("2024-05-30T06:00:00.000Z"),
        end: new Date("2024-05-30T07:30:00.000Z")
    },
    {
        name: "Historie",
        start: new Date("2024-05-30T07:50:00.000Z"),
        end: new Date("2024-05-30T09:20:00.000Z")
    },
    {
        name: "Biologi",
        start: new Date("2024-05-30T10:10:00.000Z"),
        end: new Date("2024-05-30T10:55:00.000Z")
    },
    {
        name: "Idræt",
        start: new Date("2024-05-30T10:55:00.000Z"),
        end: new Date("2024-05-30T11:40:00.000Z")
    },
]
const friday: CalendarEvent[] = [
    {
        name: "Esport",
        start: new Date("2024-05-31T06:00:00.000Z"),
        end: new Date("2024-05-31T07:30:00.000Z")
    },
    {
        name: "Dansk",
        start: new Date("2024-05-31T06:00:00.000Z"),
        end: new Date("2024-05-31T07:30:00.000Z"),
        "x": "50%"
    },
    {
        name: "Matematik",
        start: new Date("2024-05-31T07:50:00.000Z"),
        end: new Date("2024-05-31T08:35:00.000Z")
    },
    {
        name: "Tysk",
        start: new Date("2024-05-31T08:35:00.000Z"),
        end: new Date("2024-05-31T09:20:00.000Z")
    },
    {
        name: "Kristendom",
        start: new Date("2024-05-31T10:10:00.000Z"),
        end: new Date("2024-05-31T10:55:00.000Z")
    },
    {
        name: "Valgfag",
        start: new Date("2024-05-31T10:55:00.000Z"),
        end: new Date("2024-05-31T11:40:00.000Z")
    },
    {
        name: "Valgfag",
        start: new Date("2024-05-31T11:45:00.000Z"),
        end: new Date("2024-05-31T12:30:00.000Z")
    },
]

const days: CalendarEvent[][] = [monday, tuesday, wedensday, thursdag, friday];

const weeksInMayAndJune: Date[] = [];
const startDate = new Date("2024-04-01T00:00:00.000Z");
const endDate = new Date("2024-07-30T23:59:59.999Z");

const currentDate = startDate;
while (currentDate <= endDate) {
    weeksInMayAndJune.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 7);
}

const eventsInMayAndJune: CalendarEvent[] = [];
for (const week of weeksInMayAndJune) {
    for (const day of days) {
        for (const event of day) {
            const eventDayOfWeek = event.start.getDay(); // get the day of the week of the event (0-6)
            const weekDayOfWeek = week.getDay(); // get the day of the week of the week date (0-6)

            // calculate the date of the event
            const eventDate = week.getDate() - weekDayOfWeek + eventDayOfWeek;

            const modifiedEvent = {
                ...event,
                start: new Date(week.getFullYear(), week.getMonth(), eventDate, event.start.getHours(), event.start.getMinutes(), event.start.getSeconds()),
                end: new Date(week.getFullYear(), week.getMonth(), eventDate, event.end.getHours(), event.end.getMinutes(), event.end.getSeconds())
            };
            eventsInMayAndJune.push(modifiedEvent);
        }
    }
}

export default eventsInMayAndJune;