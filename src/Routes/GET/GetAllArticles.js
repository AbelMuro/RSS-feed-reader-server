const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.get('/get-all-articles', async (req, res) => {
    try{
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;
        let unreadArticles = 0;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        console.log(decodedToken);
        const accountId = decodedToken.id;

        let [articles] = await db.execute(
            'SELECT * FROM articles',
            []
        );

        const [account] = await db.execute(
            'SELECT * FROM accounts WHERE id = ?',
            [accountId]
        );

        if(!account.length)
            return res.status(404).send(account.message);


        let preferedCategories;
        
        if(account[0].categories)
            preferedCategories = account[0].categories?.split(',');

        if(preferedCategories){
            articles = articles.filter((article) => {
                const articleCategories = article.category?.split(',');
                return preferedCategories.some((category) => articleCategories.includes(category));
            });
        }


        for(let i = 0; i < articles.length; i++){
            console.log(articles[i]);
            const articleId = articles[i].id;
            const [result] = await db.execute(
                'SELECT * FROM articles_read WHERE articleId = ? AND accountId = ?',
                [articleId, accountId]
            );

            if(!result.length)
                unreadArticles++;
        }


        res.status(200).json({articles, unreadArticles});
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;