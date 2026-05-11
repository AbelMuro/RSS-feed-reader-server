const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.delete('/delete-account', async (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        await db.execute(
            'DELETE FROM account_images WHERE account_id = ?',
            [accountId]
        );

        await db.execute(
            'DELETE FROM articles WHERE account_id = ?',
            [accountId]
        );

        const [accountDeletion] = await db.execute(
            'DELETE FROM accounts WHERE id = ?',
            [accountId]
        );

        if(!accountDeletion.affectedRows)
            return res.status(404).send(results.message);

        res.status(200).send('Successfully deleted account');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;