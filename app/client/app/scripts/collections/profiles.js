define(['profile'], function(Profile) {
  var Profiles = Backbone.Collection.extend({
    model: Profile,
    initialize: function(models, opts) {
      // precaution
      opts || (opts = {})

      // api root
      this.api_root = opts.api_root;

      // set url
      this.url = opts.api_root + '/p';
    },
    retrieve: function(json) {
      var model;
      if (json.id) {
        model = this.get(json.id);
      } else {
        model = this.where(json)[0];
      }
      if (!model && !json.id) {
        this.add(json);
        model = this.where(json)[0];
      };
      return model;
    }
  });
  return Profiles;
});