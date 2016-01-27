module.exports = config:
    files:
        javascripts:
            exclude: '/**/*.min.js'
            joinTo:
                'js/app.js': /^app/
                'js/vendor.js': /^(bower_components|vendor)/
            order:
                before: [
                    'bower_components/jquery/dist/jquery.js',
                    'bower_components/lodash/dist/lodash.js',
                ]
        stylesheets:
            exclude: '/**/*.min.css'
            joinTo: 'css/app.css'
        templates: joinTo: 'js/app.js'

