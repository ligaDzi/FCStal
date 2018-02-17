$(document).ready(function () {
    // мобильно меню
    $(".hamburger").click(function () {
        $(this).toggleClass("is-active");
        $('.nav_main').toggleClass("nav_main_active");
    });

    $('.next_match_details').hover(function () {
        $('.next_match_bg').toggleClass('scaleUp');
    });
    
    // главное меню
    $('.nav_link').click((e)=>{

        if($('.is-active')){
            $('.is-active').toggleClass("is-active");
            
            // проверка - только для мобильных устройств, если мобильное меню не скрыто
            // при клике по пункту меню скрыть мобильное меню 
            if(!($('.nav_mobile').css('display') == 'none'))
                $('.nav_main').toggleClass("nav_main_active");
        }

        // если открыта страница новости, то закрыть её когда нажимают по какому либо пункту меню
        if($('.news_box')){
            $('.content').removeClass('lock');
            $('.news_box').remove();
        }

        $('.is_active').removeClass('is_active');
        e.currentTarget.className += " is_active";        
    });
});