var editor =  ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/lua");
var version = "0.0.1";
var ansi_normal = "\x1b[0m";
var ansi_purple = "\x1b[35m";
var ansi_bold = "\x1b[1m";
var ansi_yellow = "\x1b[33m";
var msg = 
	ansi_purple + ansi_bold + "ManiacWebSDK Output Console\n" + ansi_normal +
	ansi_purple + "~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + ansi_normal +
	ansi_purple + "Copyright 2016 Nathan Whitehead and others\n\n" + ansi_normal;
var terminal = Console.create('terminal-container', {
	banner: msg,
});

var run_elem = document.getElementById('run');
run_elem.onclick = function() {
	var txt = editor.getValue();
	var f;
	try {
		f = starlight.parser.parse(txt);
		var d = new Date();
		var timestamp = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();
		terminal.write(ansi_purple + "\nRunning code " + ansi_normal + "(" + timestamp + ")" + "\n\n");
		f();
	} catch (e) {
		var msg = e.toString();
		terminal.write("\n\n" + ansi_yellow + ansi_bold + msg + "\n" + ansi_normal);
	}
};

window.starlight = {
	config: {
		env: {
			API_VERSION: 2,
			terminal: {
				write: function(msg) {
					if (typeof(msg) !== 'string') {
						throw new Error('Can only write strings');
					}
					terminal.write(msg);
				},
			},
			getTimestamp: function() {
				return Date.now();
			},
		},
	},
};

