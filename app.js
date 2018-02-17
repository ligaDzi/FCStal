var express = require('express');
var app = express();

const port = 8080;

var bodyParser = require('body-parser');

var jsonParser = bodyParser.json();
app.use(jsonParser); 
app.use(bodyParser.text());

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


app.listen(port, ()=>{console.log('Сервер запущен');});