// View
define(['_base_view', 'text!view.html'], function(BaseView, view_template) {

  var View = BaseView.extend({

    id: 'view',

    template: _.template(view_template),

    events: {
      'click .view-mode .minimal'     : 'e_minimal',
      'click .view-mode .detailed'    : 'e_detailed',
      'click .theme .light'           : 'e_light',
      'click .theme .dark'            : 'e_dark',
      'click .edit-panel .icon-edit'  : 'e_edit',
      'click .edit-panel .icon-ok'    : 'e_ok',
      'click .add-exp'                : 'e_add_exp',
      'click .del-exp'                : 'e_del_exp',
      'keyup .pos'                    : 'e_pre_add_exp',
      'keyup .com'                    : 'e_pre_add_exp',
      'click .add-proj'               : 'e_add_proj',
      'click .del-proj'               : 'e_del_proj',
      'keyup .proj-name'              : 'e_pre_add_proj',
      'keyup .proj-desc'              : 'e_pre_add_proj',
      'click .add-interest'           : 'e_add_interest',
      'click .del-interest'           : 'e_del_interest',
      'keyup .interest-name'          : 'e_pre_add_interest',
      'keyup .interest-desc'          : 'e_pre_add_interest',
      'keyup .edit-existing-exp'      : 'e_edit_existing_exp',
      'keyup .edit-existing-proj'     : 'e_edit_existing_proj',
      'keyup .edit-existing-interest' : 'e_edit_existing_interest',
      'click .chg-bg'                 : 'e_change_bg',
      'click .chg-prof-pic'           : 'e_change_profile_pic'
    },

    initialize: function(opts) {
      BaseView.prototype.initialize.apply(this, arguments);
    },

    load: function(cb) {
      this.model.fetch({
        success: function() {
          cb();
        }
      });
    },

    postShow: function() {

      // $el caches
      this.$minimal     = this.$('.profile.minimal');
      this.$detailed    = this.$('.profile.detailed');
      this.$d_btn       = this.$('.view-mode .detailed');
      this.$m_btn       = this.$('.view-mode .minimal');
      this.$overlay     = this.$('.background .overlay');
      this.$edit_p      = this.$('.edit-panel');
      this.$home        = this.$('.home');
      this.$view_mode   = this.$('.view-mode');
      this.$theme       = this.$('.theme');
      this.$bg          = this.$('.change-bg');
      this.$profile     = this.$('.profile');
      this.$D_btn       = this.$('.theme .dark');
      this.$L_btn       = this.$('.theme .light');


      // Mediations
      this.$('input#change-bg').change(function(e) {

        // Request creds
        var _file = $("input#change-bg").val().replace(/.+[\\\/]/, "");

        $.ajax({
          url: "/s3/cred/bg/" + _file,
          success: function(cred) {
            $("#redir").val(cred.s3Redirect);
            $("#sig").val(cred.s3Signature);
            $("#policy").val(cred.s3PolicyBase64);
            $("#awskey").val(cred.s3Key);
            $("#aws-upload").submit();
          }
        });

      });

      this.$('input#change-profile-pic').change(function(e) {

        // Request creds
        var _file = $("input#change-profile-pic").val().replace(/.+[\\\/]/, "");

        $.ajax({
          url: "/s3/cred/profile/" + _file,
          success: function(cred) {
            $("#redir-p").val(cred.s3Redirect);
            $("#sig-p").val(cred.s3Signature);
            $("#policy-p").val(cred.s3PolicyBase64);
            $("#awskey-p").val(cred.s3Key);
            $("#aws-upload-profile-pic").submit();
          }
        });

      });
    },

    serialize: function() {
      return {
        email     : this.model.get('email'),
        theme     : this.model.get('theme'),
        loggedIn  : this.auth.get('loggedIn'),
        bg        : this.model.get('bg') || '/images/ggb.png'
      }
    },

    show: function($el) {
      $el.show().transition({
        opacity: 1
      }, 500);
    },

    hide: function($el) {
      $el.transition({
        opacity: 0
      }, 500).hide();
    },

    display: function(mode) {
      var _this = this;
      switch (mode) {
        case 'light':
          this.$view_mode.removeClass('dark').addClass('light');
          this.$profile.removeClass('dark').addClass('light');
          this.$theme.removeClass('dark').addClass('light');
          this.$edit_p.removeClass('dark').addClass('light');
          this.$home.removeClass('dark').addClass('light');
          this.$bg.removeClass('dark').addClass('light');
          // Toggle view mode setting
          this.$D_btn.removeClass('active');
          this.$L_btn.addClass('active');
          _this.$overlay.removeClass('dark');
          _this.$overlay.addClass('light');
          break;
        case 'dark':
          this.$view_mode.removeClass('light').addClass('dark');
          this.$profile.removeClass('light').addClass('dark');
          this.$theme.removeClass('light').addClass('dark');
          this.$edit_p.removeClass('light').addClass('dark');
          this.$home.removeClass('light').addClass('dark');
          this.$bg.removeClass('light').addClass('dark');
          // Toggle view mode setting
          this.$L_btn.removeClass('active');
          this.$D_btn.addClass('active');
          _this.$overlay.removeClass('light');
          _this.$overlay.addClass('dark');
          break;
      }
    },

    e_minimal: function(e) {

      // Manage displays
      this.show(this.$minimal);
      this.hide(this.$detailed);

      // Toggle view mode setting
      this.$d_btn.removeClass('active');
      this.$m_btn.addClass('active');
    },

    e_detailed: function(e) {

      // Manage displays
      this.show(this.$detailed);
      this.hide(this.$minimal);

      // Toggle view mode setting
      this.$m_btn.removeClass('active');
      this.$d_btn.addClass('active');
    },

    e_light: function() {
      this.model.set('theme', 'light');
      this.model.save();
      this.display('light');
    },

    e_dark: function() {
      this.model.set('theme', 'dark');
      this.model.save();
      this.display('dark');
    },

    e_edit: function() {
      // Manage views
      this.$('.model-view').removeClass('model-view').addClass('model-edit');

      // Manage btn views
      this.$('.icon-ok').show();
      this.$('.edit-ok').show().css('display', 'block');
      this.$('.icon-edit').hide();
      this.$('.editing').hide();

      // change to detailed mode
      this.e_detailed();

      // Bindings
      var $experiences = this.$('fieldset.experiences');
    },

    e_ok: function() {
      // Save to server
      this.model.save();

      // Manage views
      this.$('.model-edit').removeClass('model-edit').addClass('model-view');

      // Manage btn views
      this.$('.icon-ok').hide();
      this.$('.icon-edit').show();
      this.$('.editing').show();
      this.$('.edit-ok').hide();

      this.model.set('role', (this.model.get('position') ? this.model.get('position') + ', ' : '') + this.model.get('company'));

    },

    e_pre_add_exp: function(e) {
      if (e.which === 13) {
        this.e_add_exp();
        return;
      };
      return;
    },

    e_add_exp: function(e) {

      // Grab el
      var $pos, $com, pos, com;
      $pos = this.$('.pos');
      $com = this.$('.com');

      // Grab val
      pos = $pos.val();
      com = $com.val();

      // Validations
      if (!pos || !com) return;

      // Add to model
      var exp = {
        position: pos,
        company : com
      };
      var exps = this.model.get('experiences');
      if (!exps) {
        exps = [];
      };
      exps.push(exp);
      this.model.set('experiences', exps);
      this.model.trigger('change:experiences');

      // Clear input
      $pos.val('').focus();
      $com.val('');

    },

    e_del_exp: function(e) {
      var m = {
        company : $(e.currentTarget).attr('company'),
        position: $(e.currentTarget).attr('position')
      };

      var exps = _.reject(this.model.get('experiences'), function(o) {
        return o.position === m.position && o.company === m.company;
      })

      this.model.set('experiences', exps);
      this.model.trigger('change:experiences');
    },

    e_pre_add_proj: function(e) {
      if (e.which === 13) {
        this.e_add_proj();
        return;
      };
      return;
    },

    e_add_proj: function(e) {

      // Grab el
      var $name, $desc, name, desc;
      $name = this.$('.proj-name');
      $desc = this.$('.proj-desc');

      // Grab val
      name = $name.val();
      desc = $desc.val();

      // Validations
      if (!name || !desc) return;

      // Add to model
      var proj = {
        name: name,
        desc: desc
      };
      var projs = this.model.get('projects');
      if (!projs) {
        projs = [];
      };
      projs.push(proj);
      this.model.set('projects', projs);
      this.model.trigger('change:projects');

      // Clear input
      $name.val('').focus();
      $desc.val('');

    },

    e_del_proj: function(e) {
      var m = {
        name : $(e.currentTarget).attr('name'),
        desc: $(e.currentTarget).attr('desc')
      };

      var projs = _.reject(this.model.get('projects'), function(o) {
        return o.desc === m.desc && o.name === m.name;
      })

      this.model.set('projects', projs);
      this.model.trigger('change:projects');
    },

    e_pre_add_interest: function(e) {
      if (e.which === 13) {
        this.e_add_interest();
        return;
      };
      return;
    },

    e_add_interest: function(e) {

      // Grab el
      var $name, name;
      $name = this.$('.interest-name');

      // Grab val
      name = $name.val();

      // Validations
      if (!name) return;

      // Add to model
      var interest = {
        name: name
      };
      var interests = this.model.get('interests');
      if (!interests) {
        interests = [];
      };
      interests.push(interest);
      this.model.set('interests', interests);
      this.model.trigger('change:interests');

      // Clear input
      $name.val('').focus();
    },

    e_del_interest: function(e) {
      var m = {
        name : $(e.currentTarget).attr('name')
      };

      var interests = _.reject(this.model.get('interests'), function(o) {
        return o.name === m.name;
      })

      this.model.set('interests', interests);
      this.model.trigger('change:interests');
    },

    e_edit_existing_exp: function(e) {
      // update model
      var value = e.currentTarget.value,
          exp   = {
            position: $(e.currentTarget).attr('position'),
            company: $(e.currentTarget).attr('company')
          },
          key   = $(e.currentTarget).attr('edit-field'),
          exps  = this.model.get('experiences');

      _.each(exps, function(m) {
        if (m.position === exp.position && m.company === exp.company) {
          m[key] = value;
        };
      })

      // update view
      this.model.set('experiences', exps);
      this.model.trigger('change:experiences');
    },

    e_edit_existing_proj: function(e) {
      // update model
      var value = e.currentTarget.value,
          proj   = {
            name: $(e.currentTarget).attr('name'),
            desc: $(e.currentTarget).attr('desc')
          },
          key   = $(e.currentTarget).attr('edit-field'),
          exps  = this.model.get('projects');

      _.each(exps, function(m) {
        if (m.name === proj.name && m.desc === proj.desc) {
          m[key] = value;
        };
      })

      // update view
      this.model.set('projects', exps);
      this.model.trigger('change:projects');
    },

    e_edit_existing_interest: function(e) {
      // update model
      var value = e.currentTarget.value,
          interest   = {
            name: $(e.currentTarget).attr('name')
          },
          key   = $(e.currentTarget).attr('edit-field'),
          interests  = this.model.get('interests');

      _.each(interests, function(m) {
        if (m.name === interest.name) {
          m[key] = value;
        };
      })

      // update view
      this.model.set('interests', interests);
      this.model.trigger('change:interests');
    },

    e_change_bg: function() {
      this.$('#change-bg').click();
    },

    e_change_profile_pic: function() {
      this.$('#change-profile-pic').click();
    }

  });

  return View;

});

















