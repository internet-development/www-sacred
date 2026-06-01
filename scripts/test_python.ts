import { spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const REPO_ROOT = path.resolve(import.meta.dirname, '..');
const PY_ROOT = path.join(REPO_ROOT, 'scripts', 'python');
const FIXTURE_DIR = path.join(PY_ROOT, 'sacred_cli', '__tests__', 'fixtures');
const FIXTURE_PATH = path.join(FIXTURE_DIR, 'reference.json');
const DUMP_SCRIPT = path.join(REPO_ROOT, 'scripts', 'cli', 'lib', '__tests__', 'dump_reference.ts');

function probePython(): boolean {
  const probe = spawnSync('python3', ['--version'], { stdio: 'ignore' });
  return probe.status === 0;
}

if (!probePython()) {
  console.warn('[test:python] python3 not on PATH — skipping Python parity suite.');
  console.warn('[test:python] Install python3 (>=3.9) to enable byte-level parity verification.');
  process.exit(0);
}

if (!fs.existsSync(FIXTURE_DIR)) fs.mkdirSync(FIXTURE_DIR, { recursive: true });

const dump = spawnSync('npx', ['tsx', DUMP_SCRIPT], { encoding: 'utf-8' });
if (dump.status !== 0) {
  console.error('[test:python] dump_reference.ts failed:');
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
