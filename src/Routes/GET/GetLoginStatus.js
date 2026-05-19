const express = require('express');
const router = express.Router();
const {config} = require('dotenv');
config();

router.get('/get-login-status', (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('User is not logged in');

        res.status(200).send('User is logged in');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;