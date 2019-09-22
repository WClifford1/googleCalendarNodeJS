const {google} = require('googleapis');


module.exports = function getTimeslotsForDay(auth, year, month, day) {
    
    return new Promise(function(resolve, reject) {
        const timeslots = [
            {startTime: `${year}-${month}-${day}T09:00:00.000Z`, endTime: `${year}-${month}-${day}T09:40:00.000Z`},
            {startTime: `${year}-${month}-${day}T09:45:00.000Z`, endTime: `${year}-${month}-${day}T10:25:00.000Z`},
            {startTime: `${year}-${month}-${day}T10:30:00.000Z`, endTime: `${year}-${month}-${day}T11:10:00.000Z`},
            {startTime: `${year}-${month}-${day}T11:15:00.000Z`, endTime: `${year}-${month}-${day}T11:55:00.000Z`},
            {startTime: `${year}-${month}-${day}T12:00:00.000Z`, endTime: `${year}-${month}-${day}T12:40:00.000Z`},
            {startTime: `${year}-${month}-${day}T12:45:00.000Z`, endTime: `${year}-${month}-${day}T13:25:00.000Z`},
            {startTime: `${year}-${month}-${day}T13:30:00.000Z`, endTime: `${year}-${month}-${day}T14:10:00.000Z`},
            {startTime: `${year}-${month}-${day}T14:15:00.000Z`, endTime: `${year}-${month}-${day}T14:55:00.000Z`},
            {startTime: `${year}-${month}-${day}T15:00:00.000Z`, endTime: `${year}-${month}-${day}T15:40:00.000Z`},
            {startTime: `${year}-${month}-${day}T15:45:00.000Z`, endTime: `${year}-${month}-${day}T16:25:00.000Z`},
            {startTime: `${year}-${month}-${day}T16:30:00.000Z`, endTime: `${year}-${month}-${day}T17:10:00.000Z`},
            {startTime: `${year}-${month}-${day}T17:15:00.000Z`, endTime: `${year}-${month}-${day}T17:55:00.000Z`}
        ]
        const calendar = google.calendar({ version: "v3", auth });
        calendar.events.list(
        {
            calendarId: "primary",
            singleEvents: true,
            orderBy: "startTime",
            timeMin: `${year}-${month}-${day}T00:00:00.000Z`,
            timeMax: `${year}-${month}-${day}T23:59:00.000Z`,
            timeZone: "UTC"
        },
        (err, res) => {
            if (err) {
                reject(err);
            } else {
                const events = res.data.items;
                for(let i = 0; i < events.length; i++){
                    console.log(events)
                    let time = new Date(events[i].start.dateTime)
                    for(let j = 0; j < timeslots.length; j++){
                        if (timeslots[j].startTime === time.toISOString()){
                            timeslots.splice(j, 1)
                        }
                    }
                }
                resolve(timeslots)
            }
        });
    })
};