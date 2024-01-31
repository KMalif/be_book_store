const express = require('express');
const dotenv = require('dotenv');

const app = express();
const Port = process.env.NODEJS_PORT || 3000;

const Books = require('./server/api/books');


dotenv.config();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/books', Books);

app.listen(Port, () => {
  console.log(['Info'], `Server started on port ${Port}`);  
});