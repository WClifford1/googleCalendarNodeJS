const {google} = require('googleapis');

module.exports = function bookAppointment(auth, year, month, day, hour, minute) {

return new Promise(function(resolve, reject) {
    let startTime = new Date(Date.UTC(year, month - 1, day, hour, minute))
    let finishTime = new Date(Date.UTC(year, month -1, day, hour, minute))
    finishTime.setMinutes(finishTime.getMinutes() + 40)

    let message = {}

    const calendar = google.calendar({ version: "v3", auth });

        const event = {
            start: {
                dateTime: startTime.toISOString()
            },
            end: {
                dateTime: finishTime.toISOString()
            }
        };
    calendar.events.insert(
        {
            auth: auth,
            calendarId: "primary",
            resource: event
        },

        (err, res) => {
            if (err) {
                message.success = false
                message.message = "Invalid booking time"
                resolve(message);
            } else {
                message.success = true
                message.startTime = startTime.toISOString()
                message.endTime = finishTime.toISOString()
                resolve(message);
            }
            }
        );
    });
}

