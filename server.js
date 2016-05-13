var restify = require('restify');
var config = require('./config');
var app = restify.createServer({name: 'REST-api'});

app.use(restify.fullResponse());
app.use(restify.bodyParser());
app.use(restify.queryParser());

app.listen(config.port, function () {
    require('./document')(app.router.mounts);
});

var routes = require('./routes')(app);