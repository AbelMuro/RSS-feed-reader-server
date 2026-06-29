const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');
const {v4: uuid} = require('uuid');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const {config} = require('dotenv');
config();
const storage = multer.memoryStorage();
const upload = multer({
    storage
});

router.post('/add-article', upload.single('file'), async (req, res) => {
    try{
        const {title, content, category} = req.body;
        const coverImage = req.file;
        const JWT_SECRET = process.env.JWT_SECRET;
        const accountToken = req.cookies.accountToken;

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');


        const mimetype = coverImage.mimetype;
        const size = coverImage.size;
        const buffer = coverImage.buffer;
        const filename = coverImage.originalname;

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;
        const articleId = uuid();
        const articleImageId = uuid();
        const date = Date.now();

        const [articleResults] = await db.execute(
            'INSERT INTO articles (id, account_id, title, content, category, date_created) VALUES (?, ?, ?, ?, ?, ?)',
            [articleId, accountId, title, content, category, date]
        );

        const [imageResults] = await db.execute(
            'INSERT INTO article_cover_images (id, articleId, filename, size, buffer, mimetype) VALUES (?, ?, ?, ?, ?, ?)',
            [articleImageId, articleId, filename, size, buffer, mimetype]
        )

        if(!articleResults.affectedRows)
            return res.status(403).send(articleResults.message);

        if(!imageResults.affectedRows)
            return res.status(403).send(imageResults.message);

        res.status(200).send('Successfully created article');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});


module.exports = router;