const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {v4: uuid} = require('uuid');
const db = require('../../Config/MySQL/db.js');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage
})

router.post('/register', upload.single('image'), async (req, res) => {
    try{
        const {email, password, company} = req.body;
        const image = req.file;
        const accountId = uuid(); 
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        if(image){
            const imageId = uuid();

            const [accountResults] = await db.execute(
                'INSERT INTO accounts (email, password, id, imageId, company) VALUES (?, ?, ?, ?, ?)',
                [email, hashedPassword, accountId, imageId, company],
            );

            if(!accountResults.affectedRows)
                return res.status(501).send(accountResults.message);

            const [imageResults] = await db.execute(
                'INSERT INTO account_images (id, account_id, name, mimetype, size, buffer) VALUES (?, ?, ?, ?, ?, ?)',
                [imageId, accountId, image.originalname, image.mimetype, image.size, image.buffer]
            );

            if(!imageResults.affectedRows)
                return res.status(501).send('Account was created, but image could not be uploaded');

            res.status(200).send('Account has been created');
        }
        else{
            const [accountResults] = await db.execute(
                'INSERT INTO accounts (email, password, id, company) VALUES (?, ?, ?, ?)',
                [email, hashedPassword, accountId, company],
            );

            if(!accountResults.affectedRows)
                return res.status(501).send(accountResults.message);

            res.status(200).send('Account has been created');
        }    
    }
    catch(error){
        const message = error.message;
        const code = error.code;
        console.log(message);

        if(code === 'ER_DUP_ENTRY')
            res.status(500).send('Email already exists');
        else
            res.status(500).send(message);
    }
});

module.exports = router;