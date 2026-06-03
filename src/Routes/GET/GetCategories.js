const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get-categories', async (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;
        
        if(!accountToken)
            return res.status(401).send("Third-party-cookies and/or cross-site-tracking are not enabled in the browser");

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId]
        );

        if(!results.length)
            return res.status(404).send(results.message);

        let categories;
        if(results[0].categories)
            categories = results[0].categories.split(',');

        res.status(200).json(categories ? categories : []);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;