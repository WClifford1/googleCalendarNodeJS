const {google} = require('googleapis');
const appt = require('../utils/appointmentTimes')

module.exports = async function gettimeSlotsForDay(auth, year, month, day) {
        const appointmentTimes = await appt()

        appointmentTimes.map(x => {
            x.startTime = new Date(Date.UTC(year, month - 1, day, x.startTime.hours, x.startTime.minutes)), 
            x.endTime = new Date(Date.UTC(year, month - 1, day, x.endTime.hours, x.endTime.minutes)) 
        })

        let timeSlots = {
            success: false,
            timeSlots: appointmentTimes
        }

        let events = await getEvents(auth, year, month, day)
        if (events.length > 0){
            timeSlots.success = true
            for(let i = 0; i < events.length; i++){
                for(let j = 0; j < timeSlots.timeSlots.length; j++){
                let time = new Date(events[i].start.dateTime)
                    if (timeSlots.timeSlots[j].startTime.toISOString() === time.toISOString()){
                        timeSlots.timeSlots.splice(j, 1)
                    }
                }
            }
            return timeSlots
        } else {
            return timeSlots
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