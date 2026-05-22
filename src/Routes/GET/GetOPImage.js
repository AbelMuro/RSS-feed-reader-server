const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-image/:accountId', async (req, res) => {
    try{
        const accountId = req.params.accountId;

        const [results] = await db.execute(
            'SELECT * FROM account_images WHERE account_id = ?', 
            [accountId]
        );

        if(!results.length)
            return res.status(404).send("User doesn't have a photo");

        const buffer = results[0]?.buffer;
        const mimeType = results[0]?.mimeType;

        res.set('Content-Type', mimeType);
        res.status(200).send(buffer);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;