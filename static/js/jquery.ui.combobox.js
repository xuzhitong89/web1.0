
(function($) {
    $.widget("ui.combobox", {
        _create: function() {
            var self = this,
            select = this.element.hide(),
            selected = select.children(":selected"),
            value = selected.val() ? selected.text() : "",
            input = select.next("input");
            var options = this.options;
            
            input.val(value).autocomplete({
                disabled: options.disableAutocomplete,
                delay: 0,
                minLength: 0,
                source: function(request, response) {
                    var matcher = new RegExp($.ui.autocomplete.escapeRegex(request.term), "i");
                    response(select.find("option").map(function() {
                        var text = $(this).text();
                        var style = $(this).css('background-color');
                        if (this.value && (!request.term || matcher.test(text)))
                            return {
                                label: text.replace(
                                    new RegExp(
                                        "(?![^&;]+;)(?!<[^<>]*)(" +
                                        $.ui.autocomplete.escapeRegex(request.term) +
                                        ")(?![^<>]*>)(?![^&;]+;)", "gi"
                                        ), "<strong>$1</strong>" ),
                                value: text,
                                style: style,
                                option: this
                            };
                    }));
                },
                select: function(event, ui) {
                    var item = ui.item
                    item.option.selected = true;
                    self._trigger("selected", event, {
                        item: item.option
                    });
                    eval(options.onSelect);
                },
                change: function(event, ui) {
                    if (!ui.item) {
                        if (!options.allowText) {
                            var matcher = new RegExp("^" + $.ui.autocomplete.escapeRegex($(this).val() ) + "$", "i"),
                            valid = false;
                            select.children("option").each(function() {
                                if ($(this).text().match(matcher)) {
                                    this.selected = valid = true;
                                    return false;
                                }
                            });
                            if ( !valid ) {
                                // remove invalid value, as it didn't match anything
                                $( this ).val( "" );
                                select.val( "" );
                                input.data( "autocomplete" ).term = "";
                                return false;
                            }
                        }
                        eval(options.onChange);
                    }
                },
                close: function(event, ui) {
                    input.autocomplete({ disabled: options.disableAutocomplete });
                    eval(options.onClose);
                }
            })
            .css({
                "float":"left"
            })

            input.data("autocomplete")._renderItem = function(ul, item) {
                if($(item.option).parent("optgroup").length > 0)
                    if( typeof this.currentGroup == "undefined" ) {
                        this.currentGroup = "";
                    }
                if(this.currentGroup != $(item.option).parent().attr('label'))
                {
                    this.currentGroup = $(item.option).parent().attr('label');
                    $("<li><b><i>" + this.currentGroup + "</i></b></li>").appendTo(ul);
                }
                return $("<li></li>")
                .data("item.autocomplete", item)
                .append(options.showStyle?"<a style='margin-left:1px; border-left: 5px solid " 
                    + item.style + "'>" + item.label + "</a>":"<a>" + item.label + "</a>")
                .appendTo(ul);
            };

            this.button = $('<button>&nbsp;</button>')
            .attr("tabIndex", -1 )
            .attr("title", "Show All Items")
            .button({
                    icons: {
                        primary: "ui-icon-triangle-1-s"
                    },
                    text: false
                })
            .insertAfter(input)
            .click(function() {
                // close if already visible
                input.autocomplete({ disabled: false });
                if (input.autocomplete("widget").is(":visible")) {
                    input.autocomplete("close");
                    return false;
                }
                // work around a bug (likely same cause as #5265)
                $(this).blur();
                // pass empty string as value to search for, displaying all results
                input.autocomplete("search", "");
                input.focus();
                return false;
            })
            .removeClass("ui-corner-all")
            .addClass("ui-corner-right ui-button-icon combobox-toggle-btn")
            .css({
                "left": "-26px",
                "width": "26px",
                "height": "26px",
                "position": "relative"
            });
            
            if($.browser.msie) {
                this.button.css({
                    "height": "25px"
                })
            }
            
            input.parent().css({
                "white-space": "nowrap"
            })
        },
        destroy: function() {
            this.input.remove();
            this.button.remove();
            this.element.show();
            $.Widget.prototype.destroy.call(this);
        }
    });
})(jQuery);
