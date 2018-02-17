var mssql = require('mssql');
var hbs = require('hbs');

var procData = require('./process_data');
var connection = require('./db_handler');

var index = 0;

function selectNineNews(nameHBSFile, req, res){

    var ps = new mssql.PreparedStatement(connection);

        ps.input('index', mssql.Int);

        ps.prepare("SELECT * FROM News ORDER BY dateNews DESC, headerNews ASC OFFSET @index ROWS FETCH NEXT 9 ROWS ONLY", (err)=>{

            if(err) console.log(err);
            
            ps.execute({index: req.session.indexNews}, (err, data)=>{

                if(err) console.log(err);

                let masNews = procData.process_news(data.recordset);

                res.render(nameHBSFile, {news: masNews});

            });  

        });
}

function get_match(id){

    var ps = new mssql.PreparedStatement(connection);

    
    let nextMatch = {};

    ps.input('id', mssql.Int);

    ps.prepare("SELECT * FROM Matchs WHERE id=@id", (err)=>{

        if(err) console.log(err);
        
        ps.execute({id: id}, (err, data)=>{

            if(err) console.log(err);
            nextMatch.tournament = data.recordset[0].tournament;

            if(data.recordset[0].nameVisitTeam == 'Сталь')
                nextMatch.opponent = data.recordset[0].nameHostTeam;
            else nextMatch.opponent = data.recordset[0].nameVisitTeam;

            //Здесь формируется строка даты для блока новостей.
            let months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", 
                      "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

            let date = new Date(data.recordset[0].dateMatch);

            nextMatch.date = `${date.getDate()} ${months[date.getMonth()]}`;

            // getUTCHours() - этот метод вызывается, что бы время из БД браузер не подстраивал под часовой пояс
            nextMatch.time = `${date.getUTCHours()}:${date.getMinutes() < 10 ? ("0" + date.getMinutes()):date.getMinutes()}`;

            // здесь определяются картинки для турнира и команд
            let logoSRC = procData.one_match_process(data.recordset[0])
            nextMatch.logoTournament = logoSRC.logoTournament;
            nextMatch.logoHost = logoSRC.logoHost;
            nextMatch.logoVisit = logoSRC.logoVisit;

            // это дополнительная информация для страницы календаря
            nextMatch.nextHost = data.recordset[0].nameHostTeam;
            nextMatch.nextVisit = data.recordset[0].nameVisitTeam;
        });  

    });
    return nextMatch;
}

// заполнение таблицы на стартовой страницы 
function getTableStartPage(){

    let teamsArr = [];

    var request = new mssql.Request(connection);

    // запрос и фильтрация по очкам, потом по разницы забитых-пропущенных, потом по кол-ву голов
    request.query('SELECT * FROM Table201314 ORDER BY points DESC, (goalScore - goalMissed ) DESC, goalScore DESC', function (err, data) { 
            
        if(err) console.log(err);            
        
        let posNum = 1;  
        

        for(let i = 0; i < data.recordset.length; i++){


            data.recordset[i].position = posNum++;
            data.recordset[i].stal = '';

            if(data.recordset[i].nameTeam === "Сталь"){
                
                data.recordset[i].stal = ' stal_main';

                // если Сталь первая, то в таблицу добавить следующие две команды
                // если Сталь не первая, то в таблицу добавить одну предыдущую и одну последующую команду.  
                if(i === 0){        
                    teamsArr[0] = data.recordset[i];
                    teamsArr[1] = data.recordset[i + 1];
                    teamsArr[2] = data.recordset[i + 2];
                }
                else{                 
                    teamsArr[0] = data.recordset[i - 1];
                    teamsArr[1] = data.recordset[i];
                    teamsArr[2] = data.recordset[i + 1];
                }
            }            
        }                
   });
   return teamsArr;
}

