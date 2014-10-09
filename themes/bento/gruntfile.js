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
				files: 'sass/**/*.scss',
				tasks: ['sass'],
				options: {
					debounceDelay: 250
				}
			}
		}
	});

	grunt.loadNpmTasks('grunt-contrib-sass');
	grunt.loadNpmTasks('grunt-contrib-watch');

	grunt.registerTask('default', ['sass']);
};
