require('dotenv').config();
const express = require('express');
const massive = require('massive');
const session = require('express-session');
const authCtrl = require('./controllers/authController');
const moveCtrl = require('./controllers/moveController');
const userCtrl = require('./controllers/userController');
const auth = require('./middleware/authMiddleware');

const app = express();

const {CONNECTION_STRING, SERVER_PORT, SESSION_SECRET} = process.env;

app.use(express.json());

app.use(session({
    resave: true,
    saveUninitialized: false,
    secret: SESSION_SECRET,
    cookie: {maxAge: 1000*60*60*24*7}
}));

massive({
    connectionString: CONNECTION_STRING,
    ssl: {rejectUnauthorized: false}
}).then(db => {
    app.set('db', db);
    console.log('DB connected');
}).catch(err => console.log(err));

app.post('/api/auth/register', authCtrl.register);
app.post('/api/auth/login', authCtrl.login);
app.get('/api/auth/me', authCtrl.getUser);
app.post('/api/auth/logout', authCtrl.logout);
app.post('/api/auth/update', auth.usersOnly, authCtrl.updateUser);

app.get('/api/moves', moveCtrl.getMoves);
app.get('/api/moves/favs', auth.usersOnly, moveCtrl.getFavMoves)
app.get('/api/move/:id', moveCtrl.getMove)
app.post('/api/moves/favorite/:id', auth.usersOnly, moveCtrl.favMove);

app.post('/api/notes/:move', auth.usersOnly, userCtrl.addNotes);
app.get('/api/notes/:move', userCtrl.getNotes);

app.listen(SERVER_PORT, () => console.log(`running on ${SERVER_PORT}`));