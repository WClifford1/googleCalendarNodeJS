// Routes to post and view enquiries from the enquiry form
const express = require('express')
const router = express.Router()
const getTimeslots = require('../../../services/getTimeslots')
const auth = require('../../../auth')

// Get the timeslots for the day
// timeslots?year=yyyy&month=mm&day=dd
router.get('/', async (req, res) => {
    try {
        const { year, month, day } = req.query
        const oAuth2Client = await auth()
        
        const result = await getTimeslots(oAuth2Client, year, month, day)
        res.status(200).send(result)
    } catch(e) {
        res.status(400).send({
            "success": false,
            "message": e
        })
    }
})

module.exports = router
