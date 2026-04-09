"""Tests for the sacred CLI table primitives. Mirrors scripts/cli/lib/__tests__/table.test.mjs."""

import unittest

from . import _bootstrap  # noqa: F401

from sacred_cli.ansi import strip
from sacred_cli.table import format_row, kv_table, kv_table_gradient

SPEC = [
    {"width": 10, "align": "left"},
    {"width": 12, "align": "left", "grow": True},
    {"width": 8, "align": "right", "status": True, "gap": 2},
]


class TestFormatRow(unittest.TestCase):
    def test_aligns_columns(self):
        row = format_row(["name", "value", "OPEN"], SPEC, 60)
        visible = strip(row)
        self.assertIn("name", visible)
        self.assertIn("value", visible)
        # NOTE(jimmylee): right-aligned status column ends with the status text.
        self.assertTrue(visible.rstrip().endswith("OPEN"))

    def test_active_status_color(self):
        row = format_row(["x", "y", "OPEN"], SPEC, 60)
        self.assertIn("\x1b[1m", row)
        self.assertIn("38;2;0;255;0", row)

    def test_terminal_status_color(self):
        row = format_row(["x", "y", "CLOSED"], SPEC, 60)
        self.assertIn("38;2;168;168;168", row)


class TestKvTable(unittest.TestCase):
    def test_24ch_keys(self):
        lines = kv_table([("PROJECT", "sacred")])
        self.assertEqual(len(lines), 1)
        self.assertTrue(lines[0].startswith("PROJECT"))
        self.assertEqual(strip(lines[0]), "PROJECT".ljust(24, " ") + "sacred")


class TestKvTableGradient(unittest.TestCase):
    def test_per_char_gradient(self):
        lines = kv_table_gradient([("STATUS", "OK")])
        self.assertEqual(len(lines), 1)
        # NOTE(jimmylee): each character of the value gets its own fg escape.
        self.assertEqual(lines[0].count("38;2;"), 2)


if __name__ == "__main__":
    unittest.main()
