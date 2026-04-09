"""Tests for the sacred CLI button primitives. Mirrors scripts/cli/lib/__tests__/button.test.mjs."""

import unittest

from . import _bootstrap  # noqa: F401

from sacred_cli.ansi import strip
from sacred_cli.button import button, button_row


class TestButton(unittest.TestCase):
    def test_uppercases_label(self):
        b = button("ESC", "exit")
        self.assertEqual(strip(b), " ESC  EXIT ")

    def test_arrow_glyph_hotkey(self):
        b = button("\u2192", "next")
        self.assertEqual(strip(b), " \u2192  NEXT ")


class TestButtonRow(unittest.TestCase):
    def test_justifies_left_and_right(self):
        left = button("ESC", "exit")
        right = button("\u21B5", "select")
        row = button_row(left, right, 60)
        visible = strip(row)
        self.assertEqual(len(visible), 60)
        self.assertTrue(visible.startswith(" ESC  EXIT"))
        self.assertTrue(visible.rstrip().endswith("SELECT"))


if __name__ == "__main__":
    unittest.main()
