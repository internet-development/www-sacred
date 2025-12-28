'use client';

import styles from '@components/page/DefaultActionBar.module.css';

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
  useHotkeys('ctrl+g', () => toggleDebugGrid());

  useGlobalNavigationHotkeys();

  React.useEffect(() => {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

    const applyTheme = (e: MediaQueryList | MediaQueryListEvent) => {
      if (e.matches) {
        Utilities.onHandleAppearanceChange('theme-dark');
      } else {
        Utilities.onHandleAppearanceChange('');
      }
    };

    applyTheme(prefersDark);

    prefersDark.addEventListener('change', applyTheme);

    return () => {
      prefersDark.removeEventListener('change', applyTheme);
    };
  }, []);

  return (
    <div className={styles.root}>
      <ActionBar
        items={[
          {
            hotkey: '⌃+O',
            body: 'Fonts',
            openHotkey: 'ctrl+o',
            items: [
              {
                icon: '⊹',
                children: 'Chicago FLF Proportional [MIT]',
                onClick: () => Utilities.onHandleFontChange('font-use-chicago-mono'),
              },
              {
                icon: '⊹',
                children: 'Commit Mono V143 [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-commit-mono'),
              },
              {
                icon: '⊹',
                children: 'CodeNewRoman Mono 2.0 [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-code-new-roman-mono'),
              },
              {
                icon: '⊹',
                children: 'Departure Mono [MIT]',
                onClick: () => Utilities.onHandleFontChange('font-use-departure-mono'),
              },
              {
                icon: '⊹',
                children: 'Fira Code [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-fira-code'),
              },
              {
                icon: '⊹',
                children: 'Fixedsys Excelsior [CC0]',
                onClick: () => Utilities.onHandleFontChange('font-use-fixedsys-excelsior'),
              },
              {
                icon: '⊹',
                children: 'Fragment Mono [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-fragment-mono'),
              },
              {
                icon: '⊹',
                children: 'GlassTTY: TrueType VT220 [NO LICENSE]',
                onClick: () => Utilities.onHandleFontChange('font-use-glasstty-vt220'),
              },
              {
                icon: '⊹',
                children: 'Geist Mono [OFL] [DEFAULT]',
                onClick: () => Utilities.onHandleFontChange(''),
              },
              {
                icon: '⊹',
                children: 'Intel One Mono 1.4.0 [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-intel-one-mono'),
              },
              {
                icon: '⊹',
                children: 'Iosevka Term [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-iosevka-term'),
              },
              {
                icon: '⊹',
                children: 'JetBrains Mono [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-jet-brains-mono'),
              },
              {
                icon: '⊹',
                children: 'Julia Mono 0.061 [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-julia-mono'),
              },
              {
                icon: '⊹',
                children: 'Kommuna Mono™ Trial [type.tmpstate.net]',
                onClick: () => Utilities.onHandleFontChange('font-use-kommuna-mono'),
              },
              {
                icon: '⊹',
                children: 'Monaspace Argon Variable [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-argon-mono'),
              },
              {
                icon: '⊹',
                children: 'Monaspace Krypton Variable [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-krypton-mono'),
              },
              {
                icon: '⊹',
                children: 'Monaspace Neon Variable [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-neon-mono'),
              },
              {
                icon: '⊹',
                children: 'Monaspace Radon Variable [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-radon-mono'),
              },
              {
                icon: '⊹',
                children: 'Monaspace Xenon Variable [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-xenon-mono'),
              },
              {
                icon: '⊹',
                children: 'M1 Plus Mono [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-m1-plus-mono'),
              },
              {
                icon: '⊹',
                children: 'Panama Mono™ Trial [type.tmpstate.net]',
                onClick: () => Utilities.onHandleFontChange('font-use-panama-mono'),
              },
              {
                icon: '⊹',
                children: 'Web437 DOS/V re. ANK16 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank16'),
              },
              {
                icon: '⊹',
                children: 'Web437 DOS/V re. ANK19 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank19'),
              },
              {
                icon: '⊹',
                children: 'Web437 DOS/V re. ANK24 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank24'),
              },
              {
                icon: '⊹',
                children: 'Web437 DOS/V re. ANK30 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank30'),
              },
              {
                icon: '⊹',
                children: 'Web437 Nix8810 M16 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-nix8810-m16'),
              },
              {
                icon: '⊹',
                children: 'Web437 Pheonix EGA 8X8 2Y [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-pheonix-ega-8x8-2y'),
              },
              {
                icon: '⊹',
                children: 'Web437 Sanyo MB C775 2Y [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web437-sanyo-mb-c775-2y'),
              },
              {
                icon: '⊹',
                children: 'WebPlus AST PremiumExec [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-webplus-ast-premiumexec'),
              },
              {
                icon: '⊹',
                children: 'WebPlus IBM BIOS [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web-plus-ibm-bios'),
              },
              {
                icon: '⊹',
                children: 'WebPlus IBM VGA 8X16 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-web-plus-ibm-vga-8x16'),
              },
              {
                icon: '⊹',
                children: 'WebPlus ToshibaTxL1-8x16 [int10h.org] [VileR] [CC BY-SA 4.0]',
                onClick: () => Utilities.onHandleFontChange('font-use-toshiba-tx-l1-8x16'),
              },
              {
                icon: '⊹',
                children: 'SFMono Square [FOSS]',
                onClick: () => Utilities.onHandleFontChange('font-use-sfmono-square'),
              },
              {
                icon: '⊹',
                children: 'Server Mono [OFL]',
                onClick: () => Utilities.onHandleFontChange('font-use-server-mono'),
              },
              {
                icon: '⊹',
                children: 'TX-02 Berkeley Mono™ Trial [usgraphics.com]',
                onClick: () => Utilities.onHandleFontChange('font-use-berkeley-mono'),
              },
              {
                icon: '⊹',
                children: 'Ubuntu Sans Mono 1.006 [UBL]',
                onClick: () => Utilities.onHandleFontChange('font-use-ubuntu-mono'),
              },
            ],
          },
          {
            hotkey: '⌃+A',
            body: 'Appearance',
            openHotkey: 'ctrl+a',
            items: [
              {
                icon: '⊹',
                children: 'Light',
                onClick: () => Utilities.onHandleAppearanceChange(''),
              },
              {
                icon: '⊹',
                children: 'Dark',
                onClick: () => Utilities.onHandleAppearanceChange('theme-dark'),
              },
            ],
          },
          {
            hotkey: '⌃+T',
            body: 'Mode',
            openHotkey: 'ctrl+t',
            items: [
              {
                icon: '⊹',
                children: 'None',
                onClick: () => Utilities.onHandleAppearanceModeChange(''),
              },
              {
                icon: '⊹',
                children: 'Blue',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-blue'),
              },
              {
                icon: '⊹',
                children: 'Green',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-green'),
              },
              {
                icon: '⊹',
                children: 'Orange',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-orange'),
              },
              {
                icon: '⊹',
                children: 'Purple',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-purple'),
              },
              {
                icon: '⊹',
                children: 'Red',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-red'),
              },
              {
                icon: '⊹',
                children: 'Yellow',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-yellow'),
              },
              {
                icon: '⊹',
                children: 'Pink',
                onClick: () => Utilities.onHandleAppearanceModeChange('tint-pink'),
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
