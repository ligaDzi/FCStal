$(document).ready(function () {
    //Init the carousel
    initSlider();

    function initSlider() {
        $(".owl-carousel").owlCarousel({
            items: 1,
            loop: true,
            autoplay: true,
            smartSpeed: 1000,
            autoplayTimeout: 8000,
            autoplaySpeed: 1000,
        });
    }

    var img = $('.slidImg');
    var redDiv = $('.noMainRed');
    var mainDiv = $('.item');
    
    mainDiv.hover(function () {

        redDiv.toggleClass('heightNone').delay(400).toggleClass('linearGrad');
        setTimeout(function () {
            img.toggleClass('grayscale');
        }, 200);
    });




});