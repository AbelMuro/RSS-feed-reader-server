const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.get('/get-all-categories', async (req, res) => {
    try{
        const [articles] = await db.execute(
            'SELECT * FROM articles',
            []
        );
        const categories = articles.map((article) => {
            return article.category;
        })

        res.status(200).json(categories);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})

module.exports = router;