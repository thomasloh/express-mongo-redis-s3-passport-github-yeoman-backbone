// Home
define(['text!_page.html'], function(page_template) {

  // View Store
  var current_view = (function() {

    var _current;

    return {

      set: function(view) {
        // Flush existing
        if (_current) {
          _current.remove();
        };
        // Set as current
        _current = view;
      },

      get: function() {
        return current_view;
      }

    }
    
  }());

  var Page = Backbone.View.extend({

    id: 'Page',
    template: _.template(page_template),
    initialize: function(opts) {

      // precaution
      opts || (opts = {})

      // grab selector
      this.selector = opts.selector;

      // active view tracker
      this._current = current_view;

      // Attach this layout upon creation
      this.attach();      
    },

    // Append this layout
    attach: function() {
      var $main = $(this.selector);
      this.setElement($main);
      $main.append(this.template());
    },

    show: function(view) {
      this._current.set(view);
      // Put transition animation here
      this.$('#container').empty().append(view.html());
      // Event bindings, if any
      if (view.model) {
        rivets.bind(view.$el, {profile: view.model});
      };
      // Any postShows
      view.postShow();
    }

  });

  return Page;

});