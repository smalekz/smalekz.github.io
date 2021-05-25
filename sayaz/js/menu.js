(function ($) {
    "use strict";
    $.fn.menumaker = function (options) {
        var cssmenu = $(this),
            settings = $.extend({
                title: "Menu",
                format: "dropdown",
                sticky: false
            }, options);
        return this.each(function () {
            cssmenu.prepend('<div id="menu-button">' + settings.title + '</div>');
            $(this).find("#menu-button").on('click', function () {
                $(this).toggleClass('menu-opened');
                var mainmenu = $(this).next('ul');
                if (mainmenu.hasClass('open')) {
                    mainmenu.slideUp('fast').removeClass('open');
                } else {
                    mainmenu.slideDown('fast').addClass('open');
                    if (settings.format === "dropdown") {
                        mainmenu.find('ul').slideDown();
                    }
                }
            });
            cssmenu.find('li ul').parent().addClass('has-sub');
            var multiTg = function () {
                cssmenu.find(".has-sub").prepend('<span class="submenu-button"></span>');
                cssmenu.find('.submenu-button').on('click', function () {
                    $(this).toggleClass('submenu-opened');
                    if ($(this).siblings('ul').hasClass('open')) {
                        $(this).siblings('ul').removeClass('open').slideUp('fast');
                    } else {
                        $(this).siblings('ul').addClass('open').slideDown('fast');
                    }
                });
            };
            if (settings.format === 'multitoggle') multiTg();
            else cssmenu.addClass('dropdown');
            if (settings.sticky === true) cssmenu.css('position', 'fixed');
            var resizeFix = function () {
                if ($(window).width() > 992) {
                    cssmenu.find('ul').show();
                }
                if ($(window).width() < 992) {
                    cssmenu.find('ul').hide().removeClass('open');
                }
            };
            resizeFix();
            return $(window).on('resize', resizeFix);
        });
    };
})(jQuery);

(function ($) {
    "use strict";
    $(function () {
        $(".header-menu").menumaker({
            title: '<i class="fa fa-bars"></i>',
            format: "multitoggle"
        });
    });
})(jQuery);