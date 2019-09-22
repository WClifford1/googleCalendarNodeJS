async function getAppointmentTimes(year, month, day) {

    const appointmentTimes = [
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


    const twentyFourHoursFuture = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/)
    let newapps = []

    for(let i = 0; i < appointmentTimes.length; i++){
        if (new Date(appointmentTimes[i].startTime) >= twentyFourHoursFuture){
            newapps.push(appointmentTimes[i])
        }
    }


    console.log(newapps)
}

getAppointmentTimes(2019, "09", 11)