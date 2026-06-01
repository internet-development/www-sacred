import {
  RESET, moveTo, cursorHide, cursorShow, altScreenOn, altScreenOff,
  clearScreen, clearEOL, clearEOS,
} from './ansi';
import {
  getInnerWidth, wrapLine, wrapLineTop, shadowBottomRow,
  MIN_TERM_W, bgTerm,
} from './window';

const { stdin, stdout } = process;

export type InteractiveConfig = {
  count: number | ((page: number) => number);
  onSelect?: (row: number, page: number) => void;
  persist?: boolean;
};

export type AppConfig = {
  build: (page: number, innerW: number, selectedRow: number) => string[];
  totalPages?: number | (() => number);
  interactive?: InteractiveConfig;
  onKey?: (data: Buffer, state: { currentPage: number; selectedRow: number; redraw: () => void }) => void;
};

const RESIZE_DEBOUNCE_MS: number = 50;

type QuitCtx = {
  resizeTimer: ReturnType<typeof setTimeout> | null;
  onResize: (() => void) | null;
  onData: ((data: Buffer) => void) | null;
};

function createQuit(ctx: QuitCtx): () => void {
  let quitting = false;
  return function quit(): void {
    if (quitting) return;
    quitting = true;

    if (ctx.resizeTimer) { clearTimeout(ctx.resizeTimer); ctx.resizeTimer = null; }

    stdout.removeListener('resize', ctx.onResize!);
    if (stdin.isTTY) {
      stdin.removeListener('data', ctx.onData!);
      stdin.setRawMode(false);
      stdin.pause();
    }
    process.removeListener('SIGINT', quit);

    stdout.write(cursorShow + altScreenOff);
    process.exit(0);
  };
}

function createApp(config: AppConfig): { start: () => void } {
  const {
    build,
    totalPages: totalPagesOpt = 1,
    interactive,
    onKey,
  } = config;

  const resolveTotalPages: () => number = typeof totalPagesOpt === 'function'
    ? totalPagesOpt
    : () => totalPagesOpt;

  let currentPage: number = 1;
  let selectedRow: number = 0;
  let lines: string[] = [];

  const write = (s: string): boolean => stdout.write(s);
  const W = (): number => stdout.columns || 80;

  let tooNarrow: boolean = false;

  function fullBuild(): void {
    const termW = W();
    const innerW = getInnerWidth(termW);

    if (termW < MIN_TERM_W) {
      tooNarrow = true;
      const msg = 'Terminal too narrow';
      const wrapped: string[] = [];
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

    const wrapped: string[] = [];
    wrapped.push(`${bgTerm}${' '.repeat(termW)}${RESET}`);

    for (let i = 0; i < contentLines.length; i++) {
      wrapped.push(i === 0 ? wrapLineTop(contentLines[i], innerW) : wrapLine(contentLines[i], innerW));
    }

    wrapped.push(shadowBottomRow(innerW));
    wrapped.push(`${bgTerm}${' '.repeat(termW)}${RESET}`);

    lines = wrapped;
  }

  //NOTE(jimmylee): Incremental render, overwrites in place rather than clearScreen so resize and
  //NOTE(jimmylee): navigation never flicker.
  function renderStatic(): void {
    let buf = '';
    for (let i = 0; i < lines.length; i++) {
      buf += moveTo(i + 1, 1) + lines[i] + clearEOL;
    }
    buf += moveTo(lines.length + 1, 1) + clearEOS;
    write(buf);
  }

  function redraw(): void {
    fullBuild();
    renderStatic();
  }

  function start(): void {
    write(`${altScreenOn}${cursorHide}${clearScreen}`);
    fullBuild();
    renderStatic();

    const quitCtx: QuitCtx = { resizeTimer: null, onResize: null, onData: null };
    const quit = createQuit(quitCtx);

    function onResize(): void {
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

    function onData(data: Buffer): void {
      //NOTE(jimmylee): Ctrl-C (3), Esc alone (27 length 1) → quit.
      if (data[0] === 3 || (data[0] === 27 && data.length === 1)) {
        quit();
        return;
      }
      const iCount: number = interactive
        ? (typeof interactive.count === 'function' ? interactive.count(currentPage) : interactive.count)
        : 0;
      //NOTE(jimmylee): Enter (13), fires onSelect; persist:true keeps the screen alive for re-selection.
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
      //NOTE(jimmylee): Arrow keys, ESC [ A/B (up/down), C/D (right/left).
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

export { createApp, MIN_TERM_W, RESIZE_DEBOUNCE_MS };
