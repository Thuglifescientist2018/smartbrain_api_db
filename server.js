
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
    db.select('email', 'hash').from('login')
        .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
           if(isValid) {
              return db.select("*").from('users')
               .where("email", '=', req.body.email)
               .then(user => {
                   res.json(user[0])
               })
               .catch(err => res.status(400).json("unable to get the user   "))
           }
           else {
               res.status(400).json("wrong credentials")
           }
        }).catch(error => res.status(400).json('wrong credentials'))
})
let id = 125;
app.post('/register', (req, res) => {
    
    const {email, name, password} = req.body;
    const hash = bcrypt.hashSync(password);

    db.transaction(trx => {
        trx.insert({
          hash: hash,
          email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
          return trx('users')
            .returning('*')
            .insert({
              // If you are using knex.js version 1.0.0 or higher this now returns an array of objects. Therefore, the code goes from:
              // loginEmail[0] --> this used to return the email
              // TO
              // loginEmail[0].email --> this now returns the email
              email: loginEmail[0].email,
              name: name,
              joined: new Date()
            })
            .then(user => {
              res.json(user[0]);
            })
        })
        .then(trx.commit)
        .catch(trx.rollback)
      })
      .catch(err => res.status(400).json('unable to register'))
       
        
        id++;
})

app.get('/profile/:id', (req, res) => {
    const {id} = req.params;
   db.select("*").from("users").where({id}).then(users => {
       if(users.length) {
           res.json(users[0])
       }
       else {
           res.status(400).json("user not found")
       }
   })
   .catch(error => res.status(400).json("error getting user"))
})
app.post('/image', (req, res) => {
   
    const {id} = req.body;
   db('users').where('id', '=', id)
   .increment('entries', 1)
   .returning('entries')
   .then(entries =>  {
       res.json(entries[0].entries)
   })
   .catch(err => res.status(400).json("unable to get entries"))
   
})

// bcrypt start


// // Load hash from your password DB.

// bcrypt end
let port = 3000
app.listen(port, () => {
    console.log("server is running on port: ", port)
})

