module.exports = function(grunt) {
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'public/stylesheets/styles.css': 'public/stylesheets/styles.scss'
				}
			}
		},
		watch: {
			styles: {
				files: 'public/**/*.scss',
				tasks: ['sass'],
				options: {
					debounceDelay: 250
				}
			},
			scripts: {
				files: 'public/**/*.js',
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
				src: ['public/scripts/dev/*.js'],
				dest: 'public/scripts/dist/script.js',
			},
			libs: {
				src: ['public/scripts/dev/libs/*.js'],
				dest: 'public/scripts/dist/libs.js',
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-concat');

	grunt.registerTask('default', ['sass', 'concat']);
};
