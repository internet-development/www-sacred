#!/usr/bin/env node
'use strict';

//NOTE(jimmylee): Orchestrates the Python parity + unit test suite. This script is invoked by
//NOTE(jimmylee): `npm run test:python` and chained from `npm test`. It does three things:
//NOTE(jimmylee):   1. Probes for python3 on PATH. If missing, prints a warning and exits 0 so
//NOTE(jimmylee):      sacred contributors on minimal containers can still run `npm test`.
//NOTE(jimmylee):   2. Regenerates the JS reference fixture by running scripts/cli/lib/__tests__/
//NOTE(jimmylee):      dump_reference.js — guarantees the parity test never runs against a stale
//NOTE(jimmylee):      JS snapshot.
//NOTE(jimmylee):   3. Runs `python3 -m unittest discover` against scripts/python/sacred_cli/__tests__.

const { spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const REPO_ROOT = path.resolve(__dirname, '..');
const PY_ROOT = path.join(REPO_ROOT, 'scripts', 'python');
const FIXTURE_DIR = path.join(PY_ROOT, 'sacred_cli', '__tests__', 'fixtures');
const FIXTURE_PATH = path.join(FIXTURE_DIR, 'reference.json');
const DUMP_SCRIPT = path.join(REPO_ROOT, 'scripts', 'cli', 'lib', '__tests__', 'dump_reference.js');

function probePython() {
  const probe = spawnSync('python3', ['--version'], { stdio: 'ignore' });
  return probe.status === 0;
}

if (!probePython()) {
  console.warn('[test:python] python3 not on PATH — skipping Python parity suite.');
  console.warn('[test:python] Install python3 (>=3.9) to enable byte-level parity verification.');
  process.exit(0);
}

if (!fs.existsSync(FIXTURE_DIR)) fs.mkdirSync(FIXTURE_DIR, { recursive: true });

const dump = spawnSync('node', [DUMP_SCRIPT], { encoding: 'utf-8' });
if (dump.status !== 0) {
  console.error('[test:python] dump_reference.js failed:');
  process.stderr.write(dump.stderr || '');
  process.exit(dump.status || 1);
}
fs.writeFileSync(FIXTURE_PATH, dump.stdout);

const result = spawnSync(
  'python3',
  ['-m', 'unittest', 'discover', '-s', 'sacred_cli/__tests__', '-t', '.', '-v'],
  { cwd: PY_ROOT, stdio: 'inherit' }
);
process.exit(result.status === null ? 1 : result.status);
