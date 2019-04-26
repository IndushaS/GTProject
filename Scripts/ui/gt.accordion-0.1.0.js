/*
 * GTAccordion - v0.1.0 - 2017-11-30
 * Grand and Toy accordion functionality
*/

(function ($) {
    'use strict';

    //#region --== Accordion ==--

    //#region Constructors
    var gtAccordion = function (elmt, options) {
        /// <summary>
        /// Main accordion class. Essentially the container with encapsulates accordion items
        /// </summary>
        if (!elmt) {
            throw new Error('argumentnullexception - no element has been specified');
        }

        this.Elmt = elmt;
        this.$elmt = $(elmt);

        this.Options = $.extend(true, this.Options, options);

        this.Initialize();

        return this;
    };
    //#endregion

    //#region Properties
    gtAccordion.prototype = {
        Elmt: null
        , $elmt: null
        , Items: []
        , Selectors: {
            Item: '[data-gt-accordion="item"]'
        }
    };

    gtAccordion.prototype.Options = {
        AutoMinimize: false
        , DisableDefaultCloseIndicator: false
        , CustomCloseIndicator: false
    };
    //#endregion

    //#region Event Handlers
    gtAccordion.prototype.OnItemMaximize = function (currentItem) {
        this.Items.forEach(function (item) {
            if (item.IsMaxmized && item !== currentItem) {
                item.Deselect();
                item.Hide();
            }
        });
    };
    //#endregion

    //#region Methods
    gtAccordion.prototype.Initialize = function () {
        var that = this;

        var $items = $(this.Selectors.Item, this.$elmt);

        if ($items.length === 0) {
            throw new Error('argumentnullexception - no items found within the accordion');
        }

        $items.each(function () {
            that.Items.push(new gtAccordionItem(this, that.Options));
        });

        this.SetAutoMinimize();
    };

    gtAccordion.prototype.SetAutoMinimize = function () {
        var that = this;

        if (this.Options.AutoMinimize) {
            this.Items.forEach(function (item) {
                item.Events.OnMaximizeSubscribe(
                    $.proxy(that.OnItemMaximize, that)
                );
            });
        }
    };
    //#endregion

    //#endregion 

    //#region --== Accordion Item ==--

    //#region Constructors
    var gtAccordionItem = function (elmt, options) {
        /// <summary>
        /// A specific accordion item. The container for the header and the content
        /// </summary>
        /// <param name="elmt" type="DOM Element">
        /// The container that wraps each item of the accordion
        /// </param>
        if (!elmt) {
            throw new Error('argumentnullexception - no element has been specified');
        }

        this.Elmt = elmt;
        this.$elmt = $(elmt);

        this.$header = $(this.Selectors.Header, this.$elmt);
        this.$content = $(this.Selectors.Content, this.$elmt);

        if (this.$header.length !== 0 && this.$content.length !== 0) {
            this.Options = $.extend(true, this.Options, options);

            this.Initialize();
        }

        return this;
    };
    //#endregion

    //#region Properties
    gtAccordionItem.prototype = {
        Elmt: null
        , $elmt: null
        , $header: null
        , $content: null
        , HeaderClasses: {
            Default: 'gt-accordion-header'
            , Active: 'gt-accordion-header--expanded'
            , ExpandIcon: 'gt-accordion__expandIcon'
        }
        , Selectors: {
            Header: '[data-gt-accordion="header"]'
            , Content: '[data-gt-accordion="content"]'
        }
        , IsMaxmized: false
    };

    gtAccordionItem.prototype.Options = {
        DisableDefaultCloseIndicator: false
        , CustomCloseIndicator: false
    };

    gtAccordionItem.prototype.Events = {
        OnMinimizeHandlers: []
        , OnMinimizeSubscribe: function (fn) {
            /// <summary>
            /// Subscribe to on minimize event
            /// </summary>
            /// <param name="fn" type="function">
            /// Callback function. Function will be passed current item as the first parameter
            /// </param>
            this.OnMinimizeHandlers.push(fn);
        }
        , OnMinimizeUnSubscribe: function (fn) {
            /// <summary>
            /// Unsubscribe to on minimize event
            /// </summary>
            /// <param name="fn" type="function">
            /// Callback function. Function will be passed current item as the first parameter
            /// </param>
            this.OnMinimizeHandlers = this.OnMinimizeHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
        , FireOnMinimize: function (currentItem) {
            this.OnMinimizeHandlers.forEach(function (item) {
                item(currentItem);
            });
        }
        , OnMaximizeHandlers: []
        , OnMaximizeSubscribe: function (fn) {
            /// <summary>
            /// Subscribe to on maximize event
            /// </summary>
            /// <param name="fn" type="function">
            /// Callback function
            /// </param>
            this.OnMaximizeHandlers.push(fn);
        }
        , OnMaximizeUnSubscribe: function (fn) {
            /// <summary>
            /// Unsubscribe to on maximize event
            /// </summary>
            /// <param name="fn" type="function">
            /// Callback function
            /// </param>
            this.OnMaximizeHandlers = this.OnMaximizeHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
        , FireOnMaxmize: function (currentItem) {
            this.OnMaximizeHandlers.forEach(function (item) {
                item(currentItem);
            });
        }
    };
    //#endregion

    //#region Event Handlers
    gtAccordionItem.prototype.HeaderClick = function () {
        if (this.$content.is(':visible')
            && this.Options.CustomCloseIndicator === false) {
            this.Deselect();
            this.Hide();
        } else {
            this.Select();
            this.Show();
        }
    };
    //#endregion

    //#region Methods
    gtAccordionItem.prototype.Initialize = function () {
        /// <summary>
        /// Contains all method calls to properly setup the functionality
        /// </summary>
        this.$header.on('click', $.proxy(this.HeaderClick, this));

        this.PolyfillExpandIcon();

        this.PolyfillBehaviour();

        this.SetupCustomIndicator();

        if (this.Options.CustomCloseIndicator && this.IsCustomIndicatorSelected()) {
            this.IsMaxmized = true;

            this.$content.show();
        } else {
            this.IsMaxmized = false;

            this.$content.hide();
        }
    };

    gtAccordionItem.prototype.SetupCustomIndicator = function () {
        var $customIndicator = this.GetCustomIndicator();

        if (this.Options.CustomCloseIndicator && $customIndicator) {
            $customIndicator.on('click', function (evt) {
                evt.stopPropagation();
                evt.preventDefault();
            });
        }
    };

    gtAccordionItem.prototype.IsCustomIndicatorSelected = function () {
        var $elmt = this.GetCustomIndicator();

        if ($elmt) {
            return $elmt.is(':checked');
        } else {
            return false;
        }
    };

    gtAccordionItem.prototype.GetCustomIndicator = function () {
        /// <returns>
        /// Returns the custom indicator element which is basically a radio button
        /// </returns>
        var $elmt = $('[type="radio"]', this.$header);

        return $elmt.length === 0 ? null : $elmt;
    };

    gtAccordionItem.prototype.Select = function () {
        /// <summary>
        /// Set's the state of the accordion as selected
        /// </summary>
        var $customIndicator = this.GetCustomIndicator();

        if (this.Options.CustomCloseIndicator && $customIndicator) {
            $customIndicator
                .prop('checked', true)
                .attr('checked', 'checked');
        }
    };

    gtAccordionItem.prototype.Deselect = function () {
        /// <summary>
        /// Set's the state of the accordion as deselected
        /// </summary>
        var $customIndicator = this.GetCustomIndicator();

        if (this.Options.CustomCloseIndicator && $customIndicator) {
            $customIndicator
                .prop('checked', false)
                .removeAttr('checked');
        }
    };

    gtAccordionItem.prototype.Show = function () {
        this.IsMaxmized = true;

        this.$content.stop().slideDown(200);

        this.ToggleAriaRoles(true);

        this.Events.FireOnMaxmize(this);

        if (this.Options.DisableDefaultCloseIndicator === false) {
            this.$header
                .removeClass(this.HeaderClasses.Default)
                .addClass(this.HeaderClasses.Active);

            this.PolyfillToggleCloseIcon(true);
        }
    };

    gtAccordionItem.prototype.Hide = function () {
        this.IsMaxmized = false;

        this.$content.stop().slideUp(200);

        this.ToggleAriaRoles(false);

        this.Events.FireOnMinimize(this);

        if (this.Options.DisableDefaultCloseIndicator === false) {
            this.$header
                .addClass(this.HeaderClasses.Default)
                .removeClass(this.HeaderClasses.Active);

            this.PolyfillToggleCloseIcon(false);
        }
    };

    gtAccordionItem.prototype.ToggleAriaRoles = function (isExpanded) {
        /// <summary>
        /// Toggles Aria roles for accessibility
        /// </summary>
        /// <param name="isExpanded" type="Boolean">
        /// Specifies if the accordion is expanded. True if it is false otherwise
        /// </param>
        if (isExpanded) {
            this.$header.attr('aria-expanded', true);
            this.$content.attr('aria-hidden', false);
        } else {
            this.$header.attr('aria-expanded', false);
            this.$content.attr('aria-hidden', true);
        }
    };

    gtAccordionItem.prototype.PolyfillBehaviour = function () {
        /// <summary>
        /// Adds browser specific classes to modify styling
        /// </summary>
        if (this.IsIE() && this.IsIE() === 8) {
            this.$header.addClass('gt-accordion-header--polyfillIE8');
        }
    };

    gtAccordionItem.prototype.PolyfillToggleCloseIcon = function (isExpanded) {
        /// <param name="isExpanded" type="Boolean">
        /// Specifies if the accordion is expanded. True if it is false otherwise
        /// </param>
        if (this.IsIE() && this.IsIE() < 8) {
            if (isExpanded) {
                $('.' + this.HeaderClasses.ExpandIcon, this.$header).text('X');
            } else {
                $('.' + this.HeaderClasses.ExpandIcon, this.$header).text('+');
            }
        }
    };

    gtAccordionItem.prototype.PolyfillExpandIcon = function () {
        /// <summary>
        /// Uses browser sniffing to polyfill the expand icon
        /// </summary>
        if (this.IsIE() && this.IsIE() < 8) {
            var $icon = $('<span/>', {
                'class': this.HeaderClasses.ExpandIcon
                , 'text': '+'
            });

            this.$header.append($icon);
        }
    };

    gtAccordionItem.prototype.IsIE = function () {
        var myNav = navigator.userAgent.toLowerCase();

        return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
    };
    //#endregion

    //#endregion

    // Initializer
    window.gtAccordion = gtAccordion;
    window.gtAccordionItem = gtAccordionItem;

    //$(document).ready(function () {
    //    $('[data-gt-accordion="main"]').each(function () {
    //        new gtAccordion(this);
    //    });
    //});
}(jQuery));