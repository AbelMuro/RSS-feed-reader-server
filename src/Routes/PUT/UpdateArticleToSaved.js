const express = require("express");
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/save-article', async (req, res) => {
    try{
        const {articleId} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;

        const [results] = await db.execute(
            'UPDATE accounts SET savedArticles = ? WHERE id = ?',
            [articleId, accountId]
        )

        if(!results.affectedRows)
            return res.status(500).send(results.message);

        res.status(200).send('Article has been saved');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});
module.exports = router;