const {google} = require('googleapis');
const appt = require('../utils/appointmentTimes')

module.exports = async function getDays(auth, year, month) {
    try {
        const appointmentTimes = await appt()
        const appointments = []
        const booked = []
        const freeDays = []
        const result = []
        const lastDayOfMonth = new Date(year, month, 0).getDate()

        let events = await listEventsForMonth(auth, year, month)

        for(let i = 0; i < events.length; i++){
            booked.push(new Date(events[i].start.dateTime).toISOString())
        }
        
        for(let j = 0; j < lastDayOfMonth; j++){
            for(let i = 0; i < 12; i++){
                appointments.push(new Date(Date.UTC(year, month - 1, j + 1, appointmentTimes[i].startTime.hours, appointmentTimes[i].startTime.minutes)).toISOString())
            }
            result[j] = { "day": j + 1,  "hasTimeSlots": false }
        }

        let difference = appointments.filter(n => !booked.includes(n))

        for(let i = 0; i < difference.length; i++){
            var d = new Date(difference[i]);
            var n = d.getUTCDate();
            freeDays.push(n)
        }

        const uniq = [...new Set(freeDays)]

        for (let i = 0; i < lastDayOfMonth; i++){
            for(let j = 0; j < uniq.length; j++){
                if (result[i].day === uniq[j]){
                    result[i].hasTimeSlots = true
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