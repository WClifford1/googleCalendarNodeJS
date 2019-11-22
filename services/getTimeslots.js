const {
    google
} = require('googleapis');
const appt = require('./appointmentTimes')

module.exports = async function gettimeSlotsForDay(auth, year, month, day) {

    const date = new Date(Date.UTC(year, month - 1, day))
    const dayOfWeek = parseInt(date.getUTCDay())
    let weekday = true
    if (dayOfWeek === 6 || dayOfWeek === 0) {
        return ({
            success: false,
            message: "Can only view timeslots for weekdays"
        })
    }

    // Call the calendar to return the day's events
    const events = await getEvents(auth, year, month, day)

    let result = {
        success: events.success
    }

    // Only get timeslots for weekdays
    if (result.success && weekday) {
        // Get the appointment times
        const appointmentTimes = await appt()

        // Reformat the appointment times to date objects using the params
        appointmentTimes.map(x => {
            x.startTime = new Date(Date.UTC(year, month - 1, day, x.startTime.hours, x.startTime.minutes)),
                x.endTime = new Date(Date.UTC(year, month - 1, day, x.endTime.hours, x.endTime.minutes))
        })

        // Remove timeslots that are not more than 24 hours in advance 
        const twentyFourHoursFuture = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/ )
        let updatedAppointmentTimes = []
        for (let i = 0; i < appointmentTimes.length; i++) {
            if (new Date(appointmentTimes[i].startTime) >= twentyFourHoursFuture) {
                updatedAppointmentTimes.push(appointmentTimes[i])
            }
        }

        // Create timeslots for each appointment time
        result.timeSlots = updatedAppointmentTimes

        // Remove any timeslots that already have appointments booked
        if (events.events.length > 0) {
            for (let i = 0; i < events.events.length; i++) {
                for (let j = 0; j < result.timeSlots.length; j++) {
                    let time = new Date(events.events[i].start.dateTime)
                    if (result.timeSlots[j].startTime.toISOString() === time.toISOString()) {
                        result.timeSlots.splice(j, 1)
                    }
                }
            }
        }
        return result
    } else {
        result.message = "Could not connect to API"
        return result
    }
};


async function getEvents(auth, year, month, day) {
    const calendar = google.calendar({
        version: "v3",
        auth
    });
    try {
        let events = await calendar.events.list({
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
            timeMin: `${year}-${month}-${day}T00:00:00.000Z`,
            timeMax: `${year}-${month}-${day}T23:59:00.000Z`,
            timeZone: "UTC"
        })
        return ({
            success: true,
            events: events.data.items
        })
    } catch (e) {
        return ({
            success: false,
            message: e
        })
    }
}