const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.get('/get-image', async (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'SELECT * FROM account_images WHERE account_id = ?', 
            [accountId]
        );

        if(!results.length)
            return res.status(404).send("User doesn't have a photo");

        const buffer = results[0]?.buffer;
        const mimeType = results[0]?.mimeType;

        res.set('Content-Type', mimeType);
        res.status(200).send(buffer);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;