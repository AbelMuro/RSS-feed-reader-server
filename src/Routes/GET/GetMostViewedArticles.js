const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-most-viewed-articles', async (req, res) => {
    try{
        const [articles] = await db.execute(
            'SELECT * FROM articles'
        );

        res.status(200).json(articles);
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
});

module.exports = router;