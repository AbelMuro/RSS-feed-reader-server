const express = require('express');
const cors = require('cors');
const Register = require('./Routes/POST/Register.js');
const app = express();
const port = 4000;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,

}));
app.use(express.json());

app.use(Register);

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