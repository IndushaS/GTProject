// Max perks scripting for the side bar registration

// NOTES:
// 1. "#mp_option2_start" not found in the original HTML


// START NEW JAVASCRIPT
$(function () {
  var $mpSignIn = $('#mp_sign_in'),
    $mpSignedIn = $('#mp_signed_in'),
    $mpError = $('#mp_error'),
    $mpDotcom = $('#mp_is_dotcom_account'),
    $mpInvalidAccount = $('#mp_invalid_account'),
    $mpInvalidPostal = $('#mp_invalid_postal_code'),
    $mpExisting = $('#mp_existing_max_perks_account'),
    $mpNotEligible = $('#mp_max_perks_not_eligible'),
    $mpSystemError = $('#mp_system_error'),
    $mpRefusedAlreadyMember = $('#mp_refused_already_member'),
    $mpRefusedOther = $('#mp_refused_other_reason'),
    $mpSuccess = $('#mp_success'),
    $mpSuccessNew = $('#mp_success_new_user'),
    $mpSucessExisting = $('#mp_success_existing_user'),
    $mp2_2 = $('#mp_option2_step2'),
    $mp1_2 = $('#mp_option1_step2'),
    $mpErrors = $('.mp-sidebar').children('div'),
    // only direct descendant divs
    $mpAction = $('input[name="mp_action]'),
    hideAll = function () {
      $mpErrors.hide();
    },
    $mp2_next = $('#mp_option2_next'),
    $mp2_submit = $('#mp_option2_submit'),
    $mp1_submit = $('#mp_option1_submit'),
    $xml;

  $mpAction.val("check_sign_in");

  // uncomment this when the page is completed
  //  hideAll();

  // pre-populate the form
  var encodedFormDatas = $("form").serialize();
  $.post("/sites/gt/maxperks/application_option2.aspx", {
    dt: encodedFormDatas
  }, function (data) {
    if ($(data).text()) {
      $xml = $(data);
      /*
      possible flags:
      signed_in - TRUE if the user is signed in
      not_signed_in - TRUE if the user is not signed in
      system_error - TRUE if there was a system error
      */
      if ($xml.find("signed_in").text() === "TRUE") {
        hideAll();
        $mpSignedIn.show();
        mp_checkAccountStatusInit();
        return;
      }
      if ($xml.find("not_signed_in").text() === "TRUE") {
        hideAll();
        $mpSignIn.show();
        return;
      }
      if ($xml.find("system_error").text() === "TRUE") {
        hideAll();
        $mpSystemError.show();
        return;
      }
    }
  });

  // setup validation
  var result = true,
    testGeneral = /^(?=[ A-z0-9À-ÿ])(?:[À-ÿ\w\.,\-!"'\/$ ]{0,255})$/,
    // names, addresses, phone numbers, etc
    testPostal = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
    testEmail = /^[A-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    testNum = /^\d+$/; // numbers


  var grValidate = function (err, grTest, val) {
    if (grTest.test(val)) {
      err.hide();
    } else {
      err.show();
      result = false;
    }
  };

  var grConsent = function (consent, err) {
    if (consent.prop('checked')) {
      err.hide();
    } else {
      err.show();
      result = false;
    }
  };

  // validate shipto and postal code
  $mp2_next.click(function (event) {
    event.preventDefault();
    result = true;
    var $shipto = $('#mp_21_shipto').val();
    var $shiptoError = $('#mp_21_shipto__error');
    var $postal = $('#mp_21_postal_code').val();
    var $postalError = $('#mp_21_postal_code__error');

    grValidate($shiptoError, testNum, $shipto);
    grValidate($postalError, testPostal, $postal);

    if (result) {
      $mpAction.val("option2_validate_st_pc");
      var encodedFormDatas = $("form").serialize();
      $.post("/sites/gt/maxperks/application_option2.aspx", {
        dt: encodedFormDatas
      }, function (data) {
        if ($(data).text()) {

          //alert(data);
          //alert($(data).text());
          //alert($data.find( "message" ).text());
          //$xml = $( $.parseXML( $(data).text() ) )

          $xml = $(data);

          /*
          possible flags:
          validation_error - TRUE if field validation failed, message contains the error message
          is_dotcom_account - TRUE if the account is already a registered dotcom account
          invalid_account - TRUE if the account is invalid for dotcom use
          invalid_postal_code - TRUE if incorrect postal code for the given account
          existing_max_perks_account - TRUE if the account is already registered for max perks
          max_perks_not_eligible - TRUE if not eligible for max perks
          validation_passed - TRUE if all validation passed and the next step should be displayed
          system_error - TRUE if there was a system error
          */


          if ($xml.find("validation_error").text() === "TRUE") {
            // error
            hideAll();
            // set error text
            $mpError.text($xml.find("message").text()).show();
            return;
          }
          if ($xml.find("is_dotcom_account").text() === "TRUE") {
            hideAll();
            $mpDotcom.show();
            return;
          }
          if ($xml.find("invalid_account").text() === "TRUE") {
            hideAll();
            $mpInvalidAccount.show();
            return;
          }
          if ($xml.find("invalid_postal_code").text() === "TRUE") {
            hideAll();
            $mpInvalidPostal.show();
            return;
          }
          if ($xml.find("existing_max_perks_account").text() === "TRUE") {
            hideAll();
            $mpExisting.show();
            return;
          }
          if ($xml.find("max_perks_not_eligible").text() === "TRUE") {
            hideAll();
            $mpNotEligible.show();
            return;
          }
          if ($xml.find("system_error").text() === "TRUE") {
            hideAll();
            $mpSystemError.show();
            return;
          }
          if ($xml.find("validation_passed").text() === "TRUE") {
            $('#mp_22_shipto_display').text($('#mp_21_shipto').val());
            // all is well, present the next step
            hideAll();
            $mp2_2.show();
          }
        }
      });

    } else {
      return;
    }

  });

  $mp2_submit.click(function (event) {
    event.preventDefault();
    result = true;

    var $email = $('#mp_22_email').val();
    var $emailError = $('#mp_22_email__error');
    var $firstName = $('#mp_22_first_name').val();
    var $firstNameError = $('#mp_22_first_name__error');
    var $lastName = $('#mp_22_last_name').val();
    var $lastNameError = $('#mp_22_last_name__error');
    var $consent = $('#mp_22_agree');
    var $consentErr = $('#mp_22_agree__error');

    grValidate($emailError, testEmail, $email);
    grValidate($firstNameError, testGeneral, $firstName);
    grValidate($lastNameError, testGeneral, $lastName);
    grConsent($consent, $consentErr);

    if (result) {
      $mpAction.val("option2_submit_request");
      var encodedFormDatas = $("form").serialize();
      $.post("/sites/gt/maxperks/application_option2.aspx", {
        dt: encodedFormDatas
      }, function (data) {
        if ($(data).text()) {

          //alert(data);
          //alert($(data).text());
          //alert($data.find( "message" ).text());

          //$xml = $( $.parseXML( $(data).text() ) )

          $xml = $(data);

          /*
          possible flags:
          validation_error - TRUE if field validation failed, message contains the error message
          refused_by_HFA - TRUE if the max perks request was refused by HFA
          refused_already_member - TRUE if the request was refused becaused the account is already a max perks member
          refused_other_reason - TRUE if the request was refused for some other reason (reason not given by HFA)
          success - TRUE if the request was successful
          success_new_user - TRUE if a new user was created during the setup process
          success_existing_user - TRUE if an existing user was used during the setup process
          system_error - TRUE if there was a system error
          */

          //$message = $xml.find("message");
          //$validation_error = $xml.find( "validation_error" );

          if ($xml.find("validation_error").text() === "TRUE") {
            // error
            hideAll();
            // set error text
            $mpError.text($xml.find("message").text()).show();
            return;
          }

          if ($xml.find("refused_already_member").text() === "TRUE") {
            hideAll();
            $mpRefusedAlreadyMember.show();
            return;
          }

          if ($xml.find("refused_other_reason").text() === "TRUE") {
            hideAll();
            $mpRefusedOther.show();
            return;
          }

          if ($xml.find("system_error").text() === "TRUE") {
            hideAll();
            $mpSystemError.show();
            return;
          }

          if ($xml.find("success_new_user").text() === "TRUE") {
            hideAll();
            $mpSuccessNew.show();
            return;
          }

          if ($xml.find("success_existing_user").text() === "TRUE") {
            hideAll();
            $mpSucessExisting.show();
            return;
          }

        }
      });
    } else {
      return;
    }

  });

  $mp1_submit.click(function (event) {
    event.preventDefault();
    result = true;
    var $consent = $('#mp_12_agree');
    var $consentErr = $('#mp_12_agree__error');

    grConsent($consent, $consentErr);

    if (result) {
      $mpAction.val("option1_submit_request");
      var encodedFormDatas = $("form").serialize();
      $.post("/sites/gt/maxperks/application_option2.aspx", {
        dt: encodedFormDatas
      }, function (data) {
        if ($(data).text()) {

          //alert(data);
          //alert($(data).text());
          //alert($data.find( "message" ).text());

          //$xml = $( $.parseXML( $(data).text() ) )

          $xml = $(data);

          /*
          possible flags:
          validation_error - TRUE if field validation failed, message contains the error message
          refused_by_HFA - TRUE if the max perks request was refused by HFA
          refused_already_member - TRUE if the request was refused becaused the account is already a max perks member
          refused_other_reason - TRUE if the request was refused for some other reason (reason not given by HFA)
          success - TRUE if the request was successful
          system_error - TRUE if there was a system error
          */

          //$message = $xml.find("message");
          //$validation_error = $xml.find( "validation_error" );


          if ($xml.find("validation_error").text() === "TRUE") {
            // error
            hideAll();
            // set error text
            $mpError.text($xml.find("message").text()).show();
            return;
          }
          if ($xml.find("refused_already_member").text() === "TRUE") {
            hideAll();
            $mpRefusedAlreadyMember.show();
            return;
          }
          if ($xml.find("refused_other_reason").text() === "TRUE") {
            hideAll();
            $mpRefusedOther.show();
            return;
          }
          if ($xml.find("system_error").text() === "TRUE") {
            hideAll();
            $mpSystemError.show();
            return;
          }
          if ($xml.find("success").text() === "TRUE") {
            hideAll();
            $mpSuccess.show();
            return;
          }
        }
      });
    } else {
      return;
    }
  });

  var mp_refreshAccountMessageId = "";
  var mp_statusCheckFreq = 1000;
  var mp_maxRetries = 120; // wait about 2 minutes
  var mp_retryCount = 0;

  function mp_checkAccountStatusInit() {
    $mpAction.val("refresh_account");

    var encodedFormDatas = $("form").serialize();

    $.post("/sites/gt/maxperks/application_option2.aspx", {
      dt: encodedFormDatas
    }, function (data) {
      if ($(data).text()) {
        $xml = $(data);
        mp_refreshAccountMessageId = $xml.find("message_id").text();
        setTimeout(mp_checkMessageStatus, mp_statusCheckFreq);
      }
    });
  }

  function mp_checkMessageStatus() {
    $mpAction.val("check_message_status");
    var encodedFormDatas = $("form").serialize();
    $.post("/sites/gt/maxperks/application_option2.aspx", {
      dt: encodedFormDatas,
      mid: mp_refreshAccountMessageId
    }, function (data) {
      if ($(data).text()) {
        $xml = $(data);
        var statusId = $xml.find("statusid").text();
        //alert(statusId);
        if (statusId === "3" || statusId === "4" || mp_retryCount > mp_maxRetries) {
          // failed, processed or takes too long so let's move on
          mp_getSignedInStatus();
          return;
        }
        // inconclusive status, queue another status check
        setTimeout(mp_checkMessageStatus, mp_statusCheckFreq);
      }
    });
    mp_retryCount++;
  }

  function mp_getSignedInStatus() {
    $mpAction.val("option1_validate_request");
    var encodedFormDatas = $("form").serialize();
    $.post("/sites/gt/maxperks/application_option2.aspx", {
      dt: encodedFormDatas
    }, function (data) {
      if ($(data).text()) {
        $xml = $(data);
        /*
        possible flags:
        refused_already_member - TRUE if the request was refused becaused the account is already a max perks member
        max_perks_not_eligible - TRUE if the account is not max perks eligible
        */
        if ($xml.find("refused_already_member").text() === "TRUE") {
          hideAll();
          $mpRefusedAlreadyMember.show();
          return;
        }
        if ($xml.find("max_perks_not_eligible").text() === "TRUE") {
          hideAll();
          $mpNotEligible.show();
          return;
        }
        if ($xml.find("system_error").text() === "TRUE") {
          hideAll();
          $mpSystemError.show();
          return;
        }
        if ($xml.find("success").text() === "TRUE") {
          $('#mp_12_first_name_label').text($xml.find("first_name").text());
          $('#mp_12_last_name_label').text($xml.find("last_name").text());
          $('#mp_12_email_label').text($xml.find("email").text());
          $('#mp_12_shipto_label').text($xml.find("shipto").text());
          // all is well, present the next step
          hideAll();
          $mp1_2.show();
        }
      }
    });
  }
});


