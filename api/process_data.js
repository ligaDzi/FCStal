
var hbs = require('hbs');

function getLogoTeam(nameTeam){
    switch (nameTeam) {
        case 'Сталь': return 'Stal_Logo3.png';
            break;
        case 'Заря': return 'Заря.png';
            break;
        case 'Ворскла': return 'Vorskla.png';
            break;   
        case 'Титан': return 'Titan.png';
            break;
        case 'Гелиос': return 'gelios.png';
            break;
        case 'УкрАгроКом': return 'UkrAhroKom.png';
            break;
        case 'Полтава': return 'poltava.png';
            break;
        case 'Олимпик': return 'olimpic.png';
            break; 
        case 'Сумы': return 'sumy.png';
            break;     
        case 'Нива': return 'Nyva_Ternopil.png';
            break;    
        case 'Буковина': return 'Bukovyna_Chernovtsy.png';
            break; 
        case 'Десна': return 'desna.png';
            break;
        case 'Александрия': return 'Oleksandria.png';
            break;
        case 'Зирка': return 'Zirka.png';
            break;
        case 'Николаев': return 'mykolaiv.png';
            break;
        case 'Нефтяник': return 'naftovyk.png';
            break;
        case 'Динамо-2': return 'Dynamo_Kyiv.png';
            break;
        case 'Авангард': return 'avangard.png';
            break;

        default:
            break;
    }
}
function getLogoTournament(nameTournament){
    switch (nameTournament) {
        case 'Премьер-лига': return 'UPL.png';
            break; 
        case 'Первая лига': return 'PFL.png';
            break; 
       
        default:
            break;
    }
}
 // метод определения возраста по дате рождения
function get_current_age(date) {

    return ((new Date().getTime() - new Date(date)) / (24 * 3600 * 365.25 * 1000)) | 0;
}

