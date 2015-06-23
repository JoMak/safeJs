module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: 'config/jshint_config.json'
      }
    },

    mochaTest: {
      test: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: 'tests/helpers/chai',
          captureFile: 'mocha_results.txt'
        },
        src: ['tests/**/*.test.js']
      }
    },

    jsdoc: {
      main: {
        jsdoc: 'node_modules/.bin/jsdoc',
        options: {
          destination: 'docs',
          configure: 'config/jsdoc_config.json'
        }
      }
    },

    browserify: {
      standalone: {
        src: 'lib/sjs.js',
        dest: 'dist/sjs-standalone.js',

        options: {
          browserifyOptions: {
            standalone: 'sjs'
          }
        }
      },

      main: {
        src: 'lib/sjs.js',
        dest: 'dist/sjs.js',
        options: {
          browserifyOptions: {
            standalone: 'sjs'
          }
        }
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
        footer: '/*! Copyright <%= pkg.author %> */',
        screwIE8: true,

        mangle: {
          except: ['_']
        }
      },

      main: {
        files: {
          'dist/sjs.min.js': 'dist/sjs.js'
        }
      },

      standalone: {
        files: {
          'dist/sjs-standalone.min.js': 'dist/sjs-standalone.js'
        },

        options: {
          mangle: false
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', ['jshint', 'mochaTest', 'browserify:main', 'uglify:main']);
  grunt.registerTask('standalone', ['jshint', 'mochaTest', 'browserify:standalone', 'uglify:standalone']);
  grunt.registerTask('docs', ['jsdoc:main']);
};