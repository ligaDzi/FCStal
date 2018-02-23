var session = require('express-session');
 
// подключение модуля connect-mssql
var MSSQLStore = require('connect-mssql')(session);

var mssql = require('mssql');

var config = {
	user: 'user',                   // пользователь базы данных
	password: 'SAP1428', 	        // пароль пользователя 
	server: 'mysql-master',         // хост
	database: 'lidb',               // имя бд
	port: 3306,			            // порт, на котором запущен sql server
	pool: {
        max: 100,                   // максимальное допустимое количество соединений пула 
        min: 0,                     // минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000    // время ожидания перед завершением неиспользуемого соединения 
    }	 
} 


module.exports = session({
    store: new MSSQLStore(config), 
	resave: false,
    saveUninitialized: true,
    secret: 'sesinmynsites'
});