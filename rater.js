// product.liquid
// <input type="hidden" id="product_id" value="{{ product.id }}">
  
$.fn.rater = function(options) {
    var opts = $.extend({}, $.fn.rater.defaults, options);
    return this.each(function() {
        var $this = $(this);
        var $on = $('.ui-rater-starsOn');
        var $off = $('.ui-rater-starsOff');
        opts.size = $on.height();
        if (opts.rating == undefined) opts.rating = $on.width() / opts.size;
        if (opts.id == undefined) opts.id = $this.attr('id');

        $off.mousemove(function(e) {
            var left = e.clientX - $off.offset().left;
            var width = $off.width() - ($off.width() - left);
            width = Math.ceil(width / (opts.size / opts.step)) * opts.size / opts.step;
            $on.width(width);
        }).hover(function(e) { $on.addClass('ui-rater-starsHover'); }, function(e) {
            $on.removeClass('ui-rater-starsHover'); $on.width(opts.rating * opts.size);
        }).click(function(e) {
            var r = Math.round($on.width() / $off.width() * (opts.units * opts.step)) / opts.step;
            $off.unbind('click').unbind('mousemove').unbind('mouseenter').unbind('mouseleave');
            $off.css('cursor', 'default'); $on.css('cursor', 'default');
            $.fn.rater.rate($this, opts, r);
        }).css('cursor', 'pointer'); $on.css('cursor', 'pointer');
    });
};

$.fn.rater.defaults = {
    postHref: location.href,
    units: 5,
    step: 1
};

$.fn.rater.rate = function($this, opts, rating) {
 
    var $on = $this.find('.ui-rater-starsOn');
    var $off = $this.find('.ui-rater-starsOff');
    $off.fadeTo(600, 0.4, function() {
        $.ajax({
            url: opts.postHref,
            type: "POST",
            data: {rate: rating, product_id: $("#product_id").val() },
          
            success: function(reponse) {

                opts.rating = reponse.rating;
                console.log(reponse)
                    
                $off.fadeTo(600, 0.1, function() {
                  $on.removeClass('ui-rater-starsHover').width(opts.rating * opts.size);
                  var $count = $this.find('.ui-rater-rateCount');
                  $count.text(parseInt($count.text()) + 1);
                  $this.find('.ui-rater-rating').text(opts.rating);
                  $off.fadeTo(600, 1);
                  $this.attr('title', 'Pontuação Média: ' + opts.rating);
                });

                ga('send', 'event', 'button', 'click', 'review do produto '+$("#product_reference").val()+'', opts.rating);
          
             },
            error: function(req) { //failure
                opts.rating = reponse.rating;
                alert(reponse.responseText);
                $on.removeClass('ui-rater-starsHover').width(opts.rating * opts.size);
                $this.rater(opts);
                $off.fadeTo(2200, 1);
            }
          
        });
    });
};
