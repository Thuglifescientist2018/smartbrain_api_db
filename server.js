
const express =  require('express');
const bodyParser = require('body-parser');
const bcrypt  = require('bcrypt-nodejs');
const cors =  require('cors');

const knex = require('knex');
const register = require('./controllers/register');
const signin = require('./controllers/signIn');
const profile = require('./controllers/profile');
const image = require('./controllers/image');


const db  = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port : 5432,
      user : 'postgres',
      password : 'root',
      database : 'smart-brain'
    }
  });



const app = express()
app.use(function(req, res, next) {
    req.headers['content-type'] = "application/json";
    next();
});
app.use(bodyParser.json())
app.use(cors())
app.get('/', (req, res) => {res.send(database.users)})
app.post("/signin", signin.handleSignIn(db, bcrypt)) // req and res automatically get injected (advanced stuff but this is how it works)

app.post('/register', (req, res) => {register.handleRegister(req, res, db, bcrypt)})

app.get('/profile/:id', (req, res) => {profile.handleProfileGet(req, res, db)})
app.post('/image', (req, res) => {image.handleImage(req, res, db)})
app.post('/imageurl', (req, res) => {image.handleApiCall(req, res)})

// bcrypt start


// // Load hash from your password DB.

// bcrypt end
let port = 3000
app.listen(port, () => {
    console.log("server is running on port: ", port)
})

