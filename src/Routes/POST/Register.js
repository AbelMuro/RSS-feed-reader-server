const express = require('express');
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
        const {email, password} = req.body;
        const image = req.file;
        const accountId = uuid(); 
        const salt = bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [results] = await db.execute(
            'INSERT INTO accounts (email, password, id) values (?, ?, ?)',
            [email, hashedPassword, accountId],
        );

        if(results.affectedRows === 1)
            res.status(200).send(results.message);
        else
            res.status(501).send(results.message);
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;