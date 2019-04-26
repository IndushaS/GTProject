

function loadRRAllControls(jasonResponse, categoryName) {
    HideControlsWithNoPlacements(jasonResponse);
    $.each(jasonResponse.placements, function (index, placement)
    {
        if (typeof placement != "undefined") {
            var placementDefinition = GetObjectFromArray(placementDefinitions, "placement_name", placement.placement_name);
            if (placementDefinition != null) {
                $.post(placementDefinition.actionUrl, {
                    placementJson: JSON.stringify(placement),
                    categoryName: categoryName,
                    recordsPerRow: placementDefinition.recordsPerRow,
                    divId: placementDefinition.divId,
                    pageType: placementDefinition.pageType,
                    htmlClass: placementDefinition.htmlClass,
                    currentItemIndex: 0,
                    nextItemIndex: 0
                }, function(jsonResult) {
                    var controlId = placementDefinition.divId;
                    var rr_currentItemIndex = jsonResult.currentItemIndex;
                    var errorId = jsonResult.errorId;
                    $("#" + controlId).html(jsonResult.htmlView);
                    initCarousel($("#" + controlId + " .owl-container"));
                    //If there is no placement returned by Rich Relevance or if there is no record at all, then hide the Control 
                    if (errorId.length > 1 || $.trim($("#" + controlId).find("#RR_gridRow_" + rr_currentItemIndex).html()).length == 0) {
                        $("#" + controlId).hide();
                    } else {

                        $("#" + controlId).find("#RR_gridRow_0 .products-carousel__item").each(function(index) {
                            $("#" + controlId).find(".owl-container").data('owlCarousel').addItem($(this).wrapAll('<div>').parent().html());
                        });

                        $("#" + controlId).attr("currentItemIndex", rr_currentItemIndex);
                        disableEnableNextPrevButton(controlId);

                        bindCarouselAddToCartButtons();
                    }

                });
            }
        }
    });

}

function GetObjectFromArray(array, idName, idValue) {
    var result = null;
    jQuery.map(array, function (obj) {
        if (obj[idName] === idValue)
            result = obj;
    });

    return result;
}

//Check whether there is a matching placement coming from Rich Relevance according to what is defined in the page
//If there is no matching placement, then we need to hide the controls
function HideControlsWithNoPlacements(jasonResponse)
{
    for (var i = 0; i < placementDefinitions.length; i++) {
        var existPlacement = false;
        //check if placement definition exist in json result coming from Rich relevance
        $.each(jasonResponse.placements, function (index, placement) {
            if (typeof placement != "undefined") {
                if (placement.placement_name === placementDefinitions[i].placement_name) {
                    existPlacement = true;
                }
            }
        });
        if (!existPlacement)
        {
            $("#" + placementDefinitions[i].divId).hide();
        }
    }
}


function showLoader(controlId) 
{
    var loaderImg = $("#" + controlId + "_loader");
    var stDiv = $("#" + controlId);
    // show the loader
    loaderImg.css("top", stDiv.offset().top + stDiv.height() / 2 - 16);
    loaderImg.css("left", stDiv.offset().left + stDiv.width() / 2 - 16);
    loaderImg.show();
    stDiv.fadeTo("fast", 0.30);
}

function hideLoader(controlId) {
    $("#" + controlId + "_loader").hide();
    $("#" + controlId).fadeTo("fast", 1);
}

function actionAfterNext(controlId) {
    disableEnableNextPrevButton(controlId);    
    hideLoader(controlId);    
}

function disableEnableNextPrevButton(controlId) {
    var rr_currentItemIndex = $("#" + controlId).attr("currentItemIndex");

    $("#" + controlId).find(".next-btn").removeClass('disabledBtn');

    //Check to see if disable the next button if there are no more records
    var nextItemIndex = $("#" + controlId).find("#RR_gridRow_" + rr_currentItemIndex).attr("data-next-idx");
    if (nextItemIndex == "0") {
        $("#" + controlId).find(".next-btn").addClass('disabledBtn');
    }
}

function loadRRControlPrev(controlId) {
    var rr_currentItemIndex = $("#" + controlId).attr("currentItemIndex");
    if ($("#" + controlId).find(".prev-btn").hasClass('disabledBtn')) {
        return false;
    }

    var prevItemIndex = $("#" + controlId).find("#RR_gridRow_" + rr_currentItemIndex).attr("data-prev-idx");
    if (prevItemIndex != rr_currentItemIndex) {
        $("#" + controlId).find(".products-carousel__items").html($("#" + controlId).find("#RR_gridRow_" + prevItemIndex).html());
    }
    rr_currentItemIndex = prevItemIndex;
    $("#" + controlId).attr("currentItemIndex", rr_currentItemIndex);

    //setCorpProductItemAddToCartHandlers();
    //RR_bindHover(200, 280);

    disableEnableNextPrevButton(controlId);
    $("#" + controlId).find(".products-carousel__items").hide().fadeIn("slow");
}


