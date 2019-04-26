/*
 * GTAddCartFeedback - v0.1.0 - 2018-2-20
 * Grand and Toy add to cart feedback control
 */
(function ($) {
    'use strict';

    //#region gtCartFeedback

    //#region Constructors
    var gtCartFeedback = function (options) {
        this.Options = $.extend(true, this.Options, options);

        // Setters
        this.$ParentElmt = $(this.Options.ParentElmtSelector);

        if (this.Options.Language === 'FR'
            || this.Options.Language === 'fr') {
            this.$Elmt = $(this.Markup.FR);
        } else {
            this.$Elmt = $(this.Markup.EN);
        }

        // Initializers
        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtCartFeedback.prototype = {
        $ParentElmt: null
        , $Elmt: null
        , ElmtTimeoutID: null
        , AutoCloseDelay: 4000
        , Markup: {
            EN: '<div class="gt-addCart col-xs-12"><div class="row"><div class="col-xs-12 gt-addCart__header"><h1 class="gt-addCart__title h4"><i aria-hidden="true" class="fa fa-check-circle"></i> Successfully Added To Cart!</h1><button type="button" data-gt-addcart="close" class="gt-addCart__closeBtn"><i class="fa fa-remove fa-lg" aria-hidden="true"></i> <span class="sr-only">Close</span></button></div></div><div class="row"><div class="col-xs-12"><ul class="gt-addCart__items" data-gt-addcart="itemInfo"></ul></div></div><div class="row gt-addCart__commandRow"><div class="col-xs-12"><a href="/ShoppingCart" class="btn btn-primary-outline float-right">View Cart</a></div></div></div>'
            , FR: '<div class="gt-addCart col-xs-12"><div class="row"><div class="col-xs-12 gt-addCart__header"><h1 class="gt-addCart__title h4"><i aria-hidden="true" class="fa fa-check-circle"></i> Ajouté avec succès au panier!</h1><button type="button" data-gt-addcart="close" class="gt-addCart__closeBtn"><i class="fa fa-remove fa-lg" aria-hidden="true"></i> <span class="sr-only">Fermer</span></button></div></div><div class="row"><div class="col-xs-12"><ul class="gt-addCart__items" data-gt-addcart="itemInfo"></ul></div></div><div class="row gt-addCart__commandRow"><div class="col-xs-12"><a href="/ShoppingCart" class="btn btn-primary-outline float-right">Reviser panier</a></div></div></div>'
        }
        , DataFields: {
            Image: null
            , Description: null
            , Quantity: null
            , Price: null
        }
    };

    gtCartFeedback.prototype.Options = {
        ParentElmtSelector: '#main-content'
        , Language: 'EN'
    };
    //#endregion

    //#region Event Handlers
    gtCartFeedback.prototype.ItemAdded = function () {
        /// <summary>
        /// Callback function for Item Added Event. Makes a call to the 
        /// server to retrieve cart info and displays it
        /// </summary>
        var that = this;

        $.get('/Header/AddCartFeedback', function (markup) {
            $('[data-gt-addcart="itemInfo"]', that.$Elmt).html(
                markup
            );

            that.Show();

            that.ClearAutoClose();

            that.SetAutoClose();
        });
    };

    gtCartFeedback.prototype.Show = function () {
        this.PositionElmt();

        this.$Elmt.fadeIn('fast');
    };

    gtCartFeedback.prototype.Close = function () {
        this.$Elmt.fadeOut('fast');
    };
    //#endregion

    //#region Methods
    gtCartFeedback.prototype.ClearAutoClose = function () {
        if (this.ElmtTimeoutID) {
            window.clearTimeout(this.ElmtTimeoutID);

            this.ElmtTimeoutID = null;
        }
    };

    gtCartFeedback.prototype.SetAutoClose = function () {
        var that = this;

        this.ElmtTimeoutID = window.setTimeout(function () {
            that.Close();

            that.ElmtTimeoutID = null;
        }, this.AutoCloseDelay);
    };

    gtCartFeedback.prototype.Initialize = function () {
        this.Render();

        // Override this function
        window.bindCarouselAddToCartButtons = $.proxy(this.BindCarouselAddToCartButton, this);

        this.BindCarouselAddToCartButton();
        this.BindAddToCartBtn();

        $('[data-gt-addcart="close"]', this.$Elmt)
            .on('click', $.proxy(this.Close, this));

        $('html')
            .on('click', $.proxy(this.Close, this));

        this.$Elmt
            .on('mouseenter', $.proxy(this.ClearAutoClose, this))
            .on('mouseleave', $.proxy(this.SetAutoClose, this));
    };

    gtCartFeedback.prototype.Render = function () {
        this.$ParentElmt.prepend(this.$Elmt);
    };

    gtCartFeedback.prototype.BindCarouselAddToCartButton = function () {
        /// <summary>
        /// Functionality for adding items to cart from a Carousel
        /// </summary>
        var that = this;

        $('[name="prod_CarouselToCart"]').each(function () {
            var carouselAddToCart
                = new window.gtCartFeedback.CarouselBlock($(this).attr('id'), that.Options.Language);

            carouselAddToCart.Subscribe_Click($.proxy(that.Close, that));

            carouselAddToCart.Subscribe_Added($.proxy(that.ItemAdded, that));
        });
    };

    gtCartFeedback.prototype.BindAddToCartBtn = function () {
        /// <summary>
        /// Functionality for adding items to cart from Browse pages or Product Details pages
        /// </summary>
        var that = this;

        $('[name="prod_AddToCart"]').each(function () {
            var addToCartBtn
                = new window.gtCartFeedback.AddToCartBtn($(this).attr('id'), that.Options.Language);

            addToCartBtn.Subscribe_Click($.proxy(that.Close, that));

            addToCartBtn.Subscribe_Added($.proxy(that.ItemAdded, that));
        });
    };

    gtCartFeedback.prototype.PositionElmt = function () {
        var top = window.pageXOffset
            ? window.pageXOffset
            : document.documentElement.scrollTop
                ? document.documentElement.scrollTop
                : document.body.scrollTop;

        var topPos = '0';

        if (top > 50 && $(window).width() <= 768) {
            topPos = '15px';
        } else if (top > 50) {
            topPos = '60px';
        } else {
            topPos = '140px';
        }

        var horizontalPos = '0';

        if ($(window).width() > 2000) {
            horizontalPos = '19%';
        } else if ($(window).width() > 768) {
            horizontalPos = '20px';
        } else {
            horizontalPos = '0';
        }

        this.$Elmt.css({
            top: topPos
            , right: horizontalPos
        });
    };
    //#endregion
    //#endregion

    //#region gtCartFeedback.AddToCartBtn
    //#region Constructors
    gtCartFeedback.AddToCartBtn = function (btnID, language) {
        /// <summary>
        /// Represents a carousel item block with an add to cart CTA
        /// </summary>
        /// <param name="btnID" type="string">
        /// (Required) Button ID of the element. This ID is used to link
        /// to other controls such as the loading icon
        /// </param>
        if (btnID === null || btnID === '' || btnID === undefined) {
            throw Error('btnID is required');
        }

        if (language) {
            this.Options.Language = language;
        }

        this.CTABtnID = btnID;
        this.ClickHandlers = [];
        this.ItemAddedHandlers = [];

        this.Initialize();

        return this;
    };
    //#endregion

    //#region Properties
    gtCartFeedback.AddToCartBtn.prototype = {
        CTABtnID: null
        , $loaderImg: null
        , $qtyElmt: null
        , $selectedOption: null
        , $addingButton: null
        , $noteElmt: null
        , ClickHandlers: []
        , Subscribe_Click: function (fn) {
            this.ClickHandlers.push(fn);
        }
        , Unsubscribe_Click: function (fn) {
            this.ClickHandlers = this.ClickHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
        , ItemAddedHandlers: []
        , Subscribe_Added: function (fn) {
            this.ItemAddedHandlers.push(fn);
        }
        , Unsubscribe_Added: function (fn) {
            this.ItemAddedHandlers = this.ItemAddedHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
    };

    gtCartFeedback.AddToCartBtn.prototype.Options = {
        Language: 'EN'
    };
    //#endregion

    //#region Event Handlers
    gtCartFeedback.AddToCartBtn.prototype.CTA_Click = function (e) {
        e.preventDefault();

        var that = this;

        this.SetState('loading');

        this.$selectedOption = $("#" + this.CTABtnID.replace("btn_", "uom_") + " option:selected");

        var data = {
            rows: '1'
            , p: this.$addingButton.attr('pc')
            , q: this.$qtyElmt.val()
            , pu: this.$selectedOption.attr("pu")
            , pq: this.$selectedOption.attr("pq")
            , uomEx: this.$selectedOption.val()
            , note: this.$noteElmt.text()
        };

        $.each(this.ClickHandlers, function (index, item) {
            item.call(that, that);
        });

        $.post('/Ajax/AddProductToCart.aspx', data, $.proxy(this.ItemAdded, this));
    };

    gtCartFeedback.AddToCartBtn.prototype.CallItemAddedHandlers = function () {
        /// <summary>
        /// Calls Event Listeners
        /// </summary>
        var that = this;

        $.each(this.ItemAddedHandlers, function (index, item) {
            item.call(that);
        });
    };

    gtCartFeedback.AddToCartBtn.prototype.ItemAdded = function (xml) {
        /// <param name="xml" type="xml">
        /// XML returned form server
        /// </param>
        this.CallItemAddedHandlers();

        // display the messages
        if ($("messages", xml).text() !== "") {
            alert($("messages", xml).text());
        }

        // AV. 2013-04-02. Fix of TTT #14329 (Redirecting to notification page)
        if ($("valid", xml).text() === "CustomStamp") {
            location.href = "/shopping/order/customStampsNotification.aspx";
        }

        if ($("session_version", xml).text() !== ""
            && window.createCookie) {
            window.createCookie("cv", $("session_version", xml).text());
        }

        if ($("order_id", xml).text() !== ""
            && window.createCookie) {
            window.createCookie("OrderId", $("order_id", xml).text(), 7);
        }

        var pendingSubst = false;

        if ($("pending_subst", xml).text() === "True") {
            pendingSubst = true;
        }

        // update the shopping cart area
        var count = $("count", xml).text();

        if ($("#myadobedtm").length > 0) {
            var text =
                '{"transaction" : {"products" : [{"sku" :"'
                + this.$addingButton.attr("pc")
                + '", "uom" : "'
                + this.$selectedOption.attr("pu")
                + '"}]}}';

            window.digitalData = JSON.parse(text);

            if (typeof window._satellite !== "undefined") {
                window._satellite.track('cart: add');
            }
        }

        window.updateCartCountInHeader(count);

        // need to call this only on the last call but the flag may be set earlier
        if (pendingSubst) {
            location.href = "/ShoppingCart/ProductSubstitutions";
        }

        this.SetState('default');
    };
    //#endregion

    //#region Methods
    gtCartFeedback.AddToCartBtn.prototype.Initialize = function () {
        /// <summary>
        /// Sets the properties.
        /// Note: the way elements are retrieved is by parsing the btnID.
        /// This is a hack that originated from mvcsupport.js
        /// </summary>
        this.$loaderImg = $("#" + this.CTABtnID.replace("btn_", "ldr_"));
        this.$qtyElmt = $("#" + this.CTABtnID.replace("btn_", "qty_"));
        this.$selectedOption = $("#" + this.CTABtnID.replace("btn_", "uom_") + " option:selected");
        this.$noteElmt = $("#" + this.CTABtnID.replace("btn_", "note_"));
        this.$addingButton = $("#" + this.CTABtnID);

        this.$addingButton.unbind('click').bind('click', $.proxy(this.CTA_Click, this));
    };

    gtCartFeedback.AddToCartBtn.prototype.SetState = function (state) {
        switch (state) {
            case 'default':
                this.$addingButton.show();
                this.$loaderImg.hide();
                break;
            case 'loading':
                this.$addingButton.hide();
                this.$loaderImg.show();
                break;
        }
    };
    //#endregion
    //#endregion

    //#region gtCartFeedback.CarouselBlock
    //#region Constructors
    gtCartFeedback.CarouselBlock = function (btnID, language) {
        /// <summary>
        /// Represents a carousel item block with an add to cart CTA
        /// </summary>
        /// <param name="btnID" type="string">
        /// (Required) Button ID of the element. This ID is used to link
        /// to other controls such as the loading icon
        /// </param>
        if (btnID === null || btnID === '' || btnID === undefined) {
            throw Error('btnID is required');
        }

        if (language) {
            this.Options.Language = language;
        }

        this.CTABtnID = btnID;
        this.ClickHandlers = [];
        this.ItemAddedHandlers = [];

        this.Initialize();

        return this;
    };
    //#endregion

    //#region Properties
    gtCartFeedback.CarouselBlock.prototype = {
        CTABtnID: null
        , $loaderImg: null
        , $qtyElmt: null
        , $priceElmt: null
        , $unitsElmt: null
        , $pkgsUomCode: null
        , $priceUomCode: null
        , $extendedUom: null
        , $addingButton: null
        , $noteElmt: null
        , ClickHandlers: []
        , Subscribe_Click: function (fn) {
            this.ClickHandlers.push(fn);
        }
        , Unsubscribe_Click: function (fn) {
            this.ClickHandlers = this.ClickHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
        , ItemAddedHandlers: []
        , Subscribe_Added: function (fn) {
            this.ItemAddedHandlers.push(fn);
        }
        , Unsubscribe_Added: function (fn) {
            this.ItemAddedHandlers = this.ItemAddedHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
    };

    gtCartFeedback.CarouselBlock.prototype.Options = {
        Language: 'EN'
    };
    //#endregion

    //#region Event Handlers
    gtCartFeedback.CarouselBlock.prototype.CTA_Click = function (e) {
        e.preventDefault();

        var that = this;

        this.SetState('loading');

        $.each(this.ClickHandlers, function (index, item) {
            item.call(that, that);
        });

        if ($('[data-gt-carousel="refreshCartOnAdd"] #' + this.CTABtnID).length !== 0) {
            this.AddToOrder();
        } else {
            this.AddProductToCart();
        }
    };

    gtCartFeedback.CarouselBlock.prototype.CallItemAddedHandlers = function () {
        /// <summary>
        /// Calls all the listeners for Item Added Event
        /// </summary>
        var that = this;

        $.each(this.ItemAddedHandlers, function (index, item) {
            item.call(that);
        });
    };

    gtCartFeedback.CarouselBlock.prototype.ItemAdded = function (xml) {
        /// <param name="xml" type="xml">
        /// XML returned form server
        /// </param>
        this.CallItemAddedHandlers();

        // display the messages
        if ($("messages", xml).text() !== "") {
            alert($("messages", xml).text());
        }

        // AV. 2013-04-02. Fix of TTT #14329 (Redirecting to notification page)
        if ($("valid", xml).text() === "CustomStamp") {
            location.href = "/shopping/order/customStampsNotification.aspx";
        }

        if ($("session_version", xml).text() !== ""
            && window.createCookie) {
            window.createCookie("cv", $("session_version", xml).text());
        }

        if ($("order_id", xml).text() !== ""
            && window.createCookie) {
            window.createCookie("OrderId", $("order_id", xml).text(), 7);
        }

        var pendingSubst = false;

        if ($("pending_subst", xml).text() === "True") {
            pendingSubst = true;
        }

        // update the shopping cart area
        var count = $("count", xml).text();

        this.SendTransactionToAdobeDTM();

        window.updateCartCountInHeader(count);

        // need to call this only on the last call but the flag may be set earlier
        if (pendingSubst) {
            location.href = "/ShoppingCart/ProductSubstitutions";
        }

        this.SetState('default');
    };

    gtCartFeedback.CarouselBlock.prototype.ItemAddedOnCartPage = function (result) {
        /// <summary>
        /// When an item is added on the cart page the logic is a bit different since
        /// the cart page needs to be refreshed. Also note this logic is similar to the
        /// Quick Product Entry on the cart page; that logic can be found at mvcsupport.js
        /// > look for the handler for $("button.qpe-button").click
        /// </summary>
        this.CallItemAddedHandlers();

        window.processMessagesAndAlerts(result);

        window.updateCartCountInHeader(result.orderCount);

        $("ul.cart-items").html($(result.cart).html());

        $(".cart-alerts").html($(result.cartAlerts).html());

        $(".cart-header").html($(result.cartHeader).html());

        $(".cart-links").html($(result.cartLinks).html());

        this.SendTransactionToAdobeDTM();

        window.bindCartElements();
        window.bindCartItemElements();
        window.reloadSwitchAndSaveLogo(false);
        window.reloadBusinessSelectBanner();

        window.reloadMarketplaceTooltip();

        window.reloadHfaTotals();

        this.SetState('default');

        $('#main-content').spin(false);
        $('html').scrollTo(0, 300);
    };
    //#endregion

    //#region Methods
    gtCartFeedback.CarouselBlock.prototype.AddToOrder = function () {
        /// <summary>
        /// API call to add to order
        /// </summary>
        $('#main-content').spin();

        var addToShoppingCart = {
            AddToShoppingCartItems: [{
                ProductCode: this.$addingButton.attr('pc')
                , Quantity: this.$qtyElmt.val()
                , UomCodeExtended: this.$extendedUom.val()
            }]
        };

        $.post('/ShoppingCart/AddToOrder'
            , { AddToShoppingCart: addToShoppingCart }
            , $.proxy(this.ItemAddedOnCartPage, this));
    };

    gtCartFeedback.CarouselBlock.prototype.AddProductToCart = function () {
        /// <summary>
        /// API call to add product to cart
        /// </summary>
        var data = {
            rows: '1'
            , p: this.$addingButton.attr('pc')
            , q: this.$qtyElmt.val()
            , pu: this.$unitsElmt.val()
            , pq: this.$pkgsUomCode.val()
            , uomEx: this.$priceUomCode.val()
            , note: this.$noteElmt.text()
        };

        $.post('/Ajax/AddProductToCart.aspx', data, $.proxy(this.ItemAdded, this));
    };

    gtCartFeedback.CarouselBlock.prototype.SendTransactionToAdobeDTM = function () {
        /// <summary>
        /// Sends the transaction data to Adobe Analytics
        /// </summary>
        if ($("#myadobedtm").length > 0) {
            var text =
                '{"transaction" : {"products" : [{"sku" :"'
                + this.$addingButton.attr("pc")
                + '", "uom" : "'
                + this.$unitsElmt.val()
                + '"}]}}';

            window.digitalData = JSON.parse(text);

            if (typeof window._satellite !== "undefined") {
                window._satellite.track('cart: add');
            }
        }
    };

    gtCartFeedback.CarouselBlock.prototype.Initialize = function () {
        /// <summary>
        /// Sets the properties.
        /// Note: the way elements are retrieved is by parsing the btnID.
        /// This is a hack that originated from mvcsupport.js
        /// </summary>
        this.$loaderImg = $("#" + this.CTABtnID.replace("btn_", "ldr_"));
        this.$qtyElmt = $("#" + this.CTABtnID.replace("btn_", "qty_"));
        this.$priceElmt = $("#" + this.CTABtnID.replace("btn_", "uom_price_"));
        this.$unitsElmt = $("#" + this.CTABtnID.replace("btn_", "uom_uomcode_"));
        this.$pkgsUomCode = $("#" + this.CTABtnID.replace("btn_", "uom_cfactor_"));
        this.$priceUomCode = $("#" + this.CTABtnID.replace("btn_", "uom_disptext_"));
        this.$extendedUom = $("#" + this.CTABtnID.replace("btn_", "uom_codeExtended_"));
        this.$noteElmt = $("#" + this.CTABtnID.replace("btn_", "note_"));
        this.$addingButton = $("#" + this.CTABtnID);

        this.$addingButton.unbind('click').bind('click', $.proxy(this.CTA_Click, this));
    };

    gtCartFeedback.CarouselBlock.prototype.SetState = function (state) {
        switch (state) {
            case 'default':
                this.$addingButton.show();
                this.$loaderImg.hide();
                break;
            case 'loading':
                this.$addingButton.hide();
                this.$loaderImg.show();
                break;
        }
    };
    //#endregion
    //#endregion

    // Initializer
    window.gtCartFeedback = gtCartFeedback;

    $(document).ready(function () {
        var lang = $('html').attr('lang');

        if (lang) {
            new window.gtCartFeedback({ Language: lang.toLowerCase() });
        } else {
            new window.gtCartFeedback();
        }
    });
}(jQuery));