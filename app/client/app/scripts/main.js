require.config({
    paths: {
        jquery_waypoints_sticky     : '../components/jquery-waypoints/shortcuts/sticky-elements/waypoints-sticky',
        jquery_waypoints            : '../components/jquery-waypoints/waypoints',
        jquery_transition           : '../components/jquery-transition/jquery.transition',
        jquery                      : '../components/jquery/jquery',
        skrollr                     : '../components/skrollr/skrollr',
        backbone                    : '../components/backbone/backbone',
        underscore                  : '../components/underscore/underscore',
        rivets                      : '../components/rivets/lib/rivets',
        text                        : '../components/requirejs-text/text',
        foundation                  : 'vendor/foundation/js/foundation.min',
        zepto                       : 'vendor/foundation/js/vendor/zepto',
        // bootstrap                   : 'vendor/bootstrap',
        router                      : 'logistics/dp-router',
        auth                        : 'logistics/dp-auth',
        _base_view                  : 'views/_base',
        _page                       : 'views/_page/_page',
        home                        : 'views/home/home',
        view                        : 'views/view/view',
        profile                     : 'models/profile',
        profiles                    : 'collections/profiles',
        app                         : 'app'
    },
    shim: {
        // bootstrap: {
        //     deps: ['jquery'],
        //     exports: 'jquery'
        // },
        jquery_waypoints_sticky: {
            deps: ['jquery_waypoints']
        },
        jquery_waypoints: {
            deps: ['jquery']
        },
        jquery_transition: {
            deps: ['jquery']
        },
        foundation: {
            deps: ['jquery']
        },
        backbone: {
            deps: ['underscore', 'jquery']
        },
        app:  {
            deps: ['library']
        }
    }
});

require(['app'], function (App) {

    'use strict';

    $(function() {

        // DP namespace
        window.DP = {};

        // Create app
        DP.app = new App();

        // Start app
        DP.app.start({
            // api_root: 'http://floating-basin-2975.herokuapp.com/dp/api/v1'
            api_root: 'http://localhost:5000/dp/api/v1'
        });

    })

});
