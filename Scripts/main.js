/* must go first */
(function ($, sr) {

    // debouncing function from John Hann
    // http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
    var debounce = function (func, threshold, execAsap) {
        var timeout;

        return function debounced() {
            var obj = this,
              args = arguments;

            function delayed() {
                if (!execAsap)
                    func.apply(obj, args);
                timeout = null;
            };

            if (timeout)
                clearTimeout(timeout);
            else if (execAsap)
                func.apply(obj, args);

            timeout = setTimeout(delayed, threshold || 250);
        };
    }
    // smartresize 
    jQuery.fn[sr] = function (fn) {
        return fn ? this.bind('resize', debounce(fn)) : this.trigger(sr);
    };

})(jQuery, 'smartresize');

$(function () {
    var $toggle = $('.close-btn'),
        $target;

    $toggle.click(function (e) {
        e.preventDefault();
        // disable anchor tag
        $target = $(this).closest($('[id]'));
        // find the closest ancestor that has an id

        if ($target.is('.header-active')) {
            $('.header-active').removeClass('header-active');
            //      $target.slideUp(speed);
        } else if ($target.is('.popover-active')) {
            $('.popover-active').removeClass('popover-active');
        }
        //      $target.fadeOut(speed);
        //    } else {
        //       if you can just hide something, don't add it to this file
        $target.hide();
        //    }
    });
});


/* header - mobile - cart popup */

$(function () {
    //  var $toggle       = $('.cart-wide-toggle').find('.popover-toggle');
    var $target = $('#header-cart');
    var active = 'header-active';


    //  $toggle.on('click.showHeaderCart', function() {
    //    if(!$target.hasClass(active)) {
    //      $target.addClass(active).fadeIn();
    //    } else {
    //      return;
    //    }
    //    $toggle.unbind('click.showHeaderCart');
    //  });
    $(document).on('click.hideHeaderCart', function (e) {
        if (!$(e.target).closest($target).length && $target.hasClass(active)) {

        }
    });
});

$(function () {
    var $toggle = $('[toggle="location-small"]'),
        $target = $('#' + $toggle.attr('toggle')),
        speed = 'fast';

    $toggle.click(function (e) {
        e.preventDefault();
        $target.slideToggle(speed);
    });
});

$(function () {
    var $mega = $('.megamenu-wrapper'),
        $toggle = $('[mega-toggle]'),
        $toggleClasses = $('.mega-toggle,.mega-subnav-title'),
        $megaItem = $('.mega-item'),
        $megaToggle,
        active = 'mega-active',
        $activeMega,
        megaSubnav = 'mega-has-subnav',
        activeSubnav = 'mega-subnav-active',
        $megaSubnavItem = $('.mega-subnav-item'),
        $overlay = $('.overlay'),
        speed = 'fast';

    //$toggleClasses.click(function (e) {
       // if ($(this).attr('mega-toggle') || $(this).closest('.mega-has-subnav').attr('mega-toggle')) {
          //  // check if there is a mega-toggle attribute (does this have a dropdown?)
          //  e.preventDefault();
          //  // if it has a dropdown, disable the anchor tag 
      //  } else { return true; }
   // });

    $toggle.hover(function () {
        if ($(this).attr('mega-toggle')) {
            // check if there is a mega-toggle attribute (does this have a dropdown?)
            if ($('.' + active)) {
                $('.' + active).removeClass(active);
            }
            // if there is something active already, remove its active class
            $megaToggle = $(this).attr('mega-toggle');
            $('[mega-toggle="' + $megaToggle + '"]').addClass(active);
            $activeMega = $megaItem.filter('.' + active);
            $mega.stop(true, false).show().animate({
                height: $activeMega.css('height')
            }, speed);
            $overlay.stop(true, false).fadeIn();
            if ($activeMega.hasClass(megaSubnav)) {
                $activeMega.find($('.mega-subnav-item')).first().addClass(activeSubnav);
            }
        }
    },
      function () {
          if ($(this).attr('mega-toggle')) {
              $megaToggle = $(this).attr('mega-toggle');
              $overlay.stop(true, false).fadeOut();
              $mega.delay(500).stop(true, false).animate({
                  height: 0
              }, speed, function () {
                  $('[mega-toggle="' + $megaToggle + '"]').removeClass(active);
                  $mega.hide();
              });
              if ($('.' + activeSubnav)) {
                  $('.' + activeSubnav).delay(500).removeClass(activeSubnav);
              }
          }
      });

    $megaSubnavItem.hover(function () {
        if (!$(this).hasClass(activeSubnav)) {
            $('.' + activeSubnav).removeClass(activeSubnav);
            $(this).addClass(activeSubnav);
        }
    });
});


