const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.put('/update-categories', async (req, res) => {
    try{
        const {categories} = req.body;
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking is not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'UPDATE accounts SET categories = ? WHERE id = ?',
            [categories, accountId]
        );

        if(!results.affectedRows)
            return res.status(403).send(results.message);

        res.status(200).send('Categories have been updated in the account');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;