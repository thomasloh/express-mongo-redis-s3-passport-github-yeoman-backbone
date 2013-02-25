// View
define(['_base_view', 'text!view.html'], function(BaseView, view_template) {

  var View = BaseView.extend({

    id: 'view',

    template: _.template(view_template),

    initialize: function(opts) {
      BaseView.prototype.initialize.apply(this, arguments);
    },

    postShow: function() {
      var _this = this;
      // Get model
      this.model.fetch({
        success: function() {
        }
      });
    }

  });

  return View;

});