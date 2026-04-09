'use client';

//NOTE(jimmylee): One-line braille spinners with elapsed timers. Layout only — sacred surfaces use
//NOTE(jimmylee): the existing Card primitive for chrome. The animation itself is preserved because
//NOTE(jimmylee): the spinners are the entire point of this component.

import * as React from 'react';

import Card from '@components/Card';

//NOTE(jimmylee): Spinner frame data — each entry is { frames, interval }, the bare minimum needed
//NOTE(jimmylee): to animate. Full set of 18 braille spinners for Sacred Computer.
const SPINNERS: { frames: readonly string[]; interval: number }[] = [
  { frames: ['⠋⠋⠋⠋', '⠙⠙⠙⠙', '⠹⠹⠹⠹', '⠸⠸⠸⠸', '⠼⠼⠼⠼', '⠴⠴⠴⠴', '⠦⠦⠦⠦', '⠧⠧⠧⠧', '⠇⠇⠇⠇', '⠏⠏⠏⠏'], interval: 80 },
  { frames: ['⠁⠂⠄⡀', '⠂⠄⡀⢀', '⠄⡀⢀⠠', '⡀⢀⠠⠐', '⢀⠠⠐⠈', '⠠⠐⠈⠁', '⠐⠈⠁⠂', '⠈⠁⠂⠄'], interval: 100 },
  { frames: ['⠋⠉⠙⠚', '⠉⠙⠚⠒', '⠙⠚⠒⠂', '⠚⠒⠂⠂', '⠒⠂⠂⠒', '⠂⠂⠒⠲', '⠂⠒⠲⠴', '⠒⠲⠴⠤', '⠲⠴⠤⠄', '⠴⠤⠄⠋', '⠤⠄⠋⠉', '⠄⠋⠉⠙'], interval: 80 },
  { frames: ['⠀⠀⠀⠀', '⡇⠀⠀⠀', '⣿⠀⠀⠀', '⢸⡇⠀⠀', '⠀⣿⠀⠀', '⠀⢸⡇⠀', '⠀⠀⣿⠀', '⠀⠀⢸⡇', '⠀⠀⠀⣿', '⠀⠀⠀⢸'], interval: 70 },
  { frames: ['⢁⠂⠔⠈', '⠂⠌⡠⠐', '⠄⡐⢀⠡', '⡈⠠⠀⢂', '⠐⢀⠁⠄', '⠠⠁⠊⡀', '⢁⠂⠔⠈', '⠂⠌⡠⠐', '⠄⡐⢀⠡', '⡈⠠⠀⢂', '⠐⢀⠁⠄', '⠠⠁⠊⡀'], interval: 100 },
  { frames: ['⠉⠉⠉⠉', '⠓⠓⠓⠓', '⠦⠦⠦⠦', '⣄⣄⣄⣄', '⠦⠦⠦⠦', '⠓⠓⠓⠓'], interval: 120 },
  { frames: ['⠀⠰⠆⠀', '⠀⢾⡷⠀', '⠰⣿⣿⠆', '⢾⣉⣉⡷', '⡁⠀⠀⢈'], interval: 180 },
  { frames: ['⠉⠉⠀⠀', '⠈⠉⠁⠀', '⠀⠉⠉⠀', '⠀⠈⠉⠁', '⠀⠀⠉⠉', '⠀⠀⠈⠙', '⠀⠀⠀⠹', '⠀⠀⠀⢸', '⠀⠀⠀⣰', '⠀⠀⢀⣠', '⠀⠀⣀⣀', '⠀⢀⣀⡀', '⠀⣀⣀⠀', '⢀⣀⡀⠀', '⣀⣀⠀⠀', '⣄⡀⠀⠀', '⣆⠀⠀⠀', '⡇⠀⠀⠀', '⠏⠀⠀⠀', '⠋⠁⠀⠀'], interval: 80 },
  { frames: ['⡡⠊⢔⠡', '⠊⡰⡡⡘', '⢔⢅⠈⢢', '⡁⢂⠆⡍', '⢔⠨⢑⢐', '⠨⡑⡠⠊'], interval: 150 },
  { frames: ['⠀⠀⠀⠀', '⠀⠀⠀⠀', '⠁⠀⠀⠀', '⠋⠀⠀⠀', '⠞⠁⠀⠀', '⡴⠋⠀⠀', '⣠⠞⠁⠀', '⢀⡴⠋⠀', '⠀⣠⠞⠁', '⠀⢀⡴⠋', '⠀⠀⣠⠞', '⠀⠀⢀⡴', '⠀⠀⠀⣠', '⠀⠀⠀⢀'], interval: 60 },
  { frames: ['⡀⠀⠀⠀', '⡄⠀⠀⠀', '⡆⠀⠀⠀', '⡇⠀⠀⠀', '⣇⠀⠀⠀', '⣧⠀⠀⠀', '⣷⠀⠀⠀', '⣿⠀⠀⠀', '⣿⡀⠀⠀', '⣿⡄⠀⠀', '⣿⡆⠀⠀', '⣿⡇⠀⠀', '⣿⣇⠀⠀', '⣿⣧⠀⠀', '⣿⣷⠀⠀', '⣿⣿⠀⠀', '⣿⣿⡀⠀', '⣿⣿⡄⠀', '⣿⣿⡆⠀', '⣿⣿⡇⠀', '⣿⣿⣇⠀', '⣿⣿⣧⠀', '⣿⣿⣷⠀', '⣿⣿⣿⠀', '⣿⣿⣿⡀', '⣿⣿⣿⡄', '⣿⣿⣿⡆', '⣿⣿⣿⡇', '⣿⣿⣿⣇', '⣿⣿⣿⣧', '⣿⣿⣿⣷', '⣿⣿⣿⣿', '⣿⣿⣿⣿', '⠀⠀⠀⠀'], interval: 60 },
  { frames: ['⠃⠃⠃⠃', '⠉⠉⠉⠉', '⠘⠘⠘⠘', '⠰⠰⠰⠰', '⢠⢠⢠⢠', '⣀⣀⣀⣀', '⡄⡄⡄⡄', '⠆⠆⠆⠆'], interval: 100 },
  { frames: ['⠀⠀⠀⠀', '⠂⠂⠂⠂', '⠌⠌⠌⠌', '⡑⡑⡑⡑', '⢕⢕⢕⢕', '⢝⢝⢝⢝', '⣫⣫⣫⣫', '⣟⣟⣟⣟', '⣿⣿⣿⣿', '⣟⣟⣟⣟', '⣫⣫⣫⣫', '⢝⢝⢝⢝', '⢕⢕⢕⢕', '⡑⡑⡑⡑', '⠌⠌⠌⠌', '⠂⠂⠂⠂', '⠀⠀⠀⠀'], interval: 100 },
  { frames: ['⠖⠉⠉⠑', '⡠⠖⠉⠉', '⣠⡠⠖⠉', '⣄⣠⡠⠖', '⠢⣄⣠⡠', '⠙⠢⣄⣠', '⠉⠙⠢⣄', '⠊⠉⠙⠢', '⠜⠊⠉⠙', '⡤⠜⠊⠉', '⣀⡤⠜⠊', '⢤⣀⡤⠜', '⠣⢤⣀⡤', '⠑⠣⢤⣀', '⠉⠑⠣⢤', '⠋⠉⠑⠣'], interval: 90 },
  { frames: ['⢕⢕⢕⢕', '⡪⡪⡪⡪', '⢊⠔⡡⢊', '⡡⢊⠔⡡'], interval: 250 },
  { frames: ['⢌⣉⢎⣉', '⣉⡱⣉⡱', '⣉⢎⣉⢎', '⡱⣉⡱⣉', '⢎⣉⢎⣉', '⣉⡱⣉⡱', '⣉⢎⣉⢎', '⡱⣉⡱⣉', '⢎⣉⢎⣉', '⣉⡱⣉⡱', '⣉⢎⣉⢎', '⡱⣉⡱⣉', '⢎⣉⢎⣉', '⣉⡱⣉⡱', '⣉⢎⣉⢎', '⡱⣉⡱⣉'], interval: 80 },
  { frames: ['⣀⣀⣀⣀', '⣤⣤⣤⣤', '⣶⣶⣶⣶', '⣿⣿⣿⣿', '⣿⣿⣿⣿', '⣿⣿⣿⣿', '⣶⣶⣶⣶', '⣤⣤⣤⣤', '⣀⣀⣀⣀', '⠀⠀⠀⠀', '⠀⠀⠀⠀'], interval: 100 },
  { frames: ['⠁⠀⠀⠀', '⠋⠀⠀⠀', '⠟⠁⠀⠀', '⡿⠋⠀⠀', '⣿⠟⠁⠀', '⣿⡿⠋⠀', '⣿⣿⠟⠁', '⣿⣿⡿⠋', '⣿⣿⣿⠟', '⣿⣿⣿⡿', '⣿⣿⣿⣿', '⣿⣿⣿⣿', '⣾⣿⣿⣿', '⣴⣿⣿⣿', '⣠⣾⣿⣿', '⢀⣴⣿⣿', '⠀⣠⣾⣿', '⠀⢀⣴⣿', '⠀⠀⣠⣾', '⠀⠀⢀⣴', '⠀⠀⠀⣠', '⠀⠀⠀⢀', '⠀⠀⠀⠀', '⠀⠀⠀⠀'], interval: 60 },
];

