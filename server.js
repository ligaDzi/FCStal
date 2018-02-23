var express = require('express');
var app = express();
var morgan  = require('morgan');

var port = process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080,
    ip   = process.env.IP   || process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
app.use(jsonParser); 
app.use(bodyParser.text());
app.use(morgan('combined'));

// Подключение модуля с настройками сессий
var sassion_bd = require('./api/db_session');

// создание хранилища для сессии 
app.use(sassion_bd); 

// установка генератора шаблонов 
app.set('views', __dirname + '/publick/views'); 
app.set("view engine", "hbs");

app.use(express.static(__dirname + '/publick'));

var routerNews = express.Router();

var handlers = require('./api/queries');

app.get('/', handlers.get_start_page);

app.get('/news', handlers.get_News_page);

app.get('/news/:id', handlers.get_NewsArticle);

app.get("/moreNews", handlers.get_moreNews);

app.get('/calendar', handlers.get_Calendar);

app.get('/table', handlers.get_table);

app.get('/team', handlers.get_team);

app.get('/history', handlers.get_history);

// error handling
app.use(function(err, req, res, next){
    console.error(err.stack);
    res.status(500).send('Something bad happened!');
});


app.listen(port, ip);
console.log('Server running on http://%s:%s', ip, port);

module.exports = app ;