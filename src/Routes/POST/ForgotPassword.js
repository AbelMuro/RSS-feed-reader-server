const express = require('express');
const router = express.Router();
const crypto = require('crypto')
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.post('/forgot-password', async (req, res) => {
    try{
        const {email} = req.body;
        const resetToken = crypto.randomBytes(32).toString('hex');
        const resetTokenExpiration = Date.now();


    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

});

module.exports = router;