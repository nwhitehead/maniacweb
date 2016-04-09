
var Console = require('OutputConsole');

var ansi_normal = "\x1b[0m";
var ansi_purple = "\x1b[35m";
var ansi_bold = "\x1b[1m";
var ansi_yellow = "\x1b[33m";
var msg = 
    ansi_purple + ansi_bold + "ManiacWebSDK Output Console\n" + ansi_normal +
    ansi_purple + "~~~~~~~~~~~~~~~~~~~~~~~~~~~\n" + ansi_normal +
    ansi_purple + "Copyright 2016 Nathan Whitehead and others\n\n" + ansi_normal;

var terminal = Console.create('terminal-container');
terminal.write(msg);

window.starlight = {
    config: {
        env: {
            API_VERSION: 2,
            web: {
                getTimestamp: function() {
                    return Date.now();
                },
            },
        },
        stdout: {
            writeln: function () {
                var args = Array.prototype.splice.call(arguments, 0);
                terminal.write(args.join('\t') + '\n');
            },
        },
    },
};


var run = function() {
    var txt = editor.getValue();
    var f;
    try {
        starlight.parser.parse('require("webbootstrap")')();
        f = starlight.parser.parse(txt);
        f();
    } catch (e) {
        var msg = e.toString();
        terminal.write("\n\n" + ansi_yellow + ansi_bold + msg + "\n" + ansi_normal);
    }
};

document.getElementById('run').onclick = run;

var editor =  ace.edit("editor");
editor.setTheme("ace/theme/twilight");
editor.getSession().setMode("ace/mode/lua");
editor.setShowPrintMargin(false);
editor.setFontSize(14);
editor.$blockScrolling = Infinity;

var txt_default = "\n-- Put your Lua code here\n\n";
editor.setValue(txt_default);

editor.commands.addCommand({
    name: 'run',
    bindKey: {win: 'Ctrl-Enter', mac: 'Command-Enter'},
    exec: function(editor) {
        run();
    },
    readOnly: true
});

editor.focus();
