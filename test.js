const year = 2019
const month = "09"
const day = "26"


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


const events = [ 
    { 
        kind: 'calendar#event',
        etag: '"3138133949842000"',
        id: 'ls2gvdegj4hb37mmcjsd4t2uu8',
        status: 'confirmed',
        htmlLink:
        'https://www.google.com/calendar/event?eid=bHMyZ3ZkZWdqNGhiMzdtbWNqc2Q0dDJ1dTggYXBwYWNjODkyMDE5QG0&ctz=UTC',
        created: '2019-09-21T11:56:14.000Z',
        updated: '2019-09-21T11:56:14.921Z',
        creator: { email: 'appacc892019@gmail.com', self: true },
        organizer: { email: 'appacc892019@gmail.com', self: true },
        start: { dateTime: '2019-09-26T10:00:00Z' },
        end: { dateTime: '2019-09-26T11:10:00Z' },
        iCalUID: 'ls2gvdegj4hb37mmcjsd4t2uu8@google.com',
        sequence: 0,
        reminders: { useDefault: true }
    },
    { 
        kind: 'calendar#event',
        etag: '"3138140554636000"',
        id: 'fq1ulnscsinm19ssr0oqu3h8io',
        status: 'confirmed',
        htmlLink:
        'https://www.google.com/calendar/event?eid=ZnExdWxuc2NzaW5tMTlzc3Iwb3F1M2g4aW8gYXBwYWNjODkyMDE5QG0&ctz=UTC',
        created: '2019-09-21T12:51:17.000Z',
        updated: '2019-09-21T12:51:17.318Z',
        creator: { email: 'appacc892019@gmail.com', self: true },
        organizer: { email: 'appacc892019@gmail.com', self: true },
        start: { dateTime: '2019-09-26T11:15:00Z' },
        end: { dateTime: '2019-09-26T11:55:00Z' },
        iCalUID: 'fq1ulnscsinm19ssr0oqu3h8io@google.com',
        sequence: 0,
        reminders: { useDefault: true } 
    } 
]



for(let i = 0; i < events.length; i++){
    let time = new Date(events[i].start.dateTime)
    console.log(time.toISOString())
    for(let j = 0; j < timeslots.length; j++){
        if (timeslots[j].startTime === time.toISOString()){
            timeslots.splice(j, 1)
        }
    }
}

console.log(timeslots)