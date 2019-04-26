$(function() {
  
  var $submit = $('.cms-validate__submit');
  
  // remove this if there is no language option
  $submit.cmsFormLanguage();
  
  // remove this if there is no date option
  $submit.cmsFormDate();
  
  $submit.on('click', function(e) {
    // first, stop the button from doing anything
    e.preventDefault();
    
    // validate the form
    if ($(this).cmsFormValidate()) {
      alert("yay!");
    } else {return;}
    
  });
});

