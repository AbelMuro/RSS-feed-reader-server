const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const Register = require('./Routes/POST/Register.js');
const Login = require('./Routes/POST/Login.js');
const ForgotPassword = require('./Routes/POST/ForgotPassword.js');
const ResetPassword = require('./Routes/POST/ResetPassword.js');
const UpdateEmail = require('./Routes/PUT/UpdateEmail.js');
const UpdateEmailNotification = require('./Routes/PUT/UpdateEmailNotification.js');
const UpdateTextNotification = require('./Routes/PUT/UpdateTextNotification.js');
const GetRealImage = require('./Routes/GET/GetRealImage.js');
const UpdateImage = require('./Routes/PUT/UpdateImage.js');
const UpdatePassword = require('./Routes/PUT/UpdatePassword.js');
const AddArticle = require('./Routes/POST/AddArticle.js');
const DeleteAccount = require('./Routes/DELETE/DeleteAccount.js');
const GetAllArticles = require('./Routes/GET/GetAllArticles.js');
const GetLoginStatus = require('./Routes/GET/GetLoginStatus.js');
const app = express();
const port = 4000;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', ''],
    credentials: true,
}));

app.use(express.json());
app.use(cookieParser());

app.use(Register);
app.use(Login);
app.use(ForgotPassword);
app.use(ResetPassword);
app.use(UpdateEmail);
app.use(UpdateEmailNotification);
app.use(UpdateTextNotification);
app.use(GetRealImage);
app.use(UpdateImage);
app.use(UpdatePassword);
app.use(AddArticle);
app.use(DeleteAccount);
app.use(GetAllArticles);
app.use(GetLoginStatus);

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