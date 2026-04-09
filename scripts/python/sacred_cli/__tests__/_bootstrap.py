"""Test bootstrap. Adds scripts/python/ to sys.path so `import sacred_cli` works during
unittest discovery regardless of where python3 is invoked from."""

import os
import sys

_HERE = os.path.dirname(os.path.abspath(__file__))
_PY_ROOT = os.path.normpath(os.path.join(_HERE, "..", ".."))
if _PY_ROOT not in sys.path:
    sys.path.insert(0, _PY_ROOT)
