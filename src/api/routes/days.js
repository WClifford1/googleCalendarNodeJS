const express = require('express')
const router = express.Router()
const getDays = require('../../../services/getDays')
const auth = require('../../../services/auth')

// Get the availble days for the month
// /days?year=yyyy&month=mm
router.get('/', async (req, res) => {
    try {
        const { year, month } = req.query
        const oAuth2Client = await auth()
        const result = await getDays(oAuth2Client, year, month)
        res.status(200).send(result)
    } catch(e) {
        res.status(400).send({
            "success": false,
            "message": e
        })
    }
})

module.exports = router