const timeslots = require('./routes/timeslots')
const days = require('./routes/days')
const book = require('./routes/book')

module.exports = function(app) {
    app.use('/days', days)
    app.use('/book', book)
    app.use('/timeslots', timeslots)
}