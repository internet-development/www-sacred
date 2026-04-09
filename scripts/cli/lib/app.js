'use strict';

//NOTE(jimmylee): Sacred CLI app lifecycle — alt screen, raw mode, resize, input, pagination, selection.
//NOTE(jimmylee): Deliberately static — no per-cell animation diffing. The React side handles its own
//NOTE(jimmylee): animations via the existing ASCII canvas and physics modules.
//NOTE(jimmylee): createApp({ build, totalPages, interactive, onKey }).start()
//NOTE(jimmylee): totalPages accepts a number or () => number — re-evaluated on resize, currentPage clamped.

const { stdin, stdout } = process;
const {
  RESET, moveTo, cursorHide, cursorShow, altScreenOn, altScreenOff,
  clearScreen, clearEOL, clearEOS,
} = require('./ansi');
const {
  getInnerWidth, wrapLine, wrapLineTop, shadowBottomRow,
  MIN_TERM_W, bgTerm,
} = require('./window');

const RESIZE_DEBOUNCE_MS = 50;

//NOTE(jimmylee): Shared quit helper — deduplicates quit() across createApp and createLifecycle.
function createQuit(ctx) {
  let quitting = false;
  return function quit() {
    if (quitting) return;
    quitting = true;

    if (ctx.resizeTimer) { clearTimeout(ctx.resizeTimer); ctx.resizeTimer = null; }

    stdout.removeListener('resize', ctx.onResize);
    if (stdin.isTTY) {
      stdin.removeListener('data', ctx.onData);
      stdin.setRawMode(false);
      stdin.pause();
    }
    process.removeListener('SIGINT', quit);

    stdout.write(cursorShow + altScreenOff);
    process.exit(0);
  };
}

function createApp(config) {
  const {
    build,
    totalPages: totalPagesOpt = 1,
    interactive,
    onKey,
  } = config;

  const resolveTotalPages = typeof totalPagesOpt === 'function'
    ? totalPagesOpt
    : () => totalPagesOpt;

  let currentPage = 1;
  let selectedRow = 0;
  let lines = [];

  const write = (s) => stdout.write(s);
  const W = () => stdout.columns || 80;

  let tooNarrow = false;

  function fullBuild() {
    const termW = W();
    const innerW = getInnerWidth(termW);

    if (termW < MIN_TERM_W) {
      tooNarrow = true;
      const msg = 'Terminal too narrow';
      const wrapped = [];
      const rows = stdout.rows || 24;
      for (let r = 0; r < rows; r++) {
        if (r === Math.floor(rows / 2)) {
          const pad = Math.max(0, Math.floor((termW - msg.length) / 2));
          wrapped.push(`${bgTerm}${' '.repeat(pad)}${msg}${' '.repeat(Math.max(0, termW - pad - msg.length))}${RESET}`);
        } else {
          wrapped.push(`${bgTerm}${' '.repeat(termW)}${RESET}`);
        }
      }
      lines = wrapped;
      return;
    }
    tooNarrow = false;

    const contentLines = build(currentPage, innerW, interactive ? selectedRow : -1);

    const wrapped = [];
    wrapped.push(`${bgTerm}${' '.repeat(termW)}${RESET}`);

    for (let i = 0; i < contentLines.length; i++) {
      wrapped.push(i === 0 ? wrapLineTop(contentLines[i], innerW) : wrapLine(contentLines[i], innerW));
    }

    wrapped.push(shadowBottomRow(innerW));
    wrapped.push(`${bgTerm}${' '.repeat(termW)}${RESET}`);

    lines = wrapped;
  }

  //NOTE(jimmylee): Incremental render — overwrites in place rather than clearScreen so resize and
  //NOTE(jimmylee): navigation never flicker.
  function renderStatic() {
    let buf = '';
    for (let i = 0; i < lines.length; i++) {
      buf += moveTo(i + 1, 1) + lines[i] + clearEOL;
    }
    buf += moveTo(lines.length + 1, 1) + clearEOS;
    write(buf);
  }

  function redraw() {
    fullBuild();
    renderStatic();
  }

  function start() {
    write(`${altScreenOn}${cursorHide}${clearScreen}`);
    fullBuild();
    renderStatic();

    const quitCtx = { resizeTimer: null, onResize: null, onData: null };
    const quit = createQuit(quitCtx);

    function onResize() {
      if (quitCtx.resizeTimer) clearTimeout(quitCtx.resizeTimer);
      quitCtx.resizeTimer = setTimeout(() => {
        quitCtx.resizeTimer = null;
        const tp = resolveTotalPages();
        if (currentPage > tp) currentPage = Math.max(1, tp);
        if (interactive) {
          const count = typeof interactive.count === 'function' ? interactive.count(currentPage) : interactive.count;
          if (count === 0) selectedRow = 0;
          else if (selectedRow >= count) selectedRow = count - 1;
        }
        redraw();
      }, RESIZE_DEBOUNCE_MS);
    }

    function onData(data) {
      //NOTE(jimmylee): Ctrl-C (3), Esc alone (27 length 1) → quit.
      if (data[0] === 3 || (data[0] === 27 && data.length === 1)) {
        quit();
        return;
      }
      const iCount = interactive
        ? (typeof interactive.count === 'function' ? interactive.count(currentPage) : interactive.count)
        : 0;
      //NOTE(jimmylee): Enter (13) — fires onSelect; persist:true keeps the screen alive for re-selection.
      if (data[0] === 13) {
        if (interactive && interactive.onSelect && iCount > 0) {
          interactive.onSelect(selectedRow, currentPage);
        }
        if (interactive && interactive.persist) {
          redraw();
          return;
        }
        quit();
        return;
      }
      //NOTE(jimmylee): Arrow keys — ESC [ A/B (up/down), C/D (right/left).
      if (data[0] === 27 && data[1] === 91) {
        if (data[2] === 65 && interactive) {
          if (selectedRow > 0) { selectedRow--; redraw(); }
          return;
        }
        if (data[2] === 66 && interactive) {
          if (selectedRow < iCount - 1) { selectedRow++; redraw(); }
          return;
        }
        if (data[2] === 67 && currentPage < resolveTotalPages()) {
          currentPage++;
          if (interactive) selectedRow = 0;
          redraw();
        } else if (data[2] === 68 && currentPage > 1) {
          currentPage--;
          if (interactive) selectedRow = 0;
          redraw();
        }
      }
      if (onKey) {
        onKey(data, { currentPage, selectedRow, redraw });
      }
    }

    quitCtx.onResize = onResize;
    quitCtx.onData = onData;

    stdout.on('resize', onResize);

    if (stdin.isTTY) {
      stdin.setRawMode(true);
      stdin.resume();
      stdin.on('data', onData);
    }

    process.on('SIGINT', quit);
  }

  return { start };
}

module.exports = { createApp, MIN_TERM_W, RESIZE_DEBOUNCE_MS };
