$(document).ready(function () {

    /* @preserve
     * jQuery simple and accessible modal window, using ARIA
     * Website: http://a11y.nicolas-hoffmann.net/modal/
     * License MIT: https://github.com/nico3333fr/jquery-accessible-modal-window-aria/blob/master/LICENSE
     * modified to accept video URLs
     */
    // loading modal ------------------------------------------------------------------------------------------------------------

    // init
    var $modals = $('.js-modal'),
      $body = $('body');

    $modals.each(function (index_to_expand) {
        var $this = $(this),
          index_lisible = index_to_expand + 1;

        $this.attr({
            'id': 'label_modal_' + index_lisible
        });

    });

    // jQuery formatted selector to search for focusable items
    var focusableElementsString = "a[href], area[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), iframe, object, embed, *[tabindex], *[contenteditable]";

    // events ------------------
    $body.on('click', '.js-modal', function (event) {
        if ($('#js-modal-page').length === 0) { // just to avoid missing #js-modal-page
            $body.wrapInner('<div id="js-modal-page"></div>');
        }
        var $this = $(this),
          options = $this.data(),
          $modal_starter_id = $this.attr('id'),
          $pending_id = $this.attr('data-pendingorderid'),
          $modal_prefix_classes = typeof options.modalPrefixClass !== 'undefined' ? options.modalPrefixClass + '-' : '',
          modal_content_id = typeof options.modalContentId !== 'undefined' ? options.modalContentId : '',
          $modal_content = $('#' + modal_content_id),
          $modal_close_text = options.modalCloseText || 'X',
          $modal_title = options.modalTitle || '',
          $modal_code,
          $modal_video = options.modalVideo || '',
          $modal_overlay,
          $page = $('#js-modal-page');

        $("#modal-video").find('iframe').attr('src', $modal_video);

        // insert code at the end
        $modal_code = '<dialog id="js-modal" class="' + $modal_prefix_classes + 'modal" role="dialog" aria-labelledby="modal-title" open><div role="document" class="js-modal-inner">';
        $modal_code += '<button id="js-modal-close" class="' + $modal_prefix_classes + 'modal-close btn btn-close-small mb8" data-content-back-id="' + modal_content_id + '" data-focus-back="' + $modal_starter_id + '" title="' + $modal_close_text + '"><span class="' + $modal_prefix_classes + 'modal-close__text">' + $modal_close_text + '</span></button>';
        if ($modal_title !== '') {
            $modal_code += '<h1 id="modal-title" class="' + $modal_prefix_classes + 'modal-title">' + $modal_title + '</h1>';
        }

        $modal_code += '<div id="js-modal-content"></div></div></dialog>';
        $page.after($modal_code).attr('aria-hidden', 'true');
        $modal_content.clone().removeClass("hidden").appendTo('#js-modal-content');
        $body.addClass('no-scroll');

        // add overlay

        $modal_overlay = '<span id="js-modal-overlay" class="' + $modal_prefix_classes + 'modal-overlay" data-background-click="disabled"></span>';

        $($modal_overlay).insertAfter($('#js-modal'));

        $('#js-modal-close').focus();

        if ($this.hasClass('pending-approval-btn')) {
            $("#js-modal").find('.prg-pa-approve').attr('data-orderid', $pending_id);
            $("#js-modal").find('#pending-approval-display-orderid').text($pending_id);
        } else { }

        event.preventDefault();

    });
    // close button and esc key
    $body.on('click', '#js-modal-close, #pending-approval-close', function () {
        var $this = $(this),
          $focus_back = '#' + $this.attr('data-focus-back'),
          $js_modal = $('#js-modal'),
          $js_modal_overlay = $('#js-modal-overlay'),
          $page = $('#js-modal-page'),
          $contents = $page.contents();

        $page.replaceWith($contents);
        $page.removeAttr('aria-hidden');
        $body.removeClass('no-scroll');
        $js_modal.remove();
        $js_modal_overlay.remove();
        $($focus_back).focus();

    })
      .on('click', '#js-modal-overlay', function (event) {
          var $close = $('#js-modal-close');

          event.preventDefault();
          $close.trigger('click');

      })
      .on('keydown', '#js-modal-overlay', function (event) {
          var $close = $('#js-modal-close');

          if (event.keyCode === 13 || event.keyCode === 32) { // space or enter
              event.preventDefault();
              $close.trigger('click');
          }
      })
      .on("keydown", "#js-modal", function (event) {
          var $this = $(this),
            $close = $('#js-modal-close');

          if (event.keyCode === 27) { // esc
              $close.trigger('click');
          }
          if (event.keyCode === 9) { // tab or maj+tab

              // get list of all children elements in given object
              var children = $this.find('*');

              // get list of focusable items
              var focusableItems = children.filter(focusableElementsString).filter(':visible');

              // get currently focused item
              var focusedItem = $(document.activeElement);

              // get the number of focusable items
              var numberOfFocusableItems = focusableItems.length;

              var focusedItemIndex = focusableItems.index(focusedItem);

              if (!event.shiftKey && (focusedItemIndex === numberOfFocusableItems - 1)) {
                  focusableItems.get(0).focus();
                  event.preventDefault();
              }
              if (event.shiftKey && focusedItemIndex === 0) {
                  focusableItems.get(numberOfFocusableItems - 1).focus();
                  event.preventDefault();
              }
          }
      })
      .on("keyup", ":not(#js-modal)", function (event) {
          var $js_modal = $('#js-modal'),
            focusedItem = $(document.activeElement),
            in_jsmodal = focusedItem.parents('#js-modal').length ? true : false,
            $close = $('#js-modal-close');

          if ($js_modal.length && event.keyCode === 9 && in_jsmodal === false) { // tab or maj+tab
              $close.focus();
          }

      })
      .on('focus', '#js-modal-tabindex', function () {
          var $close = $('#js-modal-close');
          $close.focus();
      });

});
