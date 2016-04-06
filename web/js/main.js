var editor =  ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/lua");
var version = "0.0.1";
var msg = 
	"\x1b[35;1mManiacWebSDK Output Console\r\n" +
	"\x1b[0;35m~~~~~~~~~~~~~~~~~~~~~~~~~~~\x1b[0m\r\n" +
	"\x1b[0;35mCopyright 2016 Nathan Whitehead and others\r\n\r\n";
var terminal = Console.create('terminal-container', {
	banner: msg,
});
var trigger = function() {
	window.setTimeout(function() {
		terminal.write("Hello\n");
		trigger();
	}, 100);
};
