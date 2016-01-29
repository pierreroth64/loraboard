module.exports = config:
    files:
        javascripts:
            exclude: '/**/*.min.js'
            joinTo:
                'js/app.js': /^app/
                'js/vendor.js': /^vendor\/js/
            order:
                before: [
                    'vendor/js/jquery-2.2.0.js',
                    'vendor/js/lodash-4.0.1.js',
                    'vendor/js/backbone-1.2.3.js',
                    'vendor/js/backbone-mediator.js',
                    'vendor/js/pubnub-3.7.21.js',
                    'vendor/js/mapbox-2.2.4.js',
                    'vendor/js/d3-3.5.14.js',
                    'vendor/js/c3-0.4.10.js',
                ]
        stylesheets:
            joinTo: 'css/app.css': /^(app|vendor)/
            order:
                before: [
                    'vendor/styles/bootstrap-3.3.6.css',
                    'vendor/styles/animate-3.5.1.css'
                ],





