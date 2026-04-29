const express = require('express');
const router = express.Router();
const crypto = require('crypto');
const mailer = require('nodemailer');
const db = require('../../Config/MySQL/db.js');
const {config} = require('dotenv');
config();

router.post('/forgot-password', async (req, res) => {
    try{
        const {email} = req.body;
        const resetToken = crypto.randomBytes(32).toString('hex');
        const hashedResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const resetTokenExpiration = Date.now() + 10 * 60 * 1000;
        const resetLink = `http://localhost:5173/reset-password/${resetToken}`;

        const [results] = await db.execute(
            'UPDATE accounts SET resetToken = ?, resetTokenExpiration = ? WHERE email = ?',
            [hashedResetToken, resetTokenExpiration, email]
        );

        if(!results.affectedRows)
            return res.status(404).send('Email is not registered');

        const transporter = mailer.createTransport({
            host: 'smtp.gmail.com',
            secure: true,
            port: 465,
            auth: {
                user: process.env.user,
                pass: process.env.password
            }
        });

        await transporter.sendMail({
            from: process.env.user,
            to: email,
            subject: 'Reset Link for RSS feed reader app',
            text: `Please click on the following link to reset your password, ${resetLink}`
        })

        res.status(200).send('Reset Link has been sent');
    }
    catch(error){
        const message = error.message;
        console.log(message);
        res.status(500).send(message);
    }

});

module.exports = router;