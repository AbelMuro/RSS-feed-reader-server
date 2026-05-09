const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/update-password', async (req, res) => {
    try{
        const {oldPassword, newPassword} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;        

        const [accounts] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId]
        );

        if(!accounts.length)
            return res.status(404).send("Account couldn't be found or was deleted");

        const oldHashedPassword = accounts[0].password;
        const matches = await bcrypt.compare(oldPassword, oldHashedPassword);

        if(!matches)
            return res.status(401).send('Password is incorrect');

        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(newPassword, salt);

        const [results] = await db.execute(
            'UPDATE accounts SET password = ? WHERE id = ?',
            [newHashedPassword, accountId]
        );

        if(!results.affectedRows)
            return res.status(404).send(results.message);

        res.status(200).send('Password has been successfully updated');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;