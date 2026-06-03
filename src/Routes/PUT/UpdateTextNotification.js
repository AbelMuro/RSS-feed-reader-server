const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/receive-texts', async (req, res) => {
    try{
        const {receiveTexts} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;
        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'UPDATE accounts SET receiveTexts = ? WHERE id = ?',
            [receiveTexts, accountId]
        );

        if(!results.affectedRows)
            return res.status(404).send(results.message);

        const newAccountToken = jwt.sign({...decodedToken, receiveTexts}, JWT_SECRET);
        res.cookie(
            'accountToken',
            newAccountToken,
            {httpOnly: true, sameSite: 'Strict', secure: true}
        )
        res.status(200).send('Successfully updated text notification');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;