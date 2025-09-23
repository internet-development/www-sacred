
import styles from '@components/page/DefaultActionBar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { toggleDebugGrid } from '@components/DebugGrid';
import { useHotkeys } from '@modules/hotkeys';

import ActionBar from '@components/ActionBar';
import ButtonGroup from '@components/ButtonGroup';

function isElement(target: EventTarget | null): target is Element {
  return target instanceof Element;
}

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}

const findFocusableParent = (element: Element | null): Element | null => {
  while (element) {
    element = element.parentElement;
    if (element && Utilities.isFocusableElement(element)) {
      return element;
    }
  }
  return null;
};

const findNextFocusableSibling = (element: Element, direction: 'next' | 'previous'): HTMLElement | null => {
  let sibling = direction === 'next' ? element.nextElementSibling : element.previousElementSibling;

  while (sibling) {
    if (Utilities.isFocusableElement(sibling)) {
      return sibling as HTMLElement;
    }

    const focusableDescendant = Utilities.findFocusableDescendant(sibling, null, direction);
    if (focusableDescendant) {
      return focusableDescendant;
    }

    sibling = direction === 'next' ? sibling.nextElementSibling : sibling.previousElementSibling;
  }

  return null;
};

const findNextFocusableAncestor = (element: Element, direction: 'next' | 'previous'): HTMLElement | null => {
  let ancestor = element.parentElement;

  while (ancestor) {
    const nextFocusable = findNextFocusableSibling(ancestor, direction);
    if (nextFocusable) {
      return nextFocusable;
    }
    ancestor = ancestor.parentElement;
  }

  return null;
};

const useGlobalNavigationHotkeys = () => {
  const onHandleSubmit = (event: KeyboardEvent) => {
    const target = event.target;
    if (Utilities.isFocusableElement(target)) {
      event.preventDefault();
      (target as HTMLElement).click();
    }
  };

  const onHandleNextFocus = (event: KeyboardEvent) => {
    const target = event.target;

    if (Utilities.isFocusableElement(target)) {
      event.preventDefault();

      const nextFocusable = Utilities.findNextFocusable(target as Element, 'next');
      if (nextFocusable) {
        nextFocusable.focus();
      }
    }
  };

  const onHandlePreviousFocus = (event: KeyboardEvent) => {
    const target = event.target;

    if (Utilities.isFocusableElement(target)) {
      event.preventDefault();

      const previousFocusable = Utilities.findNextFocusable(target as Element, 'previous');
      if (previousFocusable) {
        previousFocusable.focus();
      }
    }
  };

  useHotkeys('ArrowDown', onHandleNextFocus);
  useHotkeys('ArrowUp', onHandlePreviousFocus);
  useHotkeys('ArrowRight', onHandleNextFocus);
  useHotkeys('ArrowLeft', onHandlePreviousFocus);
  useHotkeys('Enter', onHandleSubmit);
  useHotkeys(' ', onHandleSubmit);
};

interface DefaultActionBarProps {
  items?: {
    hotkey: string;
    onClick: () => void;
    body: React.ReactNode;
    items?: any;
  }[];
}

