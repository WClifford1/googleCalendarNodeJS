module.exports = function validateBookAppointment( year, month, day, hour, minute ){

    // Appointment must be at least 24 hours in advance
    const proposedTimeOfBooking = new Date(Date.UTC(year, month - 1, day, hour, minute))  
    const twentyFourHoursFuture = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/)

    if (proposedTimeOfBooking <= twentyFourHoursFuture) {
        return {
            "success": false,
            "message": "Appointments have to be made at least 24 hours in advance"            
        }
    }

    // Appointment must not be on a weekday
    else if (proposedTimeOfBooking.getDay() === 6 || proposedTimeOfBooking.getDay() === 0) {
        return {
            "success": false,
            "message": "Appointments can only be made on a weekday"
        }
    }
    else {
        return
    }
}
