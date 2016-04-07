
local t = web.getTimestamp()

local ansi_normal = "\x1b[0m"
local ansi_purple = "\x1b[35m"
local ansi_bold = "\x1b[1m"
local ansi_yellow = "\x1b[33m"

print(ansi_purple .. "\nRunning code " .. ansi_normal .. "(" .. t .. ")" .. "\n\n")
