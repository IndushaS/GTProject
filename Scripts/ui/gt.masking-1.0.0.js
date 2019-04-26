/*
 * GTMask - v1.0.0 - 2017-08-21
 * Grand and Toy masking functionality based on 
 * the Politespace by Filament Group concept https://github.com/filamentgroup/politespace
 */

/// <summary>
/// How to Use:
/// Add data-gt-mask attribute to an input field and the mask you want to use.
/// Example <input id="CreditCard" name="CreditCard" type="text" data-gt-mask="creditcard">
/// </summary>
(function ($) {
    'use strict';

    //#region Constructors
    var gtMasking = function (elmt) {
        /// <summary>
        /// Default constructor to initialize Grand & Toy Masking
        /// functionality
        /// </summary>
        /// <param name="elmt" type="DOM Element">
        /// The form element the masking should be applied to
        /// </param>
        if (!elmt) {
            throw new Error('argumentnullexception - no element has been specified');
        }

        this.Elmt = elmt;
        this.$elmt = $(elmt);
        this.Initialize();
    };
    //#endregion

    //#region Properties
    gtMasking.prototype = {
        Elmt: null
        , $elmt: null
        , $labelElmt: null
        // MaskType based on property Formats
        , MaskType: null
    };

    /// <notes>
    /// All types defined must be lower case
    /// </notes>
    gtMasking.prototype.Formats = {
        'phone': {
            Placeholder: '(___) ___-____'
            , RegularExpression: /\d+/g
            , OnEvaluatingValue: function (values, formattedValue) {
                /// <summary>
                /// Event handler which applies custom logic before
                /// a value is evaluated
                /// </summary>
                /// <param name="values" type="Array">
                /// The value in the input field split by character and
                /// stored in array
                /// </param>
                /// <param name="formattedValue" type="Array">
                /// The formatted value that will appear in the input field
                /// </param>
                /// <returns type="string">
                /// The updated formatted value
                /// </returns>
                if (values.length !== 0 && values[0] === '1') {
                    formattedValue += values.shift() + ' ';
                }

                return formattedValue;
            }
            , OnEvaluatedValue: function (values, formattedValue) {
                /// <summary>
                /// Event handler which applies custom logic before
                /// after a value is evaluated
                /// </summary>
                /// <param name="values" type="Array">
                /// The value in the input field split by character and
                /// stored in array
                /// </param>
                /// <param name="formattedValue" type="Array">
                /// The formatted value that will appear in the input field
                /// </param>
                /// <returns type="string">
                /// The updated formatted value
                /// </returns>

                return formattedValue;
            }
        }
        , 'creditcard': {
            Placeholder: '____ ____ ____ ____'
            , RegularExpression: /\d+/g
        }
        , 'postalcode': {
            Placeholder: '___ ___'
            , RegularExpression: /^([a-zA-Z]\d[a-zA-Z]\d[a-zA-Z]\d)?$/g
        }
    };
    //#endregion

    //#region Event Handlers
    gtMasking.prototype.Elmt_Blur = function () {
        var $labelMaskElmt = $('#labelMask', this.$labelElmt);

        $labelMaskElmt.remove();

        this.$elmt.val(this.GetValidValue_FormatShortForm());
    };

    gtMasking.prototype.Elmt_KeyUp = function () {
        if (this.$labelElmt && this.$labelElmt.length === 1) {
            var $labelMaskElmt = $('#labelMask', this.$labelElmt);

            $labelMaskElmt.text(this.GetValidValue_LongFormat());
        }
    };

    gtMasking.prototype.Elmt_Focus = function () {
        this.$labelElmt = $('label[for="' + this.$elmt.attr('id') + '"]');

        if (this.$labelElmt.length === 1) {
            var $labelMaskElmt = $('#labelMask', this.$labelElmt);

            if ($labelMaskElmt.length === 0) {
                $labelMaskElmt = $('<span></span>', {
                    'id': 'labelMask'
                    , 'style': 'display: inline-block; padding-left: 10px; color: #555; font-size: 0.9em'
                });

                this.$labelElmt.append($labelMaskElmt);
            }
        }
    };
    //#endregion

    //#region Methods
    gtMasking.prototype.Initialize = function () {
        /// <summary>
        /// Contains all method calls to properly setup the functionality
        /// </summary>
        var validMaskValue = this.SetMaskType();

        if (validMaskValue) {
            this.SetupPlaceholder();
            this.SetupEventHandlers();
        }
    };

    gtMasking.prototype.SetMaskType = function () {
        /// <summary>
        /// Stores the mask type specified in the element for future reference
        /// </summary>
        /// <returns type="boolean">
        /// Returns true if the element has a valid mask type. False otherwise
        /// </returns>
        var type = this.$elmt.data('gt-mask');

        if (type && this.Formats[type.toLowerCase()]) {
            this.MaskType = this.Formats[type.toLowerCase()];

            return true;
        } else {
            return false;
        }
    };

    gtMasking.prototype.SetupPlaceholder = function () {
        /// <summary>
        /// Set's up placeholder attribute on the element
        /// </summary>
        this.$elmt.attr('placeholder', this.MaskType.Placeholder);
    };

    gtMasking.prototype.SetupEventHandlers = function () {
        this.$elmt
            .on('blur', $.proxy(this.Elmt_Blur, this))
            .on('keyup', $.proxy(this.Elmt_KeyUp, this))
            .on('focus', $.proxy(this.Elmt_Focus, this));
    };

    gtMasking.prototype.IsValueValid = function () {
        /// <returns type="boolean">
        /// Returns true if the value in the input element is valid based 
        /// on the mask type set on the element.
        /// False otherwise
        /// </returns>
        var value = this.$elmt.val();
        var result = this.MaskType.RegularExpression.test(value);

        return result;
    };

    gtMasking.prototype.GetValidValue = function () {
        /// <summary>
        /// Retrieves the value from the input element and returns the valid values
        /// based on the MaskType.RegularExpression
        /// </summary>
        var value = this.$elmt.val();
        var validValues = value.match(this.MaskType.RegularExpression);

        return validValues === null ? '' : validValues.join('');
    };

    gtMasking.prototype.GetValidValue_FormatShortForm = function () {
        /// <summary>
        /// Formats the value in the input element to the format specified in the placeholder property.
        /// This will remove any trailing placeholders
        /// </summary>
        var formattedValue = this.GetValidValue_LongFormat();

        if (formattedValue !== '') {
            var lastValidValue = formattedValue.match(this.MaskType.RegularExpression).join('');

            lastValidValue = lastValidValue.substr(lastValidValue.length - 1);

            var indexOfLastValidValue = formattedValue.lastIndexOf(lastValidValue);

            return formattedValue.substr(0, indexOfLastValidValue + 1);
        } else {
            return '';
        }
    };

    gtMasking.prototype.GetValidValue_LongFormat = function () {
        /// <summary>
        /// Formats the value in the input element to the format specified in the placeholder property.
        /// This function will return the formatted value plus whatever mask value remains
        /// </summary>
        var formattedValue = '';

        if (this.IsValueValid() === true) {

            var values = this.GetValidValue().split('');

            if (this.MaskType.OnEvaluatingValue) {
                formattedValue = this.MaskType.OnEvaluatingValue(values, formattedValue);
            }

            for (var x = 0; x < this.MaskType.Placeholder.length; x++) {

                var chr = this.MaskType.Placeholder.charAt(x);

                if (values.length === 0) {
                    formattedValue += chr;
                } else if (chr === '_') {
                    formattedValue += values.shift();
                } else {
                    formattedValue += chr;
                }
            }

            if (this.MaskType.OnEvaluatedValue) {
                formattedValue = this.MaskType.OnEvaluatedValue(values, formattedValue);
            }
        }

        return formattedValue;
    };
    //#endregion

    // Initializer
    window.gtMasking = gtMasking;

    $(document).ready(function () {
        $('[data-gt-mask]').each(function () {
            new window.gtMasking(this);
        });
    });
}(jQuery));