function jsonp(url) {
    var head = document.getElementsByTagName('head')[0];    
    var script = document.createElement("script");

    script.setAttribute("src", url);
    head.appendChild(script);
    head.removeChild(script);
}

function getPlacementJson(jasonResponse, placementName)
{
    var result;
    $.each(jasonResponse.placements, function (index, placement) {
        if (typeof placement != "undefined") {
            if (placement.placement_name === placementName) {
                result = placement;
            }
        }
    });
    return result;
}

function getNumItemsPerPage(carouselObject) {
    var items;
    var itemsDesktop;
    var itemsDesktopSmall;
    var itemsTablet;

    if (carouselObject.hasClass("owl-has-left")) {
        items = 4;
        itemsDesktop = 3;
        itemsDesktopSmall = 3;
        itemsTablet = 2;
    }
    else if (carouselObject.hasClass("owl-wide")) {
        items = 5;
        itemsDesktop = 4;
        itemsDesktopSmall = 4;
        itemsTablet = 3;
    }

    var width = $(window).width();

    if (width <= 768) {
        return 1;
    } else if (width <= 992) {
        return itemsTablet;
    } else if (width <= 1200) {
        return itemsDesktopSmall;
    } else {
        return items;
    }
}


function initCarousel(carouselObject)
{
    var items;
    var itemsDesktop;
    var itemsDesktopSmall;
    var itemsTablet;
    if (carouselObject.hasClass("owl-has-left"))
    {
        items = 4;
        itemsDesktop = 3;
        itemsDesktopSmall = 3;
        itemsTablet = 2;
    }
    else if (carouselObject.hasClass("owl-wide"))
    {
        items = 5;
        itemsDesktop = 4;
        itemsDesktopSmall = 4;
        itemsTablet = 3;
    }

    // Carousels
    carouselObject.owlCarousel({
        items: items,
        itemsDesktop: [1200, itemsDesktop],
        itemsDesktopSmall: [1200, itemsDesktopSmall],
        itemsTablet: [992, itemsTablet],
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
        },
        afterAction : function()
        {            
            this.$elem.attr("data-carousel-currentItem", this.owl.currentItem);
        }

    });

    var owl;
    var preview = carouselObject.parent().parent().find('.owl-nav-prev');
    var next = carouselObject.parent().parent().find('.owl-nav-next');

    $(preview).on('click', function (e) {
        owl = $(this).parent().next().children('.owl-container');
        owl.trigger('owl.prev');
        e.preventDefault();
    });

    $(next).on('click', function (e) {
        owl = $(this).parent().next().children('.owl-container');
        e.preventDefault();
        loadRRControlNextOwl(this, owl);

    });
}

function loadRRControlNextOwl(nextControl, carouselObject) {
    var controlId = carouselObject.attr("data-rrcontrol-id");
    var placementName = carouselObject.attr("data-rrplacement-name");    
    var rr_currentItemIndex = $("#" + controlId).attr("currentItemIndex");

    if ($(nextControl).hasClass('disabledBtn')) {
        carouselObject.trigger('owl.next');
        return false;
    }

    var nextItemIndex = $("#" + controlId).find("#RR_gridRow_" + rr_currentItemIndex).attr("data-next-idx");
        
    
    var placementDefinition = GetObjectFromArray(placementDefinitions, "placement_name", placementName);
    if (placementDefinition != null) {
        var placementJson = getPlacementJson(jasonResponse, placementName);
        $.post(placementDefinition.actionUrl, {
            placementJson: JSON.stringify(placementJson), categoryName: "", recordsPerRow: placementDefinition.recordsPerRow,
            divId: placementDefinition.divId, pageType: placementDefinition.pageType, currentItemIndex: rr_currentItemIndex, nextItemIndex: nextItemIndex
        }, function (jsonResult) {
            var controlId = placementDefinition.divId;
            var rr_currentItemIndex = jsonResult.currentItemIndex;
            var errorId = jsonResult.errorId;
            var carrouselObj = $("#" + controlId).find(".owl-container");
            var carrsouselCurrentItem = $(carrouselObj).attr("data-carousel-currentItem");

            $("#" + controlId).attr("currentItemIndex", rr_currentItemIndex);
            $("#" + controlId).find(".RR_ProductList").append(jsonResult.htmlView);

            $("#" + controlId).find("#RR_gridRow_" + rr_currentItemIndex +" .products-carousel__item").each(function (index) {
                $(carrouselObj).data('owlCarousel').addItem($(this).wrapAll('<div>').parent().html());
            });

            //need to restore the index, since addItem reset the carrousel Index position
            var carrouselNextIndex = parseInt(carrsouselCurrentItem) + getNumItemsPerPage(carouselObject);
            $(carrouselObj).trigger("owl.goTo", carrouselNextIndex);

            //delay to make sure that the html appended is ready
            setTimeout(function () { disableEnableNextPrevButton(controlId); }, 500);

             bindCarouselAddToCartButtons();

        });
    }
    
}
