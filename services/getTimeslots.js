const {google} = require('googleapis');
const appt = require('../utils/appointmentTimes')

module.exports = async function getTimeslotsForDay(auth, year, month, day) {
        const appointmentTimes = await appt()

        appointmentTimes.map(x => {
            x.startTime = new Date(Date.UTC(year, month - 1, day, x.startTime.hours, x.startTime.minutes)), 
            x.endTime = new Date(Date.UTC(year, month - 1, day, x.endTime.hours, x.endTime.minutes)) 
        })

        let timeslots = {
            success: false,
            timeslots: appointmentTimes
        }

        let events = await getEvents(auth, year, month, day)
        if (events.length > 0){
            timeslots.success = true
            for(let i = 0; i < events.length; i++){
                for(let j = 0; j < timeslots.timeslots.length; j++){
                let time = new Date(events[i].start.dateTime)
                    if (timeslots.timeslots[j].startTime.toISOString() === time.toISOString()){
                        timeslots.timeslots.splice(j, 1)
                    }
                }
            }
            return timeslots
        } else {
            return timeslots
        }
};


async function getEvents(auth, year, month, day){
    const calendar = google.calendar({ version: "v3", auth });
    try {
        let events = await calendar.events.list(
        {
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
            timeMin: `${year}-${month}-${day}T00:00:00.000Z`,
            timeMax: `${year}-${month}-${day}T23:59:00.000Z`,
            timeZone: "UTC"
        })
        return events.data.items
    } catch {
        return []
    }
}