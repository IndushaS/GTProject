/*
 * Client functionality for the Envoicing/Statement page
 */
(function ($) {
    'use strict';

    //#region Invoice Table Component
    var statementTableComponent = function () {
        this.$el = $(this.Selectors.MainTable);

        this.Initialize();
    };

    statementTableComponent.prototype = {
        $el: null
        , CommandBarComponent: null
        , TableRows: []
        , Selectors: {
            MainTable: '[data-gt-table="table"]'
            , TableRow: '[data-gt-table="row"]'
            , BtnSelectAll: '[data-gt-table="selectAll"]'
        }
        , ErroMsg: {
            UnloadWhenSelected: 'gt-table-error-msg-unload-when-selected'
        }
        , TotalItemsSelected: 0
    };

    statementTableComponent.prototype.Options = {
        TotalItemsSelectedOnOtherPages: 0
        , TotalItems: 0
    };

    statementTableComponent.prototype.Initialize = function () {
        if (this.$el.length === 1) {
            var that = this;

            this.CommandBarComponent = new commandBarComponent();

            this.CommandBarComponent.SetNumberSelected(this.TotalItemsSelected);

            $(this.Selectors.TableRow, this.$el).each(function () {
                var row = new tableRowComponent(this);

                row.Subscribe_Click($.proxy(that.Row_Click, that));

                row.Initialize();

                that.TableRows.push(row);
            });

            $(this.Selectors.BtnSelectAll, this.$el)
                .on('click', $.proxy(this.SelectAll_Click, this));

            $(window).on('beforeunload', $.proxy(this.Window_Beforeunload, this));

            this.SetSelectALLBtnState();
        }
    };

    statementTableComponent.prototype.SetSelectALLBtnState = function () {
        /// <summary>
        /// Checks if all rows are selected on the table and checks the Select All box
        /// if all rows are selected. Un-checks it if not all rows are selected
        /// </summary>
        if (this.IsAllRowsSelected()) {
            $(this.Selectors.BtnSelectAll, this.$el).prop('checked', true);
        } else {
            $(this.Selectors.BtnSelectAll, this.$el).prop('checked', false);
        }
    };

    statementTableComponent.prototype.IsAllRowsSelected = function () {
        return this.TotalItemsSelected === this.TableRows.length;
    };

    statementTableComponent.prototype.Window_Beforeunload = function (e) {
        /// <summary>
        /// Warns the user when leaving the page if they have items selected
        /// </summary>
        if (this.TotalItemsSelected !== 0) {
            var errorMessage = this.$el.data(this.ErroMsg.UnloadWhenSelected);

            (e || window.event).returnValue = errorMessage;

            return errorMessage;
        } else {
            return undefined;
        }
    };

    statementTableComponent.prototype.SelectAll_Click = function () {
        if ($(this.Selectors.BtnSelectAll, this.$elmt).is(':checked')) {
            $(this.TableRows).each(function () {
                this.Select();
            });
        } else {
            $(this.TableRows).each(function () {
                this.Deselect();
            });
        }

        this.CommandBarComponent.SetNumberSelected(this.TotalItemsSelected);
    };

    statementTableComponent.prototype.Row_Click = function (isSelected) {
        if (isSelected) {
            this.TotalItemsSelected += 1;
        } else {
            this.TotalItemsSelected -= 1;
        }

        this.CommandBarComponent.SetNumberSelected(this.TotalItemsSelected);

        this.SetSelectALLBtnState();
    };
    //#endregion

    //#region Command Bar Component
    var commandBarComponent = function () {
        this.$elmt = $(this.Selectors.CommandBar);
        this.$elmt_ContainerItemSelected = $(this.Selectors.CmdsContainer_ItemSelected, this.$elmt);
        this.$elmt_ContainerNothingSelected = $(this.Selectors.CmdsContainer_NothingSelected, this.$elmt);
    };

    commandBarComponent.prototype = {
        $elmt: null
        , $elmt_ContainerItemSelected: null
        , $elmt_ContainerNothingSelected: null
        , Selectors: {
            CommandBar: '[data-gt-table="commandbar"]'
            , CmdsContainer_ItemSelected: '[data-gt-table="commandsSomethingSelected"]'
            , CmdsContainer_NothingSelected: '[data-gt-table="commandsNothingSelected"]'
            , TextNumberSelected: '[data-gt-table="numberSelected"]'
        }
    };

    commandBarComponent.prototype.SetNumberSelected = function (numSelected) {
        /// <param name="numSelected" type="int">
        /// Specifies the amount of items selected
        /// </param>
        var $textElmt = $(this.Selectors.TextNumberSelected, this.$elmt);
        var selectedText = $textElmt.text();

        if (numSelected && numSelected > 0) {
            this.$elmt_ContainerItemSelected.fadeIn('fast');
            this.$elmt_ContainerNothingSelected.fadeOut(0);
        } else {
            this.$elmt_ContainerItemSelected.fadeOut(0);
            this.$elmt_ContainerNothingSelected.fadeIn('fast');
        }

        selectedText = selectedText.replace(/^[\\n\s]*\d+\s/, numSelected + ' ');

        $textElmt.text(selectedText);
    };
    //#endregion

    //#region Table Row Component
    var tableRowComponent = function (elmt) {
        /// <summary>
        /// Represents a single row on the table
        /// </summary>
        /// <param name="elmt" type="DOM Element">
        /// HTML element representing the row
        /// </param>
        this.$elmt = $(elmt);
        this.ClickHandlers = [];
    }

    tableRowComponent.prototype = {
        $elmt: null
        , Selectors: {
            BtnSelect: '[data-gt-table="selectRow"]'
        }
        , StylingClasses: {
            SelectedClass: 'table-statement_row--selected'
        }
        , ClickHandlers: []
        , Subscribe_Click: function (fn) {
            this.ClickHandlers.push(fn);
        }
        , Unsubscribe_Click: function (fn) {
            this.ClickHandlers = this.ClickHandlers.filter(
                function (item) {
                    if (item !== fn) {
                        return item;
                    }
                }
            );
        }
    };

    tableRowComponent.prototype.Initialize = function () {
        if (this.$elmt) {
            $(this.Selectors.BtnSelect, this.$elmt)
                .on('click', $.proxy(this.SelectRow_Click, this));

            // If the checkbox is checked on load update state
            var isSelected = this.IsSelected();
            if (isSelected) {
                this.SetState('selected');

                this.SelectRow_FireClickEvent(isSelected);
            }
        }
    };

    tableRowComponent.prototype.SetState = function (state) {
        switch (state) {
            case 'selected':
                this.$elmt.addClass(this.StylingClasses.SelectedClass);
                break;
            default:
                this.$elmt.removeClass(this.StylingClasses.SelectedClass);
                break;
        }
    };

    tableRowComponent.prototype.IsSelected = function () {
        return $(this.Selectors.BtnSelect, this.$elmt).is(':checked');
    };

    tableRowComponent.prototype.Select = function () {
        if (this.IsSelected() === false) {
            $(this.Selectors.BtnSelect, this.$elmt).click();
        }
    };

    tableRowComponent.prototype.Deselect = function () {
        if (this.IsSelected() === true) {
            $(this.Selectors.BtnSelect, this.$elmt).click();
        }
    }

    tableRowComponent.prototype.SelectRow_Click = function () {
        var isSelected = false;

        if (this.IsSelected() === true) {
            this.SetState('selected');

            isSelected = true;
        } else {
            this.SetState('notSelected');

            isSelected = false;
        }

        this.SelectRow_FireClickEvent(isSelected);
    };

    tableRowComponent.prototype.SelectRow_FireClickEvent = function (isSelected) {
        $(this.ClickHandlers).each(function () {
            this.call(this, isSelected);
        });
    };
    //#endregion

    window.StatementTableComponent = statementTableComponent;
}(jQuery));