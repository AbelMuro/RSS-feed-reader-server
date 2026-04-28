const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();


router.post('/login', async (req, res) => {
    try{
        const {email, password} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const [accounts] = await db.execute(
            'SELECT * FROM accounts WHERE email = ?',
            [email]
        );

        if(!accounts.length)
            return res.status(404).send('Email is not registered');
    
        const hashedPassword = accounts[0].password;
        const matches = await bcrypt.compare(password, hashedPassword);

        if(!matches)
            return res.status(401).send('Email or password is incorrect');

        const token = jwt.sign({...accounts[0]}, JWT_SECRET);
        res.cookie('accountToken', token);
        res.status(200).send('User is logged in');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;