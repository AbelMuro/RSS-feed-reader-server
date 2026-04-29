const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const db = require('../../Config/MySQL/db.js');

router.post('/reset-password', async (req, res) => {
    try{
        const {resetToken, password} = req.body;
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const currentTime = Date.now();

        const [accounts] = await db.execute(
            'SELECT * FROM accounts WHERE resetToken = ?',
            [hashedResetToken]
        );

        if(!accounts.length || Number(accounts[0].resetTokenExpiration) < currentTime)
            return res.status(404).send('Reset Token expired');

        const [results] = await db.execute(
            'UPDATE accounts SET password = ?, resetToken = ?, resetTokenExpiration = ? WHERE resetToken = ?',
            [hashedPassword, '', '', hashedResetToken]
        );

        if(!results.affectedRows)
            return res.status(501).send(results.message);

        res.status(200).send('Password has been reset');

    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }
});

module.exports = router;