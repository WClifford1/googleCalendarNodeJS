const {google} = require('googleapis');
const appt = require('./appointmentTimes')

module.exports = async function gettimeSlotsForDay(auth, year, month, day) {

    // Call the calendar to return the day's events
    const events = await getEvents(auth, year, month, day)
    
    let result = {
        success: events.success,
        timeSlots: []
    }

    if (result.success) {
        // Get the appointment times
        const appointmentTimes = await appt()

        // Reformat the appointment times to date objects using the params
        appointmentTimes.map(x => {
            x.startTime = new Date(Date.UTC(year, month - 1, day, x.startTime.hours, x.startTime.minutes)), 
            x.endTime = new Date(Date.UTC(year, month - 1, day, x.endTime.hours, x.endTime.minutes)) 
        })

        // Create timeslots for each appointment time
        result.timeSlots = appointmentTimes

        // Remove any timeslots that already have appointments booked
        if (events.events.length > 0){
            for(let i = 0; i < events.events.length; i++){
                for(let j = 0; j < result.timeSlots.length; j++){
                let time = new Date(events.events[i].start.dateTime)
                    if (result.timeSlots[j].startTime.toISOString() === time.toISOString()){
                        result.timeSlots.splice(j, 1)
                    }
                }
            }
        }
        return result
    } else {
        return result
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
        return ({
            success: true,
            events: events.data.items
        })
    } catch(e) {
        return ({
            success: false,
            message: e
        })
    }
}