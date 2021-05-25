/*---------------------------------------------
Template name: CryptoCloud
Version: 1.4
Author: ThemeLooks
Author url: http://themelooks.com

NOTE:
------
Please DO NOT EDIT THIS JS, you may need to use "custom.js" file for writing your custom js.
We may release future updates so it will overwrite this file. it's better and safer to use "custom.js".

[Table of Content]

01: Section background image
02: Sticky header
03: Smooth scroll for scroll button
04: Home main slider
05: Home review slider one
06: Home review slider two
07: Team member slider
08: Video popup
09: Back to top button
10: Top padding for menu
11: jQuery vector map
12: Server plan
13: Multi Tab target
14: Collapsible tab content
15: Google map
16: isotope for Blog
17: Content animation
18: Preloader

----------------------------------------------*/


(function($) {
    "use strict";
    $(function(){

        /* 01: Section background image
        ==============================================*/
        
        var $bgImg = $('[data-bg-img]');
        
        $bgImg.css('background-image', function(){
            return 'url("' + $(this).data('bg-img') + '")';
        });

        
        /* 02: Sticky header
        ==============================================*/

        var $headerContainer = $('.header-container');

        $(window).on('scroll', function(){
            if($(window).scrollTop() >= 15){
                $headerContainer.addClass('sticking');
            } 
            else {
                $headerContainer.removeClass('sticking');
            }
        }).scroll();

        
        /* 03: Smooth scroll for scroll button
        ==============================================*/
        
        var $mainBanner = $('.main-banner');

        $mainBanner.on('click', '.scroll-down p', function(){
            var $target = $mainBanner.next();
            
            if ( $target.length ) {
                $('html, body').animate({
                    scrollTop: $target.offset().top - 50
                }, 500);
            }
        });
        
        
        /* 04: Home main slider
        ==============================================*/

        var swiperHome = new Swiper('.home-slider', {
            speed: 600,
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.home-slider-next',
                prevEl: '.home-slider-prev',
            },
            pagination: {
                el: '.home-slider-pagination',
                clickable: true,
            }
        });

        swiperHome.on('slideChangeTransitionStart', function () {
            var $el = $(this.slides[ this.activeIndex ]),
                $animate = $el.find('[data-animate]');

            $animate.each(function () {
                var $t = $(this);

                $t.removeClass( 'animated ' + $t.data('animate') );
            });
        }).on('slideChangeTransitionEnd', function () {
            var $el = $(this.slides[ this.activeIndex ]),
                $animate = $el.find('[data-animate]');

            $animate.each(function () {
                var $el = $(this),
                    $duration = $el.data('duration'),
                    $delay = $el.data('delay');

                $duration = typeof $duration === 'undefined' ? '0.6' : $duration;
                $delay = typeof $delay === 'undefined' ? '0' : $delay;

                $el.addClass( 'animated ' + $el.data('animate') ).css({
                    'animation-duration': $duration + 's',
                    'animation-delay': $delay + 's'
                });
            });
        });

        
        /* 05: Home review slider one
        ==============================================*/

        var swiperHomeRev = new Swiper('.home-review-slider-one', {
            loop: true,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            pagination: {
                el: '.review-swiper-pagination',
                clickable: true,
            }
        });

        
        /* 06: Home review slider two
        ==============================================*/
        
        var swiperHomeRevTwo = new Swiper('.home-review-slider-two', {
            slidesPerView: 3,
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: true,
            },
            pagination: {
                el: '.review-swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is <= 575px
                575: {
                    slidesPerView: 1
                },
                // when window width is <= 767px
                767: {
                    slidesPerView: 2
                }
            }
        });

        
        /* 07: Team member slider
        ==============================================*/
        
        var swiperTeam = new Swiper('.team-member-slider', {
            slidesPerView: 4,
            spaceBetween: 30,
            autoplay: {
                delay: 5000,
                disableOnInteraction: false,
            },
            navigation: {
                nextEl: '.team-member-next',
                prevEl: '.team-member-prev',
            },
            breakpoints: {
                // when window width is <= 575px
                575: {
                    slidesPerView: 1
                },
                // when window width is <= 767px
                767: {
                    slidesPerView: 2
                },
                // when window width is <=991px
                991: {
                    slidesPerView: 3
                }
            }
        });

        
        /* 08: Video popup
        ==============================================*/

        var $youtubePopup = $('.youtube-popup');

        $youtubePopup.magnificPopup({
            type:'iframe'
        });

        
        /* 09: Back to top button
        ==============================================*/

        var $backToTopBtn = $('.back-to-top');

        if ($backToTopBtn.length) {
            var scrollTrigger = 400, // px
            backToTop = function () {
                var scrollTop = $(window).scrollTop();
                if (scrollTop > scrollTrigger) {
                    $backToTopBtn.addClass('show');
                } else {
                    $backToTopBtn.removeClass('show');
                }
            };

            backToTop();

            $(window).on('scroll', function () {
                backToTop();
            });

            $backToTopBtn.on('click', function (e) {
                e.preventDefault();
                $('html,body').animate({
                    scrollTop: 0
                }, 700);
            });
        }

        
        /* 10: Top padding for menu
        ==============================================*/

        var $header = $('header.header');

        $header.next().addClass('top-spacing');

        
        /* 11: jQuery vector map
        ==============================================*/

        var $vmap = $('#vmap');

        if($vmap.length){
            var $pinStart   = '<i class="fa fa-map-marker"></i><p><span>',
                $pinEnd     = '</span></p>';

            $vmap.vectorMap({
                map: 'world_en',
                backgroundColor: 'transparent',
                borderColor: '#84C3EC',
                borderOpacity: 0,
                borderWidth: 2,
                color: '#84C3EC',
                enableZoom: false,
                hoverColor: '#84C3EC',
                hoverOpacity: null,
                normalizeFunction: 'linear',
                scaleColors: ['#84C3EC', '#84C3EC'],
                selectedColor: '#84C3EC',
                selectedRegions: null,
                showTooltip: false,
                pins: {
                    "gb" : $pinStart + 'United Kingdom' + $pinEnd, 
                    "us" : $pinStart + 'USA' + $pinEnd,
                    "au" : $pinStart + 'Australia' + $pinEnd,
                    "ca" : $pinStart + 'Canada' + $pinEnd,
                    "gl" : $pinStart + 'Greenland' + $pinEnd,
                    "ru" : $pinStart + 'Russia' + $pinEnd,
                    "ua" : $pinStart + 'Ukraine' + $pinEnd,
                    "br" : $pinStart + 'Brazil' + $pinEnd,
                    "cd" : $pinStart + 'Congo' + $pinEnd
                },
                pinMode: 'content'
            });
        }

        
        /* 12: Server plan
        ==============================================*/

        var $vpsPricing = $('#vpsPricing'),
            vpsPricingObj = {};
        
        vpsPricingObj.$slider = $vpsPricing.find('#vps-pricing-slider');
        vpsPricingObj.$putValue = $vpsPricing.find('[data-put-value]');
        vpsPricingObj.$putHref = $vpsPricing.find('[data-put-href]');
        vpsPricingObj.$progressBar = $vpsPricing.find('[data-vps-slider="progress_bar"]');

        vpsPricingObj.slider = function (res) {
            vpsPricingObj.slider.value = 0;
            vpsPricingObj.slider.max = res.length - 1;
            
            vpsPricingObj.slider.changeValue = function (e, ui) {
                vpsPricingObj.slider.value = $.isEmptyObject( ui ) ? vpsPricingObj.slider.value : ui.value;
                
                vpsPricingObj.$putValue.each(function () {
                    var $t = $(this),
                        curValue = res[ vpsPricingObj.slider.value ][ $t.data('put-value') ];

                    if ( Array.isArray(curValue) ) {
                        $t.text( curValue[0] ).siblings('.progress').css( 'width', curValue[1] );
                    } else {
                        $t.text( curValue );
                    }
                });
                
                vpsPricingObj.$putHref.each(function () {
                    var $t = $(this);
                    
                    $t.attr( 'href', res[ vpsPricingObj.slider.value ][ vpsPricingObj.$putHref.data('put-href') ] );
                });

                var indx = typeof ui.value === 'undefined' ? vpsPricingObj.slider.value : ui.value;
                vpsPricingObj.$plansListItem.eq( indx ).addClass('active').siblings('li').removeClass('active');
            };
            
            vpsPricingObj.$slider.slider({
                animate: 'fast',
                range: 'min',
                min: 0,
                max: vpsPricingObj.slider.max,
                value: vpsPricingObj.slider.value,
                step: 1,
                create: function (e, ui) {
                    vpsPricingObj.$plansList = $('<ul class="vps-pricing-plans clearfix"></ul>');
                    $(e.target).append( vpsPricingObj.$plansList );

                    $.each(res, function (i, value) {
                        vpsPricingObj.$plansList.append('<li><span>' + value.shortTitle + '</span></li>');
                    });
                    vpsPricingObj.$plansListItem = vpsPricingObj.$plansList.children('li');

                    vpsPricingObj.slider.changeValue(e, ui);
                },
                slide: vpsPricingObj.slider.changeValue
            });
        };
        
        if ( $vpsPricing.length ) {
            $.getJSON('json/vps-plans.json', vpsPricingObj.slider);
        }


        /* 13: Multi Tab target
        ==============================================*/

        var tabTarget = $('[data-toggle="tab"]');

        tabTarget.on('show.bs.tab', function(){

            var target = $(this).data('secondary-target');

            if( typeof target !== 'undefined'){

                target = $(target);
                
                target.addClass('active').siblings().removeClass('show active');

                setTimeout(function () {
                    target.addClass('show');
                }, 200);
            }
        });

        
        /* 14: Collapsible tab content
        ==============================================*/

        var aboutUs = $('.about-us');
        aboutUs.on('click', 'a.read-more', function(event){
            event.preventDefault();
            $(this).parent().hide();

            var fullContent = $(this).parent().siblings();

            fullContent.fadeIn();
        });

        
        /* 15: Google map
        ==============================================*/

        var $map = $('[data-trigger="map"]'),
            $mapOps;

        if ( $map.length ) {
            // Map Options
            $mapOps = $map.data('map-options');

            // Map Initialization
            window.initMap = function () {
                $map.css('min-height', '500px');

                $map.each(function () {
                    var $t = $(this), map, lat, lng, zoom;

                    $mapOps = $t.data('map-options');
                    lat = parseFloat($mapOps.latitude, 10);
                    lng = parseFloat($mapOps.longitude, 10);
                    zoom = parseFloat($mapOps.zoom, 10);

                    map = new google.maps.Map($t[0], {
                        center: {lat: lat, lng: lng},
                        zoom: zoom,
                        scrollwheel: false,
                        disableDefaultUI: true,
                        zoomControl: true,
                        styles: [
                            {
                                "featureType": "water",
                                "elementType": "geometry",
                                "stylers": [{"color": "#e9e9e9"}, {"lightness": 17}]
                            },
                            {
                                "featureType": "landscape",
                                "elementType": "geometry",
                                "stylers": [{"color": "#f5f5f5"}, {"lightness": 20}]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#ffffff"}, {"lightness": 17}]
                            },
                            {
                                "featureType": "road.highway",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#ffffff"}, {"lightness": 29}, {"weight": 0.2}]
                            },
                            {
                                "featureType": "road.arterial",
                                "elementType": "geometry",
                                "stylers": [{"color": "#ffffff"}, {"lightness": 18}]
                            },
                            {
                                "featureType": "road.local",
                                "elementType": "geometry",
                                "stylers": [{"color": "#ffffff"}, {"lightness": 16}]
                            },
                            {
                                "featureType": "poi",
                                "elementType": "geometry",
                                "stylers": [{"color": "#f5f5f5"}, {"lightness": 21}]
                            },
                            {
                                "featureType": "poi.park",
                                "elementType": "geometry",
                                "stylers": [{"color": "#dedede"}, {"lightness": 21}]
                            },
                            {
                                "elementType": "labels.text.stroke",
                                "stylers": [{"visibility": "on"}, {"color": "#ffffff"}, {"lightness": 16}]
                            },
                            {
                                "elementType": "labels.text.fill",
                                "stylers": [{"saturation": 36}, {"color": "#333333"}, {"lightness": 40}]
                            },
                            {
                                "elementType": "labels.icon",
                                "stylers": [{"visibility": "off"}]
                            },
                            {
                                "featureType": "transit",
                                "elementType": "geometry",
                                "stylers": [{"color": "#f2f2f2"}, {"lightness": 19}]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "geometry.fill",
                                "stylers": [{"color": "#fefefe"}, {"lightness": 20}]
                            },
                            {
                                "featureType": "administrative",
                                "elementType": "geometry.stroke",
                                "stylers": [{"color": "#fefefe"}, {"lightness": 17}, {"weight": 1.2}]
                            }
                        ]
                    });

                    map = new google.maps.Marker({
                        position: {lat: lat, lng: lng},
                        map: map,
                        animation: google.maps.Animation.DROP,
                        draggable: true,
                        icon: 'img/marker.png'
                    });
                });
            };

            // Map Script
            var googleAPI = document.createElement('script');

            googleAPI.type = 'text/javascript';
            googleAPI.src = 'https://maps.googleapis.com/maps/api/js?key='+ $mapOps.api_key +'&callback=initMap';

            $('body').append( googleAPI );
        }
    });

    
    $(window).on('load', function(){

        /* 16: isotope for Blog
        ==============================================*/

        $('.isotope').isotope({
            itemSelector: '.isotope > div'
        });


        /* 17: Content animation
        ==============================================*/

        var $animateEl = $('[data-animate]');

        $animateEl.each(function () {
            var $el = $(this),
                $name = $el.data('animate'),
                $duration = $el.data('duration'),
                $delay = $el.data('delay');

            $duration = typeof $duration === 'undefined' ? '0.6' : $duration ;
            $delay = typeof $delay === 'undefined' ? '0' : $delay ;

            $el.waypoint(function () {
                $el.addClass('animated ' + $name)
                   .css({
                        'animation-duration': $duration + 's',
                        'animation-delay': $delay + 's'
                   });
            }, {offset: '93%'});
        });

        setTimeout(function () {
            $('nav').removeClass('fadeInDown');
        }, 2000);
    });
    

    /* 18: Preloader
    ==============================================*/

    $("#fakeLoader").fakeLoader({
        timeToHide: 250,
        zIndex: 99999,
        spinner: "spinner6"
    });

})(jQuery);
