/*
 * GTTooltip - v0.1.0 - 2018-5-7
 * Grand and Toy tooltip control
 */
(function ($) {
    'use strict';

    //#region --== ToolTips Parent - Holds a Collection of ToolTips ==--

    //#region Constructors
    var gtTooltips = function () {
        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtTooltips.prototype = {
        ToolTips: []
        , Selectors: {
            TooltipContainer: '[data-gt-tooltip="container"]'
        }
    };
    //#endregion

    //#region Event Handlers
    gtTooltips.prototype.Tooltip_Click = function (tooltipID) {
        /// <summary>
        /// Hides all other tools tips
        /// </summary>
        for (var i = 0; i < this.ToolTips.length; i++) {
            if (this.ToolTips[i].ID !== tooltipID) {
                this.ToolTips[i].Hide();
            }
        }
    };
    //#endregion

    //#region Methods
    gtTooltips.prototype.Initialize = function () {
        var that = this;
        var id = 0;

        $(this.Selectors.TooltipContainer).each(function () {
            var tooltip = new window.gtTooltip(id, this);

            tooltip.Subscribe_Click($.proxy(that.Tooltip_Click, that));

            that.ToolTips.push(tooltip);

            id++;
        });
    };
    //#endregion

    //#endregion

    //#region --== ToolTip ==--

    //#region Constructors
    var gtTooltip = function (id, elmt) {
        this.$elmt = $(elmt);
        this.ID = id;
        this.ClickHandlers = [];

        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtTooltip.prototype = {
        ID: 0
        , $elmt: null
        , $content: null
        , Selectors: {
            Content: '[data-gt-tooltip="content"]'
        }
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
    };

    gtTooltip.prototype.Options = {
        ClickEnabled: true
        , HoverEnabled: false
        , Selectors: {
            ClickEnabled: 'gt-tooltip-click-enabled'
            , HoverEnabled: 'gt-tooltip-hover-enabled'
        }
    };
    //#endregion

    //#region Event Handlers
    gtTooltip.prototype.Html_Click = function () {
        this.Hide();
    };

    gtTooltip.prototype.Elmt_Click = function (evt) {
        var that = this;

        evt.stopPropagation();
        evt.preventDefault();

        if (this.$content.is(':visible')) {
            this.Hide();
        } else {
            this.Show();
        }

        $.each(this.ClickHandlers, function (index, item) {
            item.call(that, that.ID);
        });
    };

    gtTooltip.prototype.Elmt_HoverOver = function () {
        var that = this;

        if (this.HoverTimeout) {
            window.clearTimeout(this.HoverTimeout);

            this.HoverTimeout = null;
        }

        this.Show();
    };

    gtTooltip.prototype.Elmt_HoverOut = function () {
        var that = this;

        if (this.HoverTimeout) {
            window.clearTimeout(this.HoverTimeout);

            this.HoverTimeout = null;
        }

        this.HoverTimeout = window.setTimeout(function () {
            that.Hide();
        }, 1000);
    };
    //#endregion

    //#region Methods
    gtTooltip.prototype.Initialize = function () {
        this.$content = $(this.Selectors.Content, this.$elmt);

        if (this.$content.length === 0) {
            throw new Error('Content for the popup must be defined');
        } else {
            this.SetupEventHandlers();
        }
    };

    gtTooltip.prototype.SetupEventHandlers = function () {
        if (this.IsHoverEnabled()) {
            this.$elmt.hover(
                $.proxy(this.Elmt_HoverOver, this)
                , $.proxy(this.Elmt_HoverOut, this)
            );
        } else if (this.IsClickEnabled()) {
            this.$elmt.on('click', $.proxy(this.Elmt_Click, this));

            $('html').on('click', $.proxy(this.Html_Click, this));
        }
    };

    gtTooltip.prototype.IsClickEnabled = function () {
        if (this.$elmt.data(this.Options.Selectors.ClickEnabled)) {
            this.Options.ClickEnabled = this.$elmt.data(this.Options.Selectors.ClickEnabled);
        }

        return this.Options.ClickEnabled;
    };

    gtTooltip.prototype.IsHoverEnabled = function () {
        if (this.$elmt.data(this.Options.Selectors.HoverEnabled)) {
            this.Options.HoverEnabled = this.$elmt.data(this.Options.Selectors.HoverEnabled);
        } else {
            this.Options.HoverEnabled = false;
        }

        return this.Options.HoverEnabled;
    }

    gtTooltip.prototype.Position_Elmt = function () {
        /// <summary>
        /// Positions element if it is at the edges. Use default styles otherwise
        /// </summary>
        this.$content.css({
            display: 'block'
            , opacity: 0
        });

        var offsetLeft = this.$content.offset().left;
        var offsetRight = $(window).width() - (offsetLeft + this.$content.outerWidth());

        this.$content.css({
            display: 'none'
            , opacity: 1
        });

        if (offsetLeft < 0) {
            this.$content
                .addClass('gt-tooltip--left')
                .removeClass('gt-tooltip--right');
        } else if (offsetRight < 0) {
            this.$content
                .removeClass('gt-tooltip--left')
                .addClass('gt-tooltip--right');
        } else {
            this.ResetPosition();
        }
    };

    gtTooltip.prototype.ResetPosition = function () {
        this.$content
            .removeClass('gt-tooltip--left')
            .removeClass('gt-tooltip--right');
    };

    gtTooltip.prototype.Show = function () {
        if (this.$content.css('display') === 'none') {
            this.Position_Elmt();

            this.$content.stop().fadeIn('fast');
        }
    };

    gtTooltip.prototype.Hide = function () {
        if (this.$content.css('display') !== 'none') {
            var that = this;

            this.$content.stop().fadeOut('fast', function () {
                that.ResetPosition();
            });
        }
    };
    //#endregion

    //#endregion

    // Initialzier
    window.gtTooltips = gtTooltips;
    window.gtTooltip = gtTooltip;

    $(document).ready(function () {
        new window.gtTooltips();
    });
})(jQuery);