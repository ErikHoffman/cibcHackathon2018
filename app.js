const express = require('express')
const request = require('request')
const app = express()

const primaryKey = '7e5c0bb85aff4345847c352b80654e9e';
const secondaryKey = 'd19538df049d46e7b2b3c6811e745cdd';

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/webhook', (req, res) => res.send('Hello Webhook World!'))

app.get('/customers', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey
        },
        url: 'https://api.azureminilab.com/customers/',
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/customers/:id', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey

        },
        url: 'https://api.azureminilab.com/customers/' + req.params.id,
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/customers/:id/accounts', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey

        },
        url: 'https://api.azureminilab.com/customers/' + req.params.id + '/accounts',
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/accounts', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey

        },
        url: 'https://api.azureminilab.com/accounts',
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/accounts/:account_id', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey

        },
        url: 'https://api.azureminilab.com/accounts/' + req.params.account_id,
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/accounts/:account_id/transactions', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey

        },
        url: 'https://api.azureminilab.com/accounts/' + req.params.account_id + 'transactions',
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/transactions/:transactions_id', function (req, res) {
    request.get({
        headers: {'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey

        },
        url: 'https://api.azureminilab.com/accounts/' + req.params.transactions_id,
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});


var port = process.env.PORT || 1337;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
