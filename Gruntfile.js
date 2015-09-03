module.exports = function(grunt) {
  "use strict";

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      release: [ 'dist' ],
      docs: [ 'docs' ]
    },

    jshint: {
      files: ['lib/**/*.js', 'test/**/*.js'],
      options: {
        jshintrc: 'config/jshint/config.json'
      }
    },

    mochaTest: {
      test: {
        options: {
          ui: 'bdd',
          reporter: 'spec',
          require: [
            'tests/helpers/chai',
            'tests/helpers/sinon',
            'tests/helpers/sjs'
          ],
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
          configure: 'config/jsdoc/config.json'
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
          transform: [ 'browserify-shim' ],
          exclude: ['underscore']
        }
      }
    },

    uglify: {
      options: {
        banner: '/* Copyright <%= grunt.template.today("yyyy") %> <%= pkg.author %>\n<%= pkg.name %> - v.<%= pkg.version %> - Built on <%= grunt.template.today("yyyy-mm-dd") %> */\n',
        screwIE8: true,

        mangle: {
          except: ['_', 'sjs', 'func', 'TypeDefinition', 'TypeDefinitionError']
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
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-jsdoc');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  // builds
  grunt.registerTask('build', 'Build task.', function(opt) {
    grunt.task.run('clean:release');

    if (opt === 'main') {
      grunt.task.run('browserify:main', 'uglify:main');

    } else if (opt === "standalone") {
      grunt.task.run('browserify:standalone', 'uglify:standalone');

    } else {
      grunt.task.run('browserify:main', 'uglify:main');
      grunt.task.run('browserify:standalone', 'uglify:standalone');
    }
  });

  // other
  grunt.registerTask('docs', ['clean:docs', 'jsdoc']);
  grunt.registerTask('test', ['jshint', 'mochaTest']);

  // release
  grunt.registerTask('release', 'Release task.', function(opt) {
    grunt.task.run('test', 'build');

    if (opt === 'withDocs') {
      grunt.task.run('docs');
    }
  });

  // default
  grunt.registerTask('default', 'release');
};
