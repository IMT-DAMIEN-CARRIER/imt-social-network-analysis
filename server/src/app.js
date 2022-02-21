const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');
const personMySqlroute = require('../routes/MysqlRoutes/personMySqlRoute');

require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});

app.get('/', (req, res) => {
    res.send('Hello world !');
});

app.use('/mysql', personMySqlroute)