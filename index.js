const express = require('express');
const expressMongoDb = require('express-mongo-db');
const bodyParser = require('body-parser');
const cors = require('cors');
const ObjectID = require('mongodb').ObjectID;


const app = express();

app.use(expressMongoDb('mongodb://localhost/bora'));
app.use(bodyParser.json());
app.use(cors());

app.get('/users', (req, res) => {

    

    req.db.collection('users')
    .find({})
    .toArray((err, data) => {
        res.send(data);
    });
});
app.post('/search', (req, res) => {

    search = {
        login: req.body.login      
    }

    req.db.collection('users')
    .findOne(search, (err, data) => {

        res.send(data);

        
    });
});

// endpoint to log in the app
app.post('/login', (req, res) => {
    if (!req.body.login || !req.body.senha) {
        res.status(400).send({ 'error': 'Preencha todos os campos obrigatorios' });
        return;
    }

    

    let busca = {
        login: req.body.login,
        senha: req.body.senha,
    }

    req.db.collection('users')
        .findOne(busca, (err, data) => {
            if (data) {
                console.log("vtnc: ", data);
                res.send(data);
            } else {
                // TODO: use status, but this didnt work
                // res.status(400).send({});
                res.send({});
            }
        });
});

// endpoint to sign up the user
app.post('/users', (req, res) => {
    console.log("insert");

    if (!req.body.login || !req.body.senha) {
        res.status(400).send({ 'error': 'Preencha todos os campos obrigatorios' });
        return;
    }

    user = {
        login: req.body.login,
        senha: req.body.senha,
        amigos: []
    }



    req.db.collection('users')
    .insert(user, (err, data) => {
        if (!err) {
            res.send(data);
        } else {
            res.send(err);
        }
    });


});

app.post('/addFriend', (req, res) => {

    busca = {
        login: (req.body.login)
    }
    newFriend = req.body.newFriend;


    req.db.collection('users')
    .findOne(busca, (err, data) => {

        
        data.amigos.push(newFriend);
        req.db.collection('users')
        .update(busca, data,  (err, data) => {


        });

        res.send(data);
    });


});

app.listen(3000, () => {
    console.log('Servidor local rodando na 3000');
});
