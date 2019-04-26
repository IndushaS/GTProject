// JavaScript Document


function RR_bindHover(topPosition1, topPosition2) {
    $('.RR_gridRow .RR_productMore').unbind('hover');
    $('.RR_gridRow .RR_productMore').hover(function () {
        $('.RR_gridRow .RR_productMore select[name=lstUom]').hover(function (e) {
            e.stopPropagation();
        });
        $(this).children('.RR_shopNow').hide();
        $(this).stop().animate({
            top: topPosition1
        }, 300);
        $(this).children('.RR_productMoreBg').children('.RR_productMoreDetail').show();
        $(this).children('.RR_productMoreBg').find('select[name=lstUom]').removeAttr('tabindex');
        $(this).children('.RR_productMoreBg').find('input[name=txtProductQty]').removeAttr('tabindex');
        $(this).children('.RR_productMoreBg').find('a[name=corpAddToCart]').removeAttr('tabindex')
    }, function () {
        $(this).stop().animate({
            top: topPosition2
        }, 300, function () {
            $(this).children('.RR_shopNow').fadeIn();
            $(this).children('.RR_productMoreBg').children('.RR_productMoreDetail').hide();
            $(this).children('.RR_productMoreBg').find('select[name=lstUom]').attr('tabindex', '-1');
            $(this).children('.RR_productMoreBg').find('input[name=txtProductQty]').attr('tabindex', '-1');
            $(this).children('.RR_productMoreBg').find('a[name=corpAddToCart]').attr('tabindex', '-1')
        })
    });

    $('.RR_productPicSm .RR_detailOver').hover(function () {
        $(this).children('.RR_quickViewIcon').show()
    }, function () {
        $(this).children('.RR_quickViewIcon').hide()
    })
}

function NewLink(target, link) {
        target.href = link;
}