// small screens: header/nav

$(function () {
    var $toggle = $('.header-toggle'),
        $target,
        $activeEl,
        $activeAttr,
        active = 'header-active',
        activePopover = 'popover-active',
        speed = 'fast';

    $toggle.click(function (e) {
        var attr = $(this).attr('toggle');

        // some browsers return undefined, some return false
        if (typeof attr === typeof undefined || attr === false) {
            // if the toggle attribute is not defined treat it like a link
            return;
        }

        // testing iOS issues
        // if (!$('body').hasClass('sticky-header-active')) {
            e.preventDefault();
            if ($('.' + activePopover)) {
                $('[id].' + activePopover).hide();
                $('.' + activePopover).removeClass(activePopover);
            }
            // prevent anchor tag from going to its URL
            // always give anchor tags a URL in case JS is disabled!
            $toggle = $(this);
            // store the jquery object 'this'

            $target = $('#' + $toggle.attr('toggle'));
            // get the dropdown

            if ($toggle.hasClass(active)) {
                // if this is already active
                $target.hide().removeClass(active);
                $toggle.removeClass(active);
            } else {
                if ($('.' + active)) {
                    // if something else is active...
                    $activeEl = $('.' + active + '[toggle]');
                    // get the active link
                    $activeAttr = $activeEl.attr('toggle');
                    // and its toggle attribute
                    $('#' + $activeAttr).hide().removeClass(active);
                    // remove the dropdown first
                    $activeEl.removeClass(active);
                    if ($('.main-nav-small-active')) {
                        $('[id].main-nav-small-active').hide();
                        $('.main-nav-small-active').removeClass('main-nav-small-active');
                    } else { return; }
                } else { return; }

                // if this isn't active, make it active
                $target.slideDown(speed).addClass(active);
                $toggle.addClass(active);
            }
        //}
    });
});

$(function () {
    $(window).smartresize(function () {
        var win = $(this);
        if (win.width() < 768) {
            if ($('.popover-active')) {
                $('[id].popover-active').hide();
                $('.popover-active').removeClass('popover-active');
            }
        } else {
            if ($('.header-active')) {
                $('[id].header-active').hide();
                $('.header-active').removeClass('header-active');
            }
        }
    });
});


$(function () {
    var $toggle = $('.popover-toggle'),
        $popover = $('.popover'),
        $target,
        active = 'popover-active',
        activeHeader = 'header-active',
        speed = 'fast',
        $this;

    $toggle.click(function (e) {
        e.preventDefault();
        var $this = $(this);
        if ($this.parent('.cart-wide-toggle') && $('.site-header').hasClass('sticky-header-down')) {
            window.location.href = $this.attr('href');
        } else {
            // prevent anchor tag from going to its URL
            // always give anchor tags a URL in case JS is disabled!
            // find the popover that matches the toggle
            $target = $popover.filter($('#' + $this.attr('toggle')));

            if ($('.' + activeHeader)) {
                $('[id].' + activeHeader).hide();
                $('.' + activeHeader).removeClass(activeHeader);
            }
            if ($target.hasClass(active)) {
                // if the current toggle/popover is already active...
                $target.hide();
                $('.' + active).removeClass(active);
                // turn it off
            } else {
                if ($('.' + active)) {
                    // if a different toggle/popover is active
                    $('.popover.' + active).hide();
                    // hide the active popover
                    $('.' + active).removeClass(active);
                    // remove active classes
                }
                $target.fadeIn(speed).addClass(active);
                // show matching popover and make it active
                $this.parent().addClass(active);
                // make the LI parent of the anchor tag active
            }
        }
    });
});

