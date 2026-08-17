'use client';

import styles from '@components/page/DefaultActionBar.module.css';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { toggleDebugGrid } from '@components/DebugGrid';
import { useHotkeys } from '@modules/hotkeys';

import ActionBar from '@components/ActionBar';
import ButtonGroup from '@components/ButtonGroup';

import { useModals } from '@components/page/ModalContext';

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
  //NOTE(jimmylee): Skip elements with native keyboard activation or their own keyboard handling.
  const onHandleSubmit = (event: KeyboardEvent) => {
    const target = event.target;
    if (!Utilities.isFocusableElement(target)) return;

    const el = target as HTMLElement;
    const tag = el.tagName;
    if (tag === 'BUTTON' || tag === 'A' || tag === 'SELECT' || tag === 'INPUT') return;

    const role = el.getAttribute('role');
    if (role === 'menuitem' || role === 'option') return;

    event.preventDefault();
    el.click();
  };

  const onHandleNextFocus = (event: KeyboardEvent) => {
    const target = event.target;
    if (!Utilities.isFocusableElement(target)) return;

    const el = target as HTMLElement;
    if (el.closest('[role="menu"], [role="listbox"], [role="grid"]') || el.getAttribute('aria-haspopup')) return;

    event.preventDefault();
    const nextFocusable = Utilities.findNextFocusable(el, 'next');
    if (nextFocusable) {
      nextFocusable.focus();
    }
  };

  const onHandlePreviousFocus = (event: KeyboardEvent) => {
    const target = event.target;
    if (!Utilities.isFocusableElement(target)) return;

    const el = target as HTMLElement;
    if (el.closest('[role="menu"], [role="listbox"], [role="grid"]') || el.getAttribute('aria-haspopup')) return;

    event.preventDefault();
    const previousFocusable = Utilities.findNextFocusable(el, 'previous');
    if (previousFocusable) {
      previousFocusable.focus();
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
  const { close } = useModals();

  useHotkeys('ctrl+g', () => toggleDebugGrid());
  useHotkeys('Escape', () => close());

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
                children: <span className="font-use-cascadia-mono">Cascadia Mono [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-cascadia-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-chicago-mono">Chicago FLF Proportional [MIT]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-chicago-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-commit-mono">Commit Mono V143 [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-commit-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-code-new-roman-mono">CodeNewRoman Mono 2.0 [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-code-new-roman-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-departure-mono">Departure Mono [MIT]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-departure-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-fira-code">Fira Code [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-fira-code'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-fixedsys-excelsior">Fixedsys Excelsior [CC0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-fixedsys-excelsior'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-fragment-mono">Fragment Mono [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-fragment-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-glasstty-vt220">GlassTTY: TrueType VT220 [NO LICENSE]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-glasstty-vt220'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-geist-mono">Geist Mono [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-geist-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-intel-one-mono">Intel One Mono 1.4.0 [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-intel-one-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-iosevka-term">Iosevka Term [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-iosevka-term'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-ioskeley-mono-condensed">Ioskeley Mono Condensed [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-ioskeley-mono-condensed'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-ioskeley-mono-regular">Ioskeley Mono Regular [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-ioskeley-mono-regular'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-jet-brains-mono">JetBrains Mono [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-jet-brains-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-julia-mono">Julia Mono 0.061 [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-julia-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-kommuna-mono">Kommuna Mono™ Trial [type.tmpstate.net]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-kommuna-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-mekzantine">Mekzantine™ [Michael Micasso] [mek.gallery]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-mekzantine'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-mekzantine-mono">Mekzantine Mono™ [Michael Micasso] [mek.gallery] [DEFAULT]</span>,
                onClick: () => Utilities.onHandleFontChange(''),
              },
              {
                icon: '⊹',
                children: <span className="font-use-monaspace-argon-mono">Monaspace Argon Variable [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-argon-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-monaspace-krypton-mono">Monaspace Krypton Variable [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-krypton-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-monaspace-neon-mono">Monaspace Neon Variable [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-neon-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-monaspace-radon-mono">Monaspace Radon Variable [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-radon-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-monaspace-xenon-mono">Monaspace Xenon Variable [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-monaspace-xenon-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-m1-plus-mono">M1 Plus Mono [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-m1-plus-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-panama-mono">Panama Mono™ Trial [type.tmpstate.net]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-panama-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-paper-mono">Paper Mono v0.3 [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-paper-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-dos-v-ank16">Web437 DOS/V re. ANK16 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank16'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-dos-v-ank19">Web437 DOS/V re. ANK19 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank19'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-dos-v-ank24">Web437 DOS/V re. ANK24 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank24'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-dos-v-ank30">Web437 DOS/V re. ANK30 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-dos-v-ank30'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-nix8810-m16">Web437 Nix8810 M16 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-nix8810-m16'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-pheonix-ega-8x8-2y">Web437 Pheonix EGA 8X8 2Y [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-pheonix-ega-8x8-2y'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web437-sanyo-mb-c775-2y">Web437 Sanyo MB C775 2Y [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web437-sanyo-mb-c775-2y'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-webplus-ast-premiumexec">WebPlus AST PremiumExec [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-webplus-ast-premiumexec'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web-plus-ibm-bios">WebPlus IBM BIOS [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web-plus-ibm-bios'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-web-plus-ibm-vga-8x16">WebPlus IBM VGA 8X16 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-web-plus-ibm-vga-8x16'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-toshiba-tx-l1-8x16">WebPlus ToshibaTxL1-8x16 [int10h.org] [VileR] [CC BY-SA 4.0]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-toshiba-tx-l1-8x16'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-sfmono-square">SFMono Square [FOSS]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-sfmono-square'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-server-mono">Server Mono [OFL]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-server-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-berkeley-mono">TX-02 Berkeley Mono™ Trial [usgraphics.com]</span>,
                onClick: () => Utilities.onHandleFontChange('font-use-berkeley-mono'),
              },
              {
                icon: '⊹',
                children: <span className="font-use-ubuntu-mono">Ubuntu Sans Mono 1.006 [UBL]</span>,
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
