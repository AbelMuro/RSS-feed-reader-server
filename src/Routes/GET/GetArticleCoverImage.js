const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-article-cover-image/:articleId', async (req, res) => {
    try{
        const articleId = req.params.articleId;
        const [results] = await db.execute(
            'SELECT * FROM article_cover_images WHERE articleId = ?',
            [articleId]
        );

        if(!results.length)
            return res.status(404).send(results.message);

        const filename = results[0].filename;
        const size = results[0].size;
        const buffer = results[0].buffer;
        const mimetype = results[0].mimetype;

        res.set('Content-Type', mimetype);
        res.status(200).send(buffer);
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
});

module.exports = router;