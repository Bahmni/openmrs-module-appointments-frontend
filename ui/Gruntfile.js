'use strict';

module.exports = function (grunt) {
    // load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    // configurable paths
    var yeomanConfig = {
        app: 'app',
        dist: 'dist',
        test: 'test',
        root: '.',
        nodeModules: 'node_modules'
    };

    var libraryCSSFiles = [
        'components/select2/select2.css',
        'components/ngDialog/css/ngDialog.min.css',
        'components/ngDialog/css/ngDialog-theme-default.min.css',
        'components/ngDialog/css/ngDialog-theme-plain.min.css',
        'components/ng-tags-input/ng-tags-input.bootstrap.min.css',
        'components/ng-tags-input/ng-tags-input.min.css',
        'components/jquery-ui/themes/smoothness/jquery-ui.min.css'
    ];

    var libraryJSFiles = [
        'components/jquery/jquery.min.js',
        'components/lodash/dist/lodash.min.js',
        'components/jquery.cookie/jquery.cookie.js',
        'components/angular/angular.min.js',
        'components/ng-tags-input/ng-tags-input.min.js',
        'components/angular-sanitize/angular-sanitize.min.js',
        'components/angular-bindonce/bindonce.min.js',
        'components/angular-recursion/angular-recursion.min.js',
        'components/ngInfiniteScroll/build/ng-infinite-scroll.min.js',
        'components/moment/min/moment-with-locales.min.js',
        'components/select2/select2.min.js',
        'components/angular-ui-select2/src/select2.js',
        'components/angular-ui-router/release/angular-ui-router.min.js',
        'components/ngDialog/js/ngDialog.min.js',
        'components/stacktrace-js/dist/stacktrace.min.js',
        'components/ng-clip/dest/ng-clip.min.js',
        'components/zeroclipboard/dist/ZeroClipboard.min.js',
        'components/jquery.scrollTo/jquery.scrollTo.min.js',
        'components/angular-translate/angular-translate.min.js',
        'components/angular-cookies/angular-cookies.min.js',
        'components/angular-translate-loader-static-files/angular-translate-loader-static-files.min.js',
        'components/angular-translate-storage-cookie/angular-translate-storage-cookie.min.js',
        'components/angular-translate-storage-local/angular-translate-storage-local.min.js',
        'components/angular-translate-handler-log/angular-translate-handler-log.min.js',
        'components/angular-elastic/elastic.js',
        'components/angular-route/angular-route.min.js',
        'components/jquery-ui/ui/minified/jquery-ui.custom.min.js',
        'components/angular-ivh-treeview/dist/ivh-treeview.min.js'
    ];

    try {
        yeomanConfig.app = require('./package.json').appPath || yeomanConfig.app;
    } catch (e) {
    }

    grunt.initConfig({
        yeoman: yeomanConfig,
        watch: {
            compass: {
                files: ['<%= yeoman.app %>/styles/**/*.{scss,sass}'],
                tasks: ['compass:debug']
            }
        },
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.app %>/styles/*.css',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            coverage: [
                'coverage'
            ],
            debug: [
                '<%= yeoman.app %>/styles/*.css'
            ]
        },
        toggleComments: {
            customOptions: {
                options: {
                    padding: 4,
                    removeCommands: true
                },
                files: {
                }
            }
        },
        eslint: {
            options: {
                fix: false,
                quiet: true
            },
            target: [
                'Gruntfile.js',
                '<%= yeoman.app %>/**/*.js',
                '!<%= yeoman.app %>/**/*.min.js',
                '!<%= yeoman.app %>/components/**/*.js',
                '!<%= yeoman.app %>/lib/**/*.js',
                '!app/lib/**/*.js'
            ]
        },
        karma: {
            unit: {
                configFile: 'test/config/karma.conf.js'
            },
            auto: {
                configFile: 'test/config/karma.conf.js',
                singleRun: false,
                autoWatch: true,
                reporters: ['junit', 'progress'],
                preprocessors: {
                    'app/common/displaycontrols/**/views/*.html': ['ng-html2js'],
                    'app/common/concept-set/views/*.html': ['ng-html2js'],
                    'app/common/uicontrols/**/views/*.html': ['ng-html2js']
                }
            }
        },
        coverage: {
            options: {
                thresholds: {
                    statements: 68.15,
                    branches: 59.0,
                    functions: 62.35,
                    lines: 68.33
                },
                dir: 'coverage',
                root: '.'
            }
        },
        compass: {
            options: {
                sassDir: '<%= yeoman.app %>/styles',
                cssDir: '<%= yeoman.app %>/styles/',
                imagesDir: '<%= yeoman.app %>/images',
                javascriptsDir: '<%= yeoman.app %>/scripts',
                fontsDir: '<%= yeoman.app %>/styles/fonts',
                importPath: '<%= yeoman.app %>/components',
                relativeAssets: true
            },
            dist: {},
            debug: {
                options: {
                    debugInfo: true
                }
            }
        },
        // Renames files for browser caching purposes
        filerev: {
            dist: {
                src: [
                    '<%= yeoman.dist %>/**/*.js',
                    '<%= yeoman.dist %>/**/*.css',
                    '!<%= yeoman.dist %>/**/registrationPrint.css',
                    '!<%= yeoman.dist %>/initWorker.js',
                    '!<%= yeoman.dist %>/components/sw-toolbox/sw-toolbox.js',
                    '!<%= yeoman.dist %>/worker.js'
                ]
            }
        },
        useminPrepare: {
            html: [
                '<%= yeoman.app %>/appointments/**/*.html',
                '<%= yeoman.app %>/common/**/*.html'
            ],
            css: '<%= yeoman.app %>/styles/**/*.css',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: {
                    html: {
                        steps: {
                            js: ['concat'],
                            css: ['cssmin']
                        },
                        post: {}
                    }
                }
            }
        },
        usemin: {
            html: [
                '<%= yeoman.dist %>/**/index.html',
                '<%= yeoman.dist %>/common/displaycontrols/prescription/views/prescription.html'
            ],
            css: '<%= yeoman.dist %>/styles/**/*.css',
            options: {
                assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
            }
        },
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        cssmin: {
            options: {
                banner: '/* Bahmni OPD minified CSS file */'
            },
            minify: {
                expand: true,
                cwd: '<%= yeoman.dist %>/styles/css/',
                src: ['**/*.css', '!**/*.min.*.css'],
                dest: '<%= yeoman.dist %>/styles/css/',
                ext: '.min.*.css'
            }
        },
        htmlmin: {
            dist: {
                options: {
                    keepClosingSlash: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>',
                        src: [
                            'appointments/**/*.html',
                            'common/**/*.html'
                        ],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            libraryCSSFiles,
                            libraryJSFiles,
                            '*.{ico,txt,html,js}',
                            '.htaccess',
                            'images/**/*.{gif,webp}',
                            'styles/**/*.css',
                            'styles/fonts/**/*',
                            'i18n/**/*.json',
                            'lib/**/*'
                        ]
                    }
                ]
            }
        },
        rename: {
            minified: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['appointments.*.js'],
                        dest: '<%= yeoman.dist %>/appointments/'
                    },
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['appointments.*.css'],
                        dest: '<%= yeoman.dist %>/appointments/'
                    }
                ]
            }
        },
        ngAnnotate: {
            options: {
                remove: true,
                add: true
            },
            files: {
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['**/*.min.*.js'],
                dest: '<%= yeoman.dist %>'
            }
        },
        uglify: {
            options: {
                mangle: false
            },
            files: {
                expand: true,
                cwd: '<%= yeoman.dist %>',
                src: ['**/*.min.*.js'],
                dest: '<%= yeoman.dist %>'
            }
        },
        preprocess: {
            options: {
                context: {
                    DEBUG: 'production'
                }
            },
            multifile: {
                files: {
                    '<%= yeoman.dist %>/appointments.min.js': '<%= yeoman.dist %>/appointments.min.js'
                }
            },
            web: {
                src: ['<%= yeoman.dist %>/**/index.html'],
                options: {
                    inline: true,
                    context: {
                        ONLINE: true
                    }
                }
            }
        }
    });

    grunt.renameTask('regarde', 'watch');

    grunt.registerTask('test', ['karma:unit', 'coverage']);

    grunt.registerTask('bundle', [
        'eslint',
        'clean:dist',
        'compass:dist',
        'useminPrepare',
        'ngAnnotate',
        'concat',
        'preprocess',
        'imagemin',
        'htmlmin',
        'cssmin',
        'copy:dist',
        'filerev',
        'usemin'
    ]);

    grunt.registerTask('build', [
        'npm-install',
        'bower-install',
        'bundle'
    ]);

    grunt.registerTask('uglify-and-rename', [
        'uglify',
        'rename:minified'
    ]);

    grunt.registerTask('dev', ['build', 'test']);
    grunt.registerTask('default', ['bundle', 'uglify-and-rename', 'test', 'preprocess:web']);
    grunt.registerTask('web', ['test', 'preprocess:web']);
    grunt.registerTask('bower-install', 'install dependencies using bower', function () {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('bower install', function (err, stdout) {
            console.log(stdout);
            cb(!err);
        });
    });

    grunt.registerTask('npm-install', 'install dependencies using npm', function () {
        var exec = require('child_process').exec;
        var cb = this.async();
        exec('npm install', function (err, stdout) {
            console.log(stdout);
            cb(!err);
        });
    });
};
