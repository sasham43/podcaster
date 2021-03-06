module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      scripts: {
        files: ['client/client.js'],
        tasks: ['copy'],
        options: {
          spawn: false,
        },
      },
    },
    // uglify: {
    //   options: {
    //     banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
    //   },
    //   build: {
    //     src: 'client/client.js',
    //     dest: 'server/public/assets/scripts/client.min.js'
    //   }
    // },
    copy: {
      main : {
        files: [
          {expand: true,
          cwd: 'node_modules/',
          src: [
            'angular/angular.min.js',
            'angular/angular.min.js.map',
            'purecss/build/pure-min.css',
            'purecss/build/grids-responsive-min.css',
            'angular-resource/angular-resource.min.js',
            'angular-ui-router/release/angular-ui-router.min.js'
          ],
          dest: 'server/public/vendor/'},

          {expand: true, cwd: 'client', src:['client.js'], dest: 'server/public/scripts'}
              ],
      }

    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s)
  grunt.registerTask('default', ['copy']);
};
