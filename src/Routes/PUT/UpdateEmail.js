const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/update-email', async (req, res) => {
    try{
        const {email} = req.body;
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!accountToken)
            return res.status(400).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const account = jwt.decode(accountToken, JWT_SECRET);

        const [updateEmail] = await db.execute(
            'UPDATE accounts SET email = ? WHERE id = ?',
            [email, account.id]
        );

        if(!updateEmail.affectedRows)
            return res.status(404).send(results.message);

        res.cookie(
            'accountToken',
            {
                ...decodedToken,
                email
            },
            {httpOnly: true, sameSite: 'Strict', secure: true}
        )
        res.status(200).send('Successfully updated account details')

    }
    catch(error){
        const message = error.message;
        const code = error.code;
        console.log(message);

        if(code === 'ER_DUP_ENTRY')
            res.status(500).send('Email already exists');
    }
})

module.exports = router;