$(function () {
    var didScroll;
    var lastScrollTop = 0;
    var delta = 5;
    var $header = $('.site-header');
    var st;
    var $body = $('body');
    var $cartToggle = $('.cart-wide-toggle').find('.popover-toggle');

    $(window).scroll(function () {
        didScroll = true;
    });

    setInterval(function () {
        if (didScroll) {
            hasScrolled();
            didScroll = false;
        }
        // only check scrolling every 100 milliseconds
    }, 100);

    function hasScrolled() {
        if ($(window).width() < 992) {
            $header.removeClass('sticky-header-down').removeClass('sticky-header-up');
            $body.removeClass('sticky-header-active');
        } else {
            st = $(this).scrollTop();
            if (Math.abs(lastScrollTop - st) <= delta) {
                return;
            }
            if (st < 126) {
                // if you're on the wide view
                $header.removeClass('sticky-header-down').removeClass('sticky-header-up');
                $body.removeClass('sticky-header-active');
                // remove all special nav classes
                // show default nav
            } else if (st > lastScrollTop && st > 0) {
                $header.removeClass('sticky-header-down').addClass('sticky-header-up');
                $body.addClass('sticky-header-active');
                if ($('.main-nav-small-active')) {
                    $('[id].main-nav-small-active').hide();
                    $('.main-nav-small-active').removeClass('main-nav-small-active');
                } else { return; }
                if ($('.popover-active')) {
                    $('[id].popover-active').hide();
                    $('.popover-active').removeClass('popover-active');
                } else { return; }
            } else {
                if (st + $(window).height() < $(document).height()) {
                    $header.removeClass('sticky-header-up').addClass('sticky-header-down');
                    $body.addClass('sticky-header-active');
                }
            }
            lastScrollTop = st;
        }
    }
});


