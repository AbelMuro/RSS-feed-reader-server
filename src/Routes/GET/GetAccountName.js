const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-account-name/:accountId', async (req, res) => {
    try{
        const accountId = req.params.accountId;
        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId]
        );
        if(!results.length)
            return res.status(404).send('User not found');
        
        const accountName = results[0].account_name;
        res.status(200).send(accountName);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;