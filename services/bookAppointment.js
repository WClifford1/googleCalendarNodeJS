const {google} = require('googleapis');

module.exports = async function bookAppointment(auth, year, month, day, hour, minute) {

    let message = {}
    try {
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