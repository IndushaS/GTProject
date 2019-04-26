/*
 * GTShowHide - 2018-7-16
*/
(function ($) {
    'use strict';

    //#region Constructors
    var gtShowHide = function (trigger, options) {
        /// <param name="trigger" type="DOM Element">
        /// (Required) The trigger to show or hide such as a button
        /// </param>

        this.Options = $.extend(this, this.Options, options);

        this.Initialize(trigger);
    };
    //#endregion

    //#region Properties
    gtShowHide.prototype = {
        $trigger: null
        , $container: null
    };

    gtShowHide.prototype.Options = {
        TriggerClass: 'arrow'
        , TriggerSelectedClass: 'arrow--expanded'
        , Attributes: {
            // Attribute to specify which screen size this functionality should be disabled on
            DisabledForScreenAttr: 'gt-showhide-disable-for-screen'
            // Specifies which HTML5 feature is required for this to be enabled. Example of usage:
            // show hide only disables for mobile resolutions. But since IE < 10 does not have media queries
            // it is not responsive hence no need to have this functionality. You can specify the required feature
            // is responsive
            , RequiredFeature: 'gt-showhide-required-feature'
            // The text that displays when the control is either open or close. Possible values (open, close)
            , StateCaption: 'gt-showhide-caption'
        }
    };
    //#endregion

    //#region Event Handlers
    gtShowHide.prototype.Trigger_Click = function (evt) {
        var that = this;

        var $expandedTrigger = $('.' + this.Options.TriggerSelectedClass, this.$trigger);
        var $nonExpandedTrigger = $('.' + this.Options.TriggerClass, this.$trigger);

        evt.preventDefault();

        // Check if expanded on collapsed and style accordingly
        if ($nonExpandedTrigger.length !== 0) {
            $nonExpandedTrigger
                .removeClass(this.Options.TriggerClass)
                .addClass(this.Options.TriggerSelectedClass);
        } else {
            $expandedTrigger
                .addClass(this.Options.TriggerClass)
                .removeClass(this.Options.TriggerSelectedClass);
        }

        this.$container.slideToggle(300, function () {
            that.ToggleCaption();
        });
    };

    gtShowHide.prototype.Window_Resize = function () {
        this.ToggleEnabledState();
    };
    //#endregion

    //#region Methods
    gtShowHide.prototype.Initialize = function (trigger) {
        var that = this;
        var windowResizeID = 0;

        if (this.IsValid(trigger)) {
            this.$trigger
                .off('click', $.proxy(this.Trigger_Click, this))
                .on('click', $.proxy(this.Trigger_Click, this));

            $(window).resize(function () {
                clearTimeout(windowResizeID);

                windowResizeID = setTimeout($.proxy(that.Window_Resize, that), 500);
            });

            this.ToggleEnabledState();
        }
    };

    gtShowHide.prototype.ToggleCaption = function (state) {
        /// <summary>
        /// Toggles between the open/close caption if they are defined.
        /// </summary>
        var $closeCaption = $('[' + this.Options.Attributes.StateCaption + '="close"]', this.$trigger);
        var $openCaption = $('[' + this.Options.Attributes.StateCaption + '="open"]', this.$trigger);
        
        if (state) {
            if (state === 'open') {
                $closeCaption.show();
                $openCaption.hide();
            } else if (state === 'close') {
                $closeCaption.hide();
                $openCaption.show();
            }
        } else if ($closeCaption.length !== 0 && $openCaption.length !== 0) {
            if ($closeCaption.css('display') === 'none') {
                $closeCaption.show();
                $openCaption.hide();
            } else {
                $closeCaption.hide();
                $openCaption.show();
            }
        }
    };

    gtShowHide.prototype.ToggleEnabledState = function () {
        /// <summary>
        /// Enables disabled control based on screen size
        /// </summary>
        var $expandedTrigger = $('.' + this.Options.TriggerSelectedClass, this.$trigger);
        var $nonExpandedTrigger = $('.' + this.Options.TriggerClass, this.$trigger);

        if (this.CanEnable()) {
            this.$container.slideUp();
            
            this.ToggleCaption('close');

            $expandedTrigger
                .addClass(this.Options.TriggerClass)
                .removeClass(this.Options.TriggerSelectedClass);
        } else {
            this.$container.slideDown();

            this.ToggleCaption('open');

            $nonExpandedTrigger
                .removeClass(this.Options.TriggerClass)
                .addClass(this.Options.TriggerSelectedClass);
        }
    };

    gtShowHide.prototype.CanEnable = function () {
        /// <summary>
        /// Evaluates data attributes associated with enabling/disabling the control.
        /// This is a command function that calls other functions to evaluate various data attributes. 
        /// </summary>
        var canEnable = true;

        if (this.IsDisabledForScreen()) {
            canEnable = false;
        } else if (this.IsDisabledForMissingFeature()) {
            canEnable = false;
        }

        return canEnable;
    };

    gtShowHide.prototype.IsDisabledForScreen = function () {
        /// <summary>
        /// This show and hide functionality can be enabled and disabled at certain screen resolutions.
        /// This function will return true if the current screen size allows the functionality to be enabled.
        /// This is defined by adding data attribute data-gt-showhide-disable-for-screen to value of {xs, sm, md}
        /// </summary>
        var isDisabled = false;

        var windowWidth = $(window).width();

        var disableAttrVal = this.$trigger.data(this.Options.Attributes.DisabledForScreenAttr);

        if (disableAttrVal.toLowerCase()) {
            if (disableAttrVal === 'xs' && windowWidth < 768) {
                isDisabled = true;
            } else if (disableAttrVal === 'sm' && windowWidth >= 768 && windowWidth < 992) {
                isDisabled = true;
            } else if (disableAttrVal === 'md' && windowWidth >= 992) {
                isDisabled = true;
            }
        }

        return isDisabled;
    };

    gtShowHide.prototype.IsDisabledForMissingFeature = function () {
        /// <summary>
        /// If a browser feature specified is missing (Such as responsive) then this function returns true. False otherwise.
        /// </summary>
        var isDisabled = false;

        var disableAttrVal = this.$trigger.data(this.Options.Attributes.RequiredFeature);

        if (disableAttrVal.toLowerCase()) {
            if (disableAttrVal === 'responsive' && this.MediaQueriesEnabled() === false) {
                isDisabled = true;
            }
        }

        return isDisabled;
    };

    gtShowHide.prototype.IsValid = function (trigger) {
        /// <summary>
        /// Checks to see if the trigger provided is valid
        /// </summary>
        /// <param name="trigger" type="DOM Object">
        /// The trigger to show or hide such as a button
        /// </param>
        /// <returns type="Boolean">
        /// Returns a true if a trigger is found with a corresponding container. False otherwise
        /// </returns>
        var isValid = false;

        if (trigger) {
            this.$trigger = $(trigger);

            if (this.$trigger.length !== 0) {
                this.$container = $(this.$trigger.attr('href'));

                if (this.$container.length !== 0) {
                    isValid = true;
                }
            }
        }

        return isValid;
    };

    gtShowHide.prototype.IsIE = function () {
        var myNav = navigator.userAgent.toLowerCase();

        return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
    };

    gtShowHide.prototype.MediaQueriesEnabled = function () {
        /// <summary>
        /// Checks if Media queries are supported. Returns true if media queries are supported. False otherwise.
        /// </summary>
        if (typeof window.matchMedia !== "undefined" || typeof window.msMatchMedia !== "undefined") {
            return true;
        } else {
            return false;
        }
    };
    //#endregion

    // Initializer
    window.gtShowHide = gtShowHide;

    $(document).ready(function () {
        $('[data-gt-showhide="trigger"]').each(function () {
            new window.gtShowHide(this);
        });
    });
}(jQuery));