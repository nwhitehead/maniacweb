module.exports = function(grunt) {
	
	grunt.initConfig({
		starlight: {
			test: {
				src: 'modules/**/*.lua',
				dest: 'web/dist/test.lua.js',
				options: {
					main: 'blank',
					basePath: 'modules'
				}
			}
		},
		babel: {
			options: {
				plugins: ['transform-es2015-destructuring'],
				compact: false
			},
			test: {
				src: 'web/dist/test.lua.js',
				dest: 'web/dist/test.lua.js',
			}
		}
	});

	grunt.loadNpmTasks('grunt-starlight');
	grunt.loadNpmTasks('grunt-babel');

	// Default task.
	grunt.registerTask('default', ['starlight:test', 'babel:test']);
};
