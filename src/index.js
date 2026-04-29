const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Register = require('./Routes/POST/Register.js');
const Login = require('./Routes/POST/Login.js');
const ForgotPassword = require('./Routes/POST/ForgotPassword.js');
const ResetPassword = require('./Routes/POST/ResetPassword.js');
const app = express();
const port = 4000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,

}));
app.use(express.json());
app.use(cookieParser());

app.use(Register);
app.use(Login);
app.use(ForgotPassword);
app.use(ResetPassword);

app.get('/', (req, res) => {
    res.send('hello world');
});

app.listen(port, (error) => {
    if(error){
        console.log(error, 'error occured');
        return;
    }

    console.log(`Server is running on port ${port}`);
});