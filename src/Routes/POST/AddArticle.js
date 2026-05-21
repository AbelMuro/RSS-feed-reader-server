const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.post('/add-article', async (req, res) => {
    try{
        const {title, content, category} = req.body;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;
        const articleId = uuid();
        const date = Date.now();

        const [results] = await db.execute(
            'INSERT INTO articles (id, account_id, title, content, category, date_created) VALUES (?, ?, ?, ?, ?, ?)',
            [articleId, accountId, title, content, category, date]
        );

        if(!results.affectedRows)
            return res.status(403).send(results.message);

        res.status(200).send('Successfully created article')
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});


module.exports = router;