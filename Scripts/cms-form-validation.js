//$.fn.cmsFormDate = function () {
//  // populate hidden date fields
//  var d = new Date(),
//    mm = d.getMonth() + 1,
//    dd = d.getDate(),
//    yyyy = d.getFullYear();
//  mm = (mm < 10) ? '0' + mm : mm;
//  dd = (dd < 10) ? '0' + dd : dd;
//  var $date = mm + '/' + dd + '/' + yyyy;
//  $(this).closest('.cms-validate__form').find('.cms-validate__date').val($date);
//};

$.fn.cmsFormLanguage = function () {
  // populate the language field
  // based on the language of the page
  var formLang = $(this).closest('.cms-validate__form').find('.cms-validate__language');
  var pageLang = $('html').attr('lang');
  if (formLang.length) {
    formLang.filter('[value="' + pageLang + '"]').prop('checked', true);
  } else {}
};

$.fn.cmsFormValidate = function () {
  var $input, $val,
    testGeneral = /^(?=[ A-z0-9À-ÿ])(?:[À-ÿ\w\.,\-!"'\/$ ]{0,255})$/,
    // names, addresses, phone numbers, etc. Basically whitelisting safe characters.
    testPostal = /^[ABCEGHJKLMNPRSTVXY]\d[ABCEGHJKLMNPRSTVWXYZ]( )?\d[ABCEGHJKLMNPRSTVWXYZ]\d$/i,
    testEmail = /^[A-z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
    testNum = /^(\s*|\d+)$/, // numbers or blank
    $form = $(this).closest('.cms-validate__form'),
    $inputs = $form.find('.cms-validate__general,.cms-validate__email,.cms-validate__postal,.cms-validate__number,.cms-validate__select'),
    $radioCheckbox = $form.find('.cms-validate__radio,.cms-validate__checkbox'),
    result = true,
    validClass = 'cms-validate__valid',
    invalidClass = 'cms-validate__invalid',
    wrapperClass = '.cms-validate__wrapper',
    inputError = function (input) {
      input.closest(wrapperClass).addClass(invalidClass).removeClass(validClass);
      result = false;
    },
    inputValid = function (input) {
      input.closest(wrapperClass).removeClass(invalidClass).addClass(validClass);
    };
  
  // remove classes from previous validation attempts
  $form.find('.' + invalidClass).removeClass(invalidClass);
  $form.find('.' + validClass).removeClass(validClass);
  
  // check each input
  for (var i = 0; i < $inputs.length; i++) {
    $input = $inputs.eq(i);
    $val = $input.val();

    // if input is required and not empty...
    if ($input.is("[required]") && ($val === "" || $val === " ")) {
      inputError($input);
    } else if ($val !== "" && $val !== " ") {
      // otherwise if the field is not empty, run a test.
      // no specific test is needed for select elements.
      if ($input.hasClass('cms-validate__general') && !testGeneral.test($val)) {
        inputError($input);
      } else if ($input.hasClass('cms-validate__email') && !testEmail.test($val)) {
        inputError($input);
      } else if ($input.hasClass('cms-validate__postal') && !testPostal.test($val)) {
        inputError($input);
      } else if ($input.hasClass('cms-validate__num') && !testNum.test($val)) {
        inputError($input);
      } else {
        // if the field has content *and* passes the tests,
        // result remains true
        inputValid($input);
      }
    } else {
      // if the field is empty and not required,
      // result remains true
      inputValid($input);
    }
  }
  
  // validating radio buttons & checkboxes
  var $name, $fieldset, $this, $wrapper;
  for (var n = 0; n < $radioCheckbox.length; n++) {
    $this = $radioCheckbox.eq(n);
    // check if this input or the input's fieldset has already been validated
    $wrapper = $this.closest(wrapperClass);
    if (!$wrapper.hasClass(invalidClass) && !$wrapper.hasClass(validClass)) {
      // if it hasn't been evaluated,
      // get all the inputs with the same name 
      $name = $this.attr('name');
      $fieldset = $radioCheckbox.filter('[name="' + $name + '"]');
      // if the first input has a required attribute,
      // and NONE of the inputs in the fieldset are checked
      if ($fieldset.eq(0).is('[required]') && $fieldset.filter(':checked').length === 0) {
        inputError($this);
      } else {
        // if the input is required and an input is checked
        // if the input isn't required and no inputs are checked
        // if the input isn't required and an input is checked
        inputValid($this);
      }
    } else {}
  }

  return result;

};


// @codekit-prepend "cms-forms/_cmsformdate.js", "cms-forms/_cmsformlanguage.js","cms-forms/_cmsformvalidate.js";
$(function () {
  $('.cms-validate__submit').on('click', function () {
    alert('clicked!');
    if ($(this).cmsFormValidate()) {
      alert("true");
    } else {
      alert("false");
    }
  });
});


