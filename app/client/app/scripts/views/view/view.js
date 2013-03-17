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
      'keyup .interest-desc'          : 'e_pre_add_interest'
    },

    initialize: function(opts) {
      BaseView.prototype.initialize.apply(this, arguments);
    },

    postShow: function() {

      // $el caches
      this.$minimal     = this.$('.profile.minimal');
      this.$detailed    = this.$('.profile.detailed');
      this.$d_btn       = this.$('.view-mode .detailed'); 
      this.$m_btn       = this.$('.view-mode .minimal');
      this.$overlay     = this.$('.background .overlay');
      this.$edit_p      = this.$('.edit-panel');
      this.$view_mode   = this.$('.view-mode');
      this.$theme       = this.$('.theme');
      this.$profile     = this.$('.profile');
      this.$D_btn       = this.$('.theme .dark'); 
      this.$L_btn       = this.$('.theme .light');

      // Get model
      this.model.fetch();
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
      switch (mode) {
        case 'light':
          this.$view_mode.removeClass('dark').addClass('light');
          this.$profile.removeClass('dark').addClass('light');
          this.$theme.removeClass('dark').addClass('light');
          this.$overlay.removeClass('dark').addClass('light');
          this.$edit_p.removeClass('dark').addClass('light');
          // Toggle view mode setting
          this.$D_btn.removeClass('active');
          this.$L_btn.addClass('active');

          break;
        case 'dark':
          this.$view_mode.removeClass('light').addClass('dark');
          this.$profile.removeClass('light').addClass('dark');
          this.$theme.removeClass('light').addClass('dark');
          this.$overlay.removeClass('light').addClass('dark');
          this.$edit_p.removeClass('light').addClass('dark');
          // Toggle view mode setting
          this.$L_btn.removeClass('active');
          this.$D_btn.addClass('active');
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
      this.display('light');
    },

    e_dark: function() {
      this.display('dark');
    },

    e_edit: function() {
      // Manage views
      this.$('.model-view').removeClass('model-view').addClass('model-edit');

      // Manage btn views
      this.$('.icon-ok').show();
      this.$('.icon-edit').hide();
    },

    e_ok: function() {
      // Save to server
      this.model.save();

      // Manage views
      this.$('.model-edit').removeClass('model-edit').addClass('model-view');
      
      // Manage btn views
      this.$('.icon-ok').hide();
      this.$('.icon-edit').show();
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
    }

  });

  return View;

});

















