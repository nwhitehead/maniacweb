module.exports = function(grunt) {
	
	grunt.initConfig({
		starlight: {
			engine: {
				src: 'modules/**/*.lua',
				dest: 'web/dist/engine.lua.js',
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
			engine: {
				src: 'web/dist/engine.lua.js',
				dest: 'web/dist/engine.lua.js',
			}
		},
	});

	grunt.loadNpmTasks('grunt-starlight');
	grunt.loadNpmTasks('grunt-babel');

	// Default task.
	grunt.registerTask('default', ['starlight:engine', 'babel:engine']);
};
