
require.config({
  paths: {
    // Major libraries
    jquery: 'libs/jquery/jquery-2.1.1',
    underscore: 'libs/underscore/underscore', // https://github.com/amdjs
    backbone: 'libs/backbone/backbone', // https://github.com/amdjs
    async: 'libs/async/async',
    slick : 'libs/slick/slick.min',

    // Require.js plugins
    text: 'libs/require/text',
    order: 'libs/require/order',
    css: 'libs/require/css',
    less: 'libs/require/require-less/less',
    lessc: 'libs/require/require-less/lessc',
    normalize : 'libs/require/require-less/normalize',
    order: 'libs/require/order'
  },
  map : {
    '*': {
      'less': 'libs/require/require-less' // path to less
    }
  }
});

// Let's kick off the application

require([
  'jquery',
  'router',
  'less!/css/main.less',
], function($, Router){
  console.log('Application was started!');
  Router.initialize({}, function() {
    console.log('Iniitialiased!');
    Backbone.history.start();
  });
});