module.exports = {    
    
    // возвращает стартовую страницу
    get_start_page: function(req, res){

        req.session.indexNews = 0;

        // здесь хранится информация о следующем матче.
        // Хранится в сессии потому что если хранить на сервере то будут возникать проблемы, 
        // т.к. сервер по истечению определенного времени отчищает кэш.
        req.session.nextMatchInfo = get_match(5);

        // таблица на стартовой страницы
        req.session.startTable = getTableStartPage();

        // здесь выбераются банеры из БД на главную страницу
        var banerNews = [];
        var request = new mssql.Request(connection);        

        request.query('SELECT * FROM News WHERE mainNews=1', function (err, rows) { 

            banerNews = procData.process_news(rows.recordset);
		});


        var ps = new mssql.PreparedStatement(connection);

        ps.input('index', mssql.Int);

        ps.prepare("SELECT * FROM News ORDER BY dateNews DESC, headerNews ASC OFFSET @index ROWS FETCH NEXT 9 ROWS ONLY", (err)=>{

            if(err) console.log(err);
            
            ps.execute({index: req.session.indexNews}, (err, data)=>{

                if(err) console.log(err);

                let masNews = procData.process_news(data.recordset);

                res.render('index.hbs', {baner1: banerNews[0], baner2: banerNews[1], baner3: banerNews[2], news: masNews, 
                    nextLogoTourn: req.session.nextMatchInfo.logoTournament, nextLogoHost: req.session.nextMatchInfo.logoHost,
                    nextLogoVisit: req.session.nextMatchInfo.logoVisit, nextTournament: req.session.nextMatchInfo.tournament,
                    nextOpponent: req.session.nextMatchInfo.opponent, nexDate: req.session.nextMatchInfo.date,
                    nextTime: req.session.nextMatchInfo.time, teams: req.session.startTable});
            }); 
        });
    },
    
    // добавляет еще блоки новостей
    get_moreNews: function(req, res){

        req.session.indexNews += 9;

        selectNineNews('moreNews.hbs', req, res);
    },

    get_News_page: function(req, res){
        
        // (12 - 9) потому что когда нажимаеш на кнопку "Больше новостей" к req.session.indexNews прибавляется число 9 (см. get_moreNews())
        req.session.indexNews = 12 - 9;

        var ps = new mssql.PreparedStatement(connection);

        ps.input('index', mssql.Int);

        ps.prepare("SELECT * FROM News ORDER BY dateNews DESC, headerNews ASC OFFSET @index ROWS FETCH NEXT 12 ROWS ONLY", (err)=>{

            if(err) console.log(err);
            
            ps.execute({index: 0}, (err, data)=>{

                if(err) console.log(err);

                let masNews = procData.process_news(data.recordset);

                res.render('newsPage.hbs', {news: masNews});

            });  

        });
    },
    
    // показывает новость по id
    get_NewsArticle: function(req, res){

        var ps = new mssql.PreparedStatement(connection);

        ps.input('id', mssql.Int);

        ps.prepare("SELECT * FROM News WHERE id=@id", (err)=>{

            if(err) console.log(err);
            
            ps.execute({id: parseInt(req.params.id)}, (err, data)=>{

                if(err) console.log(err);

                let news = procData.process_news(data.recordset);

                res.render('newsBlock.hbs', {headerNews: news[0].headerNews, 
                    dateNews: news[0].dateNews,
                    sourceNews: news[0].sourceNews,
                    imgHeader: news[0].imgHeader,
                    bodyNews: news[0].bodyNews}); 
            }); 
        });
    },

    get_Calendar: function(req, res){

        var request = new mssql.Request(connection);

        request.query('SELECT * FROM Matchs ORDER BY dateMatch', function (err, data) { 
            
            let matchArr = procData.matchs_process(data.recordset);
             

            res.render('calendar.hbs', {matchs: matchArr, nextLogoTourn: req.session.nextMatchInfo.logoTournament,
                nextTournament: req.session.nextMatchInfo.tournament, nextLogoHost: req.session.nextMatchInfo.logoHost,
                nextHost: req.session.nextMatchInfo.nextHost, nextLogoVisit: req.session.nextMatchInfo.logoVisit,
                nextVisit: req.session.nextMatchInfo.nextVisit, nexDate: req.session.nextMatchInfo.date,
                nextTime: req.session.nextMatchInfo.time});
		});
    },

    get_table: function(req, res){         

        var request = new mssql.Request(connection);

        // запрос и фильтрация по очкам, потом по разницы забитых-пропущенных, потом по кол-ву голов
        request.query('SELECT * FROM Table201314 ORDER BY points DESC, (goalScore - goalMissed ) DESC, goalScore DESC', function (err, data){ 
            
            if(err) console.log(err);
            
            let teamArr = procData.teams_process(data.recordset);

            res.render('table.hbs', {teams: teamArr});
        });
    },

    get_team: function(req, res){

        var request = new mssql.Request(connection);

        request.query('SELECT * FROM Team', function (err, rows) { 

            if(err) console.log(err);

            let players = procData.players_process(rows.recordset);


            res.render('team.hbs', {goalkeepersHBS: players.goalkeepers, backsHBS: players.backs, 
                halfbacksHBS: players.halfbacks, forwardsHBS: players.forwards});
		});
    },

    get_history: function(req, res){

        var request = new mssql.Request(connection);

        request.query('SELECT * FROM TableResultClub', function (err, rows) { 

            if(err) console.log(err);

            res.render('history.hbs', {tableResult: rows.recordset});
		});
    },

    // Принцип работы циклов for of и for in
    get_data: function(){
        // Коментарий

        let rows = ['rows1', 'rows2', 'rows3', 'rows4', 'rows5'];

        console.log('for(let row of rows) console.log(row);');

        for(let row of rows){            

            console.log(row);
        }
        console.log('for(let row in rows) console.log(rows[row]);');

        for(let row in rows){

            console.log(rows[row]);
        }        
    }
}