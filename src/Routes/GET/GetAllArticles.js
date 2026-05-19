const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-all-articles', async (req, res) => {
    try{
        const [articles] = await db.execute(
            'SELECT * FROM articles',
            []
        );

        if(!articles.length)
            return res.status(404).send(articles.message);

        res.status(200).json(articles);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;