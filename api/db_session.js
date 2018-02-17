var session = require('express-session');
 
// подключение модуля connect-mssql
var MSSQLStore = require('connect-mssql')(session);

var mssql = require('mssql');

var config = {
	user: 'ligaga',   // пользователь базы данных
	password: 'NM12IS3', 	 // пароль пользователя 
	server: 'localhost', // хост
	database: 'staldb',    // имя бд
	port: 1433,			 // порт, на котором запущен sql server
	pool: {
        max: 100, // максимальное допустимое количество соединений пула 
        min: 0,  // минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 // время ожидания перед завершением неиспользуемого соединения 
    }	 
} 


module.exports = session({
    store: new MSSQLStore(config), 
	resave: false,
    saveUninitialized: true,
    secret: 'sesinmynsites'
});