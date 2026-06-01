import { bgHex, fgHex, RESET, RESET_FG, COLORS, visLen } from './ansi';

function button(hotkey: string, label: string): string {
  return `${bgHex(COLORS.btnHotkey)}${fgHex(COLORS.text)} ${hotkey} ${RESET_FG}${bgHex(COLORS.btnLabel)}${fgHex(COLORS.btnLabelText)} ${label.toUpperCase()} ${RESET}`;
}

//NOTE(jimmylee): Gap explicitly uses windowBg so RESET in buttons does not leak terminal default bg.
const bgWin: string = bgHex(COLORS.windowBg);

function buttonRow(left: string, right: string, innerW: number): string {
  const gap = Math.max(1, innerW - visLen(left) - visLen(right));
  return `${left}${bgWin}${' '.repeat(gap)}${RESET}${right}`;
}

export { button, buttonRow };
