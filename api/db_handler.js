// Подключаем модуль mssql для работы с mssql сервером
var mssql = require('mssql'); 

var config = {
    user : 'ligaga',					// пользователь базы данных
    password : 'NM12IS3',			// пароль пользователя
    database : 'staldb',				// имя бд
    server : 'localhost',				// хост
    port : 1433,						// порт, на котором запущен sql server
    pool: {
        max: 100, 						// максимальное допустимое количество соединений пула 
        min: 0,  						// минимальное допустимое количество соединений пула 
        idleTimeoutMillis: 30000 		// время ожидания перед завершением неиспользуемого соединения 
    }
}

var connection = new mssql.ConnectionPool(config); 
var pool = connection.connect(function(err) {
	if (err) console.log(err)
}); 

module.exports = pool; 