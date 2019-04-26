/*
 * GGCreditCard - v0.1.0 - 2017-09-12
 * Grand and Toy credit card control
 */
(function ($) {
    'use strict';

    //#region Constructors
    var ggCreditCard = function (elmt) {
        /// <summary>
        /// Default constructor to initialize Grand & Toy Credit Card
        /// functionality
        /// </summary>
        /// <param name="elmt" type="DOM Element">
        /// The container of the Credit Card Control
        /// </param>
        this.Elmt = elmt;
        this.$elmt = $(elmt);
        this.Initialize();

        return this;
    };
    //#endregion

    //#region Properties
    ggCreditCard.prototype = {
        Elmt: null
        , $elmt: null
        // Different states for cards
        , StateClasses: {
            Default: 'creditCard--default'
            , Edit: 'creditCard--edit'
            , EditInvalid: 'creditCard-editInvalid'
            , DefaultAdd: 'creditCard-add--default'
            , Add: 'creditCard-add--new'
            , AddInvalid: 'creditCard-add--newInvalid'
        }
        // Used for selectors
        , Tags: {
            InnerContainer: '[data-gg-creditcard="inner"]'
            , SummaryInfoContainer: '[data-gg-creditcard="summary"]'
            , EditContainer: '[data-gg-creditcard="edit"]'
            , AddContainer: '[data-gg-creditcard="add"]'
        }
    };
    //#endregion

    //#region Event Handlers
    ggCreditCard.prototype.Elmt_KeyDown = function (evt) {
        if (evt.keyCode === 13) {
            if ($(this.Tags.EditContainer, this.$elmt).size() !== 0) {
                this.BtnUpdate_Click();

            } else if ($(this.Tags.AddContainer, this.$elmt).size() !== 0) {
                this.BtnAddCard_Click();
            }
        }
    };

    ggCreditCard.prototype.BtnEdit_Click = function () {
        this.SetState('edit');
       
        $('input', this.$elmt).first().focus();

        this.ClearValidation();

        return false;
    };

    ggCreditCard.prototype.BtnDelete_Click = function () {
        var that = this;

        var  cardID = $('input[name="CardID"]', this.$elmt).val();
       
        var currentElement = this.$elmt;
        var thatElement = that.$elmt;

        var confirmMsg = $("#creditCardConfirmationMsg").text();
        if (confirm(confirmMsg)) {
            var data = { CardID: cardID };

            $.post("/Account/DeleteCard", data, function(result){
       
                if (result.success)
                {
                    currentElement.fadeOut('slow', function () {
                        thatElement.remove();
                    });

                }
                else {
                    alert(result.message);
                }
            
            } ); // $.proxy(that.Update_Success, that)).done(function (result) {
                        
                     
           // });
        }

        return false;
    };

    ggCreditCard.prototype.BtnUpdate_Click = function () {
        var that = this;
        var returnval = false;
        var windowUrl = $("#CardWindowsLocation").text(); 

        var IsNameOnCardValid = $('input[name="NameOnCard"]', this.$elmt).valid();
        var IsCVVValid = $('input[name="CVV"]', this.$elmt).valid();
        var IsYearValid = $('select[name="ExpiryYear"]', this.$elmt).valid();
        var IsMonthValid = $('select[name="ExpiryMonth"]', this.$elmt).valid();

        if (IsNameOnCardValid && IsCVVValid && IsYearValid && IsMonthValid) {
            var data = {
              CardID: $('input[name="CardID"]', this.$elmt).val()
            , CardNumber: $('[data-gg-creditcard="number"]', this.$elmt).text()
            , Description: $('input[name="Description"]', this.$elmt).val()
            , NameOnCard: $('input[name="NameOnCard"]', this.$elmt).val()
            , ExpiryMonth: parseInt($('select[name="ExpiryMonth"]', this.$elmt).val())
            , ExpiryYear: parseInt($('select[name="ExpiryYear"]', this.$elmt).val())
            , CVV: $('input[name="CVV"]', this.$elmt).val()
            , IsPreferredCard: $('input[name="IsPreferredCard"]', this.$elmt).is(':checked')
            };

            $.post("/Account/UpdateCard", data, function (result) {
                if (result.success) {
                    window.location.href = windowUrl;
                    returnval = true;
                }
                else {
                    alert(result.message);
                }

            });//$.proxy(that.Update_Success, that));


            return returnval;
        }
        else
        {
            this.SetState('editInvalid');

            return false;
        }

       
    };

    ggCreditCard.prototype.BtnCancel_Click = function () {
        this.SetState('default');
        this.ClearValidation();

        return false;
    };

    ggCreditCard.prototype.BtnNew_Click = function () {
        /// <summary>
        /// Event handler to make add new card form appear
        /// </summary>
        $('input', this.$elmt).first().focus();

        this.SetState('new');

        return false;
    };

    ggCreditCard.prototype.BtnAddCard_Click = function () {
        /// <summary>
        /// Event handler to submit new card
        /// </summary>
        var that = this;
        var windowUrl = $("#CardWindowsLocation").text();  //"/account/managecreditcards";
        var returnval = false;
        var $addForm = $('[data-gg-creditcard="add"]', this.$elmt);
        var IsCardNumValid = $('input[name="CardNumber"]', $addForm).valid();
        var IsNameOnCardValid = $('input[name="NameOnCard"]', $addForm).valid();
        var IsCvvValid = $('input[name="CVV"]', $addForm).valid();
        var aggreeMentMsg = $("#credtidCardAggreementMsg").text();
        var IsAggreementChecked = $('input[name="AgreeToLegal"]', $addForm).is(':checked');
        var IsMonthValid = $('select[name="ExpiryMonth"]', $addForm).valid();
        var IsYearValid = $('select[name="ExpiryYear"]', $addForm).valid();
        var cardNumber = $('input[name="CardNumber"]', $addForm).val();

        if (IsCardNumValid && IsNameOnCardValid && IsCvvValid && IsAggreementChecked && IsMonthValid & IsYearValid)
        {
            var data = {
                CardNumber: cardNumber
                , Description: $('input[name="Description"]', $addForm).val()
                , NameOnCard: $('input[name="NameOnCard"]', $addForm).val()
                , ExpiryMonth: parseInt($('select[name="ExpiryMonth"]', $addForm).val())
                , ExpiryYear: parseInt($('select.AddExpiryYear', $addForm).val())
                , CVV: $('input[name="CVV"]', $addForm).val()
                , IsPreferredCard: $('input[name="IsPreferredCard"]', $addForm).is(':checked')
                , AgreeToLegal: IsAggreementChecked
             };

            $.post("/Account/AddCard", data, function (result) {

                if (result.success) {
                    returnval = true;
                    window.location.href = windowUrl + '?saved='
                        + cardNumber.substring(cardNumber.length - 4, cardNumber.length);
                }
                else {
                    returnval = false;
                    alert(result.message);
                }

            }); //$.proxy(that.Add_Success, that)).done(function (result) {
                //alert("success");
         //   });

            return returnval;
        }
        else
        {
            if (!IsAggreementChecked)
            {
                alert(aggreeMentMsg);
           
            }

            this.SetState('newInvalid');

            return false;
        }

    };

    ggCreditCard.prototype.BtnCancelAdd_Click = function () {
        this.ClearAddForm();
        this.SetState('defaultAdd');
        this.ClearValidation();

        return false;
    };

    ggCreditCard.prototype.BtnCVV_Click = function () {
        var $popoverElmt = $('[data-gg-creditcard="popoverCVV"]', this.$elmt);

        if ($popoverElmt.css('display') === 'block') {
            $('.creditCard', this.$elmt).removeClass('creditCard--popupVisible');

            $popoverElmt.hide('fast');
        } else {
            $('.creditCard', this.$elmt).addClass('creditCard--popupVisible');

            $popoverElmt.show('fast');
        }

        return false;
    };

    ggCreditCard.prototype.PopoverCVV_MouseLeave = function () {
        $('.creditCard', this.$elmt).removeClass('creditCard--popupVisible');

        $('[data-gg-creditcard="popoverCVV"]', this.$elmt).hide('fast');
    };

    ggCreditCard.prototype.Add_Success = function (addedMarkup) {
        var $newElmt = $(addedMarkup);

        $newElmt.eq(0).hide();

        $($newElmt).insertBefore(this.$elmt);

        $newElmt.eq(0).slideDown('slow');

        new ggCreditCard($newElmt.get(0));

        this.ClearAddForm();

        this.SetState('defaultAdd');
    };

    ggCreditCard.prototype.Update_Success = function (updatedMarkup) {
        /// <summary>
        /// Event handler when successful update
        /// functionality
        /// </summary>
        /// <param name="updatedMarkup" type="string">
        /// Updated markup for the credit card control
        /// </param>
        $('[data-gg-creditcard="summaryDesc"]', this.$elmt).text(
            $('input[name="Description"]', this.$elmt).val()
        );

        $('[data-gg-creditcard="summaryExpiry"]', this.$elmt).text(
            $('select[name="ExpiryMonth"]', this.$elmt).val() + '/'
            + $('select[name="ExpiryYear"]', this.$elmt).val()
        );

        if ($('input[name="IsPreferredCard"]', this.$elmt).is(':checked')) {
            $('[data-gg-creditcard="summaryPreferred"]', this.$elmt).show();
        }
        else {
            $('[data-gg-creditcard="summaryPreferred"]', this.$elmt).hide();
        }

        this.SetState('default');
    };
    //#endregion

    //#region Methods
    ggCreditCard.prototype.Initialize = function () {
        /// <summary>
        /// Command function - hooks up event handlers
        /// </summary>
        this.$elmt.on('keydown', $.proxy(this.Elmt_KeyDown, this));
        $('[data-gg-creditcard="btnEdit"]', this.$elmt).on('click', $.proxy(this.BtnEdit_Click, this));
        $('[data-gg-creditcard="btnCancel"]', this.$elmt).on('click', $.proxy(this.BtnCancel_Click, this));
        $('[data-gg-creditcard="btnUpdate"]', this.$elmt).on('click', $.proxy(this.BtnUpdate_Click, this));
        $('[data-gg-creditcard="btnDelete"]', this.$elmt).on('click', $.proxy(this.BtnDelete_Click, this));
        $('[data-gg-creditcard="btnNew"]', this.$elmt).on('click', $.proxy(this.BtnNew_Click, this));
        $('[data-gg-creditcard="btnCancelAdd"]', this.$elmt).on('click', $.proxy(this.BtnCancelAdd_Click, this));
        $('[data-gg-creditcard="btnAddCard"]', this.$elmt).on('click', $.proxy(this.BtnAddCard_Click, this));
        $('[data-gg-creditcard="popoverCVVTrigger"]', this.$elmt).on('click', $.proxy(this.BtnCVV_Click, this));
        $('[data-gg-creditcard="popoverCVVContainer"]', this.$elmt).on('mouseleave', $.proxy(this.PopoverCVV_MouseLeave, this));
    };

    ggCreditCard.prototype.ClearAddForm = function () {
        var $addForm = $('[data-gg-creditcard="add"]', this.$elmt);

        $('input', $addForm).each(function () {
            $(this).val('');
        });

        $('select', $addForm).each(function () {
            $(this)[0].selectedIndex = 0;
        });
    };

    ggCreditCard.prototype.ClearValidation = function () {

        // Remove all validation summary text regardless of which card you are in.
        // This is because an error message on one card appears on the summary of other cards
        $('.field-validation-error').empty();

        // Remove validation styling on input elements for all cards only that have this error set by other update button without adding any value to the field that is been validated
        $('.input-validation-error').each(function () {
            $(this).removeClass('input-validation-error');
        });
    };

    ggCreditCard.prototype.SetState = function (state) {
        var that = this;
        var $innerContainer = $(this.Tags.InnerContainer, this.$elmt);

        // Revert all to default state
        $('.' + this.StateClasses.Edit).each(function () {
            $(this)
                .removeClass(that.StateClasses.Edit)
                .addClass(that.StateClasses.Default);
        });

        $('.' + this.StateClasses.EditInvalid).each(function () {
            $(this)
                .removeClass(that.StateClasses.EditInvalid)
                .addClass(that.StateClasses.Default);
        });

        $('.' + this.StateClasses.Add).each(function () {
            $(this)
                .removeClass(that.StateClasses.Add)
                .addClass(that.StateClasses.DefaultAdd);
        });

        $('.' + this.StateClasses.AddInvalid).each(function () {
            $(this)
                .removeClass(that.StateClasses.AddInvalid)
                .addClass(that.StateClasses.DefaultAdd);
        });

        switch (state) {
            case 'edit':
                $innerContainer
                    .removeClass(this.StateClasses.Default)
                    .removeClass(this.StateClasses.EditInvalid)
                    .addClass(this.StateClasses.Edit);
                break;
            case 'editInvalid':
                $innerContainer
                    .removeClass(this.StateClasses.Default)
                    .addClass(this.StateClasses.EditInvalid)
                    .removeClass(this.StateClasses.Edit);
                break;
            case 'default':
                $innerContainer
                    .removeClass(this.StateClasses.Edit)
                    .removeClass(this.StateClasses.EditInvalid)
                    .addClass(this.StateClasses.Default);
                break;
            case 'new':
                $innerContainer
                    .removeClass(this.StateClasses.DefaultAdd)
                    .removeClass(this.StateClasses.AddInvalid)
                    .addClass(this.StateClasses.Add);
                break;
            case 'newInvalid':
                $innerContainer
                    .removeClass(this.StateClasses.DefaultAdd)
                    .addClass(this.StateClasses.AddInvalid)
                    .removeClass(this.StateClasses.Add);
                break;
            case 'defaultAdd':
                $innerContainer
                    .removeClass(this.StateClasses.Add)
                    .removeClass(this.StateClasses.AddInvalid)
                    .addClass(this.StateClasses.DefaultAdd);
                break;
        }
    };
    //#endregion

    // Initializer
    $(document).ready(function () {
        var gtCreditCards = [];

        $('[data-gg-creditcard="container"]').each(function () {
            gtCreditCards.push(new ggCreditCard(this));
        });

        $('[data-gg-creditcard="btnNewHeader"]').click(function () {
            $('body').scrollTo($('#pnlAddCard'), 300, {
                onAfter: function () {
                    gtCreditCards[gtCreditCards.length - 1].BtnNew_Click();
                }
            });

            return false;
        });
    });
}(jQuery));