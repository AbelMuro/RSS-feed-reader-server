const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/receive-emails', async (req, res) => {
    try{
        const {receiveEmails} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;
        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'UPDATE accounts SET receiveEmails = ? WHERE id = ?',
            [receiveEmails, accountId]
        );

        if(!results.affectedRows)
            return res.status(404).send(results.message);

        res.status(200).send('Successfully updated email preference');


    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;