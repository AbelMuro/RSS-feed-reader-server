const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-article/:articleId', async (req, res) => {
    try{
        const articleId = req.params.articleId;

        const [results] = await db.execute(
            'SELECT * FROM articles WHERE id = ?',
            [articleId]
        );

        if(!results.length)
            return res.status(404).send(results.message);

        res.status(200).json(results[0]);

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;