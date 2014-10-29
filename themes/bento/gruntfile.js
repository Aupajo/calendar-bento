module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'stylesheets/styles.css': 'stylesheets/styles.scss'
				}
			}
		},
		watch: {
			styles: {
				files: 'stylesheets/**/*.scss',
				tasks: ['sass'],
				options: {
					debounceDelay: 250
				}
			},
			scripts: {
				files: 'javascripts/**/*.js',
				tasks: ['concat'],
				options: {
					debounceDelay: 250
				}
			}
		},
		concat: {
			options: {
				separator: ';',
			},
			scripts: {
				src: ['javascripts/dev/*.js'],
				dest: 'javascripts/dist/script.js',
			},
			libs: {
				src: ['javascripts/dev/libs/*.js'],
				dest: 'javascripts/dist/libs.js',
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['sass', 'concat']);
};
