const {google} = require('googleapis');
const appt = require('./appointmentTimes')

module.exports = async function getDays(auth, year, month) {
    try {
        const appointmentTimes = await appt()
        const appointments = []
        const booked = []
        const result = []
        const lastDayOfMonth = new Date(year, month, 0).getDate()
        const twentyFourHoursFuture = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/)
        const cutOffMonth = (twentyFourHoursFuture.getUTCMonth() + 1).toString()
        const cutOffYear = twentyFourHoursFuture.getUTCFullYear().toString()
        let cutOffDate = 0

        // Call the calendar to return the month's events
        let events = await listEventsForMonth(auth, year, month)

        // Push the date string of the month's events into the booked array
        for(let i = 0; i < events.length; i++){
            booked.push(new Date(events[i].start.dateTime).toISOString())
        }
        
        // Push the date string of all the month's appointment timeslots into the appointments array
        for(let j = 0; j < lastDayOfMonth; j++){
            for(let i = 0; i < 12; i++){
                appointments.push(new Date(
                    Date.UTC(
                        year,
                        month - 1,
                        j + 1,
                        appointmentTimes[i].startTime.hours,
                        appointmentTimes[i].startTime.minutes
                    )
                ).toISOString())
            }
            result[j] = { "day": j + 1, "hasTimeSlots": false }
        }

        // Remove the booked appointments the appointments array
        let difference = appointments.filter(n => !booked.includes(n))

        // Change date strings in difference array to UTC date, eg 21, 22, 23...
        difference = difference.map(x =>
            x = new Date(x).getUTCDate()
        )

        // Remove any duplicate dates. The resulting uniq array is all dates that currently have available timeslots.
        const uniq = [...new Set(difference)]


        // If checking the current month, all days prior to 24 hours in the future will not have timeslots
        if (cutOffMonth == parseInt(month) && cutOffYear === year || cutOffMonth === 13 && month === 1 && cutOffYear === year){
            cutOffDate = twentyFourHoursFuture.getUTCDate()
        }


        // Check each day of the month against the uniq array
        // If a date is in the uniq array then the date's hasTimeSlots = true
        if (year === cutOffYear && parseInt(month) >= cutOffMonth || year > cutOffYear){
            for (let i = cutOffDate; i < lastDayOfMonth; i++){
                for(let j = 0; j < uniq.length; j++){
                    if (result[i].day === uniq[j]){
                        result[i].hasTimeSlots = true
                        uniq.splice(j, 1)
                    }
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
            // Only need to retrieve appointments that are more than 24 hours in the future
            const twentyFourHoursFuture = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/)
            let firstApp = new Date(Date.UTC(year - 1, month - 1, 1, 00, 00))
            if (firstApp < twentyFourHoursFuture){
                firstApp = twentyFourHoursFuture
            }
            let events = await calendar.events.list({
                calendarId: 'primary',
                timeMin: firstApp.toISOString(),
                timeMax: new Date(Date.UTC(year, month, 0, 23, 59)).toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
                timeZone: "UTC"
            })
        return events.data.items
    } catch {
        return {
            sucess: false,
            message: "Could not connect to API"
        }
    }
}