/*
 * GTAccessControl
 * Purpose of this script is to add classes to the root element so that specific 
 * access attributes set in DotCom Admin will be reflected on the UI
 */
$(document).ready(function () {
    if (window.digitalData && window.digitalData.subscriptionOrdersAccess) {
        var $rootElmt = $('html');

        if (window.digitalData.subscriptionOrdersAccess.accessAllowed === false) {
            $rootElmt
                .removeClass('has-subscription')
                .addClass('no-subscription');
        } else if (window.digitalData.subscriptionOrdersAccess.reasonCode === 'Punchout') {
            $rootElmt
                .removeClass('has-subscription')
                .addClass('no-subscription');
        } else {
            $rootElmt
                .addClass('has-subscription')
                .removeClass('no-subscription');
        }
    }
});