
//$(document).ready(function(){
//$("form").data("validator").settings.ignore = ".data-val-ignore, :hidden, :disabled";
//});

$.validator.addMethod('notfedgovemail', function (value, element, params) {
    var regexStr = $(element).attr('data-val-notfedgovemail-regex');
    var regexVal = new RegExp(regexStr);

    if (regexVal.test(value)) {
        return false;
    } else {
        return true;
    }
});

$.validator.unobtrusive.adapters.add('notfedgovemail', {}, function (options) {
    options.rules['notfedgovemail'] = options.params;
    options.messages['notfedgovemail'] = options.message;
});

$.validator.addMethod('requiredif', function (value, element, params) {

    var isChecked = false;

    if ($(params).is("input[type=checkbox]"))
    {
        isChecked = $(params).is(':checked');
    }

    if ($(params).is("input[type=hidden]")) {
        if ($(params).val() == "True")
        {
            isChecked = true;
        }        
    }

    if (isChecked) {
        if (element.value.trim().length == 0) {
            return false;
        }
    }

    return true;
}, '');

$.validator.unobtrusive.adapters.add('requiredif', ['param'], function (options) {
    options.rules["requiredif"] = '#' + options.params.param;
    options.messages['requiredif'] = options.message;
});

$.validator.addMethod('enforcetrue', function (value, element) {
    return $(element).is(":checked");
});

$.validator.unobtrusive.adapters.add('enforcetrue', [], function (options) {
    options.messages['enforcetrue'] = options.message;
    options.rules['enforcetrue'] = options.params;
});