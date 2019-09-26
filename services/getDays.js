const {google} = require('googleapis');
const appt = require('../utils/appointmentTimes')

module.exports = async function getDays(auth, year, month) {
    try {
        const appointmentTimes = await appt()
        const appointments = []
        const booked = []
        const result = []
        const lastDayOfMonth = new Date(year, month, 0).getDate()

        // Let events equal an array of the month's events that are currently stored in the calendar
        let events = await listEventsForMonth(auth, year, month)

        // Pushes the date string of the month's events into the booked array
        for(let i = 0; i < events.length; i++){
            booked.push(new Date(events[i].start.dateTime).toISOString())
        }
        
        // Pushes the date string of all the months appointment timeslots into the appointments array
        for(let j = 0; j < lastDayOfMonth; j++){
            for(let i = 0; i < 12; i++){
                appointments.push(new Date(Date.UTC(year, month - 1, j + 1, appointmentTimes[i].startTime.hours, appointmentTimes[i].startTime.minutes)).toISOString())
            }
            result[j] = { "day": j + 1,  "hasTimeSlots": false }
        }

        // Removes the booked appointment date strings from the appointments array
        let difference = appointments.filter(n => !booked.includes(n))

        // Changes date strings in difference array to UTC date
        difference = difference.map(x =>
            x = new Date(x).getUTCDate()
        )

        // Removes any duplicate dates. The resulting uniq array is all dates that have available timeslots.
        const uniq = [...new Set(difference)]

        // Checks each day of the month against the uniq array
        // If a date is in the uniq array then the date's hasTimeSlots = true
        for (let i = 0; i < lastDayOfMonth; i++){
            for(let j = 0; j < uniq.length; j++){
                if (result[i].day === uniq[j]){
                    result[i].hasTimeSlots = true
                    uniq.splice(j, 1)
                }
            }
        }

        return {
            "success": true,
            days: result
        }
    } catch(e) {
        return { 
            "success": false,
            "message": e
        }
    }
};


async function listEventsForMonth(auth, year, month) {
    const calendar = google.calendar({version: 'v3', auth});
    try {
        let events = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date(Date.UTC(year - 1, month - 1, 1, 00, 00)).toISOString(),
            timeMax: new Date(Date.UTC(year, month, 0, 23, 59)).toISOString(),
            singleEvents: true,
            orderBy: 'startTime',
            timeZone: "UTC"
        })
    return events.data.items
    } catch {
        return []
    }
}