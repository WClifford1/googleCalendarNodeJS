const express = require('express')
const router = express.Router()
const bookAppointment = require('../../../services/bookAppointment')

// Book and appointment
// /book?year=yyyy&month=MM&day=dd&hour=hh&minute=mm
router.post('/', async (req, res) => {
    const { year, month, day, hour, minute } = req.query
    try {
    const result = await bookAppointment(year, month, day, hour, minute)
    res.status(200).send(result)
    } catch(e) {
        res.status(400).send({
            "success": false,
            "message": e
        })
    }
})

module.exports = router