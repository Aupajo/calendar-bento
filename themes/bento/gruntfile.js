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
				files: 'scripts/**/*.js',
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
				src: ['scripts/dev/*.js'],
				dest: 'scripts/dist/script.js',
			},
			libs: {
				src: ['scripts/dev/libs/*.js'],
				dest: 'scripts/dist/libs.js',
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['sass', 'concat']);
};
