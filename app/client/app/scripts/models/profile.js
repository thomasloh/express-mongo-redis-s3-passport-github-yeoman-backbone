define([], function() {
  var Profile = Backbone.Model.extend({
    idAttribute: '_id'
  });
  return Profile;
});