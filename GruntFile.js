module.exports = function(grunt) {
    grunt.initConfig({
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
                    "public/js/script.min.js": ["public/js/script.js"]
                }
            }
        },
        jshint: {
            files: ["public/js/*.js", "!public/js/*.min.js"],
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
                files: ["public/js/*.js", "!public/js/*.min.js"],
                tasks: ["jshint"]
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-watch");

    grunt.registerTask("default", ["watch"]);
};
