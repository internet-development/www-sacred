'use client';

import styles from '@components/page/DefaultActionBar.module.scss';

import * as React from 'react';
import * as Utilities from '@common/utilities';

import { toggleDebugGrid } from '@components/DebugGrid';
import { useHotkeys } from '@modules/hotkeys';

import ActionBar from '@components/ActionBar';

function isElement(target: EventTarget | null): target is Element {
  return target instanceof Element;
}

function isHTMLElement(target: EventTarget | null): target is HTMLElement {
  return target instanceof HTMLElement;
}

const isFocusableElement = (element: Element | null): boolean => {
  if (!element) return false;

  const focusableSelectors = [
    'a[href]',
    'button',
    'input',
    'select',
    'textarea',
    '[tabindex]:not([tabindex="-1"])',
    '[contenteditable="true"]',
  ];

  return element.matches(focusableSelectors.join(', '));
};

const findFocusableDescendant = (
  element: Element | null,
  currentFocused: Element | null = null,
  direction: 'next' | 'previous' = 'next'
): HTMLElement | null => {
  if (!element) return null;

  const focusableElements = Array.from(
    element.querySelectorAll('[tabindex][role="button"], [tabindex][role="link"]')
  ) as HTMLElement[];

  if (focusableElements.length === 0) return null;

  let index: number;
  if (currentFocused) {
    const currentIndex = focusableElements.indexOf(currentFocused as HTMLElement);
    if (currentIndex !== -1) {
      index = currentIndex + (direction === 'next' ? 1 : -1);
    } else {
      index = direction === 'next' ? 0 : focusableElements.length - 1;
    }
  } else {
    index = direction === 'next' ? 0 : focusableElements.length - 1;
  }

  if (index >= 0 && index < focusableElements.length) {
    return focusableElements[index];
  } else {
    return null;
  }
};

const findFocusableParent = (element: Element | null): Element | null => {
  while (element) {
    element = element.parentElement;
    if (element && isFocusableElement(element)) {
      return element;
    }
  }
  return null;
};

const findNextFocusableSibling = (
  element: Element,
  direction: 'next' | 'previous'
): HTMLElement | null => {
  let sibling =
    direction === 'next' ? element.nextElementSibling : element.previousElementSibling;

  while (sibling) {
    if (isFocusableElement(sibling)) {
      return sibling as HTMLElement;
    }

    const focusableDescendant = findFocusableDescendant(sibling, null, direction);
    if (focusableDescendant) {
      return focusableDescendant;
    }

    sibling =
      direction === 'next' ? sibling.nextElementSibling : sibling.previousElementSibling;
  }

  return null;
};

const findNextFocusableAncestor = (
  element: Element,
  direction: 'next' | 'previous'
): HTMLElement | null => {
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
    if (isHTMLElement(target) && isFocusableElement(target)) {
      event.preventDefault();
      target.click();
    }
  };

  const onHandleNextFocus = (event: KeyboardEvent) => {
    const target = event.target;
    if (isElement(target) && isFocusableElement(target)) {
      event.preventDefault();

      let nextFocusable = findFocusableDescendant(target, target, 'next');
      if (nextFocusable) {
        nextFocusable.focus();
        return;
      }

      nextFocusable = findNextFocusableSibling(target, 'next');
      if (nextFocusable) {
        nextFocusable.focus();
        return;
      }

      nextFocusable = findNextFocusableAncestor(target, 'next');
      if (nextFocusable) {
        nextFocusable.focus();
      }
    }
  };

  const onHandlePreviousFocus = (event: KeyboardEvent) => {
    const target = event.target;
    if (isElement(target) && isFocusableElement(target)) {
      event.preventDefault();

      let previousFocusable = findFocusableDescendant(target, target, 'previous');
      if (previousFocusable) {
        previousFocusable.focus();
        return;
      }

      previousFocusable = findNextFocusableSibling(target, 'previous');
      if (previousFocusable) {
        previousFocusable.focus();
        return;
      }

      previousFocusable = findNextFocusableAncestor(target, 'previous');
      if (previousFocusable) {
        previousFocusable.focus();
      }
    }
  };

  useHotkeys('ArrowDown', onHandleNextFocus);
  useHotkeys('ArrowUp', onHandlePreviousFocus);
  useHotkeys('ArrowRight', onHandleNextFocus);
  useHotkeys('ArrowLeft', onHandlePreviousFocus);
  useHotkeys('ctrl+t', () => Utilities.onHandleThemeChange());
  useHotkeys('ctrl+g', () => toggleDebugGrid());
  useHotkeys('Enter', onHandleSubmit);
  useHotkeys(' ', onHandleSubmit);
};

interface DefaultActionBarProps {
  items?: {
    hotkey: string;
    onClick: () => void;
    body: React.ReactNode;
  }[];
}

const DefaultActionBar: React.FC<DefaultActionBarProps> = ({ items = [] }) => {
  useGlobalNavigationHotkeys();

  return (
    <div className={styles.root}>
      <ActionBar
        items={[
          {
            hotkey: '⌃+T',
            onClick: () => Utilities.onHandleThemeChange(),
            body: 'Theme',
          },
          {
            hotkey: '⌃+G',
            onClick: () => toggleDebugGrid(),
            body: 'Grid',
          },
          ...items,
        ]}
      />
    </div>
  );
};

export default DefaultActionBar;