//NOTE(jimmylee): One word per spinner — synonyms of "thinking".
const WORDS = [
  'Thinking',
  'Pondering',
  'Reasoning',
  'Analyzing',
  'Processing',
  'Computing',
  'Evaluating',
  'Reflecting',
  'Deliberating',
  'Considering',
  'Contemplating',
  'Mulling',
  'Deducing',
  'Inferring',
  'Examining',
  'Synthesizing',
  'Assessing',
  'Ruminating',
];

const DOT_STRINGS = ['﹒', '﹒﹒', '﹒﹒﹒'];

function formatElapsed(ms: number): string {
  if (ms < 1000) return `(${ms}ms)`;
  if (ms < 60000) return `(${(ms / 1000).toFixed(1)}s)`;
  const m = Math.floor(ms / 60000);
  const s = Math.floor((ms % 60000) / 1000);
  return `(${m}m ${s}s)`;
}

interface AnimationState {
  frames: number[];
  dotPhase: number;
  elapsed: number;
}

//NOTE(jimmylee): setInterval at 60ms drives every spinner. rAF is unreliable on mobile — iOS Safari
//NOTE(jimmylee): and Chrome Android throttle or pause rAF for off-screen and backgrounded elements.
//NOTE(jimmylee): setInterval keeps firing so the spinners always animate when scrolled into view.
const OneLineLoaders: React.FC = () => {
  const [state, setState] = React.useState<AnimationState>(() => ({
    frames: SPINNERS.map(() => 0),
    dotPhase: 0,
    elapsed: 0,
  }));

  React.useEffect(() => {
    let lastTime = performance.now();

    const accum = new Float64Array(SPINNERS.length);
    let dotAccum = 0;
    let elapsedAccum = 0;

    const localFrames = new Int32Array(SPINNERS.length);
    let localDotPhase = 0;
    let localElapsed = 0;

    const tick = () => {
      const now = performance.now();
      const dt = now - lastTime;
      lastTime = now;

      let changed = false;

      for (let i = 0; i < SPINNERS.length; i++) {
        accum[i] += dt;
        if (accum[i] >= SPINNERS[i].interval) {
          const steps = (accum[i] / SPINNERS[i].interval) | 0;
          accum[i] -= steps * SPINNERS[i].interval;
          localFrames[i] = (localFrames[i] + steps) % SPINNERS[i].frames.length;
          changed = true;
        }
      }

      dotAccum += dt;
      if (dotAccum >= 500) {
        const steps = (dotAccum / 500) | 0;
        dotAccum -= steps * 500;
        localDotPhase = (localDotPhase + steps) % 3;
        changed = true;
      }

      elapsedAccum += dt;
      if (elapsedAccum >= 100) {
        const steps = (elapsedAccum / 100) | 0;
        elapsedAccum -= steps * 100;
        localElapsed += steps * 100;
        changed = true;
      }

      if (changed) {
        setState({
          frames: Array.from(localFrames),
          dotPhase: localDotPhase,
          elapsed: localElapsed,
        });
      }
    };

    const intervalId = window.setInterval(tick, 60);
    return () => window.clearInterval(intervalId);
  }, []);

  const dots = DOT_STRINGS[state.dotPhase];

  return (
    <Card title="STATUS" mode="left">
      {SPINNERS.map((spinner, i) => (
        <div key={i}>
          {spinner.frames[state.frames[i]]}
          {'  '}
          {WORDS[i]}
          {dots} {formatElapsed(state.elapsed)}
        </div>
      ))}
    </Card>
  );
};

export default OneLineLoaders;
