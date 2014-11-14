$.fn.eqHeights = function(options) {

    var defaults = {
        child: false ,
        parentSelector:null
    };
    var options = $.extend(defaults, options);

    var el = $(this);
    if (el.length > 0 && !el.data('eqHeights')) {
        $(window).bind('resize.eqHeights', function() {
            el.eqHeights();
        });
        el.data('eqHeights', true);
    }

    if( options.child && options.child.length > 0 ){
        var elmtns = $(options.child, this);
    } else {
        var elmtns = $(this).children();
    }

    var prevTop = 0;
    var max_height = 0;
    var elements = [];
    var parentEl;
    elmtns.height('auto').each(function() {

        if(options.parentSelector && parentEl !== $(this).parents(options.parentSelector).get(0)){
            $(elements).height(max_height);
            max_height = 0;
            prevTop = 0;
            elements=[];
            parentEl = $(this).parents(options.parentSelector).get(0);
        }

        var thisTop = this.offsetTop;

        if (prevTop > 0 && prevTop != thisTop) {
            $(elements).height(max_height);
            max_height = $(this).height();
            elements = [];
        }
        max_height = Math.max(max_height, $(this).height());

        prevTop = this.offsetTop;
        elements.push(this);
    });

    $(elements).height(max_height);
};

// Isotope
$(function () {
    // init Isotope
    var $container = $('.isotope').isotope({
        itemSelector: '.element-item',
        layoutMode: 'fitRows'
    });
    // filter functions
    var filterFns = {
        // show if number is greater than 50
        numberGreaterThan50: function () {
            var number = $(this).find('.number').text();
            return parseInt(number, 10) > 50;
        },
        // show if name ends with -ium
        ium: function () {
            var name = $(this).find('.name').text();
            return name.match(/ium$/);
        }
    };
    // bind filter button click
    $('#filters').on('click', 'button', function () {
        var filterValue = $(this).attr('data-filter');
        // use filterFn if matches value
        filterValue = filterFns[filterValue] || filterValue;
        $container.isotope({filter: filterValue});
    });
    // change is-checked class on buttons
    $('.button-group').each(function (i, buttonGroup) {
        var $buttonGroup = $(buttonGroup);
        $buttonGroup.on('click', 'button', function () {
            $buttonGroup.find('.is-checked').removeClass('is-checked');
            $(this).addClass('is-checked');
        });
    });

});


$(function () {
    $('.scrollto, .gototop').bind('click', function (event) {
        var $anchor = $(this);
        $('html, body').stop().animate({
            scrollTop: $($anchor.attr('href')).offset().top
        }, 1500, 'easeInOutExpo');
        event.preventDefault();
    });
});

// PrettyPhoto 
$(document).ready(function () {

    //$("area[data-rel^='prettyPhoto']").prettyPhoto();
    //$(".gallery:first a[data-rel^='prettyPhoto']").prettyPhoto({
    //    animation_speed: 'normal',
    //    theme: 'light_square',
    //    slideshow: 3000,
    //    autoplay_slideshow: true
    //});
    //wow.sync();
});

//if ( !Modernizr.backgroundsize ) {
//    $('.masthead').css('background-color','#6883cc');
//}

if(Modernizr.csstransitions) {
    $('.process > div').eqHeights();

    // Wow.js
    var wow = new WOW(
        {
            boxClass: 'wow',      // animated element css class (default is wow)
            animateClass: 'animated', // animation css class (default is animated)
            offset: 100,          // distance to the element when triggering the animation (default is 0)
            mobile: true,       // trigger animations on mobile devices (default is true)
            live: true        // act on asynchronously loaded content (default is true)
        }
    );
    wow.init();

}

$('#twitterFeed .carousel-inner').twittie({
    'apiPath': '/assets/tweetie/api/tweet.php',
    'template': '<div class="item"><a href="http://twitter.com/opencityuk" target="_blank">{{avatar}}</a><h4>{{tweet}}</h4></div>',
    'count': 10,
    'hideReplies': false,
    'username': 'opencityuk'
}, function() {
    $('.carousel .item').first().addClass('active');
    $('.carousel').carousel();
});

$('#twimages').twittie({
    'apiPath': '/assets/tweetie/api/tweet.php',
    'template': '<div class="col-xs-12 col-sm-4 col-md-2"><div class="thumbnail">{{tweet}}</div></div>',
    'count': 100,
    'hideReplies': true,
    'outputMediaOnly': true,
    'mediaCount': 6,
    'username': 'opencityuk'
}, function() {
    $("#twimages a[rel^='prettyPhoto']").prettyPhoto();
});

$("a[rel^='prettyPhoto']").prettyPhoto();

jQuery(function(){
    jQuery('#flipcountdownbox1').flipcountdown({
        beforeDateTime:'11/15/2014 20:00:00'
    });
})