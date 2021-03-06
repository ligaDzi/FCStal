// Подключаем модуль mssql для работы с mssql сервером
var mssql = require('mssql'); 

var config = {
    user : process.env.OPENSHIFT_MYSQL_DB_USERNAME,			// пользователь базы данных
    password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,		// пароль пользователя
    database : 'lidb',				                        // имя бд
    server : process.env.OPENSHIFT_MYSQL_DB_HOST,			// хост
    port : process.env.OPENSHIFT_MYSQL_DB_PORT || '3306',	// порт, на котором запущен sql server
    pool: {
        max: 10, 						                    // максимальное допустимое количество соединений пула 
        min: 0,  						                    // минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 		                    // время ожидания перед завершением неиспользуемого соединения 
    }
}

var connection = new mssql.ConnectionPool(config); 
var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 