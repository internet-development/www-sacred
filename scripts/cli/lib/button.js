'use strict';

//NOTE(jimmylee): Terminal buttons with backgrounds matching the React TerminalButton component.
//NOTE(jimmylee): Hotkey bg #8a8a8a + label bg #4e4e4e + label text #a8a8a8.

const { bgHex, fgHex, RESET, RESET_FG, COLORS, visLen } = require('./ansi');

function button(hotkey, label) {
  return `${bgHex(COLORS.btnHotkey)}${fgHex(COLORS.text)} ${hotkey} ${RESET_FG}${bgHex(COLORS.btnLabel)}${fgHex(COLORS.btnLabelText)} ${label.toUpperCase()} ${RESET}`;
}

//NOTE(jimmylee): Gap explicitly uses windowBg so RESET in buttons does not leak terminal default bg.
const bgWin = bgHex(COLORS.windowBg);

function buttonRow(left, right, innerW) {
  const gap = Math.max(1, innerW - visLen(left) - visLen(right));
  return `${left}${bgWin}${' '.repeat(gap)}${RESET}${right}`;
}

module.exports = { button, buttonRow };
