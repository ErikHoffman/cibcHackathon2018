const express = require('express')
const request = require('request')
const bodyParser = require('body-parser')
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
        url: 'https://api.azureminilab.com/customers/'
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
        url: 'https://api.azureminilab.com/customers/' + req.params.id
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
        url: 'https://api.azureminilab.com/customers/' + req.params.id + '/accounts'
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
        url: 'https://api.azureminilab.com/accounts'
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
        url: 'https://api.azureminilab.com/accounts/' + req.params.account_id
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
        url: 'https://api.azureminilab.com/accounts/' + req.params.account_id + '/transactions'
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/transactions/:transactions_id', function (req, res) {
    request.get({
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey
        },
        url: 'https://api.azureminilab.com/accounts/' + req.params.transactions_id
    }, function(err, response, body) {
        let json = JSON.parse(body);
        res.send(json);
    })
});

app.get('/shortfall/:id', function (req, res) {
    var debitsWeekOne = 0;
    var debitsWeekTwo = 0;
    var debitsWeekThree = 0;
    var debitsWeekFour = 0;
    var creditsWeekOne = 0;
    var creditsWeekTwo = 0;
    var creditsWeekThree = 0;
    var creditsWeekFour = 0;
    request.get({
        headers: {
            'content-type': 'application/json',
            'Ocp-Apim-Subscription-Key': primaryKey
        },
        url: 'https://api.azureminilab.com/customers/' + req.params.id + '/accounts'
    }).then(function(body) {
        /* Grab all of the accounts*/
        let accounts = JSON.parse(body);
        /* For each account add up all of the transactions to debit or credit var
         based on what week it falls into for 13 month calendar
        */
        async.map(accounts , function(account, callback) {
            request.get("https://api.azureminilab.com/accounts/"+account.id+'/transactions', function(body) {
                res.send(JSON.parse(body));
            });
        });

        /* Master calculation to find out which week 1-4 it is:
            floor( (364 - daysDiff(mostRecentSunday, dayOfTransaction)) / 7) % 4 = which week to average
    })
})


var port = process.env.PORT || 1337;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
