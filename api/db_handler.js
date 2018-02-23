// Подключаем модуль mssql для работы с mssql сервером
var mssql = require('mssql'); 

var config = {
    user : 'user',					                        // пользователь базы данных
    password : 'SAP1428',			                        // пароль пользователя
    database : 'lidb',				                        // имя бд
    server : 'mysql://mysql:3306/',				            // хост
    port : 3306,						                    // порт, на котором запущен sql server
    pool: {
        max: 100, 						                    // максимальное допустимое количество соединений пула 
        min: 0,  						                    // минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 		                    // время ожидания перед завершением неиспользуемого соединения 
    }
}

var connection = new mssql.ConnectionPool(config); 
var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 