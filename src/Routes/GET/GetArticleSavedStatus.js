const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.get('/is-article-saved/:articleId', (req, res) => {
    try{
        const articleId = req.params.articleId;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId]
        );

        if(!results.length)
            return res.status(404).send('Account was not found in database');

        const savedArticles = results[0].savedArticles;

        for(let article in savedArticles){
            if(article.id === articleId)
                return res.status(200).json(true)
        }

        res.status(200).json(false);

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;