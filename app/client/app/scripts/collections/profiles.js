define(['profile'], function(Profile) {
  var Profiles = Backbone.Collection.extend({
    model: Profile,
    initialize: function(models, opts) {
      // precaution
      opts || (opts = {})

      // set url
      this.url = opts.api_root + '/p';
    },
    retrieve: function(id) {
      var model = this.get(id);
      if (!model) {
        this.add({id: id});
        model = this.get(id);
      };
      return model;
    }
  });
  return Profiles;
});