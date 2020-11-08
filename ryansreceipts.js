const express = require('express');
const expressHandlebars = require('express-handlebars');
const handlers = require('./src/handlers');
const createReceiptData = require('./src/lib/createReceiptData');

const app = express();

app.use(express.static(__dirname + '/public'));

// configure Handlebars view engine
app.engine('handlebars', expressHandlebars({
    defaultLayout: 'main',
}));
app.set('view engine', 'handlebars');

const port = process.env.PORT || 3000;

app.get('/', handlers.home);

app.get('/about', handlers.about);

// Receipt making API
app.use(express.json());
app.use(express.urlencoded({ extended: false}));

app.post('/makereceipt', (req, res) => res.status(201).json({ receipt: createReceiptData(req.body.menu, req.body.order) }));

app.post('/makehtmlreceipt', handlers.makeHtmlReceipt);

// custom 404 page
app.use(handlers.notFound);

// custom 500 page
app.use(handlers.serverError);

const server = app.listen(port, () => console.log(
    `Express started on http://localhost:${port}; ` +
    'press Ctrl-C to terminate.'
));

module.exports = server;