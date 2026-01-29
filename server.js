const express = require('express');

const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const path = require('path');
require('dotenv').config();


const app = express();



app.use(express.static('public'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


const dbURI = process.env.DB_URI || 'mongodb://localhost:27017/task-manager-db';
mongoose.connect(dbURI)
    .then((result) => app.listen(3000, () => console.log('Server running on port 3000')))
    .catch((err) => console.log(err));


const authRoutes = require('./routes/authRoutes');
const taskRoutes = require('./routes/taskRoutes');
const { checkUser } = require('./middleware/authMiddleware');

app.use(checkUser);
app.use(authRoutes);
app.use('/tasks', taskRoutes);

app.get('/', (req, res) => res.redirect('/tasks'));


app.use((req, res) => {
    res.status(404).send('404 Not Found');
});

module.exports = app;
