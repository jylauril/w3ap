module.exports = (grunt) ->

  pkg = grunt.file.readJSON('package.json')

  require('matchdep').filterDev(['grunt-*', '!grunt-cli']).forEach(grunt.loadNpmTasks)

  grunt.initConfig

    pkg: pkg

    meta:
      banner: '/*!\n * <%= pkg.name %> - v<%= pkg.version %> - ' +
      '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
      ' * <%= pkg.homepage %>\n' +
      ' * Copyright (c) <%= grunt.template.today("yyyy") %> ' +
      '<%= pkg.author.name %> <<%= pkg.author.url %>>\n */\n'

    clean:
      options:
        force: true
      build:
        src: ['<%= pkg.directories.build %>/*']
      tests:
        src: ['<%= pkg.directories.test %>/**/*.js']

    coffee:
      lib:
        options:
          join: true
          bare: false

        files:
          '<%= pkg.directories.build %>/<%= pkg.name %>.js': [
            '<%= pkg.directories.lib %>/utils.coffee'
            '<%= pkg.directories.lib %>/w3ap.coffee'
            '<%= pkg.directories.lib %>/parser.coffee'
            '<%= pkg.directories.lib %>/expose.coffee'
          ]

      tests:
        expand: true
        options:
          bare: true
        flatten: false
        cwd: pkg.directories.test
        src: '**/*.coffee'
        dest: pkg.directories.test
        ext: '.js'

    concat:
      lib:
        options:
          banner: '<%= meta.banner %>'
          process: true
        src: '<%= pkg.directories.build %>/<%= pkg.name %>.js'
        dest: '<%= pkg.directories.build %>/<%= pkg.name %>.js'

    coffeelint:
      lib: '<%= pkg.directories.lib %>/**/*.coffee'
      options:
        line_endings: level: 'error'
        no_backticks: level: 'error'
        space_operators: level: 'error'
        no_implicit_braces: level: 'error'
        no_implicit_parens: level: 'error'
        no_empty_param_list: level: 'error'
        camel_case_classes: level: 'ignore'
        max_line_length: level: 'ignore'

    uglify:
      options:
        banner: '<%= meta.banner %>'
      lib:
        files: [
          {
            expand: true
            cwd: pkg.directories.build
            src: '*.js'
            ext: '-min.js'
            dest: pkg.directories.build
          }
        ]

    jasmine:
      tests:
        src: '<%= pkg.directories.build %>/<%= pkg.name %>.js'
        options:
          keepRunner: true
          outfile: '<%= pkg.directories.test %>/SpecRunner.html'
          vendor: [
            'components/underscore/underscore.js'
          ]
          specs: '<%= pkg.directories.test %>/tests/*Spec.js'
          helpers: [
            '<%= pkg.directories.test %>/helpers/*.js',
            'components/jasmine-matchers/dist/jasmine-matchers.js',
            'components/sinonjs/sinon.js',
            'components/jasmine-sinon/lib/jasmine-sinon.js'
          ]

  grunt.registerTask('default', [
    'coffeelint:lib'
    'clean:build'
    'coffee:lib'
    'concat:lib'
    'uglify:lib'
  ])

  grunt.registerTask('test', [
    'clean:tests'
    'coffee:tests'
    'jasmine:tests'
  ])
