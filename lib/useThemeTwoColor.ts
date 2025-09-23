import * as React from 'react';
import type { RGBColor } from '@lib/dither';

export type TwoColor = [RGBColor, RGBColor];

export interface ThemeTwoColorState {
  // Theme-derived two-color palette: [paper, ink] = [theme-background, theme-text]
  palette?: TwoColor;
  // Hover ink color derived from theme: theme-focused-foreground
  hoverInk?: RGBColor;
  // Convenience: direct accessors
  paper?: RGBColor;
  ink?: RGBColor;
  // Whether the values are computed and ready
  ready: boolean;
}

/**
 * useThemeTwoColor
 *
 * Derives a two-color halftone palette from CSS theme variables and recomputes
 * when the theme changes (observes body.class mutations).
 *
 * - paper = var(--theme-background)
 * - ink = var(--theme-text)
 * - hoverInk = var(--theme-focused-foreground)
 */
export function useThemeTwoColor(): ThemeTwoColorState {
  const [palette, setPalette] = React.useState<TwoColor | undefined>(undefined);
  const [hoverInk, setHoverInk] = React.useState<RGBColor | undefined>(undefined);
  const [ready, setReady] = React.useState(false);

  const parseColor = React.useCallback((value?: string | null): RGBColor | null => {
    if (!value) return null;

    // rgb/rgba(r,g,b[,a])
    const m = value.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)/i);
    if (m) {
      const r = Math.max(0, Math.min(255, Math.round(parseFloat(m[1]))));
      const g = Math.max(0, Math.min(255, Math.round(parseFloat(m[2]))));
      const b = Math.max(0, Math.min(255, Math.round(parseFloat(m[3]))));
      return [r, g, b];
    }

    // #rrggbb
    const hex6 = value.match(/^#([0-9a-f]{6})$/i);
    if (hex6) {
      const int = parseInt(hex6[1], 16);
      return [(int >> 16) & 0xff, (int >> 8) & 0xff, int & 0xff];
    }

    // #rgb
    const hex3 = value.match(/^#([0-9a-f]{3})$/i);
    if (hex3) {
      const r = parseInt(hex3[1][0] + hex3[1][0], 16);
      const g = parseInt(hex3[1][1] + hex3[1][1], 16);
      const b = parseInt(hex3[1][2] + hex3[1][2], 16);
      return [r, g, b];
    }

    return null;
  }, []);

  const compute = React.useCallback(() => {
    if (typeof window === 'undefined' || !document?.body) return;

    try {
      // Resolve theme variables via computed styles on probe elements
      const probePaper = document.createElement('div'); // --theme-background
      probePaper.style.backgroundColor = 'var(--theme-background)';

      const probeInk = document.createElement('div'); // --theme-text
      probeInk.style.color = 'var(--theme-text)';

      const probeHover = document.createElement('div'); // --theme-focused-foreground
      probeHover.style.color = 'var(--theme-focused-foreground)';

      document.body.append(probePaper, probeInk, probeHover);

      const paperStr = getComputedStyle(probePaper).backgroundColor.trim();
      const inkStr = getComputedStyle(probeInk).color.trim();
      const hoverStr = getComputedStyle(probeHover).color.trim();

      document.body.removeChild(probePaper);
      document.body.removeChild(probeInk);
      document.body.removeChild(probeHover);

      let paper = parseColor(paperStr);
      let ink = parseColor(inkStr);
      let hover = parseColor(hoverStr);

      // Fallback to body computed colors if needed
      if (!paper || !ink || !hover) {
        const bodyStyles = getComputedStyle(document.body);
        paper = paper ?? parseColor(bodyStyles.backgroundColor.trim());
        ink = ink ?? parseColor(bodyStyles.color.trim());
        hover = hover ?? ink ?? hover;
      }

      if (paper && ink) {
        setPalette([paper, ink]);
        setHoverInk(hover ?? ink);
        setReady(true);
      } else {
        // Final fallback: white paper, black ink
        setPalette([
          [255, 255, 255],
          [0, 0, 0],
        ]);
        setHoverInk([0, 0, 0]);
        setReady(true);
      }
    } catch {
      // Final fallback on unexpected errors
      setPalette([
        [255, 255, 255],
        [0, 0, 0],
      ]);
      setHoverInk([0, 0, 0]);
      setReady(true);
    }
  }, [parseColor]);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    // Initial compute
    compute();

    // Observe theme changes via body.class mutations
    const observer = new MutationObserver((mutations) => {
      for (const m of mutations) {
        if (m.type === 'attributes' && m.attributeName === 'class') {
          compute();
          break;
        }
      }
    });

    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    return () => observer.disconnect();
  }, [compute]);

  return {
    palette,
    hoverInk,
    paper: palette?.[0],
    ink: palette?.[1],
    ready,
  };
}

export default useThemeTwoColor;
