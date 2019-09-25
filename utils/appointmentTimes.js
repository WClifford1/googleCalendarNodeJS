
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