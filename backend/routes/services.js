//services.js
const router = require('express').Router();
const { getDirections } = require('../helpers');
/*Used clade to get routing*/
// Get Directions Data
router.get('/get-directions', async (req, res) => {
    const { start, end, date, time } = req.query; // Extract start, end, date, and time from query params
    try {
        const result = await getDirections(start, end, date, time);
        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;