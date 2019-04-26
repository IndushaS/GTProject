RegExp.escape = function (s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

// make a radio box work like a checkbox
// plugin code is from here:
// http://stackoverflow.com/questions/2117538/how-to-uncheck-a-radio-button
(function ($) {
    $.fn.uncheckableRadio = function () {

        return this.each(function () {
            var radio = this;
            $('label[for="' + radio.id + '"]').add(radio).mousedown(function () {
                $(radio).data('wasChecked', radio.checked);
            });

            $('label[for="' + radio.id + '"]').add(radio).click(function () {
                if ($(radio).data('wasChecked'))
                    radio.checked = false;
            });
        });
    };
})(jQuery);

$(function () {

    // close the header signin toggles.
    // works like close-btn but without the styling
    $("a.close-signin").unbind("click");
    $("a.close-signin").click(function (e) {
        $('#signin-wide').hide();
        $('#signin-small').hide();

        $('.popover-active').removeClass('popover-active');
    });


    $(".cart-toggle-wrapper").click(function (e) {
        $(".header-cart").html("<img src='/Content/images/order_summary_loader.gif' alt='Loading....'>");

        $.ajax({
            url: "/Header/Cart",
            type: "POST"
        })
            .done(function (result) {
                $(".header-cart").html(result);

                var cart = $("<cart>").append($.parseHTML(result));
                var totalItems = $(cart).find("div#total-items").text();
                updateCartCountInHeader(totalItems);
            })
            .fail(function (result) {
                console.log(result);
                $(".header-cart").html("Error! Check the console.");
            });
    });


    //product search result - grid/view switcher
    $("a.list-view").unbind("click");
    $("a.list-view").click(function (e) {
        e.preventDefault();

        $('div.grid-view').toggleClass('list-view grid-view');
        $("a.list-view").addClass("active");
        $("a.grid-view").removeClass("active");

    });

    //product search result - grid/view switcher
    $("a.grid-view").unbind("click");
    $("a.grid-view").click(function (e) {
        e.preventDefault();

        $('div.list-view').toggleClass('list-view grid-view');
        $("a.list-view").removeClass("active");
        $("a.grid-view").addClass("active");

    });

    // product details - add to subscription handler
    // trigger the add to subscription process from a product
    $("button[name='prod_AddToSubscription']").unbind("click");
    $("button[name='prod_AddToSubscription']").click(function(e) {
        e.preventDefault();
        var subscrIdElem = $("#SelectedSubscriptionOrderId option:selected");
        var subst;
        if (this.id.toString().indexOf("NS_") > 0) {
            subst = "btnNS_";
            subscrIdElem.val("new");
        } else {
            subst = "btn_";
        }


        var loaderImg = $("#" + this.id.replace(subst, "ldr_"));
        var qtyElem = $("#" + this.id.replace(subst, "qty_"));
        var selectedOption = $("#" + this.id.replace(subst, "uom_") + " option:selected");
        var noteElem = $("#" + this.id.replace(subst, "note_"));
        var addingButton = $("#" + this.id);
        var isWizard = false;
        addingButton.hide();
        loaderImg.show();


        var indexes = "1";
        var products = $(this).attr("pc");
        var quantities = qtyElem.val();
        var units = selectedOption.attr("pu");
        var pkgs = selectedOption.attr("pq");
        var note = noteElem.text();

        var uomEx = selectedOption.val();

        var subscrId = subscrIdElem.val();


        if (this.id.toString().indexOf("wizard") > 0) {
            subscrId = $("#OrderId").val();
            isWizard = true;
        }

        $.ajax({
                url: "/SubscriptionOrders/AddProductToSubscription",
                type: "POST",
                data: { a: "SR", rows: indexes, p: products, q: quantities, pu: units, pq: pkgs, uomEx: uomEx, note: note, subsId: subscrId }
            })
            .done(function(result) {

                processMessagesAndAlerts(result);

                $('#SelectedSubscriptionOrderId>option:eq(0)').prop('selected', true);
                $('#SelectedSubscriptionOrderId').disabled = true;

                if (!isWizard)
                {
                    addingButton.prop('disabled', true);
                }

                loaderImg.hide();

                addingButton.show();

            })
            .fail(function(result) {
                console.log(result);
            });
    });

    // product details - add to subscription handler
    // trigger the add to subscription process from a Wizard
    $("button[name='prod_AddToSubscriptionInWizard']").unbind("click");
    $("button[name='prod_AddToSubscriptionInWizard']").click(function (e) {
        e.preventDefault();

        var indexes = "1";
        var products = $(this).attr("pc");
        var quantities = 1;
        var units = "EA";
        var pkgs = "1";
        var note = "";

        var uomEx = "";
        var subscrId = "new";
        var frqncy = $(this).attr("frequency");
        var offer = $(this).attr("offer");

        $.ajax({
            url: "/SubscriptionOrders/AddProductToSubscription",
            type: "POST",
            data: { a: "SR", rows: indexes, p: products, q: quantities, pu: units, pq: pkgs, uomEx: uomEx, note: note, subsId: subscrId }
        })
            .done(function (result) {
                processMessagesAndAlerts(result);

                location.href = "/SubscriptionOrders/WizardPage2?frequency=" + frqncy + "&offerId=" + offer;
            })
            .fail(function (result) {
                console.log(result);
            });
    });



    // 2017-10-26. AV. Add a product to local cart and send PunchOutOrderMessage to Ariba (for MVC design)
    $("button[name='l2punchoutAddToAribaCart']").unbind("click");
    $("button[name='l2punchoutAddToAribaCart']").click(function (e) {
        e.preventDefault();

        var loaderImg = $("#" + this.id.replace("btn_", "ldr_"));
        var qtyElem = $("#" + this.id.replace("btn_", "qty_"));
        var selectedOption = $("#" + this.id.replace("btn_", "uom_") + " option:selected");
        var addingButton = $("#" + this.id);
        var noteElem = $("#" + this.id.replace("btn_", "note_"));

        addingButton.hide();
        loaderImg.show();

        var level2Punchout = "true";
        var indexes = "1";
        var products = $(this).attr("pc");
        var quantities = qtyElem.val();
        var units = selectedOption.attr("pu");
        var pkgs = selectedOption.attr("pq");
        var note = noteElem.text();
        var uomEx = selectedOption.val();

        // send request
        var readyToPost = true;
        if (readyToPost) {
            $.post("/Ajax/AddProductToCart.aspx", { a: "SR", rows: indexes, p: products, q: quantities, pu: units, pq: pkgs, uomEx: uomEx, note: note }, function (xml) {

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

                if ($("#myadobedtm").length > 0) {
                    var text = '{"transaction" : {"products" : [{"sku" :"' + products + '", "uom" : "' + units + '"}]}}';
                    digitalData = JSON.parse(text);
                    if (typeof _satellite != "undefined") {
                        _satellite.track('cart: add');
                    }
                }

                updateCartCountInHeader(count);

                loaderImg.hide();

                // need to call this only on the last call but the flag may be set earlier
                if (pendingSubst) {
                    location.href = "/ShoppingCart/ProductSubstitutions";
                }

                //addingButton.show();

                window.location.replace("/shopping/xt_logoff.aspx?URL=/shopping/punchout/xt_AribaCheckout.asp");
            });
            readyToPost = false;
        }
    });



    // select account favorite setting
    $("input.prg-select-acct-fav").unbind("click");
    $("input.prg-select-acct-fav").click(function (e) {
        var activate = this.checked;
        var account = $(this).attr("data-shipto");

        $.ajax({
            url: "/Account/SetFavoriteAccount",
            type: "POST",
            data: { account: account, activate: activate }
        })
            .done(function (result) {

                if (!result.success) {
                    alert("Error!");
                }

            })
            .fail(function (result) {
                console.log(result);
            });

    });

    bindCartElements();

    bindSubcriptionOrderItemElements();
    bindSubscriptionEditor();

    bindCartItemElements();
    bindQuickProductEntry();
    bindAddPromoToOrder();
    bindRemoveOrderPromo();
    bindSwitchAndSaveLogo();

    // order tracking event bindings
    bindOrderTrackingView();
    bindOrderTrackingButtons();

    // pending approval bindings
    bindPendingApprovalButtons();

    bindScheduleOrder();

    bindSelectAccountButtons();

    bindManageAccount();

    bindCustomLists();

    // needed for the Endeca carousel
    bindCarouselAddToCartButtons();

    $("input.prg-radio-checkbox").uncheckableRadio();

});

function createCookie(name, value) {
    document.cookie = name + "=" + value + "; path=/";
}

// product search result - compare check handler
// show/hide the compare buttons
$("input[name='prod_compareCheck']").unbind("click");
$("input[name='prod_compareCheck']").click(function (e) {
    var compareButton = $("#" + this.id.replace("chk_", "btn_"));

    if ($(this).is(':checked')) {
        compareButton.show();
    } else {
        compareButton.hide();
    }
});

// product search result - compare button handler
// show the product comparison screen
$("button[name='prod_compare']").unbind("click");
$("button[name='prod_compare']").click(function (e) {
    //alert("TODO: compare");
    var pcsSelected = "";
    $("input:checked[name='prod_compareCheck']").each(function (index) {
        if (index > 0) {
            pcsSelected = pcsSelected + "|" + $(this).attr("pc");
        }
        else {
            pcsSelected = $(this).attr("pc");
        }
    });

    if (pcsSelected.length > 0) {
        var productsNumber = pcsSelected.split("|").length;
        if (productsNumber > 1 && productsNumber < 4) {
            window.location = "/ProductDetails/CompareProducts?pcs=" + pcsSelected;
        }
        else if (productsNumber <= 1) {
            alert(minAmountCompare);
        }
        else {
            alert(maxAmountCompare);
        }
    }
});

// product search result - uom selector
// update the unit price after every selection
$("select.prg-prod-uom-selector").unbind("change");
$("select.prg-prod-uom-selector").change(function (e) {
    var priceElement = $("#" + this.id.replace("uom_", "amt_"));

    priceElement.html($("option:selected", this).attr("dp"));
});

//set up the view option in cookie
function SwitchViewPost(viewOption) {
    $.post("/Ajax/ResultList.aspx", { action: "SwicthView", viewOption: viewOption }, function (xml) {
        if ($("success", xml).text() == "true") {
            if (viewOption == "GR") {
                tabdisable();
            }
            else {
                tabenable();
            }
        }
    });
}

function bindAddPromoToOrder() {
    // shopping cart - add promotion to cart
    // posts to /ShoppingCart/AddPromoToOrder (setup in the view)    
    $("#ShoppingCartAddPromo_PromoCode").keypress(function (e) {
        if (e.which == 13) {
            e.preventDefault();
        }
    }); //stops default action: apply promo

    $("button.prg-cart-apply-code").unbind("click");
    $("button.prg-cart-apply-code").click(function (e) {
        e.preventDefault();

        var $form = $(this).parents('form');

        $.ajax({
            type: "POST",
            url: $form.attr('action'),
            data: $form.serialize()
        })
            .done(function (result) {
                //alert("done");

                processMessagesAndAlerts(result);

                if (result.reloadAll) {
                    reloadFullCart();
                }

                $(".cart-checkout-promo").html($(result.addPromoToOrder).html());

                bindAddPromoToOrder();
                bindRemoveOrderPromo();
            })
            .fail(function (result) {
                console.log(result);
            });
    });
}

function bindRemoveOrderPromo() {
    $("a.prg-cl-remove-promo").unbind("click");
    $("a.prg-cl-remove-promo").click(function (e) {
        e.preventDefault();

        var promoId = $(this).attr("data-tds");

        $.ajax({
            url: "/ShoppingCart/RemoveOrderPromo",
            type: "POST",
            data: { promoId: promoId }
        })
            .done(function (result) {
                processMessagesAndAlerts(result);

                if (result.reloadAll) {
                    reloadFullCart();
                }

                $(".cart-checkout-promo").html($(result.removeOrderPromo).html());

                bindAddPromoToOrder();
                bindRemoveOrderPromo();
            })
            .fail(function (result) {
                console.log(result);
            });

    });
}

function bindCartElements() {
    // show po editing textbox
    $("a.prg-sc-po-edit").unbind("click");
    $("a.prg-sc-po-edit").click(function (e) {
        e.preventDefault();

        // hide link, show editor and give it focus
        $(".prg-sc-po-edit").hide();
        $(".prg-sc-po-editor").show();
        $(".prg-sc-po-editor-text").focus();

    });

    // hide po editing textbox and save to server
    $("a.prg-sc-update-po").unbind("click");
    $("a.prg-sc-update-po").click(function (e) {
        e.preventDefault();

        // hide editor, show link
        $(".prg-sc-po-edit").show();
        $(".prg-sc-po-editor").hide();

        // grab the edited note value
        var updatedPo = $(".prg-sc-po-editor-text").val();

        $(".prg-sc-po").html(updatedPo);

        $.ajax({
            url: "/ShoppingCart/UpdatePoNumber",
            type: "POST",
            data: { poNumber: updatedPo }
        })
            .done(function (result) {

                processMessagesAndAlerts(result);
            })
            .fail(function (result) {
                console.log(result);
            });

    });

    // shipping option
    $("input.prg-sc-shipping-option").unbind("click");
    $("input.prg-sc-shipping-option").click(function (e) {
        var shipComplete = $(this).val();

        $.ajax({
            url: "/ShoppingCart/UpdateShipComplete",
            type: "POST",
            data: { shipComplete: shipComplete }
        })
            .done(function (result) {

                processMessagesAndAlerts(result);

            })
            .fail(function (result) {
                console.log(result);
            });

    });

}

function bindCartItemElements() {
    // make read-only what needs to be readonly
    $(".prg_readonly").prop("disabled", true);

    // shopping cart uom change on shopping cart details
    $("select.prg_sci_uom").unbind("change");
    $("select.prg_sci_uom").change(function (e) {
        updateSI($(this).attr("data-ods"));
    });

    // shopping cart qty change on shopping cart details
    $("input.prg_sci_qty").unbind("change");
    $("input.prg_sci_qty").change(function (e) {
        updateSI($(this).attr("data-ods"));
    });

    // remove shopping cart item
    $("a.prg_sci_remove").unbind("click");
    $("a.prg_sci_remove").click(function (e) {
        e.preventDefault();
        removeSI($(this).attr("data-ods"));
    });

    // display swith and save item
    $(".prg-cart-show-ss").unbind("click");
    $(".prg-cart-show-ss").click(function (e) {
        e.preventDefault();
        loadSwitchAndSave($(this).attr("data-ods"));
    });

    // display swith and save item
    $(".prg-cart-decline-ss").unbind("click");
    $(".prg-cart-decline-ss").click(function (e) {
        e.preventDefault();
        reloadCartItem($(this).attr("data-ods"));
    });

    // display swith and save item
    $(".prg-cart-switch-ss").unbind("click");
    $(".prg-cart-switch-ss").click(function (e) {
        e.preventDefault();
        switchCartItem($(this).attr("data-ods"));
    });

    $(".prg_sci_atl").unbind("click");
    $(".prg_sci_atl").click(function (e) {
        e.preventDefault();

        addToList();
    });

    $(".prg_sci_pp").unbind("click");
    $(".prg_sci_pp").click(function (e) {
        e.preventDefault();

        // open print preview
        window.open("/shopping/pleasewait.aspx?url=/shopping/order/preview.aspx", 'GrandAndToyPopUpWindow', 'scrollbars=1,resizable=1,width=660,height=480');

        /*
         /shopping/order/preview.aspx
         /shopping/pleasewait.aspx?url=/shopping/order/preview.aspx
         */
    });


}

function bindSubcriptionOrderItemElements() {

    // subscription order uom change on shopping cart details
    $("select.prg_soi_uom").unbind("change");
    $("select.prg_soi_uom").change(function (e) {
        updateSOI($(this).attr("data-ods"), $(this).attr("data-oid"));
    });

    // subscription order qty change on shopping cart details
    $("input.prg_soi_qty").unbind("change");
    $("input.prg_soi_qty").change(function (e) {
        updateSOI($(this).attr("data-ods"), $(this).attr("data-oid"));
    });

    // remove subscription item
    $("a.prg_soi_remove").unbind("click");
    $("a.prg_soi_remove").click(function (e) {
        e.preventDefault();
        removeSOI($(this).attr("data-ods"), $(this).attr("data-oid"));
    });

    // it has to be reloadHFATotals(orderId) for subscription with websiteContext.SubscriptionId
    reloadHfaTotals();

    //$(".prg_soi_remove").hide();  - this should have place only for SubscriptionPage2, not for EditItems page.
    if (window.location.toString().indexOf("SubscriptionOrderPage2") > 0) {
        $(".prg_soi_remove").hide();
    }

}

function bindSubscriptionEditor() {

    $(document).ready(function() {

        // if the subscription editor form is found
        // then save the form initial data and setup the page leaving handlers
        if ($("#subscriptionDetailsEditorForm").length > 0) {
            window.startupFormData = $("#subscriptionDetailsEditorForm").serialize();
            window.ignoreFormDataChange = false;

            $(window).bind('beforeunload', function() {

                // ignoreFormDataChange - true when save was clicked because we do want to prompt
                // some trips to the server need to bring up the saving prompt
                // we set forcePageLeavingPrompt to "true" if this is the case
                // otherwise rely on the form getting changed
                if (!window.ignoreFormDataChange
                    && (((typeof forcePageLeavingPrompt !== 'undefined') && forcePageLeavingPrompt == "true")
                        || window.startupFormData != $("#subscriptionDetailsEditorForm").serialize())) {

                    // some browsers ignore the text completely
                    return 'Are you sure you want to leave?';
                }

                // TB: do not return anything. Chrome will think you want to display the alert.
                //return "";
            });

            // disable the page leaving prompt if a submitter button is clicked
            $("button[name='submitter']").click(function(e) {
                window.ignoreFormDataChange = true;
            });
        }

    });
}

function bindQuickProductEntry() {
    $(".qpe-item").unbind("keypress");
    $(".qpe-item").keypress(function (e) {

            if (e.which == 13) {
                e.preventDefault();
                // enter pressed in the quick product entry area, prevent the acordeon from closing
            }
    });


    // product code changed on quick product entry
    $(".prg_qpe_input").unbind("change");
    $(".prg_qpe_input").change(function () {

        if (window.qpeTemplate === undefined) {
            // save the last row as a template.
            // there may be multiple rows if we are doing a post-back with errors
            // so we calculate which one it is and reset the indexes to 0 so the other scripts work
            var templatePrep = $("div.qpe-item:last-child").wrap('<div>').parent().html();

            // some browsers (IE8 and friends) will return the values in the HTML so we have to strip it out
            var tempVal = $(this).val();
            templatePrep = templatePrep.replace(new RegExp("value=" + tempVal, "g"), "value=''");
            templatePrep = templatePrep.replace(new RegExp("value='" + tempVal + "'", "g"), "value=''");
            templatePrep = templatePrep.replace(new RegExp("value=\"" + tempVal + "\"", "g"), "value=''");

            $("div.qpe-item:last-child").unwrap();

            var realIndex = $("div[class*=prg_quickadditionfield]").length - 1;

            // may need to set the template's index back to 0
            if (realIndex > 0) {
                templatePrep = templatePrep.replace(new RegExp("_" + realIndex, "g"), "_0");
                templatePrep = templatePrep.replace(new RegExp(RegExp.escape("[" + realIndex + "]"), "g"), "[0]");
            }

            window.qpeTemplate = templatePrep;
        }

        var indexRegex = /\[(.*?)\]/g;
        var idRegex = /id=\"(.*?)\"/g;
        var nameRegex = /name=\"(.*?)\"/g;

        var dotAndSquareBracketsRegex = /\.|\[|\]/g;

        var prodCode = $(this).val();
        var name = $(this).attr("name");

        // find content inside square brackets
        var index = indexRegex.exec(name)[1];

        var namePrefix = name.substring(0, name.lastIndexOf(".") + 1);
        var idPrefix = namePrefix.replace(dotAndSquareBracketsRegex, "_");

        var rowCount = $("div[class*=prg_quickadditionfield]").length;

        if (rowCount - 1 === parseInt(index)) {
            //if called from the last row add another empty row; respect mvc naming!

            var template = window.qpeTemplate;

            template = template.replace(/_0/g, "_" + rowCount);
            template = template.replace(/\[0\]/g, "[" + rowCount + "]");

            $("div.qpe-items").append(template);

            bindQuickProductEntry();


        }

        // cursor is sometimes confused about the location 
        //    so force it to the quantity field and select all contents
        // some browsers do this automatically but there should be no harm in forcing it
        var qtyId = $(this).attr("id").replace(/ProductCode/, "Quantity");
        $("#" + qtyId).focus().select();

        $.ajax({
            url: "/ShoppingCart/ProductInfo",
            type: "POST",
            data: { productCodeString: prodCode, rowIndex: index }
        })
            .done(function (result) {
                // restore mvc naming scheme
                result = result.replace(idRegex, "id=\"" + idPrefix + "$1\"");
                result = result.replace(nameRegex, "name=\"" + namePrefix + "$1\"");

                var description = decodeHtml($(result).find(".prg_desc_0").html());

                //replace the originator table cells with server generated data
                // using "replaceWith" instead of "html" because of better IE8 compatibility
                $(".prg_select_" + index + " select").replaceWith($(result).find("select").parent().html());
                $(".prg_desc_" + index).html(description);

                //$("#shoppingCartQuickAddtoCartBtn").show();

            })
            .fail(function (result) {
                console.log(result);
            });
    });



}


function bindSwitchAndSaveLogo() {

    $("button.prg-cart-show-all-ss").unbind("click");
    $("button.prg-cart-show-all-ss").click(function (e) {
        e.preventDefault();

        resetHfaTotalsProcessorId();

        $("ul.cart-items").fadeTo("fast", 0.30);
        $("ul.cart-items").spin();

        $.ajax({
            url: "/ShoppingCart/LoadAllSwitchAndSaveItems",
            type: "POST"
        })
            .done(function (result) {
                //alert("done");

                processMessagesAndAlerts(result);

                //updateCartCountInHeader(result.orderCount);

                $("ul.cart-items").spin(false);
                $("ul.cart-items").fadeTo("fast", 1);

                // update cart lines
                $("ul.cart-items").html($(result.cart).html());

                // update cart totals
                $(".cart-totals").html($(result.cartTotals).html());

                window.cartTotalsProcessorId = result.messageId;

                // start the HFA total checker if needed
                if (window.cartTotalsProcessorId != null && window.cartTotalsProcessorId != "") {
                    setTimeout(function () { loadHfaTotals(); }, hfaTotalsCheckFrequency);
                }

                bindCartItemElements();
                reloadSwitchAndSaveLogo(true);

            })
            .fail(function (result) {
                console.log(result);
            });


    });

    $("button.prg-cart-switch-all-ss").unbind("click");
    $("button.prg-cart-switch-all-ss").click(function (e) {
        e.preventDefault();

        resetHfaTotalsProcessorId();

        $("ul.cart-items").fadeTo("fast", 0.30);
        $("ul.cart-items").spin();

        $.ajax({
            url: "/ShoppingCart/SwitchAllCartItems",
            type: "POST"
        })
            .done(function (result) {
                //alert("done");

                processMessagesAndAlerts(result);

                //updateCartCountInHeader(result.orderCount);

                $("ul.cart-items").spin(false);
                $("ul.cart-items").fadeTo("fast", 1);

                // update cart lines
                $("ul.cart-items").html($(result.cart).html());

                $(".cart-alerts").html($(result.cartAlerts).html());

                // update cart totals
                $(".cart-totals").html($(result.cartTotals).html());

                window.cartTotalsProcessorId = result.messageId;

                // start the HFA total checker if needed
                if (window.cartTotalsProcessorId != null && window.cartTotalsProcessorId != "") {
                    setTimeout(function () { loadHfaTotals(); }, hfaTotalsCheckFrequency);
                }

                bindCartItemElements();
                reloadSwitchAndSaveLogo(false);

            })
            .fail(function (result) {
                console.log(result);
            });


    });

}

// get the quick product entry empty line template from the server
//function GetQuickProductEntryTemplate(afterGetTemplate) {
//    if (window.qpeTemplate === undefined) {
//        $.ajax({
//                url: "/ShoppingCart/GetAddToCartItemTemplate",
//                type: "POST"
//            })
//            .done(function(result) {
//                window.qpeTemplate = result;

//                afterGetTemplate();
//            })
//            .fail(function(result) {
//                console.log(result);
//            });

//    } else {
//        afterGetTemplate();
//    }
//}


// HTML decoder. 
// relies on textarea properties to decode the content
// fails in IE8 (compatibility mode)
function decodeHtml(input) {
    try {
        var y = document.createElement('textarea');
        y.innerHTML = input;
        return y.value;
    } catch (err) {
        // ignore error, try alternate decoding method
        return decodeHTMLEntities(input);
    }
}

// decode alternate if above fails (like in IE8)
function decodeHTMLEntities(text) {
    var entities = [
        ['amp', '&'],
        ['apos', '\''],
        ['#x27', '\''],
        ['#x2F', '/'],
        ['#39', '\''],
        ['#47', '/'],
        ['lt', '<'],
        ['gt', '>'],
        ['nbsp', ' '],
        ['quot', '"']
    ];

    for (var i = 0, max = entities.length; i < max; ++i)
        text = text.replace(new RegExp('&' + entities[i][0] + ';', 'g'), entities[i][1]);

    return text;
}


function removeSI(itemId, postRemoveSI) {
    //TODO: loader needed?
    //var loaderImg = $("#" + siId + itemId + "_loader");
    var siDiv = $(".prg-row-" + itemId);

    // show the loader, hide the link
    //loaderImg.css("top", siDiv.offset().top + siDiv.height() / 2 - 16);
    //loaderImg.css("left", siDiv.offset().left + siDiv.width() / 2 - 16);
    //loaderImg.show();

    siDiv.fadeTo("fast", 0.30);
    siDiv.spin();


    $.ajax({
        url: "/ShoppingCart/DeleteItem",
        type: "POST",
        data: { ods: itemId }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            siDiv.hide();
            siDiv.spin(false);

            $(".cart-alerts").html($(result.cartAlerts).html());

            updateCartCountInHeader(result.orderCount);

            if (result.reloadAll) {
                // full items container force is requested from the server
                reloadFullCart();

                return;
            }
            else {
                if (result.removeItemId != null && result.removeItemId != "") {
                    var promoDiv = $("li.prg-row-" + result.removeItemId);

                    promoDiv.hide();
                }
            }

            if ($("#myadobedtm").length > 0) {
                digitalData = $(result.adobeDtm)[0];
                if (typeof _satellite != "undefined") {
                    _satellite.track('cart: remove');
                }
            }

            //TODO: alerts and other functions to implement

            //$(".alert_icon_small").html($("bulk_save_total", xml).text());

            reloadSwitchAndSaveLogo(false);
            reloadBusinessSelectBanner();

            reloadHfaTotals();
            //loadSASLogo();

            //// reload exclusive offers
            //loadEO();

            ////reload bulk save message
            //loadBulkM();

            ////reload Unavailable Online Message
            //loadUnavailableOnlineMessage();


            //if ($("order_items", xml).text() == "0") {
            //    $('.hideit').show();
            //    $('.showit').removeClass('active');
            //}

            if (typeof postRemoveSI == 'function') {
                postRemoveSI();
            }
        })
        .fail(function (result) {
            console.log(result);
        });


}

function removeSOI(itemId, orderId) {
    var siDiv = $(".prg-row-" + itemId);

    siDiv.fadeTo("fast", 0.30);
    siDiv.spin();

    $.ajax({
        url: "/ShoppingCart/DeleteSubscriptionItem",
        type: "POST",
        data: { oid: orderId, ods: itemId }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            siDiv.hide();
            siDiv.spin(false);

            $(".cart-alerts").html($(result.cartAlerts).html());

            updateCartCountInHeader(result.orderCount);

            if (result.reloadAll) {
                // full items container force is requested from the server
                reloadFullSubscription(orderId);

                return;
            }
            else {
                if (result.removeItemId != null && result.removeItemId != "") {
                    var promoDiv = $("li.prg-row-" + result.removeItemId);

                    promoDiv.hide();
                }
            }

            reloadHfaTotals();
        })
        .fail(function (result) {
            console.log(result);
        });


}


// Update shopping cart item
function updateSI(itemId, postUpdateSI) {
    if (typeof itemId === "undefined" || itemId == "") {
        // custom list display has no need to update the server
        // and we can't do it anyway if the item Id is missing
        return;
    }
    var quantity = $("input.prg_sci_qty[data-ods='" + itemId + "']").val();

    var uom = $("select.prg_sci_uom[data-ods='" + itemId + "']").find(":selected").val();
    $("li.prg-row-" + itemId).fadeTo("fast", 0.30);
    $("li.prg-row-" + itemId).spin();

    //String unparsedOrderDetailSequence, String uparsedQuantity, String unparsedExtendedUom
    $.ajax({
        url: "/ShoppingCart/ChangeQuantity",
        type: "POST",
        data: { orderDetailSequence: itemId, quantity: quantity, extendedUom: uom }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            $("li.prg-row-" + itemId).spin(false);
            $("li.prg-row-" + itemId).fadeTo("fast", 1);

            if (result.reloadAll) {
                reloadFullCart();
                return;
            }

            replaceCartRowHtml(itemId, result.cartItem);

            $(".cart-alerts").html($(result.cartAlerts).html());



            bindCartItemElements();

            reloadSwitchAndSaveLogo(false);

            // remove the old items in the cart
            //$("div[id^='si3']").remove();

            // add the new items in the place of the old ones
            //$(result).insertBefore("#addFunction");

            reloadHfaTotals();
        })
        .fail(function (result) {
            console.log(result);
        });


}

// update subscription order
function updateSOI(itemId, orderId) {
    if (typeof itemId === "undefined" || itemId == "" || typeof orderId === "undefined" || orderId == "") {
        // custom list display has no need to update the server
        // and we can't do it anyway if the item Id or order id is missing
        return;
    }
    var quantity = $("input.prg_soi_qty[data-ods='" + itemId + "']").val();

    var uom = $("select.prg_soi_uom[data-ods='" + itemId + "']").find(":selected").val();

    $("li.prg-row-" + itemId).fadeTo("fast", 0.30);
    $("li.prg-row-" + itemId).spin();

    //String unparsedOrderDetailSequence, String uparsedQuantity, String unparsedExtendedUom
    $.ajax({
        url: "/ShoppingCart/ChangeSubscriptionQuantity",
        type: "POST",
        data: { orderId:orderId, orderDetailSequence: itemId, quantity: quantity, extendedUom: uom }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            $("li.prg-row-" + itemId).spin(false);
            $("li.prg-row-" + itemId).fadeTo("fast", 1);

            if (result.reloadAll) {
                reloadFullSubscription(orderId);
                return;
            }

            replaceCartRowHtml(itemId, result.cartItem);

            $(".cart-alerts").html($(result.cartAlerts).html());

            bindSubcriptionOrderItemElements();

        })
        .fail(function (result) {
            console.log(result);
        });


}

// Load switch and save item
function loadSwitchAndSave(itemId, postLoadSS) {
    $("li.prg-row-" + itemId).fadeTo("fast", 0.30);
    $("li.prg-row-" + itemId).spin();

    $.ajax({
        url: "/ShoppingCart/LoadSwitchAndSaveItem",
        type: "POST",
        data: { ods: itemId }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            if (result.reloadAll) {
                reloadFullCart();
                return;
            }

            $("li.prg-row-" + itemId).spin(false);
            $("li.prg-row-" + itemId).fadeTo("fast", 1);

            replaceCartRowHtml(itemId, result.cartItem);

            bindCartItemElements();
            reloadSwitchAndSaveLogo(false);
        })
        .fail(function (result) {
            console.log(result);
        });


}

function replaceCartRowHtml(itemId, rawHtml) {
    var curLi = $("li.prg-row-" + itemId);

    curLi.html($(rawHtml).html());

    // reconcile row class type switch-item vs cart-item based on the server's reponse
    curLi.removeClass("cart-item");
    curLi.removeClass("switch-item");

    if ($(rawHtml).prop("class").indexOf("switch") >= 0) {
        curLi.addClass("switch-item");
    } else {
        curLi.addClass("cart-item");
    }

}

// quick product entry - add to cart clicked
// posts to /ShoppingCart/AddToOrder (setup in the view)
$("button.qpe-button").unbind("click");
$("button.qpe-button").click(function (e) {

    e.preventDefault();

    $(".qpe-items").fadeTo("fast", 0.30);
    $(".qpe-items").spin();

    var $form = $(this).parents('form');

    var idRegex = /id=\"(.*?)\"/g;
    var nameRegex = /name=\"(.*?)\"/g;


    $.ajax({
        type: "POST",
        url: $form.attr('action'),
        data: $form.serialize()
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            updateCartCountInHeader(result.orderCount);

            var qpeItems = $(result.addToShoppingCart).find(".qpe-items").html();

            // restore full view render MVC names
            qpeItems = qpeItems.replace(idRegex, "id=\"" + "AddToShoppingCart_" + "$1\"");
            qpeItems = qpeItems.replace(nameRegex, "name=\"" + "AddToShoppingCart." + "$1\"");

            $(".qpe-items").html(qpeItems);

            $(".qpe-items").spin(false);
            $(".qpe-items").fadeTo("fast", 1);

            $("ul.cart-items").html($(result.cart).html());

            $(".cart-alerts").html($(result.cartAlerts).html());    

            $(".cart-header").html($(result.cartHeader).html());

            $(".cart-links").html($(result.cartLinks).html());

            if ($("#myadobedtm").length > 0) {
                digitalData = $(result.adobeDtm)[0];
                if (typeof _satellite != "undefined") {
                    _satellite.track('cart: quick add');
                }
            }

            bindQuickProductEntry();
            bindCartElements();
            bindCartItemElements();
            reloadSwitchAndSaveLogo(false);
            reloadBusinessSelectBanner();

            reloadMarketplaceTooltip();

            reloadHfaTotals();

            //$("#shoppingCartQuickAddtoCartBtn").hide();

        })
        .fail(function (result) {
            console.log(result);
        });
});

// clear up any processor ID we may be waiting for
function resetHfaTotalsProcessorId() {
    window.cartTotalsProcessorId = "";
    hfaTotalsCheckRetryCount = 0;
}

var hfaTotalsCheckFrequency = 1000;
var hfaTotalsCheckMaxRetries = 120; // wait about 2 minutes
var hfaTotalsCheckRetryCount = 0;

function reloadHfaTotals() {
    resetHfaTotalsProcessorId();
    loadHfaTotals();
}

function loadHfaTotals(postLoadFunction) {
    if (window.cartTotalsProcessorId === undefined) {
        window.cartTotalsProcessorId = "";
    }

    var target = "/ShoppingCart/CartTotals";

    if (window.location.toString().indexOf("SubscriptionOrderPage2") > 0 || window.location.toString().indexOf("WizardPage3") > 0) {
        target = "/SubscriptionOrders/CartTotals";
    }

    $.ajax({
        url: target,
        type: "POST",
        data: { existingMessageId: window.cartTotalsProcessorId }
    })
        .done(function (result) {

            window.cartTotalsProcessorId = result.messageId;

            $(".cart-totals").html($(result.cartTotals).html());


            //if ($("success", xml).text() == "true") {

            if (result.statusId == "3") { //Proccessed and ajax call completed
                $(".cart-totals").html($(result.cartTotals).html());
                if (typeof postLoadFunction == 'function') {
                    postLoadFunction();
                }
                //if ($("#" + hfaTId + " .cartTotal").length == 0) {
                //    //show subtotals, if the call do not failed but, the result is empty
                //    $("#st .cartTotalPrice").show();
                //    $("#st .cartTax").show();                    
                //}
            }
                //status not failed and retry count is not greater than max, then call again ajax using the timeout
            else if (result.statusId != "4" && hfaTotalsCheckRetryCount <= hfaTotalsCheckMaxRetries) {
                //processorMessageId = result.messageId;
                setTimeout(function () { loadHfaTotals(postLoadFunction); }, hfaTotalsCheckFrequency);
            }
            else { //failed or max retries reached
                $(".cart-totals").html($(result.cartTotals).html());
                if (typeof postLoadFunction == 'function') {
                    postLoadFunction();
                }
                //if hfa totals failed, then we need to show the subtotal that is already calculated
                //$("#st .cartTotalPrice").show();
                //$("#st .cartTax").show();
            }
            //}


        })
        .fail(function (result) {
            console.log(result);
        });

    hfaTotalsCheckRetryCount++;
}

function reloadFullCart() {
    resetHfaTotalsProcessorId();
    $("ul.cart-items").fadeTo("fast", 0.30);
    $("ul.cart-items").spin();

    $.ajax({
        url: "/ShoppingCart/Index",
        type: "POST"
    })
        .done(function (result) {
            //alert("done");

            processMessagesAndAlerts(result);

            updateCartCountInHeader(result.orderCount);

            $("ul.cart-items").spin(false);
            $("ul.cart-items").fadeTo("fast", 1);

            // update cart lines
            $("ul.cart-items").html($(result.cart).html());

            $(".cart-alerts").html($(result.cartAlerts).html());

            // update cart totals
            $(".cart-totals").html($(result.cartTotals).html());

            window.cartTotalsProcessorId = result.messageId;

            // start the HFA total checker if needed
            if (window.cartTotalsProcessorId != null && window.cartTotalsProcessorId != "") {
                setTimeout(function () { loadHfaTotals(); }, hfaTotalsCheckFrequency);
            }

            bindCartItemElements();
            reloadSwitchAndSaveLogo(false);
            reloadBusinessSelectBanner();

        })
        .fail(function (result) {
            console.log(result);
        });

}

function reloadFullSubscription(orderId) {
    resetHfaTotalsProcessorId();
    $("ul.cart-items").fadeTo("fast", 0.30);
    $("ul.cart-items").spin();

    $.ajax({
        url: "/ShoppingCart/LoadFullSubscription",
        type: "POST",
        data: { orderId: orderId }
    })
        .done(function (result) {
            //alert("done");

            processMessagesAndAlerts(result);

            updateCartCountInHeader(result.orderCount);

            $("ul.cart-items").spin(false);
            $("ul.cart-items").fadeTo("fast", 1);

            // update cart lines
            $("ul.cart-items").html($(result.cart).html());

            $(".cart-alerts").html($(result.cartAlerts).html());

            // update cart totals
            $(".cart-totals").html($(result.cartTotals).html());

            window.cartTotalsProcessorId = result.messageId;

            // start the HFA total checker if needed
            if (window.cartTotalsProcessorId != null && window.cartTotalsProcessorId != "") {
                setTimeout(function () { loadHfaTotals(); }, hfaTotalsCheckFrequency);
            }

            bindSubcriptionOrderItemElements();

        })
        .fail(function (result) {
            console.log(result);
        });

}
function reloadCartItem(itemId) {
    $("li.prg-row-" + itemId).fadeTo("fast", 0.30);
    $("li.prg-row-" + itemId).spin();

    $.ajax({
        url: "/ShoppingCart/LoadShoppingCartItem",
        type: "POST",
        data: { ods: itemId }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            $("li.prg-row-" + itemId).spin(false);
            $("li.prg-row-" + itemId).fadeTo("fast", 1);


            if (result.reloadAll) {
                reloadFullCart();
                return;
            }

            replaceCartRowHtml(itemId, result.cartItem);

            if (result.isSubscr)
            {
                bindSubcriptionOrderItemElements();
            }
            else
            {
                bindCartItemElements();
            }

            reloadSwitchAndSaveLogo(false);            
            // remove the old items in the cart
            //$("div[id^='si3']").remove();

            // add the new items in the place of the old ones
            //$(result).insertBefore("#addFunction");

            //reloadHfaTotals();
        })
        .fail(function (result) {
            console.log(result);
        });
}

function switchCartItem(itemId) {
    $("li.prg-row-" + itemId).fadeTo("fast", 0.30);
    $("li.prg-row-" + itemId).spin();

    $.ajax({
        url: "/ShoppingCart/SwitchCartItem",
        type: "POST",
        data: { ods: itemId }
    })
        .done(function (result) {

            processMessagesAndAlerts(result);

            $("li.prg-row-" + itemId).spin(false);
            $("li.prg-row-" + itemId).fadeTo("fast", 1);

            if (result.reloadAll) {
                reloadFullCart();
                return;
            }

            replaceCartRowHtml(itemId, result.cartItem);


            bindCartItemElements();
            reloadSwitchAndSaveLogo(false);
            // remove the old items in the cart
            //$("div[id^='si3']").remove();

            // add the new items in the place of the old ones
            //$(result).insertBefore("#addFunction");

            //reloadHfaTotals();
        })
        .fail(function (result) {
            console.log(result);
        });
}


function reloadSwitchAndSaveLogo(switchAllMode) {

    $("div.prg-switch-logo").fadeTo("fast", 0.30);
    //$("div.prg-switch-logo").spin();

    $.ajax({
        url: "/ShoppingCart/SwitchAndSaveLogo",
        type: "POST",
        data: { mode: switchAllMode ? "SwitchAll" : "DisplayAll" }
    })
        .done(function (result) {

            $("div.prg-switch-logo").html(result);

            //$("div.prg-switch-logo").spin(false);
            $("div.prg-switch-logo").fadeTo("fast", 1);

            bindSwitchAndSaveLogo();
        })
        .fail(function (result) {
            console.log(result);
        });
}

function reloadBusinessSelectBanner() {

    $("div.business-select-banner").fadeTo("fast", 0.30);    

    $.ajax({
        url: "/ShoppingCart/BusinessSelectBanner",
        type: "POST"
    })
        .done(function (result) {
            
            $("div.business-select-banner").html(result);
            $("div.business-select-banner").fadeTo("fast", 1);
        })
        .fail(function (result) {
            console.log(result);
        });
}

function reloadMarketplaceTooltip() {
    if (window.gtTooltips) {
        new window.gtTooltips();
    }
}

function updateCartCountInHeader(count) {
    $("span.cart-items").html(count);
}

function processMessagesAndAlerts(jsonResult) {

    var message = jsonResult.message;
    var userAlert = jsonResult.userAlert;
    var redirect = jsonResult.redirect;
    var substitutionPending = jsonResult.substitutionPending;

    // if not null, undefined or empty
    if (redirect != null && redirect != "") {
        location.href = redirect;
    }

    // if not null, undefined or empty
    if (message != null && message != "") {
        alert(message);
    }

    // if not null, undefined or empty
    // userAlert is an array of UserMessage objects
    if (userAlert != null && userAlert != "") {
        for (var counter in userAlert) {
            alert(userAlert[counter].SerializedValue);
        }
    }

    if (substitutionPending) {
        location.href = "/ShoppingCart/ProductSubstitutions";
    }

}

// fancybox trigger
// TODO: there is also an IE version. See GlobalBasePage

if ('undefined' != typeof window.jQuery) {
    $(document).ready(function () {
        $('.fancybox').fancybox();

        $('a.fancybox').fancybox({
            fitToView: false,
            autoSize: false,
            afterLoad: function () {
                this.width = $(this.element).data('width');
                this.height = $(this.element).data('height');
            }

        });
    });
}

function bindOrderTrackingView() {
    $(".prg-ot-view").unbind("click");
    $(".prg-ot-view").click(function (e) {
        e.preventDefault();

        var itemId = $(this).attr("data-orderid");
        var uid = $(this).attr("data-uid");

        // reset the details to an empty div
        $(".prg-ot-details").html("<div style='height:200px'>&nbsp;</div>");

        $(".prg-ot-details").fadeTo("fast", 0.30);
        $(".prg-ot-details").spin();

        $("tr.selected").removeClass("selected");

        $("tr[data-uid='" + uid + "']").addClass("selected");

        scrollToElement(".prg-ot-details");

        $.ajax({
            url: "/OrderTracking/GetOrderDetails",
            type: "POST",
            data: { itemId: itemId }
        })
            .done(function (result) {

                $(".prg-ot-details").spin(false);
                $(".prg-ot-details").fadeTo("fast", 1);

                $(".prg-ot-details").html(result);

                // re-bind any new buttons added by the new HTML
                bindOrderTrackingButtons();

            })
            .fail(function (result) {
                console.log(result);
            });


    });

}

function bindOrderTrackingButtons() {
    $(".prg-ot-view-all").unbind("click");
    $(".prg-ot-view-all").click(function (e) {
        e.preventDefault();

        // remove selection from the list view
        $("tr.selected").removeClass("selected");

        // scroll to view all
        scrollToElement(".prg-ot-all");

        // remove details
        $(".prg-ot-details").html("");

    });

    $(".prg-ot-paging").unbind("click");
    $(".prg-ot-paging").click(function (e) {
        e.preventDefault();

        var page = $(this).attr("data-page");

        $("input.prg-ot-filter-page-number").val(page);

        var $form = $(this).parents('form');

        $form.submit();

    });

    $(".prg-ot-reorder").unbind("click");
    $(".prg-ot-reorder").click(function (e) {
        e.preventDefault();

        var orderid = $(this).attr("data-orderid");

        $.ajax({
            url: "/OrderTracking/Reorder",
            type: "POST",
            data: { itemId: orderid }
        })
            .done(function (result) {
                var message = result.message;
                var redirect = result.redirect;

                // if not null, undefined or empty
                if (message != null && message != "") {
                    alert(message);
                }

                // if not null, undefined or empty
                if (redirect != null && redirect != "") {
                    location.href = redirect;
                }


            })
            .fail(function (result) {
                console.log(result);
            });
    });

    $(".aceTrack").unbind("click");
    $(".aceTrack").click(function (e) {
        e.preventDefault();

        var acepin = $(this).attr("data-acepin");

        $('input[name="TrackingField1"]').val(acepin);
        $("#acetracking").submit();
    });

    //$(".prg-ot-filter").unbind("click");
    //$(".prg-ot-filter").click(function (e) {
    //    e.preventDefault();

    //    // reset page number
    //    $("input.prg-ot-filter-page-number").val("1");

    //    $("form.prg-ot-filter-form").submit();

    //});



}
function clearPendingApprovalFilters() {
    $("select.prg-pa-filter-month").val("");
    $("select.prg-pa-filter-year").val("");
    $("select.prg-pa-filter-statuses").val("all");
    $("input.prg-pa-filter-search").val("");
    $("input.prg-ot-filter-page-number").val("1");
}

function bindPendingApprovalButtons() {
    $(".prg-pa-l30d").unbind("click");
    $(".prg-pa-l30d").click(function (e) {
        e.preventDefault();

        clearPendingApprovalFilters();

        $("input.prg-pa-filter-count").val("30");
        $("input.prg-pa-filter-type").val("d");

        $("form.prg-pa-filter-form").submit();
    });

    $(".prg-pa-l6m").unbind("click");
    $(".prg-pa-l6m").click(function (e) {
        e.preventDefault();

        clearPendingApprovalFilters();

        $("input.prg-pa-filter-count").val("6");
        $("input.prg-pa-filter-type").val("m");

        $("form.prg-pa-filter-form").submit();
    });

    $(".prg-pa-l12m").unbind("click");
    $(".prg-pa-l12m").click(function (e) {
        e.preventDefault();

        clearPendingApprovalFilters();

        $("input.prg-pa-filter-count").val("12");
        $("input.prg-pa-filter-type").val("m");

        $("form.prg-pa-filter-form").submit();
    });


    $(".prg-pa-approve").unbind("click");
    $(".prg-pa-approve").click(function (e) {
        e.preventDefault();

        var orderid = $(this).attr("data-orderid");

        $("input.prg-pa-filter-orderid").val(orderid);

        $("form.prg-pa-filter-form").attr('action', "/OrderStatus/ApproveOrder").submit();
    });

    $('body').on('click', ".prg-pa-approve-all", function (e) {
        e.preventDefault();
        $("form.prg-pa-filter-form").attr('action', "/OrderStatus/ApproveAll").submit();
    });

    $(".prg-pa-filter-clear").unbind("click");
    $(".prg-pa-filter-clear").click(function (e) {
        e.preventDefault();

        clearPendingApprovalFilters();

        $("form.prg-pa-filter-form").submit();

    });
}

function bindScheduleOrder() {

    $("#scheduled-radio-once").unbind("change");
    $("#scheduled-radio-once").change(function (e) {

        if ($("#scheduled-radio-once:checked").val() == "1") {
            $("#scheduled-radio-repeat").prop('checked', false);
        }

    });

    $("#scheduled-radio-repeat").unbind("change");
    $("#scheduled-radio-repeat").change(function (e) {

        if ($("#scheduled-radio-once").prop('checked')) {
            $("#scheduled-radio-once").prop('checked', false);
            $("#scheduled-radio-daily").prop('checked', true);
        }

    });

    $("#scheduled-radio-daily").unbind("change");
    $("#scheduled-radio-daily").change(function (e) {

        if ($("#scheduled-radio-daily").prop('checked')) {
            $("#scheduled-radio-repeat").prop('checked', true);
        }

    });
    
    $("#scheduled-radio-weekly").unbind("change");
    $("#scheduled-radio-weekly").change(function (e) {

        if ($("#scheduled-radio-weekly").prop('checked')) {
            $("#scheduled-radio-repeat").prop('checked', true);
        }

    });
    
    $("#scheduled-radio-monthly").unbind("change");
    $("#scheduled-radio-monthly").change(function (e) {

        if ($("#scheduled-radio-monthly").prop('checked')) {
            $("#scheduled-radio-repeat").prop('checked', true);
        }

    });
    
    $("#scheduled-radio-alternate").unbind("change");
    $("#scheduled-radio-alternate").change(function (e) {

        if ($("#scheduled-radio-alternate").prop('checked')) {
            $("#scheduled-radio-repeat").prop('checked', true);
        }

    });


}

function bindSelectAccountButtons() {
    $(".prg-sa-clear").unbind("click");
    $(".prg-sa-clear").click(function (e) {
        e.preventDefault();

        $("input.prg-sa-search-for").val("");
    });

    $(".prg-sa-select").unbind("click");
    $(".prg-sa-select").click(function (e) {
        e.preventDefault();

        var allow = $(this).attr("data-allow");
        var prompt = $(this).attr("data-prompt");
        var shipTo = $(this).attr("data-shipto");

        if (allow == "True") {
            if (prompt != "" && !confirm(window[prompt])) {
                return;
            }
            $("input.prg-sa-selected-account").val(shipTo);

            $("form.prg-sa-select-form").submit();
        } else {
            alert(window[prompt]);
        }
    });
}

function scrollToElement(selector, time, verticalOffset) {
    time = typeof (time) != 'undefined' ? time : 500;
    verticalOffset = typeof (verticalOffset) != 'undefined' ? verticalOffset : -80;
    element = $(selector);
    offset = element.offset();
    offsetTop = offset.top + verticalOffset;
    $('html, body').animate({
        scrollTop: offsetTop
    }, time);
};


function bindManageAccount() {
    // select account favorite setting
    $('[name="Name_ShipToDefault"]').unbind("click");
    $('[name="Name_ShipToDefault"]').click(function (e) {
        var isDefault = this.checked;
        var shipto = $(this).attr("data-shipto");

        var selectedid = this.id;
        $('[name="Name_ShipToDefault"]').each(function () {
            if (this.id != selectedid)
            {
                this.checked = false;
            }
        });

        //do ajax call here
        $.ajax({
            url: "/Account/SetDefaultAccount",
            type: "POST",
            data: { shipTo: shipto, isdefault: isDefault }
        })
            .done(function (result) {
                if (!result.success) {
                    alert("Error!");
                }

            })
            .fail(function (result) {
                console.log(result);
            });
    });
}


function bindCustomLists() {

    $(document).ready(function () {

        // if the custom list editor form is found
        // then save the form initial data and setup the page leaving handlers
        if ($("#customListEditorForm").length > 0) {
            window.startupFormData = $("#customListEditorForm").serialize();
            window.ignoreFormDataChange = false;

            $(window).bind('beforeunload', function () {

                // ignoreFormDataChange - true when save was clicked because we do want to prompt
                // some trips to the server need to bring up the saving prompt
                // we set forcePageLeavingPrompt to "true" if this is the case
                // otherwise rely on the form getting changed
                if (!window.ignoreFormDataChange
                    && (((typeof forcePageLeavingPrompt !== 'undefined') && forcePageLeavingPrompt == "true")
                        || window.startupFormData != $("#customListEditorForm").serialize())) {

                    // some browsers ignore the text completely
                    return 'Are you sure you want to leave?';
                }

                // TB: do not return anything. Chrome will think you want to display the alert.
                //return "";
            });

            // disable the page leaving prompt if a submitter button is clicked
            $("button[name='submitter']").click(function (e) {
                window.ignoreFormDataChange = true;
            });
        }

    });

    // custom list "list" - delete a list
    $("button.prg-delete-custom-list").unbind("click");
    $("button.prg-delete-custom-list").click(function (e) {
        var listid = $(this).attr("data-cid");

        if (!confirm("Are you sure you want to delete this custom list?")) {
            return;
        }

        $.ajax({
            url: "/CustomLists/DeleteCustomList",
            type: "POST",
            data: { listid: listid }
        })
            .done(function (result) {
                if (!result.success) {
                    alert("Error!");
                }

                if (reloadUrl != null && reloadUrl != "") {
                    location.href = reloadUrl;
                }

            })
            .fail(function (result) {
                console.log(result);
            });
    });

    // add entire list to cart in the CustomLists/Select view
    //$("button.prg-add-list-to-cart").unbind("click");
    //$("button.prg-add-list-to-cart").click(function (e) {
    //    if (clstId === undefined || clsPage === undefined) {
    //        return;
    //    }

    //    $(".prg-button-row").fadeTo("fast", 0.30);
    //    $(".prg-button-row").spin();

    //    $.ajax({
    //        url: "/CustomLists/AddListToCart",
    //        type: "POST",
    //        data: { templateId: clstId, page: clsPage }
    //    })
    //        .done(function (result) {

    //            updateCartCountInHeader(result.orderCount);

    //            $(".prg-button-row").spin(false);
    //            $(".prg-button-row").fadeTo("fast", 1);

    //            processMessagesAndAlerts(result);

    //        })
    //        .fail(function (result) {
    //            console.log(result);
    //        });
    //});


    // custom list print preview
    $("button.prg-cl-print-preview").unbind("click");
    $("button.prg-cl-print-preview").click(function (e) {
        e.preventDefault();

        var tid = $(this).attr("data-tid");

        // open print preview
        window.open("/Shopping/Template/CustomListPrintPreview.aspx?sTemplateID=" + tid, 'GrandAndToyPopUpWindow', 'scrollbars=1,resizable=1,width=660,height=480');

    });

    // show note editing textbox
    $("a.prg-cl-edit-note").unbind("click");
    $("a.prg-cl-edit-note").click(function (e) {
        e.preventDefault();

        var tds = $(this).attr("data-tds");

        // hide link, show editor and give it focus
        $("#note-editor-link-" + tds).hide();
        $("#note-editor-row-" + tds).show();
        $("#note-editor-text-" + tds).focus();

    });

    // hide note editing textbox and prepare note for server post
    $("a.prg-cl-update-note").unbind("click");
    $("a.prg-cl-update-note").click(function (e) {
        e.preventDefault();

        var tds = $(this).attr("data-tds");

        // hide editor, show link
        $("#note-editor-row-" + tds).hide();
        $("#note-editor-link-" + tds).show();

        // grab the edited note value
        var note = $("#note-editor-text-" + tds).val();

        //alert(note);
        //alert($("input.prg-cl-note-hidden[data-tds='" + tds + "']").val());

        // update hidden post-back value
        $("input.prg-cl-note-hidden[data-tds='" + tds + "']").val(note);

        // update display value
        $("#note-" + tds).text(note);

        // show/hide depending if there is a note or not
        if (note != "") {
            $("#note-display-row-" + tds).show();
        } else {
            $("#note-display-row-" + tds).hide();
        }

    });


    // mark a list item for removal
    // the delete happens when save is clicked
    $("a.prg-cl-remove-item").unbind("click");
    $("a.prg-cl-remove-item").click(function (e) {
        e.preventDefault();

        var tds = $(this).attr("data-tds");

        // mark row for removal on post-back
        $("input.prg-cl-row-deleted[data-tds='" + tds + "']").val("True");

        // hide item row
        $("li.prg-cl-item[data-tds='" + tds + "']").hide("fast");
    });

    //custom list editor - select all toggle
    $("input.prg-cl-select-all").unbind("click");
    $("input.prg-cl-select-all").click(function (e) {

        $(".prg-cl-item-select").prop('checked', $(this).is(':checked'));
    });

    $("button.prg-cl-pager").unbind("click");
    $("button.prg-cl-pager").click(function (e) {
        // save the new page and let the form submit.
        var page = $(this).attr("data-page");

        $("input.prg-cl-curpage").val(page);
    });

}

$(function () {

    $(".subnav-small.custom-select > select").change(function () {
        var index = $(this).prop('selectedIndex');
        var url = $(this).find("option:eq(" + index + ")").attr("href");
        if (url.length > 0) {
            window.location = url;
        }
    });

    //this event is used on the client side to allow number to be entered into the textbox associated with the class = numbertxtboxonly attribute.
    $(".numbertxtboxonly").keydown(function (event) {
        if (event.keyCode == 46 || event.keyCode == 8 || event.keyCode == 37 || event.keyCode == 39 || event.keyCode == 9) //allow only
        {
            //don't do anything allow the backspace or delete key
        }
        else {
            if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { //taking keyboard number pad in consideration
                //do nothing allow the keybown event to fire
            }
            else {
                event.preventDefault();
            }
        }

    });


    $("#postalCodeWebChangeBtn").click(function () {

        var postalCode1 = $("#webPostalCodeFirst3Char").val();
        var postalCode2 = $("#webPostalCodeLast3Char").val();    
        var postalCode = postalCode1 + postalCode2;
        var errorMsg = $("#postalCodeErrorMsg").text();
       // alert("postalCode1 is :" + postalCode1 + "\n" + "postacode2 is  :" + postalCode2)
        var returnval = isPostalCodeValid(postalCode);
        if (returnval) {
            $(this).submit();

            return returnval;
        }
        else
        {
            alert(errorMsg);
           return returnval;
        }
        
    });


    $("#postalcodemobilechangebtn").click(function () {

        var postalCode1 = $("#mobilePostalCodeFirst3Char").val();
        var postalCode2 = $("#mobilePostalCodeLast3Char").val();
       
        var postalCode = postalCode1 + postalCode2;
        var errorMsg = $("#postalCodeErrorMsg").text();
       // alert("postalCode1 is :" + postalCode1 + "\n" + "postacode2 is  :" + postalCode2)
        var returnval = isPostalCodeValid(postalCode);
        if (returnval)
        {
            $(this).submit();

            return returnval;
        }
        else {
            alert(errorMsg);
            return returnval;
        }

    });

    function isPostalCodeValid(postalCode)
    {
        var postalCodePattern = /^[a-zA-Z]+[0-9]+[a-zA-Z]+[0-9]+[a-zA-Z]+[0-9]+$/;
        return  postalCodePattern.test(postalCode);
    }

});

var orderTrackingCheckFrequency = 1000;
var orderTrackingCheckMaxRetries = 120; // wait about 2 minutes
var orderTrackingCheckRetryCount = 0;


function startOrderTrackingChecks(messageId) {
    window.orderTrackingProcessorId = messageId;
    orderTrackingCheckRetryCount = 0;

    $("#otloader").spin();
    setTimeout(function () { checkOrderTrackingUpdated(); }, orderTrackingCheckFrequency);
}

function checkOrderTrackingUpdated() {
    if (orderTrackingCheckRetryCount > orderTrackingCheckMaxRetries) {
        window.orderTrackingProcessorId = "";
        location.href = "OrderTracking?expired=true";
    }

    $.ajax({
        url: "/OrderTracking/GetRefresherStatus",
        type: "POST",
        data: { mid: window.orderTrackingProcessorId, count: orderTrackingCheckRetryCount }
    })
        .done(function (result) {

            if (result.completed) {
                window.orderTrackingProcessorId = "";
                location.href = "OrderTracking?done=true";
            }
            else{
                setTimeout(function () { checkOrderTrackingUpdated(); }, orderTrackingCheckFrequency);
            }


        })
        .fail(function (result) {
            console.log(result);
        });

    orderTrackingCheckRetryCount++;
}

function addToList() {

    $.ajax({
        url: "/ShoppingCart/AddToList",
        type: "POST"
    })
        .done(function (result) {

            document.location.href = "/CustomLists?Show=Select";

        })
        .fail(function (result) {
            console.log(result);
        });
}
