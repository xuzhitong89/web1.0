(function($) {  
    $.fn.MassPicker = function(options) {
        var opts = $.extend({}, $.fn.MassPicker.defaults, options);
        return this.each(function() {    
            $this = $(this);
            $this.attr('readonly', 'readonly');
            $target = $(this).prev("select");
            $target.hide();
            $this.click(function(){
                opts.click();
            })
        });  
    };  

    $.fn.MassPicker.defaults = {
        click:{}
    };
})(jQuery);