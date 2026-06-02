const express = require('express');
const router = express.Router();
const {v4 : uuid} = require('uuid');
const db = require('../../Config/MySQL/db.js');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const storage = multer.memoryStorage();
const input = multer({storage});
const {config} = require('dotenv');
config();

router.put('/update-image', input.single('image'), async (req, res) => {
    try{
        const file = req.file;
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!file)
            return res.status(401).send('File was not sent to the backend')

        if(!accountToken)
            return res.status(401).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const decodedToken = jwt.decode(accountToken, JWT_SECRET);
        const accountId = decodedToken.id;
        const name = file.originalname;
        const mimeType = file.mimetype;
        const size = file.size;
        const buffer = file.buffer;

        const [updateImage] = await db.execute(
            'UPDATE account_images SET name = ?, mimetype = ?, size = ?, buffer = ? WHERE account_id = ?',
            [name, mimeType, size, buffer, accountId]
        );

        if(!updateImage.affectedRows){
            const imageId = uuid();
            const [insertImage] = await db.execute(
                'INSERT INTO account_images (id, account_id, name, mimetype, size, buffer) VALUES (?, ?, ?, ?, ?, ?)',
                [imageId, accountId, name, mimeType, size, buffer]
            );

            if(!insertImage.affectedRows)
                return res.status(400).send(insertImage.message);
        
            res.cookie(
                'accountToken',
                {
                    ...decodedToken,
                    imageId
                },
                {httpOnly: true, sameSite: 'Strict', secure: true}
        )
        }

        res.status(200).send('Successfully updated account image');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;