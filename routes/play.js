var express = require('express');
var util = require('../config/util.js');
var router = express.Router();
const { validationResult, param } = require('express-validator');
const { getTokenInfo } = require('../rpc/rpc.js');
const validateAddressParam = [
    param('address').isAlphanumeric().isLength({ min: 42, max: 42 }).withMessage('Invalid address'),
];

router.get('/', function(req, res) {
    res.render('partials/play', {
        title: 'Chess Hub - Game',
        user: req.user,
        isPlayPage: true
    });
});

router.post('/', function(req, res) {
    var side = req.body.side;
    //var opponent = req.body.opponent; // playing against the machine in not implemented
    var token = util.randomString(20);
    res.redirect('/game/' + token + '/' + side);
});

router.get('/tokenInfo/:address', validateAddressParam, async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const address = req.params.address;
        const tokenInfo = await getTokenInfo(address);
        res.status(200).send(tokenInfo);
    } catch (err) {
        res.status(500).send(`Internal server error! ${err}`);
    }
});

module.exports = router;