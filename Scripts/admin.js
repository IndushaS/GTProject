/*Administrator pages support scripts*/

function bindControlValueEditor() {

    // edit control value name selector
    $("select.prg-ecv-name-selector").unbind("change");
    $("select.prg-ecv-name-selector").change(function (e) {

        var selectedId = $("option:selected", this).attr("value");

        $(".prg_cva_details").hide();

        if (selectedId != "") {
            $("#" + selectedId).show();
        }

        //var priceElement = $("#" + this.id.replace("uom_", "amt_"));

        //priceElement.html($("option:selected", this).attr("dp"));

        filterControlValues(selectedId, "", false);
    });

    // control values name selector
    $("select.prg-cv-name-selector").unbind("change");
    $("select.prg-cv-name-selector").change(function (e) {
        var selectedName = $("option:selected", $("select.prg-cv-name-selector")).attr("value");
        var selectedGroup = $("option:selected", $("select.prg-cv-group-selector")).attr("value");

        filterControlValues(selectedName, selectedGroup, true);
    });

    $("select.prg-cv-group-selector").unbind("change");
    $("select.prg-cv-group-selector").change(function (e) {
        var selectedName = $("option:selected", $("select.prg-cv-name-selector")).attr("value");
        var selectedGroup = $("option:selected", $("select.prg-cv-group-selector")).attr("value");

        filterControlValues(selectedName, selectedGroup, true);
    });

}


$(function () {

    bindControlValueEditor();

});

function filterControlValues(name, group, editable) {
    // retrieve the control values
    $.ajax({
        type: "POST",
        url: "/Administrator/FilterControlValues",
        data: { controlValuelName: name, controlValueGroup: group, editable: editable }
    })
        .done(function (result) {
            var controlValues = $(result.controlValues).html();

            if (controlValues === undefined) {
                controlValues = "";
            }

            $(".control-values").html(controlValues);

        })
        .fail(function (result) {
            console.log(result);
        });

}