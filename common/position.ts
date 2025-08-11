export type Placement = 'top' | 'bottom' | 'left' | 'right';

export function calculate(triggerElement: HTMLElement, popoverElement: HTMLElement, scrollX: number = window.scrollX, scrollY: number = window.scrollY): { placement: Placement; position: { top: number; left: number } } {
  let triggerRect;
  let popoverRect;

  if (triggerElement) {
    triggerRect = triggerElement.getBoundingClientRect();
  }

  if (popoverElement) {
    popoverRect = popoverElement.getBoundingClientRect();
  }

  const spaceAbove = triggerRect.top;
  const spaceBelow = window.innerHeight - triggerRect.bottom;
  const spaceLeft = triggerRect.left;
  const spaceRight = window.innerWidth - triggerRect.right;

  const viewportHeightThreshold = window.innerHeight * 0.4;
  const viewportWidthThreshold = window.innerWidth * 0.4;

  let placement: Placement = 'bottom';
  let top = 0;
  let left = 0;
  if (!popoverRect) {
    return { placement, position: { top: 0, left: 0 } };
  }

  if (spaceAbove >= viewportHeightThreshold && spaceAbove >= popoverRect.height) {
    placement = 'top';
    top = triggerRect.top + scrollY - popoverRect.height;
    left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
  } else if (spaceBelow >= viewportHeightThreshold && spaceBelow >= popoverRect.height) {
    placement = 'bottom';
    top = triggerRect.bottom + scrollY;
    left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
  } else if (spaceRight >= viewportWidthThreshold && spaceRight >= popoverRect.width) {
    placement = 'right';
    top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
    left = triggerRect.right + scrollX;
  } else if (spaceLeft >= viewportWidthThreshold && spaceLeft >= popoverRect.width) {
    placement = 'left';
    top = triggerRect.top + scrollY + (triggerRect.height - popoverRect.height) / 2;
    left = triggerRect.left + scrollX - popoverRect.width;
  } else {
    placement = 'bottom';
    top = triggerRect.bottom + scrollY;
    left = triggerRect.left + scrollX + (triggerRect.width - popoverRect.width) / 2;
  }

  if (left < 0) left = 0;
  else if (left + popoverRect.width > window.innerWidth) left = window.innerWidth - popoverRect.width;

  if (top < 0) top = 0;
  else if (top + popoverRect.height > window.innerHeight + scrollY) top = window.innerHeight + scrollY - popoverRect.height;

  return { placement, position: { top, left } };
}
