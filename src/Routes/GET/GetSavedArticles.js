const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.get('/get-saved-articles', async (req, res) => {
    try{
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [savedArticles] = await db.execute(
            'SELECT * FROM saved_articles WHERE accountId = ?',
            [accountId]
        );
        const articles = [];

        for(let savedArticle of savedArticles){
            const [results] = await db.execute(
                'SELECT * FROM articles WHERE id = ?',
                [savedArticle.articleId]
            );
            
            articles.push(results[0]);
        };

        console.log()


        res.status(200).json({articles});

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;