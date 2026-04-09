"""Tests for the sacred CLI ANSI primitives. Mirrors scripts/cli/lib/__tests__/ansi.test.mjs."""

import unittest

from . import _bootstrap  # noqa: F401

from sacred_cli.ansi import (
    COLORS,
    RESET_FG,
    bg_hex,
    fg_hex,
    gradient_text,
    pad_l,
    pad_r,
    strip,
    truncate_visible,
    vis_len,
)


class TestFgBgHex(unittest.TestCase):
    def test_fg_white(self):
        self.assertEqual(fg_hex("#ffffff"), "\x1b[38;2;255;255;255m")

    def test_bg_window(self):
        self.assertEqual(bg_hex("#262626"), "\x1b[48;2;38;38;38m")

    def test_fg_no_hash(self):
        self.assertEqual(fg_hex("e4f221"), "\x1b[38;2;228;242;33m")


class TestStripVisLen(unittest.TestCase):
    def test_removes_escapes(self):
        colored = f"{fg_hex('#ff0000')}sacred{RESET_FG}"
        self.assertEqual(strip(colored), "sacred")
        self.assertEqual(vis_len(colored), 6)


class TestPad(unittest.TestCase):
    def test_pad_r(self):
        self.assertEqual(pad_r("foo", 6), "foo   ")

    def test_pad_l(self):
        self.assertEqual(pad_l("foo", 6), "   foo")

    def test_pad_r_truncates(self):
        padded = pad_r("hello world", 5)
        self.assertLessEqual(len(strip(padded)), 5)


class TestTruncateVisible(unittest.TestCase):
    def test_appends_reset_fg(self):
        out = truncate_visible(f"{fg_hex('#ff0000')}sacredXXX", 6)
        self.assertTrue(out.endswith(RESET_FG))
        self.assertEqual(strip(out), "sacred")


class TestGradientText(unittest.TestCase):
    def test_emits_one_escape_per_char(self):
        out = gradient_text("abc", "#000000", "#ffffff")
        self.assertEqual(strip(out), "abc")
        self.assertTrue(out.endswith(RESET_FG))

    def test_empty_input(self):
        self.assertEqual(gradient_text("", "#000000", "#ffffff"), "")


class TestColors(unittest.TestCase):
    def test_palette_loaded(self):
        self.assertEqual(COLORS["windowBg"], "#3a3a3a")
        self.assertEqual(COLORS["text"], "#ffffff")
        self.assertEqual(COLORS["brand"], "#e4f221")


if __name__ == "__main__":
    unittest.main()
