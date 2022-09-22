$.widget("custom.fontSelectMenu", $.ui.selectmenu, {
    _renderItem: function (ul, item) {
        const li = $("<li>");

        const div = $("<div>");
        div.role = 'option';
        div.text(item.label);
        div.css('font-family', item.value);

        div.appendTo(li);

        return li.appendTo(ul);
    },
    _renderButtonItem: function( item ) {
        var buttonItem = $( "<span>" );

        this._setText( buttonItem, item.label );
        this._addClass( buttonItem, "ui-selectmenu-text" );
        buttonItem.css('font-family', item.value);

        return buttonItem;
    },
});
