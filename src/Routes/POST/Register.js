const express = require('express');
const router = express.Router();
const db = require('../../Config/MySQL/db.js');

router.post('/register', (req, res) => {
    try{

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
})