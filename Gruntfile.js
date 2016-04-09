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
		},
        browserify: {
            options: {
                banner: "// ManiacWebSDK Copyright 2016 Nathan Whitehead\n",
                alias: {
                    'OutputConsole': './web/js/OutputConsole.js',
                    'Terminal': './web/external/xterm.js/xterm.js',
                    'Terminal-Fit': './web/external/xterm.js/fit.js',
                    'Starlight-Runtime': './web/external/starlight/runtime.js',
                    //~ 'Starlight-Parser': './web/external/starlight/parser.js'
                }
            },
            test: {
                src: [
                    'web/js/main.js',
                ],
                dest: 'web/dist/main_bundle.js'
            }
        }
	});

	grunt.loadNpmTasks('grunt-starlight');
	grunt.loadNpmTasks('grunt-babel');
	grunt.loadNpmTasks('grunt-browserify');

	// Default task.
	grunt.registerTask('default', ['starlight:test', 'babel:test']);
};
