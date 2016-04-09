# Maniac WebSDK

Maniac WebSDK is an online creativity studio for creating games and
interactive media. It is designed to be simple and fun to use, and
to make sharing your creations easy.

Technology:
* Projects written in Lua
* Starlight and Babel run user code in browser
* WebGL graphics engine powers drawing and animation
* ACE editor for interactive editing

Inspired by Love and Processing.

## Build

Requires `node` which includes `npm`.

Do `npm install` to get dependencies installed locally.

Do `grunt` to build single JS file with converted Lua engine files.
Appears in `web/dist/engine.lua.js`.

Next make the main editor app with `browserify src/main.js > web/dist/main.js`.
