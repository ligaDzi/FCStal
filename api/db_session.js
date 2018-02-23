var session = require('express-session');
 
// подключение модуля connect-mssql
var MSSQLStore = require('connect-mssql')(session);

var mssql = require('mssql');

var config = {
	user: process.env.OPENSHIFT_MYSQL_DB_USERNAME || 'root',                   // пользователь базы данных
	password: process.env.OPENSHIFT_MYSQL_DB_PASSWORD || '', 	        // пароль пользователя 
	server: process.env.OPENSHIFT_MYSQL_DB_HOST || 'localhost',                // хост
	database: 'lidb',               // имя бд
	port: process.env.OPENSHIFT_MYSQL_DB_PORT || '3306',			            // порт, на котором запущен sql server
	pool: {
        max: 10,                   // максимальное допустимое количество соединений пула 
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