const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-most-viewed-articles', async (req, res) => {
    try{
        const [articles] = await db.execute(
            'SELECT * FROM articles'
        );

        const sortedArticlesBasedOnViews = articles.sort((articleA, articleB) => {
            if(articleA.views > articleB.views)
                return -1;
            else
                return 1;
        });


        res.status(200).json(sortedArticlesBasedOnViews.slice(0, 10));
    }
    catch(error){
        const message = error.message;
        console.log(message);
    }
});

module.exports = router;