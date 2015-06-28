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

      options: {
        browserifyOptions: {
          standalone: 'sjs'
        }
      },

      standalone: {
        src: 'lib/sjs.js',
        dest: 'dist/sjs-standalone.js'
      },

      main: {
        src: 'lib/sjs.js',
        dest: 'dist/sjs.js',
        options: {
          exclude: 'underscore'
        }
      }
    },

    uglify: {
      options: {
        banner: '/* <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
        footer: '/* Copyright <%= pkg.author %> */',
        screwIE8: true,

        mangle: {
          except: ['_', 'sjs', 'ParamDefinition', 'ParamDefinitionError']
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
        }
      }
    }
  });
  
  // load plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // default
  grunt.registerTask('default', ['jshint', 'mochaTest', 'browserify:main', 'uglify:main']);

  // builds
  grunt.registerTask('build', 'Build task.', function(opt) {
    if (typeof(opt) === 'undefined') {
      grunt.task.run('browserify:main', 'uglify:main');

    } else if (opt === "standalone") {
      grunt.task.run('browserify:standalone', 'uglify:standalone');

    } else {
      grunt.log.error('Error, invalid option: ' + opt);
      return false;
    }
  });

  // other
  grunt.registerTask('docs', ['jsdoc']);
  grunt.registerTask('test', [ 'jshint', 'mochaTest']);

  //release
  grunt.registerTask('release', 'Release task.', function(opt) {
    grunt.task.run('test', 'build', 'build:standalone');

    if (opt === "withDocs") {
      grunt.task.run('docs');
    }
  });
};