module.exports = {    

    //Метод преобразует записи из таблицы News
    process_news: function(arr){

        for(let i in arr){

            //Здесь парсится html-строка из таблицы News, чтобы Handlebars(hbs-фреймверк представлений файлы.hbs) мог её вставить в предстовление
            arr[i].bodyNews =  new hbs.SafeString(arr[i].bodyNews);
            arr[i].sourceNews =  new hbs.SafeString(arr[i].sourceNews);

            //Здесь формируется строка даты для блока новостей.
            let months = ["Января", "Февраля", "Марта", "Апреля", "Мая", "Июня", 
                          "Июля", "Августа", "Сентября", "Октября", "Ноября", "Декабря"];

            let date = new Date(arr[i].dateNews);

            arr[i].dateNews = `${date.getDate()}.${months[date.getMonth()]}.${date.getFullYear()}`;
        }
        return arr;
    },

    one_match_process: function(match){

        let logo = {};

        logo.logoTournament = getLogoTournament(match.tournament);
        logo.logoHost = getLogoTeam(match.nameHostTeam);
        logo.logoVisit = getLogoTeam(match.nameVisitTeam);

        return logo;

    },

    // здесь парсится информация из БД по матчу для страницы расписания мачей
    matchs_process: function(mass){
        
        var arr = new Array();
        var month, year;
            
		for(let i in mass){

            let match = {};

            //Здесь формируется строка даты для блока новостей.
            let months = ["Январь", "Февраль", "Март", "Апрель", "Май", "Июнь", 
                        "Июль", "Август", "Сентябрь", "Октябрь", "Ноябрь", "Декабрь"];

            let date = new Date(mass[i].dateMatch);

            match.months = months[date.getMonth()];
            match.year = date.getFullYear();
             
            // здесь определяется выводить или нет <div> с информацией о годе и месяце матча
            if(i == 0){
                year = match.year;
                month = match.months;
                match.monthCalendar = true;
            }
            else {
                if(year != match.year || month != match.months){
                    year = match.year;
                    month = match.months;
                    match.monthCalendar = true;
                }                         
                else
                    match.monthCalendar = false;

            }

            match.day = `${date.getDate()} ${months[date.getMonth()]}`;

            // getUTCHours() - этот метод вызывается, что бы время из БД браузер не подстраивал под часовой пояс
            match.time = `${date.getUTCHours()}:${date.getMinutes() < 10 ? ("0" + date.getMinutes()):date.getMinutes()}`;
            match.tournament = mass[i].tournament;
            match.nameHostTeam = mass[i].nameHostTeam;
            match.goalHost = mass[i].goalHost;
            match.nameVisitTeam = mass[i].nameVisitTeam;
            match.goalVisit = mass[i].goalVisit;
            match.playersGoalHost =  new hbs.SafeString( mass[i].playersGoalHost);
            match.playersGoalVisit =  new hbs.SafeString( mass[i].playersGoalVisit);

            // вывести информацию о голах если она есть
            if(mass[i].playersGoalHost || mass[i].playersGoalVisit){
                match.goalBool = true;              
            }
            else
            match.goalBool = false;             

            match.playersYellowHost =  new hbs.SafeString( mass[i].playersYeelowHost);
            match.playersYellowVisit =  new hbs.SafeString( mass[i].playersYeelowVisit);
            
            // вывести информацию о желтых карточках если она есть
            if(mass[i].playersYeelowHost || mass[i].playersYeelowVisit){
                match.yellowBool = true;              
            }
            else
            match.yellowBool = false;

            match.playersRedHost =  new hbs.SafeString( mass[i].playersRedHost);
            match.playersRedVisit =  new hbs.SafeString( mass[i].playersRedVisit);

            // вывести информацию о красных карточках если она есть
            if(mass[i].playersRedHost || mass[i].playersRedVisit){
                match.redBool = true;              
            }
            else
            match.redBool = false;
            
            match.referee = mass[i].referee;
            match.stadium = mass[i].stadium;
            match.audience = mass[i].audience;

            match.logoHostTeam = getLogoTeam(mass[i].nameHostTeam);
            match.logoVisitTeam = getLogoTeam(mass[i].nameVisitTeam);
            match.logoTournament = getLogoTournament(mass[i].tournament);

            // если есть кая либо информация по матчу, то сделать видимым кнопку вызова доп. инфо. по матчу 
            if(mass[i].playersGoalHost || mass[i].playersGoalVisit 
                || mass[i].playersYeelowHost || mass[i].playersYeelowVisit
                || mass[i].playersRedHost || mass[i].playersRedVisit
                || mass[i].referee || mass[i].stadium || mass[i].audience)

                match.info = true;
                    
            else 
                match.info = false;

            arr[i] = match;
        }
        return arr;
    },

    // в этот метод приходит data.recordset - т.е. записи из БД
    // и в этот массив добавляются недостающие своиства position и diffGoal.
    teams_process: function(arr){

        for(let i in arr){

            arr[i].diffGoal = arr[i].goalScore - arr[i].goalMissed;

            if(arr[i].diffGoal > 0)
                arr[i].diffGoal = "+" + arr[i].diffGoal;

            if(arr[i].nameTeam === "Сталь")    
                arr[i].stal = ' stal';
            else arr[i].stal = '';           

            arr[i].position = ++i;           

        }
        return arr;
    },   

    // здесь обрабатывается информация по игрокам из БД 
    players_process: function(arr){

        let players = {
            
            goalkeepers: [],
            backs: [], 
            halfbacks: [], 
            forwards: []
        } 
            
        for(let i = 0; i < arr.length; i++){

            switch (arr[i].amplua) {
                case 'вратарь': players.goalkeepers.push(arr[i]);
                    break; 
                case 'защитник': players.backs.push(arr[i]);
                    break; 
                case 'полузащитник': players.halfbacks.push(arr[i]);
                    break;
                case 'нападающий': players.forwards.push(arr[i]);
                    break;
               
                default:
                    break;
            }

            // определение возраста по дате рождения
            arr[i].birthday = get_current_age(arr[i].birthday);
        }
        return players;
    }

}