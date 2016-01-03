// Heart plugin (https://github.com/dobtco/heart)
var __slice = [].slice;

(function($, window) {
  var Heart;

  Heart = (function() {
    Heart.prototype.defaults = {
      rating: void 0,
      numHearts: 1,
      change: function(e, value) {}
    };

    function Heart($el, options) {
      var i, _, _ref,
        _this = this;

      this.options = $.extend({}, this.defaults, options);
      this.$el = $el;
      _ref = this.defaults;
      for (i in _ref) {
        _ = _ref[i];
        if (this.$el.data(i) != null) {
          this.options[i] = this.$el.data(i);
        }
      }
      this.createHearts();
      this.syncHeartRating();
      this.$el.on('mouseover.heart', 'span', function(e) {
        return _this.syncHeartRating(_this.$el.find('span').index(e.currentTarget) + 1);
      });
      this.$el.on('mouseout.heart', function() {
        return _this.syncHeartRating();
      });
      this.$el.on('click.heart', 'span', function(e) {
        return _this.setHeartRating(_this.$el.find('span').index(e.currentTarget) + 1);
      });
      this.$el.on('heart:change', this.options.change);
    }

    Heart.prototype.createHearts = function() {
      var _i, _ref, _results;

      _results = [];
      for (_i = 1, _ref = this.options.numHearts; 1 <= _ref ? _i <= _ref : _i >= _ref; 1 <= _ref ? _i++ : _i--) {
        _results.push(this.$el.append("<span class='glyphicon .glyphicon-heart-empty'></span>"));
      }
      return _results;
    };

    Heart.prototype.setHeartRating = function(rating) {
      if (this.options.rating === rating) {
        rating = void 0;
      }
      this.options.rating = rating;
      this.syncHeartRating();
      return this.$el.trigger('heart:change', rating);
    };

    Heart.prototype.syncHeartRating = function(rating) {
      var i, _i, _j, _ref;

      rating || (rating = this.options.rating);
      if (rating) {
        for (i = _i = 0, _ref = rating - 1; 0 <= _ref ? _i <= _ref : _i >= _ref; i = 0 <= _ref ? ++_i : --_i) {
          this.$el.find('span').eq(i).removeClass('glyphicon-heart-empty').addClass('glyphicon-heart');
        }
      }
      if (rating && rating < 5) {
        for (i = _j = rating; rating <= 4 ? _j <= 4 : _j >= 4; i = rating <= 4 ? ++_j : --_j) {
          this.$el.find('span').eq(i).removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
        }
      }
      if (!rating) {
        return this.$el.find('span').removeClass('glyphicon-heart').addClass('glyphicon-heart-empty');
      }
    };

    return Heart;

  })();
  return $.fn.extend({
    heart: function() {
      var args, option;

      option = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
      return this.each(function() {
        var data;

        data = $(this).data('heart-rating');
        if (!data) {
          $(this).data('heart-rating', (data = new Heart($(this), option)));
        }
        if (typeof option === 'string') {
          return data[option].apply(data, args);
        }
      });
    }
  });
})(window.jQuery, window);

$(function() {
  return $(".heart").heart();
});

$( document ).ready(function() {
      
  $('#hearts').on('heart:change', function(e, value){
    $('#count').html(value);
  });
  
  $('#hearts-existing').on('heart:change', function(e, value){
    $('#count-existing').html(value);
  });
});