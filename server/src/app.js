const cookieParser = require('cookie-parser');
const cors = require('cors');
const express = require('express');

require("dotenv").config();

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: process.env.CLIENT_URL }));

const port = process.env.PORT || 5050;

app.listen(port, () => {
    console.log(`Server start on port ${port}`);
});
