
import styles from '@components/Avatar.module.scss';
import Dither from '@components/dither';
import * as React from 'react';
import * as Utilities from '@common/utilities';
import type { RGBColor } from '@lib/dither';

interface AvatarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'style' | 'className' | 'children'> {
  src?: string;
  href?: string;
  target?: string;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  alt?: string;
}

/**
 * Avatar
 * - Computes theme colors from CSS variables to build a two-color halftone palette:
 *   base = [theme-background (paper), theme-text (ink)]
 *   hover/focus ink = theme-focused-foreground
 * - Recomputes palette when the theme (body class) changes.
 * - Proxies remote images through a local API to avoid tainted canvas issues.
 * - Uses Dither in twoColor mode only (no CRT animation).
 */
const Avatar: React.FC<AvatarProps> = (props) => {
  const { src, alt, style: propStyle, href, target, children, ...rest } = props;

  // Palette is [paper, baseInk] = [theme-background, theme-text]
  const [palette, setPalette] = React.useState<RGBColor[] | undefined>();
  // Hover ink (theme-focused-foreground)
  const [hoverInk, setHoverInk] = React.useState<RGBColor | undefined>();
  const [active, setActive] = React.useState(false);

  // Parse rgb/rgba strings into [r,g,b]
  const parseColor = React.useCallback((colorStr: string | null | undefined): RGBColor | null => {
    if (!colorStr) return null;
    // Match rgb(r,g,b) or rgba(r,g,b,a)
    const match = colorStr.match(/rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+)\s*)?\)/i);
    if (!match) return null;
    const r = Math.max(0, Math.min(255, Math.round(parseFloat(match[1]))));
    const g = Math.max(0, Math.min(255, Math.round(parseFloat(match[2]))));
    const b = Math.max(0, Math.min(255, Math.round(parseFloat(match[3]))));
    return [r, g, b];
  }, []);

  // Compute theme-derived colors and set palette/hoverInk
  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const compute = () => {
      try {
        // Create probe elements to resolve CSS variables to actual computed colors
        const probeText = document.createElement('div'); // theme-text (base ink)
        probeText.style.color = 'var(--theme-text)';

        const probeFocus = document.createElement('div'); // theme-focused-foreground (hover ink)
        probeFocus.style.color = 'var(--theme-focused-foreground)';

        const probeBg = document.createElement('div'); // theme-background (paper)
        probeBg.style.backgroundColor = 'var(--theme-background)';

        document.body.append(probeText, probeFocus, probeBg);

        const themeText = getComputedStyle(probeText).color.trim();
        const themeFocus = getComputedStyle(probeFocus).color.trim();
        const themeBg = getComputedStyle(probeBg).backgroundColor.trim();

        document.body.removeChild(probeText);
        document.body.removeChild(probeFocus);
        document.body.removeChild(probeBg);

        let textColor = parseColor(themeText);
        let focusedColor = parseColor(themeFocus);
        let backgroundColor = parseColor(themeBg);

        // Fallback to body computed colors if needed
        if (!textColor || !backgroundColor || !focusedColor) {
          const bodyStyles = getComputedStyle(document.body);
          textColor = textColor ?? parseColor(bodyStyles.color.trim());
          backgroundColor = backgroundColor ?? parseColor(bodyStyles.backgroundColor.trim());
          // If focus color not available, fallback to text color
          focusedColor = focusedColor ?? textColor ?? focusedColor;
        }

        if (backgroundColor && textColor) {
          setPalette([backgroundColor, textColor]);
          setHoverInk(focusedColor ?? textColor);
        } else {
          // Final fallback: white paper, black ink
          setPalette([
            [255, 255, 255],
            [0, 0, 0],
          ]);
          setHoverInk([0, 0, 0]);
        }
      } catch {
        // Final fallback: white paper, black ink
        setPalette([
          [255, 255, 255],
          [0, 0, 0],
        ]);
        setHoverInk([0, 0, 0]);
      }
    };

    // Initial compute
    compute();

    // Recompute when theme (body class) changes
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
  }, [parseColor]);

  // Trim the raw src once; Dither handles proxying/fallback logic internally.
  const imageSrc = React.useMemo(() => (typeof src === 'string' ? src.trim() : ''), [src]);

  let avatarElement: React.ReactNode;

  if (imageSrc && palette) {
    const twoColor: [RGBColor, RGBColor] = [palette[0], active && hoverInk ? hoverInk : palette[1]];
    const ditherElement = <Dither src={imageSrc} alt={alt ?? ''} width={38} height={38} twoColor={twoColor} className={styles.ditherCanvas} />;

    if (href) {
      avatarElement = (
        <a className={Utilities.classNames(styles.root, styles.link)} href={href} target={target} tabIndex={0} role="link" onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} onFocus={() => setActive(true)} onBlur={() => setActive(false)}>
          {ditherElement}
        </a>
      );
    } else {
      avatarElement = (
        <figure className={styles.root} onMouseEnter={() => setActive(true)} onMouseLeave={() => setActive(false)} onFocus={() => setActive(true)} onBlur={() => setActive(false)} style={propStyle}>
          {ditherElement}
        </figure>
      );
    }
  } else {
    // Placeholder while palette not yet computed or no src provided
    if (href) {
      avatarElement = <a className={styles.placeholder} style={propStyle} href={href} target={target} tabIndex={0} role="link" />;
    } else {
      avatarElement = <figure className={styles.placeholder} style={propStyle} />;
    }
  }

  if (!children) {
    return avatarElement as React.ReactElement;
  }

  return (
    <div className={styles.parent} {...rest}>
      {avatarElement}
      <span className={styles.right}>{children}</span>
    </div>
  );
};

export default Avatar;
