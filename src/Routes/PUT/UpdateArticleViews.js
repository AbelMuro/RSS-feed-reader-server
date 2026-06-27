const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.put('/update-article-views', async (req, res) => {
    try{
        const {articleId} = req.body;

        const [articles] = await db.execute(
            'SELECT * FROM articles WHERE id = ?', 
            [articleId]
        );

        if(!articles.length)
            return res.status(404).send("Article was not found in database");

        const prevViews = articles[0].views + 1; 

        const [results] = await db.execute(
            'UPDATE articles SET views = ? WHERE id = ?',
            [prevViews, articleId]
        );

        if(!results.affectedRows)
            return res.status(401).send(results.message);

        res.status(200).send("Article view has been updated");
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;