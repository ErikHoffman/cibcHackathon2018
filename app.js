const express = require('express')
const app = express()

app.get('/', (req, res) => res.send('Hello World!'))

app.get('/webhook', (req, res) => res.send('Hello Webhook World!'))

var port = process.env.port || 1337;
app.listen(port, () => console.log(`Example app listening on port ${port}!`))
