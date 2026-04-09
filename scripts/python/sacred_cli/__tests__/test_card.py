"""Tests for the sacred CLI card primitives. Mirrors scripts/cli/lib/__tests__/card.test.mjs."""

import unittest

from . import _bootstrap  # noqa: F401

from sacred_cli.ansi import strip
from sacred_cli.card import (
    B,
    card_bot,
    card_header_row,
    card_row,
    card_select_row,
    card_top,
    word_wrap,
)


class TestCardTopBot(unittest.TestCase):
    def test_card_top(self):
        top = card_top("SUMMARY", 30)
        self.assertTrue(top.startswith(B["tl"] + B["h"]))
        self.assertTrue(top.endswith(B["tr"]))
        self.assertIn("SUMMARY", top)
        self.assertEqual(len(top), 30)

    def test_card_bot(self):
        bot = card_bot(20)
        self.assertTrue(bot.startswith(B["bl"]))
        self.assertTrue(bot.endswith(B["br"]))
        self.assertEqual(len(bot), 20)


class TestCardRow(unittest.TestCase):
    def test_padded_to_width(self):
        row = card_row("hello", 20)
        self.assertEqual(len(strip(row)), 20)
        self.assertTrue(row.startswith(B["v"]))
        self.assertTrue(row.endswith(B["v"]))


class TestCardSelectRow(unittest.TestCase):
    def test_plain_when_unselected(self):
        row = card_select_row("item", 20, False)
        self.assertEqual(len(strip(row)), 20)
        self.assertNotIn("\x1b[7m", row)

    def test_inverse_when_selected(self):
        row = card_select_row("item", 20, True)
        self.assertIn("\x1b[7m", row)


class TestCardHeaderRow(unittest.TestCase):
    def test_table_header_background(self):
        row = card_header_row("NAME", 20)
        self.assertEqual(len(strip(row)), 20)
        # NOTE(jimmylee): #585858 → 88,88,88 → bg escape signature.
        self.assertIn("48;2;88;88;88", row)


class TestWordWrap(unittest.TestCase):
    def test_splits_long_text(self):
        lines = word_wrap("the quick brown fox jumps over the lazy dog", 12)
        for line in lines:
            self.assertLessEqual(len(line), 12)
        self.assertEqual(" ".join(lines), "the quick brown fox jumps over the lazy dog")

    def test_short_input(self):
        self.assertEqual(word_wrap("short", 20), ["short"])


if __name__ == "__main__":
    unittest.main()
