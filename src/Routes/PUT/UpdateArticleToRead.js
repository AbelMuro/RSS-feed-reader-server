const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.put('/update-article-to-read', async (req, res) => {
    try{
        const {articleId} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'INSERT INTO articles_read (accountId, articleId) VALUES (?, ?)',
            [accountId, articleId]
        );

        if(!results.affectedRows)
            return res.status(403).send(results.message);

        res.status(200).send('Article marked as read');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;