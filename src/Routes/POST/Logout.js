const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
    try{
        res.clearCookie('accountToken');
        res.status(200).send('User has logged out');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;