$(function () {
    $(".exp_qty_AddtoCart").change(function () {

        var prodCode = $(this).val();
        var uid = $(this).attr("data-uid");
        var btn = $(this).parent().siblings("button.exp-AddtoCart");
        // alert(prodCode);
        if (prodCode != "") {

            $.ajax({
                url: "/MainContentPostloginFeatures/ProductInfo",
                type: "POST",
                data: { productCodeString: prodCode }
            })
            .done(function (result) {
                $("p.exp_Description_" + uid).html($(result).find("p.exp_Description_").html());
                $("div.expAddToCartSelect_" + uid).html($(result).find("div.expAddToCartSelect_").html());
                btn.prop('disabled', false);
            })
            .fail(function (result) {
                //   alert(result);
                console.log(result);
            });
        }
        else { alert("Product Code cannot be empty"); }

    });



    $(".exp-AddtoCart").click(function () {

        var pc = $(this).siblings("div.express-sku-input").children("input.exp_qty_AddtoCart").val();
        var uid = $(this).siblings("div.express-sku-input").children("input.exp_qty_AddtoCart").attr("data-uid")
        var qt = $(this).siblings("div.express-qty-input").children("input").val();
        var selectedVal = $(this).siblings("div.express-format-input").children("div.expAddToCartSelect_" + uid).children("select").val();
        var btn = $(this);
        var img = $(this).siblings("img");
        var pu = "";
        var pq = "";
        var packageArray = selectedVal.split('|');
        if (packageArray.length >= 2)
        {
            pu = packageArray[0];
            pq = packageArray[1];
        }
        
        //alert("product Code: " + pc + " Quantity: " + qt + " UniqueID " + uid + " Selected value " + selectedVal);

        btn.hide();
        img.show();
        addToCart("1", pc, qt, pu, pq, btn, img)
    });

    // TODO: consolidate with the mvcsupport add to cart scripts to avoid code duplication
    function addToCart(indexes, products, quantities, units, pkgs, btn, img)
    {

        $.post("/Ajax/AddProductToCart.aspx", { a: "SR", rows: indexes, p: products, q: quantities, pu: units, pq: pkgs }, function (xml) {

            // display the messages
            if ($("messages", xml).text() != "") {
                alert($("messages", xml).text());
            }

            // AV. 2013-04-02. Fix of TTT #14329 (Redirecting to notification page)
            if ($("valid", xml).text() == "CustomStamp") {
                location.href = "/shopping/order/customStampsNotification.aspx";
            }

            if ($("session_version", xml).text() != "") {
                createCookie("cv", $("session_version", xml).text());
            }

            if ($("order_id", xml).text() != "") {
                createCookie("OrderId", $("order_id", xml).text(), 7);
            }

            var pendingSubst = false;

            if ($("pending_subst", xml).text() == "True") {
                pendingSubst = true;
            }

            // update the shopping cart area
            var count = $("count", xml).text();
            var formattedSubtotal = $("formatted_subtotal", xml).text();

            updateCartCountInHeader(count);

            img.hide();



            // need to call this only on the last call but the flag may be set earlier
            if (pendingSubst) {
                location.href = "/sites/gt/ProductSubstitutions.aspx";
            }

            btn.show();

        });
    }

    //Zoom images
    var e = $(".easyzoom");
    if (e.length) {
        e = $(".easyzoom").easyZoom();
        var t = e.filter(".easyzoom--with-thumbnails").data("easyZoom");
        $(".thumbnails").on("click", "a",
            function (e) {
                var a = $(this);
                e.preventDefault(), t.swap(a.data("standard"), a.attr("href"))
            })
    }

    // Carousels
    $(".owl-has-left.products-carousel").owlCarousel({
        items: 4,
        itemsDesktop: [1200, 3],
        itemsDesktopSmall: [1200, 3],
        itemsTablet: [992, 2],
        itemsMobile: [768, 1],
        pagination: false,
        navigation: false,
        afterInit: function () {
            // make individual items focusable
            $('.owl-has-left.products-carousel .owl-item').attr('aria-selected', 'false').attr('tabindex', '0');
            $('.owl-has-left.products-carousel').attr('tabindex', '0');

            // on when an item has focus, let screen readers know it is active
            $('.owl-has-left.products-carousel .owl-item').on('focus', function () {
                $('.owl-has-left.products-carousel .owl-item').attr('aria-selected', 'false');
                $(this).attr('aria-selected', 'true');
            });
        }
    });

    $(".owl-wide.products-carousel").owlCarousel({
        items: 5,
        itemsDesktop: [1200, 4],
        itemsDesktopSmall: [1200, 4],
        itemsTablet: [992, 3],
        itemsMobile: [768, 1],
        pagination: false,
        navigation: false,
        afterInit: function () {
            // make individual items focusable
            $('.owl-wide.products-carousel .owl-item').attr('aria-selected', 'false').attr('tabindex', '0');
            $('.owl-wide.products-carousel').attr('tabindex', '0');

            // on when an item has focus, let screen readers know it is active
            $('.owl-wide.products-carousel .owl-item').on('focus', function () {
                $('.owl-wide.products-carousel .owl-item').attr('aria-selected', 'false');
                $(this).attr('aria-selected', 'true');
            });
        }
    });

    $(".also-available-carousel").owlCarousel({
        items: 3,
        itemsDesktop: [1200, 3],
        itemsDesktopSmall: [1200, 3],
        itemsTablet: [992, 2],
        itemsMobile: [768, 1],
        pagination: false,
        navigation: false,
        afterInit: function () {
            // make individual items focusable
            $('.also-available-carousel .owl-item').attr('aria-selected', 'false').attr('tabindex', '0');
            $('.owl-wide.products-carousel').attr('tabindex', '0');

            // on when an item has focus, let screen readers know it is active
            $('.also-available-carousel.owl-item').on('focus', function () {
                $('.also-available-carousel .owl-item').attr('aria-selected', 'false');
                $(this).attr('aria-selected', 'true');
            });
        }
    });

    // custom prev/next buttons for carousels
    var owl;
    $('.owl-nav-prev').on('click', function (e) {
        owl = $(this).parent().next().children('.owl-container');
        owl.trigger('owl.prev');
        e.preventDefault();
    });
    $('.owl-nav-next').on('click', function (e) {
        owl = $(this).parent().next().children('.owl-container');
        owl.trigger('owl.next');
        e.preventDefault();
    });

});

function openPopUpWin(purl, pwidth, pheight, scroll) {
    var params = "height=" + pheight + ",innerHeight=" + pheight;
    params += ",width=" + pwidth + ",innerWidth=" + pwidth;

    if (window.screen) {
        var ah = screen.availHeight - 30;
        var aw = screen.availWidth - 10;
        var xc = (aw - pwidth) / 2;
        var yc = (ah - pheight) / 2;
        params += ",left=" + xc + ",screenX=" + xc;
        params += ",top=" + yc + ",screenY=" + yc;
    }

    if (scroll) {
        params += ',scrollbars';
    }

    window.open(purl, '', params);
}

/* The following functions are used but should be replaced */

