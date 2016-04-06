var Console =
(function() {

	var Console = {};

	Console.create = function(container, options) {
		// container is DOM id of element containing console
		// Options
		//		prompt			String for prompt, can contain color escapes
		//      active			Whether console is accepting input
		//      banner          Text to show on startup
		options = options || {};
		options.prompt = options.prompt || "\x1b[33;1m>>>\x1b[0m ";
		if (options.active === false) {
			options.active = false;
		} else {
			options.active = true;
		}
		options.banner = options.banner || "\x1b[35;1mWelcome to the console!\x1b[0m\r\n\r\n";

		var term_elem = document.getElementById(container);
		var term = new Terminal();
		term.scrollback = 1;
		term.open(term_elem);
		term.fit();
		term.cursorHidden = true;
		term.active = options.active;
		term.write(options.banner);
		return term;
	}

	return Console;
})();
