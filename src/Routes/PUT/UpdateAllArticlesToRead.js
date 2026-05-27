const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/mark-all-read', async (req, res) => {
    try{
        const {articles} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        for(const article in articles){
            const articleId = article.id;

            const [results] = await db.execute(
                'INSERT INTO articles_read (account_id, articles_id) VALUES (?, ?)',
                [accountId, articleId]
            );
            
            if(!results.affectedRows)
                console.log(results.message);
        };

        res.status(200).send('All articles have been marked as read');

    } 
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;