// Q2 DEPRECIATE REPLACE WITH:
function getCookie(name) {
    var dcookie = document.cookie;
    var cname = name + "=";
    var clen = dcookie.length;
    var cbegin = 0;

    while (cbegin < clen) {
        var vbegin = cbegin + cname.length;
        if (dcookie.substring(cbegin, vbegin) == cname) {
            var vend = dcookie.indexOf(";", vbegin);
            if (vend == -1) vend = clen;
            return unescape(dcookie.substring(vbegin, vend));
        }
        cbegin = dcookie.indexOf(" ", cbegin) + 1;
        if (cbegin == 0) break;
    }
    return null;
}

// Q2 DEPRECIATE:
function SetCookie(name, value, expires) {
    if (!expires) expires = new Date();
    document.cookie = name + "=" + escape(value) + "; expires=" + expires.toGMTString() + "; path=/";
}

// @codekit-prepend "_close-btn.js","_footer.js","_header-cart.js","_location-small.js","_megamenu.js","_nav-small.js","_onresize.js","_popover.js","_stickyheader.js","_subnav-small.js","_tooltip.js","_products-filter.js";

var scrollToStep = function (element) {
    if ($(window).width() >= 768) {
        offset = $(element).offset().top - 60;
    } else {
        offset = $(element).offset().top;
    }
    $('html, body').animate({
        scrollTop: offset
    }, 500);
};


$(function () {
    var $container = $('.equal-height-columns,.equal-height-wells'),
      $equals,
      height,
      tallest,
      $this;
    var equalHeight = function () {
        for (var i = 0; i < $container.length; i++) {
            // for each row that has equal height wells or columns...
            tallest = 0;
            // reset the "tallest" value
            $this = $container.eq(i);
            if (($this).hasClass('equal-height-columns')) {
                $equals = $this.children('[class*="col-"]');
            } else {
                $equals = $this.find('[class*="well-"]');
            }
            $equals.css("height", "auto");
            if ($(window).width() >= 768) {
                for (var j = 0; j < $equals.length; j++) {
                    $this = $equals.eq(j);
                    height = $this.height();
                    if (height > tallest) {
                        // if this one is the tallest,
                        // replace the "tallest" value
                        // with the height of the current column/well
                        tallest = height;
                    } else { }
                }
                $equals.height(tallest);
                // make all the columns/wells the same height 
            }
        }
    };

    if ($container.length) {
        equalHeight();
        $(window).smartresize(function () {
            equalHeight();
        });
    }
});



$("#site-wide-search-submit").click(function () {

    var searchText = $("#site-wide-search").val();

    if (searchText == "" || searchText == "Search by Keyword or Product" || searchText == "Recherche rapide") {
        return false;
    }
        
    if (searchText.length >= 100) {
        $("#site-wide-search").val(searchText.substring(0, 100));
    }

    return true;

});

$(function () {
    var $btn = $('.btn-dropdown'),
      $dropdown = $btn.next('.dropdown-menu'),
      $this;

    $btn.on('click', function () {
        $this = $(this);
        $this.next('.dropdown-menu').toggle();
    });

    $(".search-standing-offer-option").on('click', function () {
        var searchMode = $(this).attr("data-search-mode");
        var searchModeText = $(this).attr("data-search-mode-text");
        $("#SearchMode").val(searchMode);
        $("#SearchModeText").text(searchModeText);
        $dropdown.hide();        
    });
    

    $(window).smartresize(function () {
        $dropdown.hide();
    });
});

$(function () {
    var $wideInput = $('#site-wide-search'),
      $wideSubmit = $('#site-wide-search-submit'),
      $smallInput = $('#site-small-search'),
      $smallSubmit = $('#site-small-search-submit'),
      searchBindEnter = function (input, submit) {
          input.on('keypress', function (e) {
              if (e.which === 13) {
                  e.preventDefault();
                  submit.trigger('click', function () {
                      return false;
                  });
              } else {
                  return true;
              }
          });
      };

    searchBindEnter($wideInput, $wideSubmit);
    searchBindEnter($smallInput, $smallSubmit);

});

// left rail products filter
$(function () {
    var $toggle = $("#products-filter-btn"),
        $target = $("#products-filter");

    $toggle.click(function () {
        $target.toggle();
        $toggle.toggleClass("filters-open");
    });
});

// Add maxlenght attribute for all inputs that use the  tag data-val-length-max used in the validator classes
$(function () {
    $("input[data-val-length-max]").each(function (index, element) {
        var length = parseInt($(this).attr("data-val-length-max"));
        $(this).prop("maxlength", length);
    });
});