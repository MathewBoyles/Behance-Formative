module.exports = function(grunt) {
  grunt.initConfig({
    concat: {
      process_function: {
        options: {
          process: function(src, filepath) {
            return "// Source: " + (filepath.substr(10)) + "\n" +
              src.replace(/file(\d)/, "f$1");
          }
        },
        files: {
          "public/js/main.js": ["public/js/script.js", "public/js/*.js", "!public/js/*.min.js", "!public/js/main.js"]
        }
      },
    },
    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: "public/css/",
          src: ["*.css", "!*.min.css"],
          dest: "public/css/",
          ext: ".min.css"
        }]
      }
    },
    uglify: {
      options: {
        mangle: true
      },
      my_target: {
        files: {
          "public/js/main.min.js": ["public/js/main.js"]
        }
      }
    },
    jshint: {
      files: ["public/js/*.js", "!public/js/*.min.js", "!public/js/main.js"],
      options: {
        globals: {
          jQuery: true
        }
      }
    },
    sass: {
      dist: {
        files: [{
          expand: true,
          cwd: "public/sass/",
          src: ["*.scss"],
          dest: "public/css/",
          ext: ".css"
        }]
      }
    },
    watch: {
      concat: {
        files: ["public/js/*.js", "!public/js/*.min.js"],
        tasks: ["concat"]
      },
      cssmin: {
        files: ["public/css/*.css", "!public/css/*.min.css"],
        tasks: ["cssmin"]
      },
      sass: {
        files: ["public/sass/*.scss"],
        tasks: ["sass"]
      },
      uglify: {
        files: ["public/js/*.js", "!public/js/*.min.js"],
        tasks: ["uglify"]
      },
      jshint: {
        files: ["public/js/*.js", "!public/js/*.min.js", "!public/js/main.js"],
        tasks: ["jshint"]
      }
    }
  });

  grunt.loadNpmTasks("grunt-contrib-concat");
  grunt.loadNpmTasks("grunt-contrib-cssmin");
  grunt.loadNpmTasks("grunt-contrib-jshint");
  grunt.loadNpmTasks("grunt-contrib-sass");
  grunt.loadNpmTasks("grunt-contrib-uglify");
  grunt.loadNpmTasks("grunt-contrib-watch");

  grunt.registerTask("default", ["watch"]);
};
