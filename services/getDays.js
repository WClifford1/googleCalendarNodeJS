const {google} = require('googleapis');
const appt = require('../utils/appointmentTimes')

module.exports = async function getTimeslotsForDay(auth, year, month) {
        const appointmentTimes = await appt()

        for(let i = 0; i > 30; i++){


            
        }
        appointmentTimes.map(x => {
            x.startTime = new Date(Date.UTC(year, month - 1, day, x.startTime.hours, x.startTime.minutes)), 
            x.endTime = new Date(Date.UTC(year, month - 1, day, x.endTime.hours, x.endTime.minutes)) 
        })

        let timeslots = {
            success: false,
            timeslots: appointmentTimes
        }

        let response = {
            "success": false,
            "days": []
        }

        let bookings = []

        let events = await listEvents(auth, year, month)
        // console.log(events)

        for(let i = 0; i < events.length; i++){
            bookings.push({startTime: events[i].start.dateTime, endTime: events[i].end.dateTime})
        }

        console.log("APPOINTMENTS:", bookings)
        // if (events.length > 0){
        //     timeslots.success = true
        //     for(let i = 0; i < events.length; i++){
        //         for(let j = 0; j < timeslots.timeslots.length; j++){
        //         let time = new Date(events[i].start.dateTime)
        //             if (timeslots.timeslots[j].startTime.toISOString() === time.toISOString()){
        //                 timeslots.timeslots.splice(j, 1)
        //             }
        //         }
        //     }
        //     return timeslots
        // } else {
        //     return timeslots
        // }
};


async function listEvents(auth, year, month) {
    const calendar = google.calendar({version: 'v3', auth});
    try {
        let events = await calendar.events.list({
            calendarId: 'primary',
            timeMin: new Date(Date.UTC(year, month - 1, 1, 00, 00)).toISOString(),
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