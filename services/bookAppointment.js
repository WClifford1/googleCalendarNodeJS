const {google} = require('googleapis');
const getTimeslots = require('./getTimeslots')
const validateBookAppointment = require('../utils/validateBookAppointment')

module.exports = async function bookAppointment(auth, year, month, day, hour, minute) {
    
    // Call validateBookAppointment() which checks:
    // Appointment must not be in the past
    // Appointment must not be less than 24 hours in the future
    // Appointment must be on a weekday
    // Returns the error message if params do not meet these conditions
    if (await validateBookAppointment(year, month, day, hour, minute)) {
        return validateBookAppointment(year, month, day, hour, minute)
    }

    // Check if the timeslot is free
    const date = new Date(Date.UTC(year, month - 1, day, hour, minute))
    let bookingAlreadyExists = true
    let timeSlots = await getTimeslots(oAuth2Client, year, month, day)

    for(let i = 0; i < timeSlots.timeSlots.length; i++){
        if (timeSlots.timeSlots[i].startTime.toISOString() === date.toISOString()){
        bookingAlreadyExists = false
        }
    }
    
    // Sends an error if the appointment timeSlot is not free
    if (bookingAlreadyExists === true){
        return(
            {
                "success": false,
                "message": "Invalid time slot"
            }
        )
    } else {
        // Create event in google calendar
        try {
            let message = {}
            const startTime = new Date(Date.UTC(year, month - 1, day, hour, minute))
            const finishTime = new Date(Date.UTC(year, month -1, day, hour, minute))
            finishTime.setMinutes(finishTime.getMinutes() + 40)
            const event = {
                start: {
                    dateTime: startTime.toISOString()
                },
                end: {
                    dateTime: finishTime.toISOString()
                }
            }
            const calendar = google.calendar({version: 'v3', auth});
            await calendar.events.insert(
                    {
                        auth: auth,
                        calendarId: "primary",
                        resource: event
                    })

            message.success = true
            message.startTime = startTime.toISOString()
            message.endTime = finishTime.toISOString()
            return message;

        } catch(e) {
            message.success = false
            message.message = "Invalid booking time"
            return message;
        }
    }
}
