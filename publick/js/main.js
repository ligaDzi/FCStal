function bNewsScaleUp(className){
    
    $(className).hover(function () {
        $(this).find('.card_image').toggleClass('scaleUp');
    });
}
function newsClose(){
    $('.news_box_close').click((e)=>{
        $('.content').removeClass('lock');
        $('.news_box').remove();
    });
}

// страница новостей
function getNews(){
    $.ajax({

        type: "GET",
        url: "/news",
        success: (data)=>{            

            $('.main').html(data);

            // Здесь на новые блоки новостей вешаются обработчики на события
            hangUpHandler();
            getMoreNews();

        },
        error: (err)=>{
            console.log("err");
        }
    });
}
function getIDNews(className){
    
    $(className).click((e)=>{

        let id = e.currentTarget.getAttribute('data-idNews');
            

        $.ajax({

            type: "GET",
            url: "/news/" + id,
            success: (data)=>{            

                $('.wrapper').append(data);
                
                $('.content').addClass('lock');
                
                newsClose();

            },
            error: (err)=>{
                console.log("err");
            }
        });
    });
}
function  hangUpHandler(){

    // Здесь на новые блоки новостей вешаются обработчики на события 
    // ('.list_item:hidden' - это позволяет вешать обработчики именно на новые блоки новостей)
    bNewsScaleUp('.list_item:hidden');
    getIDNews('.list_item:hidden');

    // анимация постепенное появления новых блоков новостей
    $('.list_item:hidden').fadeIn("slow");
}
function getMoreNews(){

    $('.moreClick').click(()=>{

        $.ajax({

            type:"GET",
            url:"/moreNews",
            success: (data)=>{

                if(data.length == 0) $('.moreClick').remove();
                
                $('.news_feed_content').append(data);
                
                // Здесь на новые блоки новостей вешаются обработчики на события 
                hangUpHandler();
            },
            error: (err)=>{
                console.log(err);
            }
        });
    });
}

// страница расписания матчей
function getCalendar(){

    $('.is_active').removeClass('is_active');
    $('#calendar').find('.nav_link').addClass("is_active");

    $.ajax({

        type: "GET",
        url: "/calendar",
        success: (data)=>{
            $('.main').html(data);
            $('#tab_table').click(getTable);
            $('#tab_calendar').click(getCalendar);
            animeMatchInfo();            

             // анимация постепенное появления новых блоков новостей
            $('.calendarNone:hidden').fadeIn("slow");
        },
        error: (err)=>{
            console.log(err);
        }
    });
}
// страница таблицы
function getTable(){

    $('.is_active').removeClass('is_active');
    $('#calendar').find('.nav_link').addClass("is_active");

    $.ajax({

        type: "GET",
        url: "/table",
        success: (data)=>{
            $('.main').html(data);
            $('#tab_table').click(getTable);
            $('#tab_calendar').click(getCalendar);

            // анимация постепенное появления новых блоков новостей
            $('.tableNone:hidden').fadeIn("slow");
        },
        error: (err)=>{
            console.log(err);
        }
    });
}

// страница состава команды
function getTeam(){

    $.ajax({
        type: "GET",
        url: "/team",
        success: (data)=>{
            $('.main').html(data);
            animaPlayerInfo();

            // анимация постепенное появления новых блоков новостей
            $('.teamNone:hidden').fadeIn("slow");
        },

        error: (err)=>{
            console.log(err);
        }
    })
}
// анимация появления информации о матче
function animeMatchInfo(){

     $('.btn_result').click(function() {

        var elem = $(this).parent();

        elem.find('.match_item_data').slideToggle("slow", function () {

            let table = elem.find('.match_data_table');
            if (table.css('opacity') == 0) {
                table.animate({ opacity: 1 }, 300);
            }
            else table.animate({ opacity: 0 }, 10);            
        }); 
    });
}

// анимация полявления информации о игроке
function animaPlayerInfo(){
     
     $('.player_infoBlock').mouseenter(function () {
        $(this).find('.player_infoBlock_info').animate({ height: 295 }, 300)
            .find('.player_infoBlock_info_opacity').animate({ opacity: 1 }, { queue: true, duration: 300});        
    });
    $('.player_infoBlock').mouseleave(function () {
        $(this).find('.player_infoBlock_info').animate({ height: 7 }, 300).find('.player_infoBlock_info_opacity').animate({ opacity: 0 }, 300);
    });
}

function getHistory(){
    $.ajax({
        type: "GET",
        url: "/history",
        success: (data)=>{
            $('.main').html(data);

            // анимация постепенное появления новых блоков новостей
            $('.historyNone:hidden').fadeIn("slow");
        },
        error: (err)=>{
            console.log("Ошибка");
        }
    })
}

$(document).ready(function () {

    $('.btn').hover(function () {
        $(this).find('.btn_img').toggleClass('margin_left');
    });
    
    $('#btn_calendar').click(getCalendar);
    $('#btn_table').click(getTable);
    
    bNewsScaleUp('.card');  
    getIDNews('.list_item');

    // вывод новости при клики бо заголовку баннера на главной страници
    getIDNews('.slideTextUrl');  
    
    // Запрос на сервер добавить новостей
    getMoreNews();

    $('#news').click(()=>{

        getNews();
        
       
    });

    $('#calendar').click(function(){
        getCalendar();
    });
    
    $('#team').click(function(){
        getTeam();
    });
    
    $('#history').click(function(){
        getHistory();
    });

});