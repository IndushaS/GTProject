/*
 * GTTab - v0.1.0 - 2019-4-19
 * Grand and Toy tab functionality
*/
(function ($) {
    'use strict';

    //#region --== TABS Container ==--

    //#region Constructors
    var gtTabs = function () {
        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtTabs.prototype = {
        DataAttrSelector: '[data-gt-tabs]'
        , Tabs: []
    };
    //#endregion

    //#region Event Handlers
    gtTabs.prototype.GtTab_click = function (tab) {
        this.Tabs.forEach(function (currentTab) {
            if (currentTab.ID !== tab.ID) {
                currentTab.Hide();
            }
        });
    };
    //#endregion

    //#region Methods
    gtTabs.prototype.Initialize = function () {
        var that = this;
        var i = 0; 

        $(this.DataAttrSelector).each(function () {
            var $tab = $(this);
            var $content = $('#' + $tab.data('gt-tabs'));

            if ($content.length !== 0) {
                var gtTabObj = new gtTab(i, $tab.get(0), $content.get(0));

                gtTabObj.Events.OnClickingSubscribe($.proxy(that.GtTab_click, that));

                that.Tabs.push(gtTabObj);

                i++;
            }
        });
    };
    //#endregion

    //#endregion

    //#region --== TABS ==--

    //#region Constructors
    var gtTab = function (id, triggerElmt, contentElmt) {
        this.ID = id;
        this.TriggerElmt = triggerElmt;
        this.$triggerElmt = $(triggerElmt);
        this.ContentElmt = contentElmt;
        this.$contentElmt = $(contentElmt);

        this.Events.OnClickingHandlers = [];

        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtTab.prototype = {
        ID: 0
        , TriggerElmt: null
        , $triggerElmt: null
        , ContentElmt: null
        , $contentElmt: null
    };

    gtTab.prototype.StylingClasses = {
        TabSelected: 'gt-tab__tab--selected'
        , ContentSelected: 'gt-tab__pane--selected'
    }

    gtTab.prototype.Events = {
        OnClickingHandlers: []
        , OnClickingSubscribe: function (fn) {
            /// <summary>
            /// Subscribe to on clicking event
            /// </summary>
            /// <param name="fn" type="function">
            /// Callback function. Function will be passed current item as the first parameter
            /// </param>
            this.OnClickingHandlers.push(fn);
        }
        , OnClickingUnsubscribe: function (fn) {
            /// <summary>
            /// Unsubscribe to on clicking event
            /// </summary>
            /// <param name="fn" type="function">
            /// Callback function. Function will be passed current item as the first parameter
            /// </param>
            this.OnClickingHandlers = this.OnClickingHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
        , FireOnClick: function (tab) {
            this.OnClickingHandlers.forEach(function (item) {
                item(tab);
            });
        }
    };
    //#endregion

    //#region Event Handlers
    gtTab.prototype.TriggerElmt_Click = function (evt) {
        evt.preventDefault();

        this.Events.FireOnClick(this);

        this.Show();
    };
    //#endregion

    //#region Methods
    gtTab.prototype.Initialize = function () {
        this.$triggerElmt.on('click', $.proxy(this.TriggerElmt_Click, this));
    };

    gtTab.prototype.Hide = function () {
        this.$contentElmt
            .hide()
            .removeClass(this.StylingClasses.ContentSelected);

        this.$triggerElmt.removeClass(this.StylingClasses.TabSelected);
    };

    gtTab.prototype.Show = function () {
        this.$contentElmt
            .show()
            .addClass(this.StylingClasses.ContentSelected);

        this.$triggerElmt.addClass(this.StylingClasses.TabSelected);
    };
    //#endregion

    //#endregion

    // Initializer
    window.gtTabs = gtTabs;
    window.gtTab = gtTab;

    $(document).ready(function () {
        new window.gtTabs();
    });
}(jQuery));