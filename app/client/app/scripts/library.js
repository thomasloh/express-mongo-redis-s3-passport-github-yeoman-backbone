define([
  'backbone',
  'rivets',
  'foundation',
  'jquery_transition',
  'jquery_waypoints_sticky'
], function() {
  // Settings

  $(function() {
    // underscore
    // _.templateSettings = {
    //   interpolate : /\{\{(.+?)\}\}/g
    // };

    // foundation
    $(document).foundation();

    // rivets
    rivets.configure({
      prefix: 'dp',
      adapter: {
        subscribe: function(obj, keypath, callback) {
          obj.on('change:' + keypath, callback);
        },
        unsubscribe: function(obj, keypath, callback) {
          obj.off('change:' + keypath, callback);
        },
        read: function(obj, keypath) {
          var paths = keypath.match(/\./);
          if (paths && paths.length) {
            paths = keypath.split('.');
            var eval_string = 'obj.get(paths[0])' + _.reduce(paths.slice(1), function(i, o){return i + '[\"' + o + '\"]'}, '');
            return eval(eval_string);
          } else {
            return obj.get(keypath);
          }
        },
        publish: function(obj, keypath, value) {
          if (obj instanceof Backbone.Model) {
            obj.set(keypath, value);
          } else {
            obj[keypath] = value;
          }
        }
      }
    });

    rivets.binders.src = function(el, value) {
      value = value.replace('?', '?s=320');
      el.src = value;
    }

    rivets.formatters.link = function(v) {
      return '//' + v;
    }

  })

});