const DefaultActionBar: React.FC<DefaultActionBarProps> = ({ items = [] }) => {
  const [isGrid, setGrid] = React.useState(false);
  const [currentFont, setCurrentFont] = React.useState<string>('');
  const [currentTheme, setCurrentTheme] = React.useState<string>('');

  // Track current font and theme from body classes
  React.useEffect(() => {
    const updateCurrent = () => {
      const bodyClasses = Array.from(document.body.classList);
      const fontClass = bodyClasses.find(c => c.startsWith('font-use-')) || '';
      const themeClass = bodyClasses.find(c => c.startsWith('theme-')) || 'theme-black-amber';
      setCurrentFont(fontClass);
      setCurrentTheme(themeClass);
    };

    updateCurrent();

    // Watch for class changes
    const observer = new MutationObserver(updateCurrent);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  useHotkeys('ctrl+g', () => toggleDebugGrid());

  useGlobalNavigationHotkeys();

  const handleFontChange = (className: string) => {
    Utilities.onHandleFontChange(className);
    setCurrentFont(className);
  };

  const handleThemeChange = (className: string) => {
    Utilities.onHandleThemeChange(className);
    setCurrentTheme(className);
  };

  return (
    <div className={styles.root}>
      <ActionBar
        items={[
          {
            hotkey: '⌃+O',
            body: 'Fonts',
            openHotkey: 'ctrl+o',
            items: [
              // Default
              {
                icon: currentFont === 'font-use-geist-mono' || !currentFont ? '●' : '○',
                children: 'Geist Mono (Default)',
                onClick: () => handleFontChange('font-use-geist-mono'),
              },

              // Open Source Fonts
              {
                icon: '─',
                children: '─── Open Source ───',
                disabled: true,
              },
              {
                icon: currentFont === 'font-use-iosevka-term' ? '●' : '○',
                children: 'Iosevka Term',
                onClick: () => handleFontChange('font-use-iosevka-term'),
              },
              {
                icon: currentFont === 'font-use-commit-mono' ? '●' : '○',
                children: 'Commit Mono',
                onClick: () => handleFontChange('font-use-commit-mono'),
              },
              {
                icon: currentFont === 'font-use-departure-mono' ? '●' : '○',
                children: 'Departure Mono',
                onClick: () => handleFontChange('font-use-departure-mono'),
              },
              {
                icon: currentFont === 'font-use-fira-code' ? '●' : '○',
                children: 'Fira Code',
                onClick: () => handleFontChange('font-use-fira-code'),
              },
              {
                icon: currentFont === 'font-use-fragment-mono' ? '●' : '○',
                children: 'Fragment Mono',
                onClick: () => handleFontChange('font-use-fragment-mono'),
              },
              {
                icon: currentFont === 'font-use-jet-brains-mono' ? '●' : '○',
                children: 'JetBrains Mono',
                onClick: () => handleFontChange('font-use-jet-brains-mono'),
              },
              {
                icon: currentFont === 'font-use-sfmono-square' ? '●' : '○',
                children: 'SFMono Square',
                onClick: () => handleFontChange('font-use-sfmono-square'),
              },
              {
                icon: currentFont === 'font-use-server-mono' ? '●' : '○',
                children: 'Server Mono',
                onClick: () => handleFontChange('font-use-server-mono'),
              },

              // Monaspace Family
              {
                icon: '─',
                children: '─── Monaspace ───',
                disabled: true,
              },
              {
                icon: currentFont === 'font-use-monaspace-neon' ? '●' : '○',
                children: 'Neon',
                onClick: () => handleFontChange('font-use-monaspace-neon'),
              },
              {
                icon: currentFont === 'font-use-monaspace-argon' ? '●' : '○',
                children: 'Argon',
                onClick: () => handleFontChange('font-use-monaspace-argon'),
              },
              {
                icon: currentFont === 'font-use-monaspace-krypton' ? '●' : '○',
                children: 'Krypton',
                onClick: () => handleFontChange('font-use-monaspace-krypton'),
              },
              {
                icon: currentFont === 'font-use-monaspace-radon' ? '●' : '○',
                children: 'Radon',
                onClick: () => handleFontChange('font-use-monaspace-radon'),
              },
              {
                icon: currentFont === 'font-use-monaspace-xenon' ? '●' : '○',
                children: 'Xenon',
                onClick: () => handleFontChange('font-use-monaspace-xenon'),
              },

              // Google Fonts
              {
                icon: '─',
                children: '─── Google Fonts ───',
                disabled: true,
              },
              {
                icon: currentFont === 'font-use-anonymous-pro' ? '●' : '○',
                children: 'Anonymous Pro',
                onClick: () => handleFontChange('font-use-anonymous-pro'),
              },
              {
                icon: currentFont === 'font-use-chivo-mono' ? '●' : '○',
                children: 'Chivo Mono',
                onClick: () => handleFontChange('font-use-chivo-mono'),
              },
              {
                icon: currentFont === 'font-use-doto' ? '●' : '○',
                children: 'Doto',
                onClick: () => handleFontChange('font-use-doto'),
              },
              {
                icon: currentFont === 'font-use-share-tech-mono' ? '●' : '○',
                children: 'Share Tech Mono',
                onClick: () => handleFontChange('font-use-share-tech-mono'),
              },
              {
                icon: currentFont === 'font-use-space-mono' ? '●' : '○',
                children: 'Space Mono',
                onClick: () => handleFontChange('font-use-space-mono'),
              },
              {
                icon: currentFont === 'font-use-syne-mono' ? '●' : '○',
                children: 'Syne Mono',
                onClick: () => handleFontChange('font-use-syne-mono'),
              },
              {
                icon: currentFont === 'font-use-vt323' ? '●' : '○',
                children: 'VT323',
                onClick: () => handleFontChange('font-use-vt323'),
              },
              {
                icon: currentFont === 'font-use-victor-mono' ? '●' : '○',
                children: 'Victor Mono',
                onClick: () => handleFontChange('font-use-victor-mono'),
              },
              {
                icon: currentFont === 'font-use-workbench' ? '●' : '○',
                children: 'Workbench',
                onClick: () => handleFontChange('font-use-workbench'),
              },
              {
                icon: currentFont === 'font-use-xanh-mono' ? '●' : '○',
                children: 'Xanh Mono',
                onClick: () => handleFontChange('font-use-xanh-mono'),
              },

              // Premium/Self-hosted
              {
                icon: '─',
                children: '─── Premium ───',
                disabled: true,
              },
              {
                icon: currentFont === 'font-use-berkeley-mono' ? '●' : '○',
                children: 'Berkeley Mono™',
                onClick: () => handleFontChange('font-use-berkeley-mono'),
              },
              {
                icon: currentFont === 'font-use-julia-mono' ? '●' : '○',
                children: 'JuliaMono',
                onClick: () => handleFontChange('font-use-julia-mono'),
              },
              {
                icon: currentFont === 'font-use-tt2020' ? '●' : '○',
                children: 'TT2020',
                onClick: () => handleFontChange('font-use-tt2020'),
              },
              {
                icon: currentFont === 'font-use-latin-modern-mono' ? '●' : '○',
                children: 'Latin Modern Mono',
                onClick: () => handleFontChange('font-use-latin-modern-mono'),
              },
              {
                icon: currentFont === 'font-use-serious-shanns' ? '●' : '○',
                children: 'Serious Shanns',
                onClick: () => handleFontChange('font-use-serious-shanns'),
              },
            ],
          },
          {
            hotkey: '⌃+T',
            body: 'Theme',
            openHotkey: 'ctrl+t',
            items: [
              // Light themes
              {
<<<<<<< HEAD
                icon: '─',
                children: '─── Light ───',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-light' ? '●' : '○',
                children: 'Refined White',
                onClick: () => handleThemeChange('theme-light'),
              },

              // Dark themes
              {
                icon: '─',
                children: '─── Dark ───',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-dark' ? '●' : '○',
                children: 'Midnight Vapor',
                onClick: () => handleThemeChange('theme-dark'),
              },
              {
                icon: currentTheme === 'theme-blue' ? '●' : '○',
                children: 'Operation Blue',
                onClick: () => handleThemeChange('theme-blue'),
              },
              {
                icon: currentTheme === 'theme-green' ? '●' : '○',
                children: 'Neon Garden',
                onClick: () => handleThemeChange('theme-green'),
              },

              // Terminal/CRT themes
              {
                icon: '─',
                children: '─── Terminal ───',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-black-amber' || !currentTheme ? '●' : '○',
                children: 'Amber CRT (Default)',
                onClick: () => handleThemeChange('theme-black-amber'),
              },
              {
                icon: currentTheme === 'theme-black-red' ? '●' : '○',
                children: 'Code Red',
                onClick: () => handleThemeChange('theme-black-red'),
              },
              {
                icon: currentTheme === 'theme-black-teal' ? '●' : '○',
                children: 'Bioluminescence',
                onClick: () => handleThemeChange('theme-black-teal'),
              },
              {
                icon: currentTheme === 'theme-black-green' ? '●' : '○',
                children: 'AS/400 Green',
                onClick: () => handleThemeChange('theme-black-green'),
=======
                icon: '⊹',
                children: 'Amber CRT',
                onClick: () => Utilities.onHandleThemeChange('theme-black-amber'),
              },
              {
                icon: '⊹',
                children: 'White',
                onClick: () => Utilities.onHandleThemeChange('theme-light'),
              },
              {
                icon: '⊹',
                children: 'Midnight',
                onClick: () => Utilities.onHandleThemeChange('theme-dark'),
              },
              {
                icon: '⊹',
                children: 'Code Red',
                onClick: () => Utilities.onHandleThemeChange('theme-black-red'),
              },
              {
                icon: '⊹',
                children: 'Bioluminescent',
                onClick: () => Utilities.onHandleThemeChange('theme-black-teal'),
              },
              {
                icon: '⊹',
                children: 'Safe Blue',
                onClick: () => Utilities.onHandleThemeChange('theme-blue'),
              },
              {
                icon: '⊹',
                children: 'Neon Green',
                onClick: () => Utilities.onHandleThemeChange('theme-green'),
              },
              {
                icon: '⊹',
                children: 'AS/400',
                onClick: () => Utilities.onHandleThemeChange('theme-black-green'),
>>>>>>> bffebd4 (Add 30+ new themed color schemes from sci-fi and retro UIs)
              },
              {
                icon: '⊹',
                children: 'LCARS',
                onClick: () => Utilities.onHandleThemeChange('theme-lcars'),
              },
              {
                icon: '⊹',
                children: 'Hologram',
                onClick: () => Utilities.onHandleThemeChange('theme-hologram'),
              },
              {
                icon: '⊹',
                children: 'Blade Runner 2049',
                onClick: () => Utilities.onHandleThemeChange('theme-blade'),
              },
              {
                icon: '⊹',
                children: 'Nostromo',
                onClick: () => Utilities.onHandleThemeChange('theme-nostromo'),
              },
              {
                icon: '⊹',
                children: 'Tron',
                onClick: () => Utilities.onHandleThemeChange('theme-tron'),
              },
              {
                icon: '⊹',
                children: 'WOPR',
                onClick: () => Utilities.onHandleThemeChange('theme-wopr'),
              },
              {
                icon: '⊹',
                children: 'Minority Report',
                onClick: () => Utilities.onHandleThemeChange('theme-minority'),
              },
              {
                icon: '⊹',
                children: 'GitS',
                onClick: () => Utilities.onHandleThemeChange('theme-gits'),
              },
              {
                icon: '⊹',
                children: 'MCRN',
                onClick: () => Utilities.onHandleThemeChange('theme-mcrn'),
              },
              {
                icon: '⊹',
                children: 'Westworld',
                onClick: () => Utilities.onHandleThemeChange('theme-westworld'),
              },
              {
                icon: '⊹',
                children: 'Windows 95',
                onClick: () => Utilities.onHandleThemeChange('theme-win95'),
              },
              {
                icon: '⊹',
                children: 'Mac OS 9',
                onClick: () => Utilities.onHandleThemeChange('theme-macos9'),
              },
              {
                icon: '⊹',
                children: 'NERV',
                onClick: () => Utilities.onHandleThemeChange('theme-nerv'),
              },
              {
                icon: '⊹',
                children: 'Neo-Tokyo',
                onClick: () => Utilities.onHandleThemeChange('theme-akira'),
              },
              {
                icon: '⊹',
                children: 'Deus Ex',
                onClick: () => Utilities.onHandleThemeChange('theme-deus'),
              },
              {
                icon: '⊹',
                children: 'Hotline Miami',
                onClick: () => Utilities.onHandleThemeChange('theme-hotline'),
              },
              {
                icon: '⊹',
                children: 'Outrun',
                onClick: () => Utilities.onHandleThemeChange('theme-outrun'),
              },
              {
                icon: '⊹',
                children: 'Aperture Science',
                onClick: () => Utilities.onHandleThemeChange('theme-aperture'),
              },
            ],
          },
          {
            hotkey: '⌃+G',
            onClick: () => {
              toggleDebugGrid();
            },
            body: 'Grid',
            selected: false,
          },
          ...items,
        ]}
      />
    </div>
  );
};

export default DefaultActionBar;
