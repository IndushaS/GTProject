// Temp Script
$(document).ready(function () {

    if ($("#SelectCreditCard").length == 1 && $("#CVVCardNumber").length == 1)
    {
        var selectedCardText = $("#SelectCreditCard").find('option:selected').text();

        var selectedValue = $("#SelectCreditCard").val();

        $("#CVVCardNumber").val(selectedCardText);

        $("#CVVAddExpiryMonth").val(selectedValue);

        $("#CVVAddExpiryYear").val(selectedValue);

    }
    

    $("#SelectCreditCard").change(function () {
        var selectedText = $(this).find('option:selected').text();
        var selectedValue = $(this).val();

        $("#CVVCardNumber").val(selectedText);

        $("#CVVAddExpiryMonth").val(selectedValue);

        $("#CVVAddExpiryYear").val(selectedValue);

    });

    $('[data-gg-popup="container"]').each(function () {
        $("input[name='BillMethod']").change(function () {
            var $container = $(this).parents('[data-gg-popup="container"]');
            var $visiblePopup = $('[data-gg-popup="expand"]:visible');

            if ($container.size() > 0 && $visiblePopup.size() > 0) {
                $visiblePopup.stop().hide(0, function () {
                    $('[data-gg-popup="expand"]', $container).show(0);
                });
            } else if ($container.size() > 0) {
                $('[data-gg-popup="expand"]', $container).stop().show(0);
            } else {
                $visiblePopup.stop().hide(0);
            }

            // Show CVV for new credit card if alternate address is specified
            if ($(this).val() == 'MyWallet') {

                var isAlternateAddressAvailable = $("#HiddenFields_AlternateAddressesRequiresCvvValidation").val() == "True";
                if (isAlternateAddressAvailable)
                {
                    $("#IsAlternateAddressAvailable").val("True");

                }
                else
                {
                    $("#IsAlternateAddressAvailable").val("False");
                }

                var hasAlternateAddress =  $("#IsAlternateAddressAvailable").val() == "True";

                if (hasAlternateAddress) {
                    $('[data-gg-popup="expandCVV"] > div').show();
                    $('[data-gg-popup="expandCVV"]').show(0);
                   

                }
            } else {
                $('[data-gg-popup="expandCVV"] > div').hide(0);
                $('[data-gg-popup="expandCVV"]').hide(0);
                $("#AlternatAddressCVVNumber").val("");
            }
        });
    });

    $('[data-gg-creditcard="popoverCVVTrigger"]').click(function () {
        var $popoverElmt = $('[data-gg-creditcard="popoverCVV"]');

        if ($popoverElmt.css('display') === 'block') {
            $('.creditCard').removeClass('creditCard--popupVisible');

            $popoverElmt.hide('fast');
        } else {
            $('.creditCard').addClass('creditCard--popupVisible');

            $popoverElmt.show('fast');
        }

        return false;
    });

    $('[data-gg-creditcard="popoverCVVContainer"]').on('mouseleave', function () {
        $('.creditCard').removeClass('creditCard--popupVisible');

        $('[data-gg-creditcard="popoverCVV"]').hide('fast');
    });

    $('#btnAddCardCancel').click(function (evt) {
        evt.preventDefault();

        var hasAlternateAddress =
            $('[data-gg-creditcard="alternateShippingAddress"]').css('display') === 'block';

        if (hasAlternateAddress) {
            $('[data-gg-popup="expandCVV"] > div').show(0);
            $('[data-gg-popup="expandCVV"]').show(0);
        }

        $('[data-gg-popup="expand"] .popup-content--alternate').fadeOut(0, function () {
            $('[data-gg-popup="expand"] .popup-content').fadeIn(0);
        });
    });
});