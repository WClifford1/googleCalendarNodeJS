// Generate appointment times
// Generate 12 x 40 minute timeslots between 9am and 6pm
// Appointments have a 5 minute break between
// Returns an object with the start and end time of each appointment

// Appointment times are:
// 0900 - 0940, 0945 - 1025, 1030 - 1110, 1115 - 1155
// 1200 - 1240, 1245 - 1325, 1330 - 1410, 1415 - 1455
// 1500 - 1540, 1545 - 1625, 1630 - 1710, 1715 - 1755

function createAppointmentTimes(){
    let start = new Date();
    let end = new Date()
    let appointmentTimes = []

    for (let i = 0; i < 12; i++){
        start.setUTCHours(09);
        end.setUTCHours(09);
        start.setUTCMinutes(0 + i * 45)
        end.setUTCMinutes(-5 + (i + 1) * 45)
        let startHours = start.getUTCHours();
        let endHours = end.getUTCHours();
        let startMinutes = start.getUTCMinutes();
        let endMinutes = end.getUTCMinutes();
        appointmentTimes.push({
            startTime: {hours: startHours, minutes: startMinutes},
            endTime: {hours: endHours, minutes: endMinutes}
        })
    }
    return appointmentTimes
}

module.exports = createAppointmentTimes