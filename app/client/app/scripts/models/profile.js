define([], function() {

  // Experiences
  var Experience = Backbone.Model.extend({});
  var Experiences = Backbone.Collection.extend({
    model: Experience
  });

  // Profile
  // ------------------------------------------------
  var Profile = Backbone.Model.extend({
    idAttribute: '_id',

    initialize: function(opts) {
      opts || (opts = {})

      if (opts.username && !this.id) {
        this.url = this.collection.url + '/u/' + opts.username;
      }
    },

    parse: function(response) {
      // Experiences
      this.experiences = new Experiences(response.experiences);
      // Role
      this.set('role', (response.position ? response.position + ', ' : '') + response.company);
      // return the rest
      return response
    }

  });
  return Profile;
});