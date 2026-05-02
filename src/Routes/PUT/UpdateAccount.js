const express = require('express');
const router = express.Router();
const multer = require('multer');
const db = require('../../Config/MySQL/db.js');
const storage = multer.memoryStorage();
const upload = multer({storage});
const jwt = require('jsonwebtoken');
const {config} = require('dotenv');
config();

router.put('/update-account', upload.single('image'), async (req, res) => {
    try{
        const {email} = req.body;
        const file = req.file;
        const accountToken = req.cookies.accountToken;
        const JWT_SECRET = process.env.JWT_SECRET;

        if(!accountToken)
            return res.status(400).send('Third-party-cookies and/or cross-site-tracking are not enabled in the browser');

        const account = jwt.decode(accountToken, JWT_SECRET);

        const [updateEmail] = await db.execute(
            'UPDATE accounts SET email = ? WHERE id = ?',
            [email, account.id]
        );

        if(!updateEmail.affectedRows)
            return res.status(404).send(results.message);

        if(file){
            const [updateImage] = await db.execute(
                'UPDATE account_images SET name = ?, mimetype = ?, size = ?, buffer = ? WHERE account_id = ?',
                [file.filename, file.mimetype, file.size, file.buffer, account.id]
            )    
            
            if(!updateImage.affectedRows)
                return res.status(404).send(`Updated the email, but couldn't update account image : ${results.message}`);

            const [deleteOldImage] = await db.execute(
                'DELETE FROM account_images WHERE account_id = ?',
                [account.id]
            );

            if(!deleteOldImage.affectedRows)
                return res.status(404).send(`Update the email and image, but couldn't delete the old account image : ${results.message}`)
        }

        res.status(200).send('Successfully updated account details')

    }
    catch(error){
        const message = error.message;
        const code = error.code;
        console.log(message);

        if(code === 'ER_DUP_ENTRY')
            res.status(500).send('Email already exists');
    }
})

module.exports = router;