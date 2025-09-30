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
      const fontClass = bodyClasses.find((c) => c.startsWith('font-use-')) || '';
      const themeClass = bodyClasses.find((c) => c.startsWith('theme-')) || 'theme-black-amber';
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
              // Open Source Fonts
              {
                icon: '─',
                children: '',
                disabled: true,
              },
              // Default
              {
                icon: currentFont === 'font-use-geist-mono' || !currentFont ? '●' : '○',
                children: 'Geist Mono (Default)',
                onClick: () => handleFontChange('font-use-geist-mono'),
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
                icon: currentFont === 'font-use-fira-code' ? '●' : '○',
                children: 'Fira Code',
                onClick: () => handleFontChange('font-use-fira-code'),
              },

              {
                icon: currentFont === 'font-use-sfmono-square' ? '●' : '○',
                children: 'SFMono Square',
                onClick: () => handleFontChange('font-use-sfmono-square'),
              },

              // Monaspace Family
              // Monospace fonts - spacer
              {
                icon: '',
                children: '',
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
                children: '',
                disabled: true,
              },
              {
                icon: currentFont === 'font-use-anonymous-pro' ? '●' : '○',
                children: 'Anonymous Pro',
                onClick: () => handleFontChange('font-use-anonymous-pro'),
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

              // Downloaded fonts - spacer
              {
                icon: '',
                children: '',
                disabled: true,
              },
              {
                icon: currentFont === 'font-use-atkinson-hyperlegible-mono' ? '●' : '○',
                children: 'Atkinson Hyperlegible Mono',
                onClick: () => handleFontChange('font-use-atkinson-hyperlegible-mono'),
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
              // Light themes - spacer
              {
                icon: '',
                children: '',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-light' ? '●' : '○',
                children: 'Highlight',
                onClick: () => handleThemeChange('theme-light'),
              },
              {
                icon: currentTheme === 'theme-aperture' ? '●' : '○',
                children: 'Aperture',
                onClick: () => handleThemeChange('theme-aperture'),
              },
              {
                icon: currentTheme === 'theme-westworld' ? '●' : '○',
                children: 'Westworld',
                onClick: () => handleThemeChange('theme-westworld'),
              },

              // Dark themes - spacer
              {
                icon: '',
                children: '',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-dark' ? '●' : '○',
                children: 'Midnight',
                onClick: () => handleThemeChange('theme-dark'),
              },
              {
                icon: currentTheme === 'theme-blue' ? '●' : '○',
                children: 'BSOD',
                onClick: () => handleThemeChange('theme-blue'),
              },
              {
                icon: currentTheme === 'theme-green' ? '●' : '○',
                children: 'Matrix',
                onClick: () => handleThemeChange('theme-green'),
              },

              // Terminal/CRT themes - spacer
              {
                icon: '',
                children: '',
                disabled: true,
              },

              {
                icon: currentTheme === 'theme-black-green' ? '●' : '○',
                children: 'Phosphor',
                onClick: () => handleThemeChange('theme-black-green'),
              },
              {
                icon: currentTheme === 'theme-black-amber' || !currentTheme ? '●' : '○',
                children: 'Sulfur',
                onClick: () => handleThemeChange('theme-black-amber'),
              },
              {
                icon: currentTheme === 'theme-black-red' ? '●' : '○',
                children: 'Neon',
                onClick: () => handleThemeChange('theme-black-red'),
              },

              // Sci-Fi themes
              // System fonts - spacer
              {
                icon: '',
                children: '',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-lcars' ? '●' : '○',
                children: 'LCARS',
                onClick: () => handleThemeChange('theme-lcars'),
              },
              {
                icon: currentTheme === 'theme-hologram' ? '●' : '○',
                children: 'Hologram',
                onClick: () => handleThemeChange('theme-hologram'),
              },
              {
                icon: currentTheme === 'theme-blade' ? '●' : '○',
                children: '2049',
                onClick: () => handleThemeChange('theme-blade'),
              },
              {
                icon: currentTheme === 'theme-nostromo' ? '●' : '○',
                children: 'Nostromo',
                onClick: () => handleThemeChange('theme-nostromo'),
              },
              {
                icon: currentTheme === 'theme-nerv' ? '●' : '○',
                children: 'NERV',
                onClick: () => handleThemeChange('theme-nerv'),
              },
              {
                icon: currentTheme === 'theme-akira' ? '●' : '○',
                children: 'Neo-Tokyo',
                onClick: () => handleThemeChange('theme-akira'),
              },

              // Retro/Gaming themes - spacer
              {
                icon: '',
                children: '',
                disabled: true,
              },
              {
                icon: currentTheme === 'theme-win95' ? '●' : '○',
                children: 'Windows 95',
                onClick: () => handleThemeChange('theme-win95'),
              },
              {
                icon: currentTheme === 'theme-macos9' ? '●' : '○',
                children: 'Mac OS 9',
                onClick: () => handleThemeChange('theme-macos9'),
              },
              {
                icon: currentTheme === 'theme-outrun' ? '●' : '○',
                children: 'Outrun',
                onClick: () => handleThemeChange('theme-outrun'),
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
