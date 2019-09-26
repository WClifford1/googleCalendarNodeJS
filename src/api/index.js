const timeslots = require('./routes/timeslots')
// const days = require('./api/days')
// const book = require('./api/book')

module.exports = function(app) {
    // app.use('/days', days)
    // app.use('/book', book)
    app.use('/timeslots', timeslots)
}