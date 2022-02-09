
const express =  require('express');
const bodyParser = require('body-parser');
const bcrypt  = require('bcrypt-nodejs');
const cors =  require('cors');

const knex = require('knex');
const { json } = require('body-parser');

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


const database = {
    users: [
        {
            id: '123', 
            name: 'John',
            email: 'john@gmail.com',
            password: 'cookies',
            entries: 0,
            joined: new Date()
        },
        {
            id: '124', 
            name: 'Sally',
            email: 'sally@gmail.com',
            password: 'bananas',
            entries: 0,
            joined: new Date()
        },
    ],
    login: [
        {
            id: '987',
            hash: '',
            email: 'john@gmail.com'
        }
    ]
}
const app = express()
app.use(function(req, res, next) {
    req.headers['content-type'] = "application/json";
    next();
});
app.use(bodyParser.json())
app.use(cors())
app.get('/', (req, res) => {
    res.send(database.users)
})
app.post("/signin", (req, res) => {
    bcrypt.compare("22apples", '$2a$10$VBTSjPSUajbfvK5C.eI2iOZvCHf80ur5NONu0/CEF/s4cpm/dmnYe', function(err, res) {
        // console.log('comparison1: ', res)
    });
    bcrypt.compare("22apples", '$2a$10$VBTSjPSUajbfvK5C.eI2iOZvCHf80ur5NONu0/CEF/s4cpm/dmnYe', function(err, res) {
        // console.log("comparison2: ", res)
    });
    console.log("signin req.body: ", req.body)
    if(req.body.email === database.users[0].email && 
        req.body.password === database.users[0].password) {
            res.json(database.users[0]);
        }else {
            res.status(400).json('error logging in')
        }
})
let id = 125;
app.post('/register', (req, res) => {
    
    const {email, name, password} = req.body;
    bcrypt.hash(password, null, null, function(err, hash) {
        // Store hash in your password DB.
        // console.log(hash)
    });
        db('users')
        .returning('*')
        .insert({
            email: email,
            name: name,
            joined: new Date()
        }).then(user => res.json(user[0])).catch(err  => res.status(400).json("unable to register"))
       
        
        id++;
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
    let found = false;
    database.users.forEach(user => {
        // console.log(user)
        if(user.id === id) { 
            found = true;
            return res.json(user)
        }
    })
    if(!found) {
        res.status(404).json("user not found")
    }
})
app.post('/image', (req, res) => {
    console.log("image req body:: ",req.body)
    const {id} = req.body;
    let found = false;
    database.users.forEach(user => {
       
        if(user.id === id) { 
            found = true;
            user.entries++;
            console.log(user.name, user.entries)
            return res.json(user.entries)
        }
    })
    if(!found) {
        res.status(404).json("user not found")
    }
})

// bcrypt start


// // Load hash from your password DB.

// bcrypt end
let port = 3000
app.listen(port, () => {
    console.log("server is running on port: ", port)
})

