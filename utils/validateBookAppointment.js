module.exports = function validateBookAppointment( year, month, day, hour, minute ){

    const date = new Date()
    const proposedTimeOfBooking = new Date(Date.UTC(year, month - 1, day, hour, minute))  
    const twentyFourHoursFuture = new Date(Date.now() + 1000 /*sec*/ * 60 /*min*/ * 60 /*hour*/ * 24 /*day*/)

    // Appointment must not be in the past
    // if (proposedTimeOfBooking < date) {
    //     return {
    //         "success": false,
    //         "message": "Cannot book time in the past"            
    //     }
    // }

    // // Appointment must not be less than 24 hours in the future
    // if (proposedTimeOfBooking <= twentyFourHoursFuture && proposedTimeOfBooking > date) {
    //     return {
    //         "success": false,
    //         "message": "Cannot book with less than 24 hours in advance"            
    //     }
    // }

    // Appointment must not be on a weekday
    if (proposedTimeOfBooking.getDay() === 6 || proposedTimeOfBooking.getDay() === 0 || proposedTimeOfBooking.getUTCHours() < 9 || proposedTimeOfBooking.getUTCHours() > 17) {
        return {
            "success": false,
            "message": "Cannot book outside bookable timeframe: The time slot provided was not on a weekday between 9 am and 6 pm"
        }
    }
    else {
        return
    }
}