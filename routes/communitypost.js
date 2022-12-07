const express = require('express');
const router = express.Router();
const data = require('../data');
const path = require('path');

router.get('/', async (req, res) => {
    res.status(200).render('communitypost', {
        title : "Communitypost \• Jimbro",
        message : "Create Posts",
        session : req.session.user
    });
});

module.exports = router;