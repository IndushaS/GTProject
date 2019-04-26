/*
 * GT Countdown - v1.0.0 - 2017-10-12
 */
(function ($) {
    'use strict';

    //#region Constructors
    var gtCountdown = function (elmt) {
        /// <summary>
        /// Default constructor to initialize Grand & Toy UI Helpers
        /// </summary>
        /// <param name="elmt" type="DOM Element">
        /// DOM element functionality should be applied to
        /// </param>
        this.Elmt = elmt;
        this.$elmt = $(elmt);
        this.$replaceElmt = $('[data-gt-countdown="replace"]', this.$elmt);

        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtCountdown.prototype = {
        Elmt: null
        , $elmt: null
        , $replaceElmt: null
        , CountdownDate: null
        , Format: {
            Days: '{{day}}&nbsp;DAYS&nbsp;:&nbsp;{{hours}}&nbsp;HRS&nbsp;:&nbsp;{{minutes}}&nbsp;MIN'
            , Seconds: '{{hours}}&nbsp;HRS&nbsp;:&nbsp;{{minutes}}&nbsp;MIN&nbsp;:&nbsp;{{seconds}}&nbsp;SEC'
        }
    };
    //#endregion

    //#region Event Handlers
    //#endregion

    //#region Methods
    gtCountdown.prototype.Initialize = function () {
        this.SetCountdownDate();
        this.AnimateDate();
    };

    gtCountdown.prototype.SetCountdownDate = function () {
        var dateVal = this.$elmt.data('gt-value');

        if (dateVal) {
            this.CountdownDate = new Date(dateVal);
        }
    };

    gtCountdown.prototype.GetDaysRemaining = function () {
        var today = new Date();
        var one_day = 1000 * 60 * 60 * 24;
        var daysRemaining = Math.floor((this.CountdownDate.getTime() - today.getTime()) / one_day);

        return daysRemaining < 0 ? 0 : daysRemaining;
    };

    gtCountdown.prototype.GetHoursRemaining = function () {
        var today = new Date();
        var one_hour = 1000 * 60 * 60;
        var hoursRemaining = Math.floor((this.CountdownDate.getTime() - today.getTime()) / one_hour);

        hoursRemaining = hoursRemaining % 24;

        return hoursRemaining < 0 ? 0 : hoursRemaining;
    };

    gtCountdown.prototype.GetMinutesRemaining = function () {
        var today = new Date();
        var one_minute = 1000 * 60;
        var minutesRemaining = Math.floor((this.CountdownDate.getTime() - today.getTime()) / one_minute);

        minutesRemaining = minutesRemaining % 60;

        return minutesRemaining < 0 ? 0 : minutesRemaining;
    };

    gtCountdown.prototype.GetSecondsRemaining = function () {
        var today = new Date();
        var one_second = 1000;
        var secondsRemaining = Math.floor((this.CountdownDate.getTime() - today.getTime()) / one_second);

        secondsRemaining = secondsRemaining % 60;

        return secondsRemaining < 0 ? 0 : secondsRemaining;
    };

    gtCountdown.prototype.AnimateDate = function () {
        var that = this;
        var showColon = true;

        var updateDate = function () {
            var today = new Date();

            if (that.CountdownDate < today) {
                that.RenderDate(0, 0, 0, 0, showColon);
            } else {
                that.RenderDate(
                    that.GetDaysRemaining()
                    , that.GetHoursRemaining()
                    , that.GetMinutesRemaining()
                    , that.GetSecondsRemaining()
                    , showColon);
            }
        };

        window.setInterval(function () {
            updateDate();

            // Commented out after Ryan mentioned he does not like
            // the colon alternating from space to colon
            //showColon = !showColon;
        }, 1000);

        updateDate();
    };

    gtCountdown.prototype.RenderDate = function (days, hours, minutes, seconds, showColon) {
        /// <summary>
        /// Renders the date on the UI
        /// </summary>
        /// <param name="days" type="Int">
        /// Number of days remaining
        /// </param>
        /// <param name="hours" type="Int">
        /// Number of hours remaining
        /// </param>
        /// <param name="minutes" type="Int">
        /// Number of minutes remaining
        /// </param>
        /// <param name="showColon" type="Boolean">
        /// Flag that indicates whether to show the colon
        /// </param>
        var format = '';

        if (days < 2) {
            hours += days * 24;

            format = this.Format.Seconds;
        } else {
            format = this.Format.Days;
        }

        format = format.replace('{{day}}', days);
        format = format.replace('{{hours}}', hours);
        format = format.replace('{{minutes}}', minutes);
        format = format.replace('{{seconds}}', seconds);

        if (showColon === false) {
            format = format.replace(/:/g, ' ');
        }

        var $replaceElmt = $('[data-gt-countdown="replace"]', this.$elmt);

        if ($replaceElmt.length === 1) {
            $replaceElmt.html(format);
        } else {
            this.$elmt.html(format);
        }
    };
    //#endregion

    // Initializer
    window.gtCountdown = gtCountdown;

    $(document).ready(function () {
        $('[data-gt-countdown="countdown"]').each(function () {
            new window.gtCountdown(this);
        });
    });
}(jQuery));