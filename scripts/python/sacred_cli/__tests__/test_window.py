"""Tests for the sacred CLI window primitives. Mirrors scripts/cli/lib/__tests__/window.test.mjs."""

import unittest

from . import _bootstrap  # noqa: F401

from sacred_cli.ansi import strip
from sacred_cli.window import (
    MARGIN,
    MIN_INNER_W,
    MIN_TERM_W,
    SHADOW_W,
    get_inner_width,
    shadow_bottom_row,
    wrap_line,
    wrap_line_top,
    wrap_lines,
)


class TestLayoutConstants(unittest.TestCase):
    def test_documented_values(self):
        self.assertEqual(MARGIN, 2)
        self.assertEqual(SHADOW_W, 1)
        self.assertEqual(MIN_INNER_W, 20)
        self.assertEqual(MIN_TERM_W, 2 * MARGIN + SHADOW_W + MIN_INNER_W)


class TestGetInnerWidth(unittest.TestCase):
    def test_subtracts_margins_and_shadow(self):
        self.assertEqual(get_inner_width(80), 80 - 2 * MARGIN - SHADOW_W)

    def test_clamps_to_minimum(self):
        self.assertEqual(get_inner_width(5), 10)


class TestWrapping(unittest.TestCase):
    def test_wrap_line_full_width(self):
        inner_w = get_inner_width(80)
        wrapped = wrap_line("content", inner_w)
        # NOTE(jimmylee): visual width = MARGIN + inner_w + SHADOW_W + (MARGIN - SHADOW_W).
        self.assertEqual(len(strip(wrapped)), MARGIN + inner_w + SHADOW_W + (MARGIN - SHADOW_W))

    def test_wrap_line_top_no_right_shadow(self):
        inner_w = get_inner_width(80)
        top = wrap_line_top("first", inner_w)
        self.assertEqual(len(strip(top)), MARGIN + inner_w + MARGIN)

    def test_shadow_bottom_row_offset(self):
        inner_w = get_inner_width(80)
        bottom = shadow_bottom_row(inner_w)
        self.assertEqual(len(strip(bottom)), MARGIN + SHADOW_W + inner_w + (MARGIN - SHADOW_W))

    def test_wrap_lines_n_plus_one(self):
        out = wrap_lines(["a", "b", "c"], 80)
        self.assertEqual(len(out), 4)


if __name__ == "__main__":
    unittest.main()
