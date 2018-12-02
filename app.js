const express = require('express')
const request = require('request')
const async = require('async')
const bodyParser = require('body-parser')
const app = express()

const headerMiddleware = require('./middleware/header.middleware');

const primaryKey = '7e5c0bb85aff4345847c352b80654e9e';
const secondaryKey = 'd19538df049d46e7b2b3c6811e745cdd';
const port = process.env.PORT || 1337;

app.use(headerMiddleware);

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
        var txnsArray = json[50];
        console.log(txnsArray);
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
    var debits = [0, 0, 0, 0];
    var credits = [0, 0, 0, 0];

    /* Hard coded to skip some implementation details which are complex
       Grabs 52 weeks back from this date, and it is considered a week 1 start of month 14 essentially
       So Saturday December 1st, is the 7th day of the 4th week of the 13th month */
    var mostRecentSunday = new Date("12/2/2018");

    getAccounts(req, res)
    .then(accounts => {
        /* For each account add up all of the transactions to debit or credit var
         based on what week it falls into for 13 month calendar
        */
        var accountsJSON = JSON.parse(accounts);

        async.map(accountsJSON , (account, callback) => {
            return request.get({
                headers: {
                    'content-type': 'application/json',
                    'Ocp-Apim-Subscription-Key': primaryKey
                },
                url: `https://api.azureminilab.com/accounts/${account.id}/transactions`
            }, (err, response) => {
                try { 
                    getTransactions(req, res, account)
                } catch(e) {
                    console.log('Error caught');
                }
                callback(false, JSON.parse(response.body));
            });
        }, (err, response) => {
            if (err) {
                throw new Error('oops');
            }

            for (var j = 0; j < response.length; j++) {
                var transactionsJSON = response[j];
                for (var i = 0; i < transactionsJSON.length; i++) {
                    var txnDate = new Date(transactionsJSON[i].posted_date);
                    var timeDiff = Math.abs(mostRecentSunday.getTime() - txnDate.getTime());
                    var daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
                    var week = Math.floor((daysDiff / 7 * -1) % 4 * -1);
                    if (daysDiff < 1000) {
                        if (transactionsJSON[i].type.indexOf("DEBIT") !== -1) {
                            debits[week] += parseInt(transactionsJSON[i].transaction_value);
                        } else if (transactionsJSON[i].type.indexOf("CREDIT") !== -1) {
                            credits[week] += parseInt(transactionsJSON[i].transaction_value);  
                        }
                    }
                }
            }

            console.log('Total debits for week 1: ' + debits[0]);
            console.log('Total credits for week 1: ' + credits[0]);
            var averageShortfall = [0, 0, 0, 0];
            for (var i = 0; i < 4; i++) {
                averageShortfall[i] = (credits[i] - debits[i])/13;
            }

            var shortFallWeekOne = parseInt(JSON.stringify(averageShortfall[0]));
            res.send({
                shortFall: shortFallWeekOne
            });
        });
    });
})

function getAccounts(req, res) {
    return new Promise(resolve => {
        request.get({
            headers: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': primaryKey
            },
            url: 'https://api.azureminilab.com/customers/' + req.params.id + '/accounts'
        }, function (error, response, body) {
            if(!error)
                resolve(body);
        })
    })
}

function getTransactions(req, res, account) { 
    return new Promise(resolve => {
        request.get({
            headers: {
                'content-type': 'application/json',
                'Ocp-Apim-Subscription-Key': primaryKey
            },
            url: "https://api.azureminilab.com/accounts/"+account.id+'/transactions'
        }, function (error, response, body) {
            if(!error)
                resolve(body);
        })
    })
}

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
