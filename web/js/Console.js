var Console =
(function() {

	var Console = {};

	Console.create = function(container, options) {
		options = options || {};
		var prompt = options.prompt || "\x1b[33;1m>>>\x1b[0m ";
		var active = true;
		if (options.active === false) {
			active = false;
		}

		var term_elem = document.getElementById(container);
		var term = new Terminal();
		term.scrollback = 1;
		term.open(term_elem);
		term.fit();

		term.prompt = function () {
		  term.write('\r\n' + prompt);
		  term.line_length = 0;
		};
		term.line_length = 0;
		term.on('key', function (key, ev) {
		  var printable = (!ev.altKey && !ev.altGraphKey && !ev.ctrlKey && !ev.metaKey);

		  if (ev.keyCode === 13) {
			term.prompt();
		  } else if (ev.keyCode === 8) {
			/*
			 * Do not delete the prompt
			 */
			if (term.line_length > 0) {
			  term.write('\b \b');
			  term.line_length--;
			}
		  } else if (printable) {
			term.write(key);
			term.line_length++;
		  }
		});
		term.prompt();
		return term;
	}

	return Console;
})();