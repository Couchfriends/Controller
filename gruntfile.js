module.exports = function(grunt) {

    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/**\n * @link www.couchfriends.com\n * @copyright Fellicht <www.fellicht.nl>\n */\n'
            },
            build: {
                files: {
                    'build/js/game.js': [
                        'src/js/utils/pixi.js',
                        'src/js/utils/ajax.js',
                        'src/js/utils/couchfriends.js',
                        'src/js/controller/Controller.js',
                        'src/js/controller/Controller.Element.js',
                        'src/js/controller/Controller.Button.js',
                        'src/js/controller/Controller.Axis.js',
                        'src/js/app.js'
                    ]
                }
            }
        },
        less: {
            production: {
                options: {
                    plugins: [
                        //new (require('less-plugin-autoprefix'))({browsers: ["last 2 versions"]}),
                        new (require('less-plugin-clean-css'))({})
                    ]
                },
                files: {
                    "www/css/app.css": "src/css/app.less"
                }
            }
        },
        copy: {
            main: {
                src: ['**'],
                dest: 'www/img/',
                cwd: 'src/img/',
                expand: true
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['uglify', 'less', 'copy']);

    grunt.loadNpmTasks('grunt-contrib-less');

    grunt.loadNpmTasks('grunt-contrib-copy');

};