// small screens: header/nav

$(function() {
  var $toggle          = $('.site-footer').find($('.nav-toggle')),
      $target,
      $activeEl,
      $activeAttr,
      active           = 'site-footer-nav-active',
      speed            = 'fast';
  
  $toggle.click(function(e) {
    e.preventDefault();
    // prevent anchor tag from going to its URL
    // always give anchor tags a URL in case JS is disabled!
    $toggle = $(this);
    // store the jquery object 'this'
    
    $target = $('#'+$toggle.attr('toggle'));
    // get the dropdown
    
    if($toggle.hasClass(active)) {
      // if this is already active
      $target.slideUp(speed).removeClass(active);
      $toggle.removeClass(active);
    }  else {
      if($('.'+active)) {
        // if something else is active...
        $activeEl = $('.'+active+'[toggle]');
        // get the active link
        $activeAttr = $activeEl.attr('toggle');
        // and its toggle attribute
        $('#'+$activeAttr).slideUp(speed).removeClass(active);
        // remove the dropdown first
        $activeEl.removeClass(active);
      }
      // if this isn't active, make it active
      $target.slideDown(speed).addClass(active);
      $toggle.addClass(active);
    }
  });
});

