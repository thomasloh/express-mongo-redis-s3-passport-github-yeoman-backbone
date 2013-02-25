require.config({
    paths: {
        jquery          : '../components/jquery/jquery',
        backbone        : '../components/backbone/backbone',
        underscore      : '../components/underscore/underscore',
        rivets          : '../components/rivets/lib/rivets',
        text            : '../components/requirejs-text/text',
        bootstrap       : 'vendor/bootstrap',
        router          : 'logistics/dp-router',
        _base_view      : 'views/_base',
        _page           : 'views/_page/_page',
        home            : 'views/home/home',
        view            : 'views/view/view',
        profile         : 'models/profile',
        profiles        : 'collections/profiles',
        app             : 'app'
    },
    shim: {
        bootstrap: {
            deps: ['jquery'],
            exports: 'jquery'
        },
        backbone: {
            deps: ['underscore']
        },
        app:  {
            deps: ['library']
        }
    }
});

require(['app'], function (App) {

    'use strict';

    // DP namespace
    var DP = {};

    // Create app
    DP.app = new App();

    // Start app
    DP.app.start({
        api_root: 'http://localhost:5000/dp/api/v1'
    });

});